/**@type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const numberOfParticles = 200;
const particlesArray = [];
const pumpkin = new Image();
pumpkin.src = "pumpkins.png";

// // pushing entire drawing content to coordinates we passed to it/rotate etc.
// ctx.translate(100, 100);
// ctx.rotate((10 * Math.PI) / 360);
// ctx.fillRect(0, 0, 100, 150);

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 70 + 10;
    this.speed = Math.random() * 2 + 0.5;
    this.angle = Math.random() * 360;
    this.spin = Math.random() < 0.5 ? -1 : 1;

    this.frameX = Math.floor(Math.random() * 3);
    this.frameY = Math.floor(Math.random() * 3);
    this.spriteSize = 300;
  }
  draw() {
    ctx.save(); // remembers curr state of canvas at the point we call it

    ctx.translate(this.x, this.y);
    ctx.rotate((this.spin * this.angle * Math.PI) / 360);

    ctx.drawImage(
      pumpkin,
      this.spriteSize * this.frameX,
      this.spriteSize * this.frameY,
      this.spriteSize,
      this.spriteSize,
      // translate resets coordinates so we dont want to double them
      // this.x,
      // this.y,
      0 - this.size / 2,
      0 - this.size / 2,
      //  this.size / 2 place center of pumpkin in rotation centerpoint
      this.size,
      this.size
    );

    ctx.restore();
    // return to prev save point no matter what changes were made in between
  }
  update() {
    this.angle += 2;
    if (this.y - this.size > canvas.height) {
      this.y = 0 - this.size;
      this.x = Math.random() * canvas.width;
      this.size = Math.random() * 70 + 10;
      this.speed = Math.random() * 5 + 1;
      this.pumpkinFrame = Math.floor(Math.random() * 3);
    }
    this.y += this.speed;
  }
}

function init() {
  for (let i = 0; i < numberOfParticles; i += 1) {
    particlesArray.push(new Particle());
  }
}
init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach((particle) => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animate);
}
animate();
