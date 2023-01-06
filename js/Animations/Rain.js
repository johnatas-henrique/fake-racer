import utils from '../Core/utils.js';

const { width, height } = utils.htmlElements.gameCanvas();

class RainDrop {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 0.9;
    this.directionX = -4 + Math.random() * 4 + 2;
    this.directionY = Math.random() * 5 + 10;
  }

  update() {
    this.x += this.directionX;
    this.y += this.directionY;
    if (this.x > width || this.y > height) {
      this.x = Math.random() * width;
      this.y = -20;
    }
  }

  draw(render, player) {
    const { ctx } = render;
    const { maxSpeed, actualSpeed } = player;
    const accel = actualSpeed / maxSpeed;
    ctx.save();
    ctx.strokeStyle = 'rgba(174,194,224,0.9)';
    ctx.lineWidth = 0.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    const drizzle = (this.directionY * accel) / 4;
    ctx.lineTo(this.x + this.size * drizzle, this.y + this.size * this.directionY);
    ctx.stroke();
    ctx.restore();
  }
}

const rain = (rainDrops) => {
  const arrRain = [];
  for (let i = 0; i < rainDrops; i += 1) {
    arrRain.push(new RainDrop());
  }
  return arrRain;
};

export default rain;
