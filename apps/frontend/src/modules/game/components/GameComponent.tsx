import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { useSocket } from "../hooks/useSocket";
import { MyGame } from "..";
import { useParams, useLocation } from "react-router";
import ChatOverlay from "./ChatOverlay";
import ProximityVideoOverlay from "./ProximityVideoOverlay";

const GameComponent = () => {
  const { gameSocket, commSocket } = useSocket();
  const gameRef = useRef<Phaser.Game | null>(null);

  const { roomId } = useParams();
  const location = useLocation();

  const username =
    location.state?.username || `Guest_${Math.floor(Math.random() * 1000)}`;

  const skin = location.state?.skin || "player";

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
