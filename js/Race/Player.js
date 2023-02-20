import utils from '../Core/utils.js';
import SpriteRace from './SpriteRace.js';

class Player {
  constructor(config) {
    this.race = config.race;
    this.render = config.race.core.render;
    this.trackName = config.race.trackName;
    this.inputs = config.race.core.inputs;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.maxRange = 4;
    this.curvePower = 0;
    this.centrifugalForce = 0;
    this.maxSpeed = 1200;
    this.actualSpeed = 0;
    this.sprite = new SpriteRace();
    this.trackPosition = 0;
    this.name = window.playerState.name;
    this.lap = 0;
    this.raceTime = [0];
    this.crashXCorrection = 0;
    this.fps = 10;
    this.deltaTime = 0;
    this.gearTypeAuto = 1;
    this.gear = 1;
    this.gearBox = {
      1: { maxSpeed: Number(50 * 4), minSpeed: Number(0 * 4), ratio: 3.87 },
      2: { maxSpeed: Number(120 * 4), minSpeed: Number(40 * 4), ratio: 2.23 },
      3: { maxSpeed: Number(180 * 4), minSpeed: Number(110 * 4), ratio: 1.45 },
      4: { maxSpeed: Number(230 * 4), minSpeed: Number(170 * 4), ratio: 1.12 },
      5: { maxSpeed: Number(270 * 4), minSpeed: Number(220 * 4), ratio: 0.90 },
      6: { maxSpeed: Number(300 * 4), minSpeed: Number(260 * 4), ratio: 0.71 },
    };
  }

  changeXToLeft(curvePower) {
    this.x = this.x <= -this.maxRange
      ? this.x = -this.maxRange
      : this.x -= curvePower;
  }

  changeXToRight(curvePower) {
    this.x = this.x >= this.maxRange
      ? this.x = this.maxRange
      : this.x += curvePower;
  }

  init() {
    this.images = {};
    this.images.left = new Image();
    this.images.left.src = '/assets/images/cars/f1BluePlayerLeft.png';
    this.images.right = new Image();
    this.images.right.src = '/assets/images/cars/f1BluePlayerRight.png';
    this.sprite.image = this.images.right;
    this.sprite.name = 'Player';
    this.sprite.spritesInX = 6;
    this.sprite.spritesInY = 2;
    this.sprite.sheetPositionY = 1;
    this.sprite.scaleX = 2.5;
    this.sprite.scaleY = 3;

    const { trackSize } = window.tracks.f1Y91[this.race.trackName];
    const qualyPos = Number(this.race.oppNumber) + 1;
    this.trackPosition = utils.startPosition(trackSize, qualyPos);
    this.race.camera.cursor = this.trackPosition;
    this.x = (qualyPos) % 2 ? -1 : 1;
    this.actualSpeed = 0;
    document.addEventListener('keydown', this.makeGears);
  }

  reforceCurvePowerLowSpeed() {
    if (this.actualSpeed < 300) return 2;
    return 1;
  }

  * carXCrashState() {
    while (this.crashXCorrection) {
      this.crashXCorrection = this.crashXCorrection > 0 ? this.crashXCorrection -= 30 : 0;
      yield this.crashXCorrection;
    }
  }

  tyreAnimation = (spriteNum, speed) => {
    if (speed) {
      this.sprite.sheetPositionX = spriteNum;
      this.sprite.sheetPositionY = Number(!this.sprite.sheetPositionY);
    } else {
      this.sprite.sheetPositionX = spriteNum;
    }
  };

  findDirection = () => {
    const { arrowleft, arrowright } = this.inputs.multiDirection.map;
    if (arrowleft) return 'Left';
    if (arrowright) return 'Right';
    return 'Center';
  };

  curveAnim = (speed) => {
    const { arrowleft, arrowright } = this.inputs.multiDirection.map;
    const { sprite } = this;
    const actualImage = this.sprite.image;
    const actualArrow = actualImage.src.match(/Player\w+/g, '')[0].slice(6);
    const keyPress = this.findDirection();

    if ((!arrowleft && !arrowright) && sprite.sheetPositionX >= 0) {
      sprite.sheetPositionX = sprite.sheetPositionX > 0 ? sprite.sheetPositionX -= 1 : 0;
      this.tyreAnimation(sprite.sheetPositionX, speed);
    }

    if (arrowleft || arrowright) {
      if (keyPress === actualArrow) {
        sprite.sheetPositionX = sprite.sheetPositionX < 5 ? sprite.sheetPositionX += 1 : 5;
        this.tyreAnimation(sprite.sheetPositionX, speed);
      } else if (keyPress !== actualArrow && sprite.sheetPositionX > 0) {
        this.tyreAnimation(sprite.sheetPositionX, speed);
        sprite.sheetPositionX = sprite.sheetPositionX > 0 ? sprite.sheetPositionX -= 1 : 0;
      } else if (keyPress !== actualArrow && sprite.sheetPositionX === 0) {
        sprite.sheetPositionX = 1;
        this.sprite.image = this.images[keyPress.toLowerCase()];
        this.tyreAnimation(sprite.sheetPositionX, speed);
      }
    }
  };

