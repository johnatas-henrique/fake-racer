import utils from '../Core/utils.js';

class Tachometer {
  constructor(config) {
    this.actualSpeed = 0;
    this.race = config.race;
    this.options = {};
    this.gear = 1;
    this.minGearSpd = 0;
    this.maxGearSpd = 300;
  }

  gearBox() {
    const gearBoxArr = Object.values(this.player.gearBox);
    let actualGear = this.gear;
    if (this.player.gearTypeAuto === 1) {
      actualGear = gearBoxArr.sort((a, b) => b.maxSpeed - a.maxSpeed)
        .findIndex((item) => item.minSpeed <= this.actualSpeed) - 6;
    }

    this.gear = `${this.gearType} ${Math.abs(actualGear)}`;
    this.minGearSpd = (this.player.gearBox[Math.abs(actualGear)].minSpeed / 4) * 0.95;
    this.maxGearSpd = (this.player.gearBox[Math.abs(actualGear)].maxSpeed / 4);
  }

  init() {
    this.render = this.race.core.render;
    this.director = this.race.director;
    this.player = this.race.player;
    this.gearType = this.player.gearTypeAuto ? 'AT' : 'MT';
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
    const size = 0.95;
    const point = utils.getCirclePoint(x, y, radius - 20, this.angle, size);
    const point2 = utils.getCirclePoint(x, y, 2, this.angle + 90, size);
    const point3 = utils.getCirclePoint(x, y, 2, this.angle - 90, size);

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
    context.arc(x, y, 6, 0, 2 * Math.PI, false);
    context.fillStyle = '#000';
    context.fill();
  }

  outerMettalicArc() {
    const { context, x, y, radius, arcY } = this.options;
    context.save();
    context.globalAlpha = 0.95;
    context.beginPath();
    context.fillStyle = 'rgb(33,33,33)';
    context.arc(x, y, radius, arcY, Math.PI, true);
    context.fill();
    context.restore();
  }

  drawMarks() {
    const { context, x, y, radius } = this.options;
    const greaterMark = 6;
    const lesserMark = 4;
    for (let i = 0; i <= 90; i += 15) {
      const iRad = utils.degToRad(i);
      const onArcX = radius - (Math.cos(iRad) * (radius - greaterMark));
      const onArcY = radius - (Math.sin(iRad) * (radius - greaterMark));
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
      const onArcX = radius - (Math.cos(iRad) * (radius - lesserMark));
      const onArcY = radius - (Math.sin(iRad) * (radius - lesserMark));
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
      const onArcX = radius - (Math.cos(iRad) * (radius - 10 - (n * 0.8)));
      const yFix = n !== 4 ? 4 : -1;
      const onArcY = radius - (Math.sin(iRad) * (radius - 8 - yFix));

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
