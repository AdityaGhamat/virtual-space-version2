import Phaser from "phaser";

export function animateMovement(
  keys: string[],
  player: Phaser.GameObjects.Sprite
) {
  const runningKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

  const isMoving = keys.some((key) => runningKeys.includes(key));

  if (isMoving && !player.anims.isPlaying) {
    player.play("running");
  } else if (!isMoving && player.anims.isPlaying) {
    player.stop();
  }
}

// export function animateMovement(
//   keys: string[],
//   player: Phaser.GameObjects.Sprite
// ) {
//   const runningKeys = [
//     "ArrowUp",
//     "ArrowDown",
//     "ArrowLeft",
//     "ArrowRight",
//     "KeyW",
//     "KeyA",
//     "KeyS",
//     "KeyD",
//   ];

//   const isMoving = keys.some((key) => runningKeys.includes(key));

//   const animKey = player.texture.key === "player2" ? "running_red" : "running";

//   if (isMoving) {
//     player.play(animKey, true);
//   } else {
//     if (player.anims.isPlaying) {
//       player.stop();
//     }
//   }
// }