  accelerationAT = (speed, mult) => {
    const accel = ((this.maxSpeed + 300) / (speed + 300)) * mult * (1.5 - (speed / this.maxSpeed));
    const result = speed >= this.maxSpeed && accel > 0 ? 0 : accel;
    return result;
  };

  accelerationMT = (speed) => {
    const maxSpeed = this.gearBox[this.gear].maxSpeed + 1;

    const result = ((maxSpeed - speed) * this.gearBox[this.gear].ratio) / 100;
    return result;
  };

  acceleration = (speed, mult) => {
    if (this.gearTypeAuto) {
      return this.accelerationAT(speed, mult);
    }
    return this.accelerationMT(speed, mult);
  };

  makeGears = (e) => {
    if (e.key === 'Shift' || e.key === 'Control') {
      const directions = { Shift: 'up', Control: 'down' };

      if (directions[e.key] === 'up' && this.gear < 6) this.gear += 1;
      if (directions[e.key] === 'down' && this.gear > 1) this.gear -= 1;
    }
  };

  update() {
    this.deltaTime += this.race.core.deltaTime;
    if (this.deltaTime > utils.secondInMS / this.fps && this.race.director.paused) {
      this.curveAnim(this.actualSpeed);
      this.deltaTime = 0;
    }

    // DEV for development only
    if (this.inputs.multiDirection.isKeyDown('m')) {
      utils.changeMode('menuScene', this.race.core);
    }
    //

    if (this.race.director.running) {
      // this.sprite.name = 'Player';
      this.fps = utils.playerFPS(this.actualSpeed);

      // crash corrector
      const alignAfterCrash = this.carXCrashState();

      if (alignAfterCrash.next().value) {
        let direction = Math.sign(this.x);
        if (this.inputs.multiDirection.isKeyDown('arrowLeft')) direction = 1;
        if (this.inputs.multiDirection.isKeyDown('arrowRight')) direction = -1;
        this.changeXToLeft(direction * 0.10);
      }

      // making playerCar moves in Y axis
      let decelerationCurveBoost = 1;

      // offroad deceleration
      let segment = this.race.road.getSegment(this.race.camera.cursor);
      const midSpd = this.maxSpeed / 2;
      if (Math.abs(this.x) > 2.2 && segment.curve && this.actualSpeed > midSpd) {
        this.actualSpeed -= acceleration(this.actualSpeed, 7.2);
      } else if (Math.abs(this.x) > 1.6 && !segment.curve && this.actualSpeed > midSpd) {
        this.actualSpeed -= acceleration(this.actualSpeed, 7.2);
      }

      // acceleration and braking control
      if (this.inputs.multiDirection.isKeyDown('arrowUp')) {
        this.actualSpeed += this.acceleration(this.actualSpeed, 0.9);
      } else if (this.inputs.multiDirection.isKeyDown('arrowDown') && !this.inputs.multiDirection.isKeyDown('arrowUp') && this.actualSpeed >= 0) {
        const brakePower = 6;
        this.actualSpeed = this.actualSpeed % brakePower === 0
          ? this.actualSpeed : Math.ceil(this.actualSpeed / brakePower) * brakePower;
        this.actualSpeed = this.actualSpeed <= 0 ? 0 : this.actualSpeed += -brakePower;
        decelerationCurveBoost = this.actualSpeed >= 10
          ? (1.125 + (this.maxSpeed - this.actualSpeed) / this.maxSpeed)
          : 1;
      } else if (!this.inputs.multiDirection.isKeyDown('arrowUp') && this.actualSpeed > 0) {
        this.actualSpeed = this.actualSpeed % 1 === 0
          ? this.actualSpeed
          : Math.ceil(this.actualSpeed);
        this.actualSpeed = this.actualSpeed < 2 ? 0 : this.actualSpeed += -2;
        decelerationCurveBoost = this.actualSpeed >= 10
          ? (1.125 + (this.maxSpeed - this.actualSpeed) / this.maxSpeed)
          : 1;
      }

      // making a centrifugal force to pull the car
      segment = this.race.road.getSegment(this.race.camera.cursor);
      const playerPosition = (Math.floor((this.race.camera.cursor / this.race.road.segmentLength)));
      const baseForce = 0.06;
      this.centrifugalForce = Math.abs(
        baseForce * (this.actualSpeed / this.maxSpeed) * segment.curve,
      );
      if (playerPosition === segment.index && segment.curve && this.actualSpeed) {
        if (segment.curve < 0) this.changeXToRight(this.centrifugalForce);
        if (segment.curve > 0) this.changeXToLeft(this.centrifugalForce);
      }

      // making playerCar moves in X axis
      this.curvePower = baseForce * (this.actualSpeed / this.maxSpeed)
        * this.reforceCurvePowerLowSpeed();
      const curvePowerOnCentrifugalForce = (
        baseForce + Math.abs(4 * (segment.curve / 100))) * (this.actualSpeed / this.maxSpeed
      );

      if (this.inputs.multiDirection.isKeyDown('arrowleft') && this.actualSpeed !== 0 && segment.curve < 0) {
        this.curvePower = curvePowerOnCentrifugalForce * decelerationCurveBoost
          * this.reforceCurvePowerLowSpeed();
        this.changeXToLeft(this.curvePower);
      } else if (this.inputs.multiDirection.isKeyDown('arrowleft') && this.actualSpeed !== 0 && segment.curve > 0) {
        this.curvePower = curvePowerOnCentrifugalForce / 40;
        this.centrifugalForce /= 40;
        this.changeXToLeft(this.curvePower);
      } else if (this.inputs.multiDirection.isKeyDown('arrowleft') && this.actualSpeed !== 0) {
        this.curvePower *= 1.15;
        this.changeXToLeft(this.curvePower);
      } else if (this.inputs.multiDirection.isKeyDown('arrowright') && this.actualSpeed !== 0 && segment.curve > 0) {
        this.curvePower = curvePowerOnCentrifugalForce * decelerationCurveBoost
          * this.reforceCurvePowerLowSpeed();
        this.changeXToRight(this.curvePower);
      } else if (this.inputs.multiDirection.isKeyDown('arrowright') && this.actualSpeed !== 0 && segment.curve < 0) {
        this.curvePower = curvePowerOnCentrifugalForce / 40;
        this.centrifugalForce /= 40;
        this.changeXToRight(this.curvePower);
      } else if (this.inputs.multiDirection.isKeyDown('arrowright') && this.actualSpeed !== 0) {
        this.curvePower *= 1.15;
        this.changeXToRight(this.curvePower);
      }

      this.trackPosition += this.actualSpeed;
      const { trackSize } = window.tracks.f1Y91[this.race.road.trackName];
      const actualPosition = this.trackPosition / 200;
      const actualLap = Math.floor(actualPosition / trackSize);

      if (this.lap < actualLap) {
        this.raceTime.push(this.race.director.totalTime);
        this.lap += 1;
      }

      // making player crash
      const baseSegment = segment.index;
      const lookupTrackside = 4;
      let crashLookup = 4;
      const minHit = baseSegment + lookupTrackside;
      if (this.actualSpeed / this.maxSpeed < 0.5) {
        crashLookup = Math.ceil((this.actualSpeed / this.maxSpeed) * 4);
      }

      for (let i = baseSegment; i <= minHit; i += 1) {
        const crashSegment = this.race.road.getSegmentFromIndex(i);

        for (let j = 0; j < crashSegment.sprites.length; j += 1) {
          const sprite = crashSegment.sprites[j];

          const { scale } = crashSegment;
          const ignoredSprites = ['tsStartLights'];
          const regexDrivers = /^op\w*/g;
          const isDriverSprite = regexDrivers.test(sprite.name);
          const callerW = this.sprite.scaleX * 320 * 0.001;
          const otherX = sprite.offsetX * 2;
          const otherSize = (sprite.width / sprite.spritesInX);
          const otherW = Math.min(scale * sprite.scaleX * otherSize, otherSize * 0.001);
          const overLapResponse = utils.overlap(this.x, callerW, otherX, otherW, 1.1);

          if (overLapResponse && !ignoredSprites.includes(sprite.name)
            && (i <= baseSegment + crashLookup || (i > baseSegment && !isDriverSprite))) {
            // console.log('sp', sprite);
            const { speed, mult } = sprite.actualSpeed;
            const differentialSpeedPercent = (this.actualSpeed - speed) / 1200;
            console.log('name', sprite.name, 'dif', Math.abs(this.actualSpeed - speed), 'pl', this.actualSpeed, 'op', speed);
            this.actualSpeed = utils.calcCrashSpeed(this.actualSpeed, speed, mult);
            this.crashXCorrection += 600 * differentialSpeedPercent;
            // this.race.camera.cursor -= 800;
            const oppIdx = this.race.opponents.findIndex(
              (driver) => driver.sprite.name === sprite.name,
            );

            if (oppIdx !== -1) {
              this.race.opponents[oppIdx].maxSpeed *= (1 + Math.abs(differentialSpeedPercent / 3));
              this.race.opponents[oppIdx].actualSpeed *= (1 + Math.abs(differentialSpeedPercent / 3));
              this.race.opponents[oppIdx].isCrashed = 1;
            }
          }
        }
      }
      if (this.actualSpeed < 0) this.actualSpeed = 0;
      // this.cursor = this.race.camera.cursor;
      this.race.camera.cursor += this.actualSpeed;
      this.race.camera.update();
    }
  }

  draw() {
    const clip = 0;
    const scale = 1 / this.race.camera.h;
    const { midpoint: { x: midX }, height } = this.race.camera.screen;

    this.render.drawRaceSprite(
      this.sprite,
      this.race.camera,
      this,
      this.race.road.width,
      scale,
      midX,
      height,
      clip,
    );
  }
}

export default Player;
