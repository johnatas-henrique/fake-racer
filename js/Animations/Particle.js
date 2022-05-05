const arrPart = [];
const { width: canvasWidth, height: canvasHeight } = utils.htmlElements.canvas();

const connect = (render) => {
  const { ctx } = render;
  for (let a = 0; a < arrPart.length; a += 1) {
    for (let b = a; b < arrPart.length; b += 1) {
      const distance = ((arrPart[a].x - arrPart[b].x) * (arrPart[a].x - arrPart[b].x))
        + ((arrPart[a].y - arrPart[b].y) * (arrPart[a].y - arrPart[b].y));
      if (distance < (canvasWidth / 4) * (canvasHeight / 4)) {
        const max = (canvasWidth / 4) * (canvasHeight / 4);
        const opacity = 1 - (distance / max);
        ctx.strokeStyle = `rgba(128, 128, 128, ${opacity})`;
        ctx.lineWidth = 0.1;
        ctx.beginPath();
        ctx.moveTo(arrPart[a].x, arrPart[a].y);
        ctx.lineTo(arrPart[b].x, arrPart[b].y);
        ctx.stroke();
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
    if (this.x > canvasWidth || this.x < 0) this.directionX = -this.directionX;
    if (this.y > canvasHeight || this.y < 0) this.directionY = -this.directionY;
    this.x += this.directionX;
    this.y += this.directionY;
  }

  render(render) {
    const { ctx } = render;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    connect(render);
  }
}

const initParticles = () => {
  const { height, width } = utils.htmlElements.canvas();
  const numberOfParticles = 32;
  for (let i = 0; i < numberOfParticles; i += 1) {
    const size = (Math.random() * 1.5) + 1.5;
    const x = (Math.random() * ((width - size * 2) - (size * 2)) + size * 2);
    const y = (Math.random() * ((height - size * 2) - (size * 2)) + size * 2);
    const directionX = (Math.random() * 2);
    const directionY = (Math.random() * 2);
    const color = '#EB4844';
    arrPart.push(new Particle(x, y, directionX, directionY, size, color));
  }
  return arrPart;
};

window.particles = initParticles();
