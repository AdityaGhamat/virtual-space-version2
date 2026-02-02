import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as mediasoupClient from "mediasoup-client";
import { useSocket } from "./useSocket";

export interface RemoteStream {
  stream: MediaStream;
  consumerId: string;
  kind: "audio" | "video";
  producerId: string;
}

export const useMediaChat = (roomId: string) => {
  const { mediaSocket } = useSocket();
  const [isConnected, setIsConnected] = useState(false);

  const deviceRef = useRef<mediasoupClient.Device | null>(null);
  const producerTransportRef = useRef<mediasoupClient.types.Transport | null>(
    null
  );
  const consumerTransportRef = useRef<mediasoupClient.types.Transport | null>(
    null
  );

  const pendingProducers = useRef<string[]>([]);
  const isReady = useRef(false);

  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const consume = useCallback(
    async (producerId: string) => {
      const device = deviceRef.current;
      const socket = mediaSocket;
      const transport = consumerTransportRef.current;

      // Ensure everything is ready before consuming
      if (!device || !socket || !transport || !device.loaded) {
        console.warn("Consume skipped: Device/Transport not ready");
        return;
      }

      socket.emit(
        "consume",
        {
          roomId,
          producerId,
          rtpCapabilities: device.rtpCapabilities,
          transportId: transport.id,
        },
        async (data: any) => {
          if (data.error) return console.error("Consume Error:", data.error);

          try {
            const consumer = await transport.consume({
              id: data.id,
              producerId: data.producerId,
              kind: data.kind,
              rtpParameters: data.rtpParameters,
            });

            socket.emit("resume", { consumerId: data.id });

            const stream = new MediaStream();
            stream.addTrack(consumer.track);

            setRemoteStreams((prev) => [
              ...prev,
              {
                stream,
                consumerId: data.id,
                kind: data.kind,
                producerId: data.producerId,
              },
            ]);
          } catch (error) {
            console.error("Transport Consume Error:", error);
          }
        }
      );
    },
    [mediaSocket, roomId]
  );

  const startMedia = useCallback(async () => {
    // If transport is gone, don't try to produce
    if (!producerTransportRef.current || producerTransportRef.current.closed)
      return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);

      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack)
        await producerTransportRef.current.produce({ track: audioTrack });

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        await producerTransportRef.current.produce({
          track: videoTrack,
          encodings: [
            { maxBitrate: 100000, scaleResolutionDownBy: 4.0 },
            { maxBitrate: 300000, scaleResolutionDownBy: 2.0 },
            { maxBitrate: 900000, scaleResolutionDownBy: 1.0 },
          ],
        });
      }
    } catch (err) {
      console.error("Media Capture Error:", err);
      throw err; // Stop the chain if mic/cam fails
    }
  }, []);

  const initTransports = useCallback(
    async (
      device: mediasoupClient.Device,
      socket: any,
      isMounted: () => boolean
    ) => {
      return new Promise<void>((resolve) => {
        socket.emit("createWebRtcTransport", { roomId }, async (data: any) => {
          if (data.error)
            return console.error("Create Send Transport Error:", data.error);

          // SAFETY: Stop if component unmounted
          if (!isMounted()) return;

          const transport = device.createSendTransport(data);
          producerTransportRef.current = transport;

          transport.on("connect", ({ dtlsParameters }, callback) => {
            socket.emit("connectTransport", {
              transportId: transport.id,
              dtlsParameters,
            });
            callback();
          });

          transport.on("produce", async ({ kind, rtpParameters }, callback) => {
            socket.emit(
              "produce",
              { transportId: transport.id, kind, rtpParameters, roomId },
              ({ id }: any) => {
                callback({ id });
              }
            );
          });

          try {
            await startMedia();
          } catch (e) {
            console.warn("Media failed, stopping transport init");
            return;
          }

          // SAFETY: Stop if unmounted during media selection
          if (!isMounted()) return;

          socket.emit(
            "createWebRtcTransport",
            { roomId },
            async (data: any) => {
              if (data.error)
                return console.error(
                  "Create Recv Transport Error:",
                  data.error
                );

              // SAFETY: Final check
              if (!isMounted()) return;

              const transport = device.createRecvTransport(data);
              consumerTransportRef.current = transport;

              transport.on("connect", ({ dtlsParameters }, callback) => {
                socket.emit("connectTransport", {
                  transportId: transport.id,
                  dtlsParameters,
                });
                callback();
              });

              resolve();
            }
          );
        });
      });
    },
    [roomId, startMedia]
  );

  useEffect(() => {
    if (!mediaSocket || !roomId) return;

    // 1. Mounted Flag
    let mounted = true;
    const socket = mediaSocket;

    // Helper to check mounted status inside async callbacks
    const isMounted = () => mounted;

    const initMedia = async () => {
      socket.emit("joinRoom", { roomId }, async (data: any) => {
        if (!mounted) return;
        if (data.error) return console.error("Join Room Error:", data.error);

        try {
          const device = new mediasoupClient.Device();
          await device.load({ routerRtpCapabilities: data.rtpCapabilities });

          if (!mounted) return;
          deviceRef.current = device;

          // Pass the isMounted checker down
          await initTransports(device, socket, isMounted);

          if (!mounted) return;

          isReady.current = true;
          setIsConnected(true);

          if (data.existingProducers) {
            for (const producer of data.existingProducers) {
              if (!mounted) break;
              await consume(producer.producerId);
            }
          }

          if (pendingProducers.current.length > 0) {
            for (const pid of pendingProducers.current) {
              if (!mounted) break;
              await consume(pid);
            }
            pendingProducers.current = [];
          }
        } catch (error) {
          console.error("Init Media Error:", error);
        }
      });
    };

    initMedia();

    socket.on("newProducer", async ({ producerId }) => {
      if (
        isReady.current &&
        consumerTransportRef.current &&
        !consumerTransportRef.current.closed
      ) {
        await consume(producerId);
      } else {
        pendingProducers.current.push(producerId);
      }
    });

    socket.on("consumerClosed", ({ consumerId }) => {
      setRemoteStreams((prev) =>
        prev.filter((s) => s.consumerId !== consumerId)
      );
    });

    return () => {
      console.log("Leaving Video Zone...");
      mounted = false; // <--- The most important line

      socket.emit("leaveRoom");

      setRemoteStreams([]);
      setIsConnected(false);
      isReady.current = false;
      pendingProducers.current = [];

      localStream?.getTracks().forEach((track) => track.stop());

      socket.off("newProducer");
      socket.off("consumerClosed");

      if (producerTransportRef.current) producerTransportRef.current.close();
      if (consumerTransportRef.current) consumerTransportRef.current.close();

      // Just nullify the ref
      deviceRef.current = null;
    };
  }, [mediaSocket, roomId, consume, initTransports]);

  return useMemo(
    () => ({
      isConnected,
      remoteStreams,
      localStream,
    }),
    [isConnected, remoteStreams, localStream]
  );
};
