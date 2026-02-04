import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { useSocket } from "../hooks/useSocket";
import { MyGame } from "..";
import { useParams, useLocation } from "react-router";
import ChatOverlay from "./ChatOverlay";
import ProximityVideoOverlay from "./ProximityVideoOverlay";
import { CustomToast } from "../../../components/Toast";

const GameComponent = () => {
  const { gameSocket, commSocket } = useSocket();
  const gameRef = useRef<Phaser.Game | null>(null);

  const { roomId } = useParams();
  const location = useLocation();

  const username =
    location.state?.username || `Guest_${Math.floor(Math.random() * 1000)}`;

  const skin = location.state?.skin || "player";

  useEffect(() => {
    if (roomId) {
      const handleCopy = () => {
        navigator.clipboard.writeText(roomId);
        CustomToast.success("Room ID copied to clipboard!");
      };

      CustomToast.info(
        <div
          onClick={handleCopy}
          className="flex flex-col gap-1 cursor-pointer group"
          role="button"
          title="Click to copy Room ID"
        >
          <span className="opacity-80 text-[10px] uppercase tracking-wider">
            Invite Code (Click to Copy):
          </span>

          <div className="flex items-center gap-2">
            <span className="text-lg underline decoration-dashed underline-offset-4 font-black tracking-wider group-hover:text-blue-600 transition-colors">
              {roomId}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-50 group-hover:opacity-100 transition-opacity"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </div>
        </div>
      );
    }
  }, [roomId]);

  useEffect(() => {
    if (!gameSocket || !commSocket || gameRef.current) return;

    const container = document.getElementById("phaser-container");
    if (!container) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: "phaser-container",
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#000000",
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [],
    };

    gameRef.current = new Phaser.Game(config);

    gameRef.current.scene.add("MyGame", MyGame);

    gameRef.current.scene.start("MyGame", {
      socket: gameSocket,
      commSocket: commSocket,
      roomId,
      username,
      skin,
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [gameSocket, commSocket, roomId, username, skin]);

  if (!gameSocket || !commSocket)
    return <div className="text-white">Connecting...</div>;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <div
        id="phaser-container"
        className="absolute inset-0 z-0 w-full h-full"
      />

      <ChatOverlay username={username} />
      <ProximityVideoOverlay />
    </div>
  );
};

export default GameComponent;
