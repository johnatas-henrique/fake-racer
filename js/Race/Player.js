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
    this.baseForce = 0.06;
    this.decelerationCurveBoost = 1;
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
    this.sprite.scaleX = 2;
    this.sprite.scaleY = 2.2;

    const { trackSize } = window.tracks.f1Y91[this.race.trackName];
    const qualyPos = Number(this.race.oppNumber) + 1;
    this.trackPosition = utils.startPosition(trackSize, qualyPos);
    this.race.camera.cursor = this.trackPosition;
    this.x = (qualyPos) % 2 ? -1 : 1;
    this.actualSpeed = 0;
    document.addEventListener('keydown', this.makeGears);
  }

  reforceCurvePower() {
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

  crash() {
    const baseSegment = this.segment.index;
    const crashLookup = 5;
    const minHit = baseSegment + crashLookup;

    for (let i = baseSegment; i <= minHit; i += 1) {
      const crashSegment = this.race.road.getSegmentFromIndex(i);
      for (let j = 0; j < crashSegment.sprites.length; j += 1) {
        const sprite = crashSegment.sprites[j];
        const ignoredSprites = ['tsStartLights'];
        const isNotIgnored = !ignoredSprites.includes(sprite.name);
        const regexDrivers = /^op\w*/g;
        const isDriverSprite = regexDrivers.test(sprite.name);

        const callerW = this.sprite.scaleX * 320 * 0.001;
        const otherX = sprite.offsetX * 2;
        const otherSize = (sprite.width / sprite.spritesInX);
        const constantW = sprite.scaleX * otherSize * 0.001;
        const otherW = isDriverSprite ? 0.5 * constantW : 0.05 * constantW;
        const overLapResponse = utils.overlap(this.x, callerW, otherX, otherW, 1);

        if (overLapResponse && i <= minHit && isNotIgnored) {
          const crashSpeeds = {};
          const { speed, mult } = sprite.actualSpeed;
          const differentialSpeedPercent = (this.actualSpeed - speed) / 1200;
          this.crashXCorrection += 600 * differentialSpeedPercent;
          crashSpeeds.player = this.actualSpeed;
          this.actualSpeed = utils.calcCrashSpeed(this.actualSpeed, speed, mult);

          if (isDriverSprite) {
            const oppIdx = this.race.opponents.findIndex((op) => op.sprite.name === sprite.name);
            crashSpeeds.opponent = this.race.opponents[oppIdx].actualSpeed;
            crashSpeeds.newPlayer = ((crashSpeeds.player + crashSpeeds.opponent) / 2) * 0.8;
            crashSpeeds.newOpponent = ((crashSpeeds.player + crashSpeeds.opponent) / 2) * 1.1;

            this.race.opponents[oppIdx].isCrashed = 1;
            this.race.opponents[oppIdx].maxSpeed *= (1 + Math.abs(differentialSpeedPercent / 3));
            this.race.opponents[oppIdx].actualSpeed = crashSpeeds.newOpponent;
            this.actualSpeed = this.actualSpeed > crashSpeeds.newPlayer
              ? this.actualSpeed : crashSpeeds.newPlayer;
          }
        }
      }
    }
  }

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
    if (this.gearTypeAuto) return this.accelerationAT(speed, mult);
    return this.accelerationMT(speed, mult);
  };

  makeGears = (e) => {
    if (e.key === 'Shift' || e.key === 'Control') {
      const directions = { Shift: 'up', Control: 'down' };

      if (directions[e.key] === 'up' && this.gear < 6) this.gear += 1;
      if (directions[e.key] === 'down' && this.gear > 1) this.gear -= 1;
    }
  };

  offroadBraking() {
    const midSpd = this.maxSpeed / 2;
    const player = 0.16 * this.sprite.scaleX;
    if (Math.abs(this.x) > 2.6 - player && this.segment.kerb && this.actualSpeed > midSpd) {
      this.actualSpeed += this.accelerationAT(this.actualSpeed, -7.2);
    } else if (Math.abs(this.x) > 2 - player && !this.segment.kerb && this.actualSpeed > midSpd) {
      this.actualSpeed += this.accelerationAT(this.actualSpeed, -7.2);
    }
  }

  carForceToOutside() {
    const playerPosition = (Math.floor((this.race.camera.cursor / this.race.road.segmentLength)));
    this.centrifugalForce = Math.abs(
      this.baseForce * (this.actualSpeed / this.maxSpeed) * this.segment.curve,
    );
    if (playerPosition === this.segment.index && this.segment.curve && this.actualSpeed) {
      if (this.segment.curve < 0) { this.changeXToRight(this.centrifugalForce); }
      if (this.segment.curve > 0) { this.changeXToLeft(this.centrifugalForce); }
    }
  }

  static getDirection(curve) {
    if (curve > 0) return 'Right';
    if (curve < 0) return 'Left';
    return 'Any';
  }

  carMoveAxisX() {
    const speedRatio = this.actualSpeed / this.maxSpeed;
    this.curvePower = this.baseForce * speedRatio * this.reforceCurvePower();
    const { curve } = this.segment;
    const curvePowerOnCurves = (this.baseForce + Math.abs(4 * (curve / 100))) * speedRatio;

    if (this.actualSpeed === 0) return;

    const directions = [];

    if (this.inputs.multiDirection.isKeyDown('arrowleft')) {
      directions.push({ dir: 'Left', curveOk: 'Left', curveOutside: 'Right' });
    }
    if (this.inputs.multiDirection.isKeyDown('arrowright')) {
      directions.push({ dir: 'Right', curveOk: 'Right', curveOutside: 'Left' });
    }

    if (directions.length) {
      if (Player.getDirection(curve) === directions[0].curveOk) {
        this.curvePower = curvePowerOnCurves * this.decelerationCurveBoost;
        this[`changeXTo${directions[0].dir}`](this.curvePower);
      } else if (Player.getDirection(curve) === directions[0].curveOutside) {
        this.curvePower = curvePowerOnCurves / 40;
        this.centrifugalForce /= 40;
        this[`changeXTo${directions[0].dir}`](this.curvePower);
      } else {
        this.curvePower *= 1.15;
        this[`changeXTo${directions[0].dir}`](this.curvePower);
      }
    }
  }

  carMoveAxisY() {
    const isAccelerating = this.inputs.multiDirection.isKeyDown('arrowUp');
    const isBraking = this.inputs.multiDirection.isKeyDown('arrowDown');
    if (isAccelerating) {
      this.actualSpeed += this.acceleration(this.actualSpeed, 0.9);
      this.decelerationCurveBoost = 1;
    } else if (isBraking && this.actualSpeed > 0) {
      const brakePower = 6;
      this.actualSpeed -= brakePower;
      this.decelerationCurveBoost = (1.125 + (this.maxSpeed - this.actualSpeed) / this.maxSpeed);
    } else if (!isAccelerating && this.actualSpeed > 0) {
      const liftPower = 2;
      this.actualSpeed -= liftPower;
      this.decelerationCurveBoost = (1.125 + (this.maxSpeed - this.actualSpeed) / this.maxSpeed);
    }
  }

  update() {
    this.deltaTime += this.race.core.deltaTime;
    if (this.deltaTime > utils.secondInMS / this.fps && this.race.director.paused) {
      this.curveAnim(this.actualSpeed);
      this.deltaTime = 0;
    }

    // DEV for development only
    if (this.inputs.multiDirection.isKeyDown('m')) utils.changeMode('menuScene', this.race.core);
    if (this.inputs.multiDirection.isKeyDown('*')) this.actualSpeed = 1200;
    if (this.inputs.multiDirection.isKeyDown('/')) this.x = -0.25;

    if (this.race.director.running) {
      this.segment = this.race.road.getSegment(this.race.camera.cursor);
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
      this.carMoveAxisY();
      this.offroadBraking();

      // making a centrifugal force to pull the car
      this.carForceToOutside();

      // making playerCar moves in X axis
      this.carMoveAxisX();

      // correcting out of bounds actualSpeed
      if (this.actualSpeed < 0) this.actualSpeed = 0;
      if (this.actualSpeed > this.maxSpeed) this.actualSpeed = this.maxSpeed;

      // updating track position with speed
      this.trackPosition += this.actualSpeed;
      this.race.camera.cursor += this.actualSpeed;
      const { trackSize } = window.tracks.f1Y91[this.race.road.trackName];
      const actualPosition = this.trackPosition / 200;
      const actualLap = Math.floor(actualPosition / trackSize);

      if (this.lap < actualLap) {
        this.raceTime.push(this.race.director.totalTime);
        this.lap += 1;
      }

      // making player crash
      this.crash();
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
