import Sprite from './sprite.js';
import { handleInput, ceil } from './util.js';

class Player {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.maxRange = 6;
    this.animationUpdateTime = 3 / 60;
    this.curvePower = 0;
    this.centrifugalForce = 0;
    this.maxSpeed = 1200;
    this.runningPower = 0;
    this.startPress = 0;
    this.sprite = new Sprite();
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

  update(camera, road) {
    // recover button
    const cameraClass = camera;
    if (handleInput.isKeyDown('r')) {
      cameraClass.cursor = road.length - (road.segmentLength * road.rumbleLength * 2);
      this.x = 0;
      this.runningPower = 600;
    }

    // making playerCar moves in Y axis
    const acceleration = (speed, mult) => ((this.maxSpeed + 300) / (speed + 300) + 0.4) * mult;
    let decelerationCurveBoost = 1;
    if (handleInput.isKeyDown('arrowUp')) {
      if (this.runningPower === 0) this.startPress = window.performance.now();
      this.runningPower = this.runningPower >= this.maxSpeed
        ? this.maxSpeed : this.runningPower += acceleration(this.runningPower, 0.9);
      cameraClass.cursor += this.runningPower;
    } else if (handleInput.isKeyDown('arrowDown') && !handleInput.isKeyDown('arrowUp') && this.runningPower >= 0) {
      const brakePower = 6;
      this.runningPower = this.runningPower % brakePower === 0
        ? this.runningPower : ceil(this.runningPower / brakePower) * brakePower;
      this.runningPower = this.runningPower <= 0 ? 0 : this.runningPower += -brakePower;
      decelerationCurveBoost = this.runningPower >= 10
        ? (1.125 + (this.maxSpeed - this.runningPower) / this.maxSpeed)
        : 1;
      cameraClass.cursor += this.runningPower;
    } else if (!handleInput.isKeyDown('arrowUp') && this.runningPower > 0) {
      this.runningPower = this.runningPower % 1 === 0 ? this.runningPower : ceil(this.runningPower);
      this.runningPower = this.runningPower <= 0 ? 0 : this.runningPower += -1;
      cameraClass.cursor += this.runningPower;
      decelerationCurveBoost = this.runningPower >= 10
        ? (1.125 + (this.maxSpeed - this.runningPower) / this.maxSpeed)
        : 1;
    }

    // making a centrifugal force to pull the car
    const segment = road.getSegment(camera.cursor);
    const playerPosition = (Math.floor((camera.cursor / road.segmentLength)));
    const baseForce = 0.06;
    this.centrifugalForce = Math.abs(
      baseForce * (this.runningPower / this.maxSpeed) * segment.curve,
    );
    if (playerPosition === segment.index && segment.curve && this.runningPower) {
      if (segment.curve < 0) {
        this.changeXToRight(this.centrifugalForce);
      }
      if (segment.curve > 0) {
        this.changeXToLeft(this.centrifugalForce);
      }
    }

    // making playerCar moves in X axis
    this.curvePower = baseForce * (this.runningPower / this.maxSpeed);
    const curvePowerOnCentrifugalForce = (
      baseForce + Math.abs(4 * (segment.curve / 100))) * (this.runningPower / this.maxSpeed
    );

    if (handleInput.isKeyDown('arrowleft') && this.runningPower !== 0 && segment.curve < 0) {
      this.curvePower = curvePowerOnCentrifugalForce * decelerationCurveBoost;
      this.changeXToLeft(this.curvePower);
    } else if (handleInput.isKeyDown('arrowleft') && this.runningPower !== 0 && segment.curve > 0) {
      this.curvePower = curvePowerOnCentrifugalForce / 40;
      this.centrifugalForce /= 40;
      this.changeXToLeft(this.curvePower);
    } else if (handleInput.isKeyDown('arrowleft') && this.runningPower !== 0) {
      this.changeXToLeft(this.curvePower);
    } else if (handleInput.isKeyDown('arrowright') && this.runningPower !== 0 && segment.curve > 0) {
      this.curvePower = curvePowerOnCentrifugalForce * decelerationCurveBoost;
      this.changeXToRight(this.curvePower);
    } else if (handleInput.isKeyDown('arrowright') && this.runningPower !== 0 && segment.curve < 0) {
      this.curvePower = curvePowerOnCentrifugalForce / 40;
      this.centrifugalForce /= 40;
      this.changeXToRight(this.curvePower);
    } else if (handleInput.isKeyDown('arrowright') && this.runningPower !== 0) {
      this.changeXToRight(this.curvePower);
    }

    camera.update(road);
  }

  /**
   *
   * @param {Render} render
   * @param {Camera} camera
   * @param {Number} roadWidth
   */
  render(render, camera, roadWidth) {
    const clip = 0;
    const scale = 1 / camera.h;
    render.drawSprite(
      this.sprite, camera, this, roadWidth, scale,
      camera.screen.midpoint.x, camera.screen.height, clip,
    );
  }
}

export default Player;
