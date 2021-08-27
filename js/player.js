import Sprite from './sprite.js';
import { keyboard } from './util.js';

class Player {
  x = 0;
  y = 0;
  z = 0;
  maxRange = 6;
  animationUpdateTime = 3 / 60;
  curvePower = 0;
  centrifugalForce = 0;

  sprite = new Sprite;

  get width() {
    return this.sprite.width;
  };

  get height() {
    return this.sprite.height;
  };

  changeXToLeft(curvePower) {
    this.x <= -this.maxRange ? this.x = -this.maxRange : this.x -= curvePower;
  }

  changeXToRight(curvePower) {
    this.x >= this.maxRange ? this.x = this.maxRange : this.x += curvePower;
  }

  update(camera, road) {
    // making a centrifugal force to pull the car
    const segment = road.getSegment(camera.cursor);
    this.centrifugalForce = 0.06 * (camera.runningPower / camera.maxSpeed);
    if ((Math.floor((camera.cursor / road.segmentLength)) === segment.index && segment.curve) && camera.runningPower !== 0) {
      if (segment.curve < 0) {
        this.changeXToRight(this.centrifugalForce); // with curveInclination
      }
      if (segment.curve > 0) {
        this.changeXToLeft(this.centrifugalForce);
      }
    }

    // making playerCar moves in X axis
    this.curvePower = 0.08 * (camera.runningPower / camera.maxSpeed);
    if (keyboard.isKeyDown('arrowleft') && camera.runningPower !== 0) {
      this.changeXToLeft(this.curvePower); // with speed
    } else if (keyboard.isKeyDown('arrowright') && camera.runningPower !== 0) {
      this.changeXToRight(this.curvePower);
    }
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
      camera.screen.midpoint.x, camera.screen.height, clip
    );
  }
}

export default Player;
