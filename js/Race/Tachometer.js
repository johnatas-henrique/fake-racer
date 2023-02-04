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
    this.gear = 'AT';
    this.options = {
      context: this.render.ctx, x: 630, y: 340, radius: 90, arcX: 90, arcY: 90,
    };
  }

  update() {
    if (this.director.paused) {
      this.actualSpeed = this.player.actualSpeed;
      if (this.actualSpeed > 1140) {
        this.actualSpeed = this.actualSpeed - 2 + Math.random() * 12;
      }
    }
  }

  drawNeedle() {
    const { context, x, y, radius } = this.options;

    const speedAngle = utils.rpmToDeg(this.actualSpeed / 4, 360, 0, 90);
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
    context.fillStyle = '#f00';
    // context.lineWidth = 3;
    // context.moveTo(fromX, fromY);
    // context.lineTo(toX, toY);
    context.lineWidth = 2.5;
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    // context.lineTo(fromX + 2, fromY + 2);
    context.closePath();
    context.stroke();
    context.fill();
    context.restore();
    // this.render.drawRoundRect('#2C69EB', toX, toY, 100, 100, true, 20, false);
  }

  drawNeedleDial() {
    const { context, x, y } = this.options;
    const sColor = 'rgb(127, 127, 127)';
    const fColor = 'rgb(255,255,255)';
    for (let i = 0; i < 4; i += 1) {
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
    context.globalAlpha = 0.85;
    context.beginPath();
    context.fillStyle = 'rgb(33,33,33)';
    context.arc(x, y, radius, arcY, Math.PI, true);
    context.fill();
    context.restore();
  }

  drawMarks() {
    const { context, x, y, radius } = this.options;
    for (let i = 0; i <= 90; i += 15) {
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
      context.strokeStyle = '#fff';
      context.lineWidth = 1.5;
      context.moveTo(fromX, fromY);
      context.lineTo(toX, toY);
      context.stroke();
      context.restore();
    }

    for (let i = 7.5; i <= 82.5; i += 15) {
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
      context.strokeStyle = '#000';
      context.lineWidth = 1.5;
      context.moveTo(fromX, fromY);
      context.lineTo(toX, toY);
      context.stroke();
      context.restore();
    }
  }

  drawText() {
    const { x, y, radius } = this.options;

    for (let i = 0, n = 0; i <= 90; i += 15) {
      const speed = 2 * n;
      n += 1;

      const iRad = utils.degToRad(i);
      const onArcX = radius - (Math.cos(iRad) * (radius - 19 - (n * 0.8)));
      const yFix = n !== 4 ? 4 : -1;
      const onArcY = radius - (Math.sin(iRad) * (radius - 15 - yFix));

      const fromX = x - radius + onArcX;
      const fromY = y - radius + onArcY;

      this.render.drawText('#e6e6e6', speed, fromX, fromY, 0.75, 'OutRiderCond', 'center', '#000', false);
    }
  }

  drawColorArc() {
    const { context, x, y, radius } = this.options;
    const start = utils.degToRad(162);
    const endFirstYellow = utils.degToRad(202.5);
    const endGreen = utils.degToRad(247.5);
    const endYellow = utils.degToRad(262.5);
    const endRed = utils.degToRad(279);
    context.save();
    context.lineWidth = 3;
    this.render.drawCircle(x, y, radius + 1, start, endFirstYellow, false, '#ff0');
    this.render.drawCircle(x, y, radius + 1, endFirstYellow, endGreen, false, '#392');
    this.render.drawCircle(x, y, radius + 1, endGreen, endYellow, false, '#ff0');
    this.render.drawCircle(x, y, radius + 1, endYellow, endRed, false, '#f10');
    context.restore();
  }

  drawSpeed() {
    const correctedSpeed = Math.round(this.player.actualSpeed / 4);
    this.render.drawText('#ff0', this.gear, 605, 300, 1.25, 'OutRiderCond', 'center', '#660', true);
    this.render.drawText('#ff0', correctedSpeed, 605, 325, 1.75, 'OutRiderCond', 'center', '#440', true);
    this.render.drawText('#b00', 'km/h', 605, 350, 1.25, 'OutRiderCond', 'center', '#400', true);
  }

  draw() {
    this.outerMettalicArc();
    this.drawNeedleDial();
    this.drawNeedle();
    this.drawMarks();
    this.drawText();
    this.drawColorArc();
    this.drawSpeed();
  }
}

export default Tachometer;
