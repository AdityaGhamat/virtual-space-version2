import Phaser from "phaser";
import { Socket } from "socket.io-client";
import { movePlayer } from "./utils/movement";
import { animateMovement } from "./utils/animation";
import { getPlayerRoom } from "./utils/getPlayerRoom";
import shipImage from "./assets/ship.png";
import playerSprite from "./assets/player.png";

import {
  PLAYER_SPRITE_WIDTH,
  PLAYER_SPRITE_HEIGHT,
  PLAYER_START_X,
  PLAYER_START_Y,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from "./constants/player";

import type {
  LocalPlayer,
  RemotePlayer,
  ServerToClientEvents,
  ClientToServerEvents,
} from "./types/game";

const player: LocalPlayer = { sprite: null, movedLastFrame: false };
const otherPlayers = new Map<string, RemotePlayer>();
let pressedKeys: string[] = [];

export class MyGame extends Phaser.Scene {
  private socket!: Socket<ServerToClientEvents, ClientToServerEvents>;
  private commSocket!: Socket;
  private roomId: string = "";
  private username: string = "Guest";
  private skin: string = "player";

  private playerNameTag?: Phaser.GameObjects.Text;

  private currentChatRoom: string | null = null;
  private currentVideoRoom: string | null = null;

  constructor() {
    super("MyGame");
  }

  init(data: {
    socket: Socket<ServerToClientEvents, ClientToServerEvents>;
    commSocket: Socket;
    roomId: string;
    username: string;
    skin: string;
  }) {
    this.socket = data.socket;
    this.commSocket = data.commSocket;
    this.roomId = data.roomId || "default";
    this.username = data.username || "Guest";
    this.skin = data.skin || "player";

    this.socket.removeAllListeners();
    this.socket.on("connect", () => console.log("✅ Game Connected"));
    this.socket.on("error", (data) => {
      alert(data.message);
      window.location.href = "/";
    });
  }

  preload() {
    this.load.image("ship", shipImage);

    this.load.spritesheet("player", playerSprite, {
      frameWidth: PLAYER_SPRITE_WIDTH,
      frameHeight: PLAYER_SPRITE_HEIGHT,
    });
  }

  create() {
    this.cameras.main.setZoom(1.4);
    this.add.image(0, 0, "ship");

    player.sprite = this.add.sprite(
      PLAYER_START_X,
      PLAYER_START_Y,
      "player"
    ) as Phaser.GameObjects.Sprite & { currentRoom?: string };

    player.sprite.displayHeight = PLAYER_HEIGHT;
    player.sprite.displayWidth = PLAYER_WIDTH;

    this.playerNameTag = this.add
      .text(player.sprite.x, player.sprite.y - 40, this.username, {
        font: "bold 24px Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setScale(0.5);

    const initialRoom = getPlayerRoom(PLAYER_START_X, PLAYER_START_Y);

    this.socket.emit("initPlayer", {
      x: PLAYER_START_X,
      y: PLAYER_START_Y,
      username: this.username,
      skin: this.skin,
      room: initialRoom ? initialRoom.name : null,
      roomId: this.roomId,
    });

    this.anims.create({
      key: "running",
      frames: this.anims.generateFrameNumbers("player", {}),
      frameRate: 24,
      repeat: -1,
    });

    this.input.keyboard!.on("keydown", (e: KeyboardEvent) => {
      if (!pressedKeys.includes(e.code)) pressedKeys.push(e.code);
    });
    this.input.keyboard!.on("keyup", (e: KeyboardEvent) => {
      pressedKeys = pressedKeys.filter((key) => key !== e.code);
    });
    this.input.keyboard!.on("keydown-P", () => {
      if (player.sprite) {
        const x = Math.round(player.sprite.x);
        const y = Math.round(player.sprite.y);
        console.log(`📍 Current Position: { x: ${x}, y: ${y} }`);
      }
    });

    // --- SOCKET HANDLERS ---

    this.socket.on("playerConnected", ({ id, username, x, y, room }) => {
      const sprite = this.add.sprite(x, y, "player");

      sprite.displayHeight = PLAYER_HEIGHT;
      sprite.displayWidth = PLAYER_WIDTH;

      const nameTag = this.add
        .text(x, y - 40, username, {
          font: "bold 24px Arial",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setScale(0.5);

      otherPlayers.set(id, { sprite, nameTag, moving: false, room });
      console.log(`Player ${username} (${id}) joined (Visual: Purple)`);
    });

    this.socket.on("existingPlayers", (players) => {
      console.log(` Joined room. Found ${players.length} players.`);

      otherPlayers.forEach((p) => {
        p.sprite.destroy();
        p.nameTag.destroy();
      });
      otherPlayers.clear();

      players.forEach(({ id, username, skin, x, y, room }) => {
        console.log(skin);
        if (id !== this.socket.id) {
          const safeSkin = "player";

          const sprite = this.add.sprite(x, y, safeSkin);
          sprite.displayHeight = PLAYER_HEIGHT;
          sprite.displayWidth = PLAYER_WIDTH;

          const nameTag = this.add
            .text(x, y - 40, username, {
              font: "bold 24px Arial",
              color: "#ffffff",
              stroke: "#000000",
              strokeThickness: 4,
            })
            .setOrigin(0.5)
            .setScale(0.5);
          otherPlayers.set(id, {
            sprite,
            nameTag,
            moving: false,
            room,
          });
        }
      });
    });

    this.socket.on("playerDisconnected", ({ id }) => {
      const otherPlayer = otherPlayers.get(id);
      if (otherPlayer) {
        otherPlayer.sprite.destroy();
        otherPlayer.nameTag.destroy();
        otherPlayers.delete(id);
      }
    });

    this.socket.on("move", ({ id, x, y }) => {
      const otherPlayer = otherPlayers.get(id);
      if (otherPlayer) {
        if (otherPlayer.sprite.x > x) otherPlayer.sprite.setFlipX(true);
        else if (otherPlayer.sprite.x < x) otherPlayer.sprite.setFlipX(false);

        otherPlayer.targetX = x;
        otherPlayer.targetY = y;

        otherPlayer.moving = true;
      }
    });

    this.socket.on("moveEnd", ({ id }) => {
      const otherPlayer = otherPlayers.get(id);
      if (otherPlayer) {
        otherPlayer.moving = false;
      }
    });

    this.socket.on("playerEnteredRoom", ({ id, room, x, y }) => {
      const otherPlayer = otherPlayers.get(id);
      if (otherPlayer) {
        otherPlayer.room = room;
        otherPlayer.sprite.x = x;
        otherPlayer.sprite.y = y;
        otherPlayer.nameTag.x = x;
        otherPlayer.nameTag.y = y - 40;
      }
    });
  }

  update() {
    if (!player.sprite) return;

    this.cameras.main.centerOn(player.sprite.x, player.sprite.y);

    const playerMoved = movePlayer(pressedKeys, player.sprite);
    if (playerMoved) {
      this.socket.emit("move", { x: player.sprite.x, y: player.sprite.y });
      console.log(`x:${player.sprite.x} , y:${player.sprite.y}`);
      player.movedLastFrame = true;
    } else if (player.movedLastFrame) {
      this.socket.emit("moveEnd");
      player.movedLastFrame = false;
    }
    animateMovement(pressedKeys, player.sprite);

    if (this.playerNameTag) {
      this.playerNameTag.x = player.sprite.x;
      this.playerNameTag.y = player.sprite.y - 40;
    }

    const room = getPlayerRoom(player.sprite.x, player.sprite.y);
    const newRoomName = room ? room.name : null;

    if (newRoomName !== player.sprite.currentRoom) {
      player.sprite.currentRoom = newRoomName || undefined;
      this.socket.emit("playerRoomChanged", {
        room: newRoomName || "outer_space",
        x: player.sprite.x,
        y: player.sprite.y,
      });
    }

    // --- 1. CHAT ROOM LOGIC ---
    if (room && room.capabilities.includes("chat")) {
      if (this.currentChatRoom !== room.name) {
        this.commSocket.emit("joinChatRoom", {
          roomId: this.roomId,
          roomName: room.name,
        });
        this.currentChatRoom = room.name;
        window.dispatchEvent(
          new CustomEvent("ENTER_CHAT_ZONE", { detail: room.name })
        );
      }
    } else {
      if (this.currentChatRoom) {
        this.commSocket.emit("leaveChatRoom", { roomId: this.roomId });
        this.currentChatRoom = null;
        window.dispatchEvent(new Event("LEAVE_CHAT_ZONE"));
      }
    }

    // --- 2. NEW: VIDEO CALL LOGIC ---
    if (room && room.capabilities.includes("video_call")) {
      if (this.currentVideoRoom !== room.name) {
        this.currentVideoRoom = room.name;

        // Dispatch event for ProximityVideoOverlay.tsx
        window.dispatchEvent(
          new CustomEvent("ENTER_VIDEO_ZONE", { detail: room.name })
        );
      }
    } else {
      if (this.currentVideoRoom) {
        this.currentVideoRoom = null;

        // Dispatch leave event
        window.dispatchEvent(new Event("LEAVE_VIDEO_ZONE"));
      }
    }

    // --- ANIMATION LOGIC (Server Trust Model) ---
    otherPlayers.forEach((otherPlayer) => {
      // 1. Interpolation
      if (
        otherPlayer.targetX !== undefined &&
        otherPlayer.targetY !== undefined
      ) {
        otherPlayer.sprite.x = Phaser.Math.Interpolation.Linear(
          [otherPlayer.sprite.x, otherPlayer.targetX],
          0.05
        );
        otherPlayer.sprite.y = Phaser.Math.Interpolation.Linear(
          [otherPlayer.sprite.y, otherPlayer.targetY],
          0.05
        );
        otherPlayer.nameTag.x = otherPlayer.sprite.x;
        otherPlayer.nameTag.y = otherPlayer.sprite.y - 40;
      }

      // 2. Animation based on Server Flag
      if (otherPlayer.moving && !otherPlayer.sprite.anims.isPlaying) {
        otherPlayer.sprite.play("running");
      } else if (!otherPlayer.moving && otherPlayer.sprite.anims.isPlaying) {
        otherPlayer.sprite.stop();
      }
    });
  }

  destroy() {
    if (this.currentChatRoom) {
      this.commSocket.emit("leaveChatRoom", { roomId: this.roomId });
    }
    // Note: Video room cleanup is handled by the component unmounting via event
    this.socket.removeAllListeners();
    this.commSocket.removeAllListeners();
  }
}
