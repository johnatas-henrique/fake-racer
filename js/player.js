import Sprite from './sprite.js';
import { keyboard, ceil } from './util.js';

class Player {
  x = 0;
  y = 0;
  z = 0;
  maxRange = 6;
  animationUpdateTime = 3 / 60;
  curvePower = 0;
  centrifugalForce = 0;
  maxSpeed = 1200;
  runningPower = 0;
  startPress = 0;

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
    // recover button
    if (keyboard.isKeyDown('r')) {
      camera.cursor = road.length - (road.segmentLength * road.rumbleLength * 2);
      this.x = 0;
      this.runningPower = 0;
    }

    // making a centrifugal force to pull the car
    const segment = road.getSegment(camera.cursor);
    this.centrifugalForce = 0.06 * (this.runningPower / this.maxSpeed);
    if ((Math.floor((camera.cursor / road.segmentLength)) === segment.index && segment.curve) && this.runningPower !== 0) {
      if (segment.curve < 0) {
        this.changeXToRight(this.centrifugalForce); // with curveInclination
      }
      if (segment.curve > 0) {
        this.changeXToLeft(this.centrifugalForce);
      }
    }

    // making playerCar moves in X axis
    this.curvePower = 0.08 * (this.runningPower / this.maxSpeed);
    if (keyboard.isKeyDown('arrowleft') && this.runningPower !== 0) {
      this.changeXToLeft(this.curvePower); // with speed
    } else if (keyboard.isKeyDown('arrowright') && this.runningPower !== 0) {
      this.changeXToRight(this.curvePower);
    }

    // making playerCar moves in Y axis
    const acceleration = (speed, constant) => ((this.maxSpeed + 300) / (speed + 300) + 0.4) * constant
    if (keyboard.isKeyDown('arrowUp')) {
      if (this.runningPower === 0) this.startPress = window.performance.now()
      if (ceil(this.runningPower) > 200 && ceil(this.runningPower) < 206) console.log('51/0.74', Math.round(window.performance.now() - this.startPress))
      if (ceil(this.runningPower) > 280 && ceil(this.runningPower) < 284) console.log('71/1.05', Math.round(window.performance.now() - this.startPress))
      if (ceil(this.runningPower) > 398 && ceil(this.runningPower) < 402) console.log('100/1.80', Math.round(window.performance.now() - this.startPress))
      if (ceil(this.runningPower) > 566 && ceil(this.runningPower) < 569) console.log('142/2.92', Math.round(window.performance.now() - this.startPress))
      if (ceil(this.runningPower) > 854 && ceil(this.runningPower) < 857) console.log('214/5.20', Math.round(window.performance.now() - this.startPress))
      if (ceil(this.runningPower) > 1197 && ceil(this.runningPower) < 1200) console.log('300/15.00', Math.round(window.performance.now() - this.startPress))
      this.runningPower = this.runningPower >= this.maxSpeed ? this.maxSpeed : this.runningPower += acceleration(this.runningPower, 0.9); //0.9
      camera.cursor += this.runningPower;
    }
    else if (keyboard.isKeyDown("arrowDown") && !keyboard.isKeyDown("arrowUp") && this.runningPower >= 0) {
      const brakePower = 6;
      if (this.runningPower === 0) console.log('carro parou', Math.round(window.performance.now() - this.startPress))
      this.runningPower = this.runningPower % brakePower === 0 ? this.runningPower : ceil(this.runningPower / brakePower) * brakePower;
      this.runningPower = this.runningPower <= 0 ? 0 : this.runningPower += -brakePower;
      camera.cursor += this.runningPower;
    }
    // Removing reverse gear for now
    // else if (keyboard.isKeyDown("arrowDown") && !keyboard.isKeyDown("arrowUp") && this.runningPower <= 0) {
    //   console.log('dando ré', this.runningPower)
    //   this.runningPower = this.runningPower <= -200 ? -200 : this.runningPower += -4;
    //   console.log('dando ré', this.runningPower)
    //   camera.cursor += this.runningPower;
    // }
    else if (!keyboard.isKeyDown("arrowUp") && this.runningPower > 0) {
      this.runningPower = this.runningPower % 1 === 0 ? this.runningPower : ceil(this.runningPower);
      this.runningPower = this.runningPower <= 0 ? 0 : this.runningPower += -1;
      camera.cursor += this.runningPower;
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
      camera.screen.midpoint.x, camera.screen.height, clip
    );
  }
}

export default Player;
