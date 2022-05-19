class Player {
  constructor(config) {
    this.race = config.race;
    this.render = config.race.core.render;
    this.trackName = config.race.trackName;
    this.inputs = config.race.core.inputs;
    this.camera = null;
    this.road = null;
    this.director = null;
    this.opponents = null;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.maxRange = 4;
    this.curvePower = 0;
    this.centrifugalForce = 0;
    this.maxSpeed = 1200;
    this.actualSpeed = 0;
    this.startPress = 0;
    this.sprite = new SpriteRace();
    this.trackPosition = 0;
    this.name = window.playerState.name;
    this.lap = 0;
    this.raceTime = [0];
    this.crashXCorrection = 0;
    this.cursor = 0;
    this.fps = 10;
    this.deltaTime = 0;
  }

  get width() {
    return this.sprite.width;
  }

  get height() {
    return this.sprite.height;
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
    this.camera = this.race.camera;
    this.road = this.race.road;
    this.director = this.race.director;
    this.opponents = this.race.opponents;

    this.images = {};
    this.images.left = new Image();
    this.images.left.src = '../images/sprites/player/playerLeft.png';
    this.images.right = new Image();
    this.images.right.src = '../images/sprites/player/playerRight.png';
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
    this.camera.cursor = this.trackPosition;
    this.x = (qualyPos) % 2 ? -1 : 1;
    this.actualSpeed = 0;
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
    const actualArrow = actualImage.src.match(/player\w+/g, '')[0].slice(6);
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

  update() {
    this.deltaTime += this.race.core.deltaTime;
    if (this.deltaTime > utils.secondInMS / this.fps && this.director.paused) {
      this.curveAnim(this.actualSpeed);
      this.deltaTime = 0;
    }

    // for development only
    if (this.inputs.multiDirection.isKeyDown('m')) {
      utils.changeMode('menuScene', this.race.core);
    }

    if (this.director.running) {
      this.sprite.name = 'Player';
      this.fps = utils.playerFPS(this.actualSpeed);

      // crash corrector
      const alignAfterCrash = this.carXCrashState();
      if (alignAfterCrash.next().value) {
        let direction = Math.sign(this.x);
        if (this.inputs.multiDirection.isKeyDown('arrowLeft')) direction = 1;
        if (this.inputs.multiDirection.isKeyDown('arrowRight')) direction = -1;
        this.changeXToLeft(direction * 0.10);
      }

      // recover button
      if (this.inputs.multiDirection.isKeyDown('*')) {
        this.x = 0;
        this.actualSpeed = 1200;
      }

      // making playerCar moves in Y axis
      const acceleration = (speed, mult) => ((this.maxSpeed + 300) / (speed + 300))
        * mult * (1.5 - (speed / this.maxSpeed));
      let decelerationCurveBoost = 1;

      // offroad deceleration
      let segment = this.road.getSegment(this.camera.cursor);
      const midSpd = this.maxSpeed / 2;
      if (Math.abs(this.x) > 2.2 && segment.curve && this.actualSpeed > midSpd) {
        this.actualSpeed -= acceleration(this.actualSpeed, 7.2);
      } else if (Math.abs(this.x) > 1.6 && !segment.curve && this.actualSpeed > midSpd) {
        this.actualSpeed -= acceleration(this.actualSpeed, 7.2);
      }

      // acceleration and braking control
      if (this.inputs.multiDirection.isKeyDown('arrowUp')) {
        if (this.actualSpeed === 0) this.startPress = window.performance.now();
        this.actualSpeed = this.actualSpeed >= this.maxSpeed
          ? this.maxSpeed : this.actualSpeed += acceleration(this.actualSpeed, 0.9);
        this.camera.cursor += this.actualSpeed;
      } else if (this.inputs.multiDirection.isKeyDown('arrowDown') && !this.inputs.multiDirection.isKeyDown('arrowUp') && this.actualSpeed >= 0) {
        const brakePower = 6;
        this.actualSpeed = this.actualSpeed % brakePower === 0
          ? this.actualSpeed : Math.ceil(this.actualSpeed / brakePower) * brakePower;
        this.actualSpeed = this.actualSpeed <= 0 ? 0 : this.actualSpeed += -brakePower;
        decelerationCurveBoost = this.actualSpeed >= 10
          ? (1.125 + (this.maxSpeed - this.actualSpeed) / this.maxSpeed)
          : 1;
        this.camera.cursor += this.actualSpeed;
      } else if (!this.inputs.multiDirection.isKeyDown('arrowUp') && this.actualSpeed > 0) {
        this.actualSpeed = this.actualSpeed % 1 === 0
          ? this.actualSpeed
          : Math.ceil(this.actualSpeed);
        this.actualSpeed = this.actualSpeed < 2 ? 0 : this.actualSpeed += -2;
        this.camera.cursor += this.actualSpeed;
        decelerationCurveBoost = this.actualSpeed >= 10
          ? (1.125 + (this.maxSpeed - this.actualSpeed) / this.maxSpeed)
          : 1;
      }

      // making a centrifugal force to pull the car
      segment = this.road.getSegment(this.camera.cursor);
      const playerPosition = (Math.floor((this.camera.cursor / this.road.segmentLength)));
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
      const { trackSize } = window.tracks.f1Y91[this.road.trackName];
      const actualPosition = this.trackPosition / 200;
      const actualLap = Math.floor(actualPosition / trackSize);

      if (this.lap < actualLap) {
        this.raceTime.push(this.director.totalTime);
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
        const crashSegment = this.road.getSegmentFromIndex(i);

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
            const { speed, mult } = sprite.actualSpeed;
            const differentialSpeedPercent = (this.actualSpeed - speed) / 1200;
            this.actualSpeed = utils.calcCrashSpeed(this.actualSpeed, speed, mult);
            this.crashXCorrection += 600 * differentialSpeedPercent;
            this.camera.cursor -= 800;
            const oppIdx = this.opponents.findIndex(
              (driver) => driver.sprite.name === sprite.name,
            );

            if (oppIdx !== -1) {
              this.opponents[oppIdx].maxSpeed *= (1 + Math.abs(differentialSpeedPercent / 3));
              this.opponents[oppIdx].actualSpeed *= (1 + Math.abs(differentialSpeedPercent / 3));
              this.opponents[oppIdx].isCrashed = 1;
            }
          }
        }
      }
      if (this.actualSpeed < 0) this.actualSpeed = 0;
      this.cursor = this.camera.cursor;
      this.camera.update();
    }
  }

  draw() {
    const clip = 0;
    const scale = 1 / this.camera.h;
    const { midpoint: { x: midX }, height } = this.camera.screen;

    this.render
      .drawRaceSprite(this.sprite, this.camera, this, this.road.width, scale, midX, height, clip);
  }
}
