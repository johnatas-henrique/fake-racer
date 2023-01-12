import utils from '../Core/utils.js';

class Tachometer {
  constructor(config) {
    this.actualSpeed = 0;
    this.race = config.race;
    this.options = {};
  }

  init() {
    this.render = this.race.core.render;
    this.director = this.race.director;
    this.player = this.race.player;
    this.options = {
      context: this.render.ctx, x: 570, y: 300, radius: 50, arcX: 50, arcY: 15,
    };
  }

  update() {
    if (this.director.paused) {
      this.actualSpeed = this.player.actualSpeed;
    }
    if (this.actualSpeed > 1140) {
      this.actualSpeed = this.actualSpeed - 2 + Math.random() * 6;
    }
  }

  drawNeedle() {
    const { context, x, y, radius } = this.options;

    const speedAngle = utils.speedToDeg(this.actualSpeed / 4, 360, -30, 210);
    const speedRad = utils.degToRad(speedAngle);
    const onArcX = radius - (Math.cos(speedRad) * 0);
    const onArcY = radius - (Math.sin(speedRad) * 0);
    const innerX = radius - (Math.cos(speedRad) * (radius * 0.7));
    const innerY = radius - (Math.sin(speedRad) * (radius * 0.7));

    const fromX = x - radius + onArcX;
    const fromY = y - radius + onArcY;

    const toX = x - radius + innerX;
    const toY = y - radius + innerY;

    context.save();
    context.beginPath();
    context.strokeStyle = '#f00';
    context.lineWidth = 2;
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
    context.restore();
  }

  drawNeedleDial() {
    const { context, x, y } = this.options;
    const sColor = 'rgb(127, 127, 127)';
    const fColor = 'rgb(255,255,255)';
    for (let i = 0; i < 8; i += 1) {
      context.save();
      context.globalAlpha = 0.6;
      context.lineWidth = 3;
      context.beginPath();
      context.strokeStyle = sColor;
      context.fillStyle = fColor;
      context.arc(x, y, i, 15, Math.PI, true);
      context.fill();
      context.stroke();
      context.restore();
    }
  }

  outerMettalicArc() {
    const { context, x, y, radius, arcY } = this.options;
    context.save();
    context.globalAlpha = 0.75;
    context.beginPath();
    context.fillStyle = 'rgb(63,63,63)';
    context.arc(x, y, radius, arcY, Math.PI, true);
    context.fill();
    context.restore();
  }

  drawMarks() {
    const { context, x, y, radius } = this.options;
    for (let i = -30; i <= 210; i += 40) {
      const iRad = utils.degToRad(i);
      const onArcX = radius - (Math.cos(iRad) * (radius - 10));
      const onArcY = radius - (Math.sin(iRad) * (radius - 10));
      const innerX = radius - (Math.cos(iRad) * radius);
      const innerY = radius - (Math.sin(iRad) * radius);

      const fromX = x - radius + onArcX;
      const fromY = y - radius + onArcY;

      const toX = x - radius + innerX;
      const toY = y - radius + innerY;

      context.save();
      context.beginPath();
      context.strokeStyle = '#FFFFFF';
      context.lineWidth = 1.5;
      context.moveTo(fromX, fromY);
      context.lineTo(toX, toY);
      context.stroke();
      context.restore();
    }

    for (let i = -10; i <= 210; i += 40) {
      const iRad = utils.degToRad(i);
      const onArcX = radius - (Math.cos(iRad) * (radius - 5));
      const onArcY = radius - (Math.sin(iRad) * (radius - 5));
      const innerX = radius - (Math.cos(iRad) * radius);
      const innerY = radius - (Math.sin(iRad) * radius);

      const fromX = x - radius + onArcX;
      const fromY = y - radius + onArcY;

      const toX = x - radius + innerX;
      const toY = y - radius + innerY;

      context.save();
      context.beginPath();
      context.strokeStyle = '#000000';
      context.lineWidth = 1.5;
      context.moveTo(fromX, fromY);
      context.lineTo(toX, toY);
      context.stroke();
      context.restore();
    }
  }

  drawText() {
    const { x, y, radius } = this.options;

    for (let i = -30, n = 0; i <= 210; i += 40) {
      n += 1;
      const iRad = utils.degToRad(i);
      const onArcX = radius - (Math.cos(iRad) * (radius - 19 - (n * 0.8)));
      const yFix = n !== 4 ? 4 : -1;
      const onArcY = radius - (Math.sin(iRad) * (radius - 15 - yFix));

      const fromX = x - radius + onArcX;
      const fromY = y - radius + onArcY;

      const speed = 10 + i + 20 * n;
      this.render.drawText('#000', speed, fromX, fromY, 0.75, 'OutRiderCond', 'center', '#000', false);
    }
  }

  drawColorArc() {
    const { context, x, y, radius } = this.options;
    const start = utils.degToRad(149.5);
    const endGreen = utils.degToRad(291);
    const endYellow = utils.degToRad(10);
    const endRed = utils.degToRad(30.5);
    context.save();
    context.lineWidth = 3;
    this.render.drawCircle(x, y, radius + 1, start, endGreen, false, 'rgb(82, 240, 55)');
    this.render.drawCircle(x, y, radius + 1, endGreen, endYellow, false, 'yellow');
    this.render.drawCircle(x, y, radius + 1, endYellow, endRed, false, 'red');
    context.restore();
  }

  draw() {
    this.outerMettalicArc();
    this.drawMarks();
    this.drawText();
    this.drawColorArc();
    this.drawNeedleDial();
    this.drawNeedle();
  }
}

export default Tachometer;
