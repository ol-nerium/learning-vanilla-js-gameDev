// setting correct scaling (by default it's 300x150px):

let gameSpeed = 2;
// let gameFrame = 0; // another metod, but with "ragged" bug when changing speed by range

const backgroundLayer1 = new Image();
backgroundLayer1.src = "./layers/layer-1.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "./layers/layer-2.png";
const backgroundLayer3 = new Image();
backgroundLayer3.src = "./layers/layer-3.png";
const backgroundLayer4 = new Image();
backgroundLayer4.src = "./layers/layer-4.png";
const backgroundLayer5 = new Image();
backgroundLayer5.src = "./layers/layer-5.png";

const sound = new Audio();
sound.src = "jam_music.wav";
sound.loop = true;

// all code should run when page is propperly loaded and available:
window.addEventListener("load", async function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  const CANVAS_WIDTH = (canvas.width = 800);
  const CANVAS_HEIGHT = (canvas.height = 600);

  const slider = document.getElementById("slider");
  slider.value = gameSpeed;

  const showGameSpeed = document.getElementById("showGameSpeed");
  showGameSpeed.innerHTML = gameSpeed;

  const stopBtn = document.querySelector(".stopBtn");

  slider.addEventListener("change", function (e) {
    gameSpeed = e.target.value;
    showGameSpeed.innerHTML = gameSpeed;
  });

  console.log(stopBtn);
  stopBtn.addEventListener("click", () => {
    sound.pause();
    gameSpeed = 0;

    slider.value = gameSpeed;
    showGameSpeed.innerHTML = gameSpeed;
  });

  document.querySelector("input").addEventListener("change", () => {
    // sound.playbackRate = 1;
    if (gameSpeed === "0") {
      sound.pause();
      return;
    }

    sound.playbackRate = 0.9 + gameSpeed / 10;
    sound.currentTime = sound.currentTime === 0 ? 3 : sound.currentTime;
    sound.play();
  });

  class Layer {
    constructor(image, speedModifier) {
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 700;
      this.x2 = this.width;
      this.image = image;
      this.speedModifier = speedModifier;
      this.speed = gameSpeed * this.speedModifier;
    }
    update() {
      this.speed = gameSpeed * this.speedModifier;
      if (this.x <= -this.width) {
        this.x = 0;
      }
      this.x = Math.floor(this.x - this.speed);
      // this.x = (gameFrame * this.speed) % this.width; // see 7 line
    }
    draw() {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.drawImage(
        this.image,
        this.x + this.width,
        this.y,
        this.width,
        this.height,
      );
    }
  }

  const layer1 = new Layer(backgroundLayer1, 0.2);
  const layer2 = new Layer(backgroundLayer2, 0.4);
  const layer3 = new Layer(backgroundLayer3, 0.6);
  const layer4 = new Layer(backgroundLayer4, 0.8);
  const layer5 = new Layer(backgroundLayer5, 1);

  const gameObjects = [layer1, layer2, layer3, layer4, layer5];

  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameObjects.forEach((object) => {
      object.update();
      object.draw();
    });
    // gameFrame--; // see 7 line

    // // old more like 'spagetti-code' method:
    // ctx.drawImage(backgroundLayer4, x, 0);
    // if (x < -2400) x = 2400 + x2 - gameSpeed;
    // x -= gameSpeed;
    // ctx.drawImage(backgroundLayer4, x2, 0);
    // if (x2 < -2400) x2 = 2400 + x - gameSpeed;
    // x2 -= gameSpeed;

    requestAnimationFrame(animate);
  }

  animate();
});
