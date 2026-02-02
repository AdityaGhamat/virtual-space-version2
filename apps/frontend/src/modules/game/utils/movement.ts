import Phaser from "phaser";
import { PLAYER_SPEEED, SHIP_HEIGHT, SHIP_WIDTH } from "../constants/player";
import { mapBounds } from "./mapBounds";

export const isWithinBoundry = (x: number, y: number): boolean => {
  const yIndex = Math.floor(y);
  const xIndex = Math.floor(x);

  return !mapBounds[yIndex] ? true : !mapBounds[yIndex].includes(xIndex);
};

export const movePlayer = (
  keys: string[],
  player: Phaser.GameObjects.Sprite
): boolean => {
  let playerMoved = false;

  const absPlayerX = player.x + SHIP_WIDTH / 2;
  const absPlayerY = player.y + SHIP_HEIGHT / 2 + 20;

  if (
    keys.includes("ArrowUp") &&
    isWithinBoundry(absPlayerX, absPlayerY - PLAYER_SPEEED)
  ) {
    player.y -= PLAYER_SPEEED;
    playerMoved = true;
  }
  if (
    keys.includes("ArrowDown") &&
    isWithinBoundry(absPlayerX, absPlayerY + PLAYER_SPEEED)
  ) {
    player.y += PLAYER_SPEEED;
    playerMoved = true;
  }
  if (
    keys.includes("ArrowLeft") &&
    isWithinBoundry(absPlayerX - PLAYER_SPEEED, absPlayerY)
  ) {
    player.x -= PLAYER_SPEEED;
    player.setFlipX(true);
    playerMoved = true;
  }
  if (
    keys.includes("ArrowRight") &&
    isWithinBoundry(absPlayerX + PLAYER_SPEEED, absPlayerY)
  ) {
    player.x += PLAYER_SPEEED;
    player.setFlipX(false);
    playerMoved = true;
  }

  return playerMoved;
};
