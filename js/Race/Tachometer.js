import utils from '../Core/utils.js';

class Tachometer {
  constructor(config) {
    this.actualSpeed = 0;
    this.race = config.race;
    this.options = {};
    this.gear = 'AT';
    this.minGearSpd = 0;
    this.maxGearSpd = 300;
  }

  gearBox() {
    if (this.player.gearTypeAuto) {
      this.gear = 'AT';
      this.minGearSpd = 0;
      this.maxGearSpd = (this.player.maxSpeed / 4);
      return;
    }
    this.gear = this.player.gear;
    this.minGearSpd = this.player.gearBox[this.gear].minSpeed / 4;
    this.maxGearSpd = (this.player.gearBox[this.gear].maxSpeed / 4);
  }

  init() {
    this.render = this.race.core.render;
    this.director = this.race.director;
    this.player = this.race.player;
    this.gearBox();
    this.options = {
      context: this.render.ctx, x: 630, y: 340, radius: 90, arcX: 90, arcY: 90,
    };
  }

  update() {
    if (this.director.paused) {
      this.actualSpeed = this.player.actualSpeed;
      this.gearBox();
      this.angle = utils.rpmToDeg(this.actualSpeed / 4, this.minGearSpd, this.maxGearSpd, 180, 270);
      if (this.angle > 264) this.angle = this.angle - 4 + Math.random() * 4;
    }
  }

  drawPointer() {
    const { context, x, y, radius } = this.options;
    const point = utils.getCirclePoint(x, y, radius - 20, this.angle, 0.85);
    const point2 = utils.getCirclePoint(x, y, 2, this.angle + 90, 0.85);
    const point3 = utils.getCirclePoint(x, y, 2, this.angle - 90, 0.85);

    // draw needle
    context.beginPath();
    context.strokeStyle = '#ff9166';
    context.lineCap = 'round';
    context.lineWidth = 3;
    context.moveTo(point2.x, point2.y);
    context.lineTo(point.x, point.y);
    context.lineTo(point3.x, point3.y);
    context.stroke();
    context.fillStyle = '#ff9166';
    context.fill();

    // draw dial
    context.beginPath();
    context.arc(x, y, 5, 0, 2 * Math.PI, false);
    context.fillStyle = '#000';
    context.fill();
  }

  outerMettalicArc() {
    const { context, x, y, radius, arcY } = this.options;
    context.save();
    context.globalAlpha = 0.75;
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
    for (let i = 0, n = 3; i <= 90; i += 15) {
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
    this.render.drawText('#ff4146', 'km/h', 605, 350, 1.25, 'OutRiderCond', 'center', '#400', true);
  }

  draw() {
    this.outerMettalicArc();
    this.drawPointer();
    this.drawMarks();
    this.drawText();
    this.drawColorArc();
    this.drawSpeed();
  }
}

export default Tachometer;
