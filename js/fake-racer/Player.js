class Player {
  constructor(config) {
    this.race = config.race;
    this.render = config.race.core.render;
    this.camera = config.race.camera;
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
    this.startPress = 0;
    this.sprite = new SpriteRace();
    this.trackPosition = 0;
    this.name = 'Player X';
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
    this.inputs.multiDirection.init();

    this.sprite.cache = {};
    this.sprite.cache.left = new Image();
    this.sprite.cache.left.src = '../images/sprites/player/playerLeft.png';
    this.sprite.cache.right = new Image();
    this.sprite.cache.right.src = '../images/sprites/player/playerRight.png';
    this.sprite.image = this.sprite.cache.right;
    this.sprite.name = 'Player';
    this.sprite.spritesInX = 6;
    this.sprite.spritesInY = 2;
    this.sprite.sheetPositionY = 1;
    this.sprite.scaleX = 2.5;
    this.sprite.scaleY = 3;

    const { trackSize } = utils.tracks[window.gameState.menuSelectedOptions.track];
    const qualyPos = Number(window.gameState.menuSelectedOptions.opponents) + 1;
    this.trackPosition = utils.startPosition(trackSize, qualyPos);
    this.camera.cursor = this.trackPosition;
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

  // this.sprite.sheetPositionX = 0;

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
        this.sprite.image = this.sprite.cache[keyPress.toLowerCase()];
        this.tyreAnimation(sprite.sheetPositionX, speed);
      }
    }
  };

  update(camera, road, director, oppArr) {
    const cameraClass = camera;
    const oppArrClass = oppArr;
    if (director.running) {
      this.deltaTime += this.race.core.deltaTime;
      this.sprite.name = 'Player';
      this.fps = utils.playerFPS(this.actualSpeed);

      if (this.deltaTime > utils.secondInMS / this.fps) {
        this.deltaTime = 0;
        this.curveAnim(this.actualSpeed);
      }

      if (director.timeSinceLastFrameSwap > this.animationUpdateTime && director.paused) {
        console.log('verificar o paused');
        this.curveAnim(this.actualSpeed);
        director.timeSinceLastFrameSwap = 0;
      }

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
        // cameraClass.cursor = road.length - (road.segmentLength * road.kerbLength * 2);
        // this.sprite.sheetPositionX += 1;
        this.x = 0;
        this.actualSpeed = 40;
      }
      if (this.inputs.multiDirection.isKeyDown('-')) {
        // cameraClass.cursor = (road.length) - 200 * 200;
        // this.x = 0;
        // this.actualSpeed = 1200;
      }

      // making playerCar moves in Y axis
      const acceleration = (speed, mult) => ((this.maxSpeed + 300) / (speed + 300))
        * mult * (1.5 - (speed / this.maxSpeed));
      let decelerationCurveBoost = 1;

      // offroad deceleration
      let segment = road.getSegment(camera.cursor);
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
        cameraClass.cursor += this.actualSpeed;
      } else if (this.inputs.multiDirection.isKeyDown('arrowDown') && !this.inputs.multiDirection.isKeyDown('arrowUp') && this.actualSpeed >= 0) {
        const brakePower = 6;
        this.actualSpeed = this.actualSpeed % brakePower === 0
          ? this.actualSpeed : Math.ceil(this.actualSpeed / brakePower) * brakePower;
        this.actualSpeed = this.actualSpeed <= 0 ? 0 : this.actualSpeed += -brakePower;
        decelerationCurveBoost = this.actualSpeed >= 10
          ? (1.125 + (this.maxSpeed - this.actualSpeed) / this.maxSpeed)
          : 1;
        cameraClass.cursor += this.actualSpeed;
      } else if (!this.inputs.multiDirection.isKeyDown('arrowUp') && this.actualSpeed > 0) {
        this.actualSpeed = this.actualSpeed % 1 === 0
          ? this.actualSpeed
          : Math.ceil(this.actualSpeed);
        this.actualSpeed = this.actualSpeed < 2 ? 0 : this.actualSpeed += -2;
        cameraClass.cursor += this.actualSpeed;
        decelerationCurveBoost = this.actualSpeed >= 10
          ? (1.125 + (this.maxSpeed - this.actualSpeed) / this.maxSpeed)
          : 1;
      }

      // making a centrifugal force to pull the car
      segment = road.getSegment(camera.cursor);
      const playerPosition = (Math.floor((camera.cursor / road.segmentLength)));
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
      const { trackSize } = utils.tracks[road.trackName];
      const actualPosition = this.trackPosition / 200;
      const actualLap = Math.floor(actualPosition / trackSize);

      if (this.lap < actualLap) {
        this.raceTime.push(director.totalTime);
        this.lap += 1;
      }

      // making player crash
      const baseSegment = segment.index;
      const lookupTrackside = 4;
      let crashLookup = 0;
      if (this.actualSpeed / this.maxSpeed < 0.5) crashLookup = 1;
      const minHit = baseSegment + lookupTrackside;
      for (let i = baseSegment; i <= minHit; i += 1) {
        const crashSegment = road.getSegmentFromIndex(i);
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
            this.crashXCorrection += 300 * differentialSpeedPercent;
            cameraClass.cursor -= 300;
            const oppIndex = oppArrClass.findIndex((driver) => driver.sprite.name === sprite.name);
            if (oppIndex !== -1) {
              oppArrClass[oppIndex].maxSpeed *= (1 + Math.abs(differentialSpeedPercent / 6));
              oppArrClass[oppIndex].actualSpeed *= (1 + Math.abs(differentialSpeedPercent / 3));
              oppArrClass[oppIndex].isCrashed = 1;
            }
          }
        }
      }
      if (this.actualSpeed < 0) this.actualSpeed = 0;
      this.cursor = camera.cursor;
      camera.update(road, director);
    }
  }

  draw(camera, roadWidth) {
    const clip = 0;
    const scale = 1 / camera.h;

    this.render.drawSprite(
      this.sprite,
      camera,
      this,
      roadWidth,
      scale,
      camera.screen.midpoint.x,
      camera.screen.height,
      clip,
      this.sprite.spritesInX,
      this.sprite.spritesInY,
    );
  }
}
