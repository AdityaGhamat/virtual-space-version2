import { Server, Socket } from "socket.io";
import { mediasoupService } from "../service/mediasoup.service";
import { types } from "mediasoup";

interface PeerData {
  transports: Map<string, types.WebRtcTransport>;
  producers: Map<string, types.Producer>;
  consumers: Map<string, types.Consumer>;
}

const peers: Map<string, PeerData> = new Map();

export const mediaHandler = (io: Server) => {
  const mediaNamespace = io.of("/media");

  mediaNamespace.on("connection", (socket) => {
    console.log(`Media Connection: ${socket.id}`);

    peers.set(socket.id, {
      transports: new Map(),
      producers: new Map(),
      consumers: new Map(),
    });

    socket.on("disconnect", () => {
      console.log(`Media Disconnect: ${socket.id}`);
      const peer = peers.get(socket.id);
      if (peer) {
        peer.transports.forEach((t) => t.close());
        peers.delete(socket.id);
      }
    });

    socket.on("joinRoom", async ({ roomId }, callback) => {
      // ✅ 1. CRITICAL: Join the Socket.IO room so broadcasts work!
      socket.join(roomId);

      try {
        const router = await mediasoupService.getOrCreateRouter(roomId);

        // ✅ 2. Get RTP Capabilities
        const rtpCapabilities = router.rtpCapabilities;

        // ✅ 3. FETCH EXISTING PRODUCERS (So I can see people already in the room)
        const existingProducers: { producerId: string; socketId: string }[] =
          [];

        // Iterate over all connected peers to find producers in this room
        // Note: In a real production app with Redis, you'd query Redis here.
        mediaNamespace.adapter.rooms.get(roomId)?.forEach((socketId) => {
          if (socketId === socket.id) return; // Skip self
          const peer = peers.get(socketId);
          peer?.producers.forEach((producer) => {
            existingProducers.push({
              producerId: producer.id,
              socketId,
            });
          });
        });

        callback({ rtpCapabilities, existingProducers });
      } catch (err: any) {
        console.error("JoinRoom Error", err);
        callback({ error: err.message });
      }
    });

    // --- STANDARD WEBRTC EVENTS (Create Transport, Connect, Produce, Consume) ---

    socket.on("createWebRtcTransport", async ({ roomId }, callback) => {
      try {
        const router = await mediasoupService.getOrCreateRouter(roomId);
        const transport = await router.createWebRtcTransport({
          listenIps: [{ ip: "0.0.0.0", announcedIp: "192.168.0.107" }], // Change IP in Prod
          enableUdp: true,
          enableTcp: true,
          preferUdp: true,
        });

        const peer = peers.get(socket.id)!;
        peer.transports.set(transport.id, transport);

        callback({
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        });
      } catch (err: any) {
        callback({ error: err.message });
      }
    });

    socket.on("connectTransport", async ({ transportId, dtlsParameters }) => {
      const peer = peers.get(socket.id);
      const transport = peer?.transports.get(transportId);
      if (transport) await transport.connect({ dtlsParameters });
    });

    socket.on(
      "produce",
      async ({ transportId, kind, rtpParameters, roomId }, callback) => {
        try {
          const peer = peers.get(socket.id)!;
          const transport = peer.transports.get(transportId);
          if (!transport) throw new Error("Transport not found");

          const producer = await transport.produce({ kind, rtpParameters });
          peer.producers.set(producer.id, producer);

          // Notify others
          socket.to(roomId).emit("newProducer", {
            producerId: producer.id,
            socketId: socket.id,
          });

          producer.on("transportclose", () => {
            producer.close();
            peer.producers.delete(producer.id);
          });

          callback({ id: producer.id });
        } catch (err: any) {
          callback({ error: err.message });
        }
      }
    );

    socket.on(
      "consume",
      async (
        { roomId, producerId, rtpCapabilities, transportId },
        callback
      ) => {
        try {
          const router = await mediasoupService.getOrCreateRouter(roomId);
          const peer = peers.get(socket.id)!;
          const transport = peer.transports.get(transportId);

          if (!router.canConsume({ producerId, rtpCapabilities })) {
            throw new Error("Cannot consume");
          }

          const consumer = await transport!.consume({
            producerId,
            rtpCapabilities,
            paused: true,
          });

          peer.consumers.set(consumer.id, consumer);

          consumer.on("transportclose", () => {
            peer.consumers.delete(consumer.id);
          });

          consumer.on("producerclose", () => {
            socket.emit("consumerClosed", { consumerId: consumer.id });
            peer.consumers.delete(consumer.id);
            consumer.close();
          });

          callback({
            id: consumer.id,
            producerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
          });
        } catch (err: any) {
          callback({ error: err.message });
        }
      }
    );

    socket.on("resume", async ({ consumerId }) => {
      const peer = peers.get(socket.id);
      const consumer = peer?.consumers.get(consumerId);
      if (consumer) await consumer.resume();
    });
  });
};
