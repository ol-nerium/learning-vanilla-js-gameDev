/**@type {HTMLCanvasElement} */
// Main game file with Raven class, function animate and eventListener on click

import { drawScore, drawGameOver } from "./utils/textDrawers.js";
// import Raven from "./classes/raven.js";
import Particle from "./utils/particle.js";
import Explosions from "./utils/explosions.js"; // (x, y, size)
import {
  canvas,
  ctx,
  // collisionCanvas,
  collisionCanvasCtx,
} from "./utils/canvasSettings.js";

let ravens = [];
let particles = [];
let explosions = [];

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let score = 0;
let gameOver = false;

ctx.font = "50px Impact";

class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = "raven.png";

    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 50;
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color =
      "rgb(" +
      this.randomColors[0] +
      "," +
      this.randomColors[1] +
      "," +
      this.randomColors[2] +
      ")";
    this.hasTrail = Math.random() > 0.5;
  }
  update(deltatime) {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = this.directionY * -1;
    }
    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) this.markedForDeletion = true;
    this.timeSinceFlap += deltatime;
    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;

      if (this.hasTrail) {
        for (let i = 0; i < 5; i += 1) {
          particles.push(new Particle(this.x, this.y, this.width, this.color));
        }
      }
    }
    if (this.x < 0 - this.width) gameOver = true;
  }
  draw() {
    collisionCanvasCtx.fillStyle = this.color;
    collisionCanvasCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

export default function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCanvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  let deltatime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltatime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort(function (a, b) {
      return a.width - b.width;
    });
  }
  drawScore(score);
  [...particles, ...ravens, ...explosions].forEach((object) => {
    object.update(deltatime);
    object.draw();
  });
  ravens = ravens.filter((object) => !object.markedForDeletion);
  explosions = explosions.filter((object) => !object.markedForDeletion);
  particles = particles.filter((object) => !object.markedForDeletion);
  if (!gameOver) requestAnimationFrame(animate);
  else drawGameOver(score);
}
// animate(0);

window.addEventListener("click", function (e) {
  // console.log(e.x, e.y);
  const detectPixelColor = collisionCanvasCtx.getImageData(e.x, e.y, 1, 1);
  // 1,1 - third and fourth argument - of area that we want to scan
  // get data with array [x,y,z,x]
  // x,y,z - 0..255 rgb
  // x - opacity 0..255
  const pc = detectPixelColor.data;
  ravens.forEach((object) => {
    if (
      object.randomColors[0] == pc[0] &&
      object.randomColors[1] == pc[1] &&
      object.randomColors[2] == pc[2]
    ) {
      // collision detected by color
      object.markedForDeletion = true;
      score++;
      explosions.push(new Explosions(object.x, object.y, object.width));
    }
  });
});
