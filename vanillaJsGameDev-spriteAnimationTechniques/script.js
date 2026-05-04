let playerState = "fall";
const dropdown = document.getElementById("animations");
dropdown.addEventListener("change", function (e) {
  playerState = e.target.value;
});

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
// setting correct scaling:
const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);

// built-in img Class constructor,
// that create img same as in html  (we can append it, for example, if we want)
const playerImage = new Image();
playerImage.src = "shadow_dog.png";
// let x = 0;
const spriteWidth = 575;
const spriteHeight = 523;
// let frameX = 0;
// let frameY = 1;
let gameFrame = 0;
const staggerFrames = 5;
spriteAnimations = [];
const animationStates = [
  { name: "idle", frames: 7 },
  { name: "jump", frames: 7 },
  { name: "fall", frames: 7 },
  { name: "run", frames: 9 },
  { name: "dizzy", frames: 11 },
  { name: "sit", frames: 5 },
  { name: "roll", frames: 7 },
  { name: "bite", frames: 7 },
  { name: "ko", frames: 12 },
  { name: "getHit", frames: 4 },
];
animationStates.forEach((state, index) => {
  let frames = {
    loc: [],
    //location
  };
  for (let j = 0; j < state.frames; j++) {
    let positionX = j * spriteWidth;
    let positionY = index * spriteHeight;
    frames.loc.push({ x: positionX, y: positionY });
  }
  spriteAnimations[state.name] = frames;
});

console.log(spriteAnimations);

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // clear all canvas
  //   ctx.fillRect(x, 50, 100, 100);
  //   x++;
  //   ctx.fillRect(50, 50, 100, 100);

  // drawImage can have 3/5/9 args (how much control we need).
  // first - always img we want to draw.
  // ctx.drawImage=(image, x, y);
  // ctx.drawImage=(image, x, y, width, height);
  // ctx.drawImage=(image, sx, sy, sw, sh, dx, dy, dw, dh);

  // s - source x, y, w, h (Area cut out from original stylesheet)
  // d - destination x, y, w, h (Where we want to draw image)

  let position =
    Math.floor(gameFrame / staggerFrames) %
    spriteAnimations[playerState].loc.length;
  let frameX = spriteWidth * position;
  let frameY = spriteAnimations[playerState].loc[position].y;
  ctx.drawImage(
    playerImage,
    frameX,
    frameY,
    spriteWidth,
    spriteHeight,
    0,
    0,
    spriteWidth,
    spriteHeight
  );
  //   if (gameFrame % staggerFrames === 0) {
  //     if (frameX < 6) frameX += 1;
  //     else frameX = 0;
  //   }

  gameFrame++;
  requestAnimationFrame(animate);
}

animate();
