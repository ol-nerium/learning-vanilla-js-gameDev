/**@type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
// setting correct scaling:
const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 700);
let canvasPosition = canvas.getBoundingClientRect();
//built-in JS method that returns object
//that provides information about the size of element
//relative to view-port
// console.log(canvasPosition);
// console.log(canvas);

const explosions = [];

class Explosion {
  constructor(x, y) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.width = this.spriteWidth * 0.7;
    this.height = this.spriteHeight * 0.7;
    // multiplication is faster than division CPU wise
    this.x = x; //- this.width / 2;
    this.y = y; //- this.height / 2;
    this.image = new Image();
    this.image.src = "./pictures/boom.png";
    this.frame = 0;
    this.timer = 0;
    this.angle = Math.random() * 6.2;
    this.sound = new Audio();
    this.sound.src = "8bit_bomb_explosion.wav";
  }
  update() {
    if (this.frame === 0) this.sound.play();
    ++this.timer;
    if (this.timer % 10 === 0) {
      ++this.frame;
    }
  }
  draw() {
    ctx.save(); // save current state of canvas to make sure
    //that following change will effect only one draw call
    ctx.translate(this.x, this.y); // translate rotation center point
    ctx.rotate(this.angle); // rotate canvas context

    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame,
      0,
      this.spriteWidth,
      this.spriteHeight,
      0 - this.width / 2, // this.x,
      0 - this.height / 2, // this.y,
      this.width,
      this.height
    );

    ctx.restore(); // restore original save point
  }
}

window.addEventListener("click", function (e) {
  createAnimation(e);
});
// window.addEventListener("mousemove", function (e) {
//   createAnimation(e);
// });

function createAnimation(e) {
  let positionX = e.x - canvasPosition.left;
  let positionY = e.y - canvasPosition.top;

  explosions.push(new Explosion(positionX, positionY));
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  for (let i = 0; i < explosions.length; ++i) {
    explosions[i].update();
    explosions[i].draw();
    if (explosions[i].frame > 5) {
      explosions.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(animate);
}
animate();
