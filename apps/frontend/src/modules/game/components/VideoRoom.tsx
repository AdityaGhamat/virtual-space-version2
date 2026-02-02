import { useEffect, useRef } from "react";
import { useMediaChat } from "../hooks/useMediaChat";

const MediaElement = ({
  stream,
  isLocal = false,
}: {
  stream: MediaStream;
  isLocal?: boolean;
}) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video border-2 border-gray-700">
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover ${isLocal ? "scale-x-[-1]" : ""}`} // Mirror local video
      />
      {isLocal && (
        <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded">
          You
        </span>
      )}
    </div>
  );
};

export default function VideoRoom({ roomId }: { roomId: string }) {
  const { isConnected, remoteStreams, localStream } = useMediaChat(roomId);

  const videoStreams = remoteStreams.filter((s) => s.kind === "video");
  const audioStreams = remoteStreams.filter((s) => s.kind === "audio");

  return (
    <div className="fixed top-20 right-5 w-64 flex flex-col gap-2 pointer-events-auto">
      <div
        className={`px-3 py-1 text-xs font-bold text-white rounded w-fit ${isConnected ? "bg-green-600" : "bg-red-600"}`}
      >
        {isConnected ? "LIVE FEED" : "CONNECTING..."}
      </div>

      {localStream && <MediaElement stream={localStream} isLocal={true} />}

      {videoStreams.map((remote) => (
        <MediaElement key={remote.consumerId} stream={remote.stream} />
      ))}

      {audioStreams.map((remote) => (
        <audio
          key={remote.consumerId}
          ref={(el) => {
            if (el) {
              el.srcObject = remote.stream;
              el.play().catch(console.error);
            }
          }}
        />
      ))}
    </div>
  );
}
