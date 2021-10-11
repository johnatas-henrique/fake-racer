import { canvas } from './util.js';

const arrPart = [];

const connect = (render) => {
  const { renderingContext } = render;
  for (let a = 0; a < arrPart.length; a += 1) {
    for (let b = a; b < arrPart.length; b += 1) {
      const distance = ((arrPart[a].x - arrPart[b].x) * (arrPart[a].x - arrPart[b].x))
        + ((arrPart[a].y - arrPart[b].y) * (arrPart[a].y - arrPart[b].y));
      if (distance < (canvas.width / 4) * (canvas.height / 4)) {
        const max = (canvas.width / 4) * (canvas.height / 4);
        const opacity = 1 - (distance / max);
        renderingContext.strokeStyle = `rgba(128, 128, 128, ${opacity})`;
        renderingContext.lineWidth = 0.1;
        renderingContext.beginPath();
        renderingContext.moveTo(arrPart[a].x, arrPart[a].y);
        renderingContext.lineTo(arrPart[b].x, arrPart[b].y);
        renderingContext.stroke();
      }
    }
  }
};

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
    this.speed = 10;
    this.updateTime = 1 / 60;
  }

  update() {
    if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
    if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
    this.x += this.directionX;
    this.y += this.directionY;
  }

  render(render) {
    const { renderingContext } = render;
    renderingContext.beginPath();
    renderingContext.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    renderingContext.fillStyle = this.color;
    renderingContext.fill();
    connect(render);
  }
}

const init = () => {
  const { height, width } = canvas;
  const numberOfParticles = 30;
  for (let i = 0; i < numberOfParticles; i += 1) {
    const size = (Math.random() * 2) + 1;
    const x = (Math.random() * ((width - size * 2) - (size * 2)) + size * 2);
    const y = (Math.random() * ((height - size * 2) - (size * 2)) + size * 2);
    const directionX = (Math.random() * 2);
    const directionY = (Math.random() * 2);
    const color = 'gray';
    arrPart.push(new Particle(x, y, directionX, directionY, size, color));
  }
  return arrPart;
};

const animations = init();

export default animations;
