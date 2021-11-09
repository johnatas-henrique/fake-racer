import { canvas, tan, theta, keyboard, ceil } from './util.js';

class Camera {
  x = 0;
  y = 1500;
  z = 0;
  h = this.y;
  cursor = 0;
  deltaZ = 0;
  globalMaxSpeed = 1500;
  runningPower = 0;
  #distanceToProjectionPlane = 1 / tan(theta);
  screen = new class {
    midpoint = new class {
      #screen;
      constructor(screen) {
        this.#screen = screen;
      }
      get x() {
        return this.#screen.width * 0.5;
      }
      get y() {
        return this.#screen.height * 0.5;
      }
    }(this);

    get width() {
      return canvas.width;
    }

    get height() {
      return canvas.height;
    }
  };
  get distanceToProjectionPlane() {
    return this.#distanceToProjectionPlane;
  }

  /**
   * 
   * @param {Road} road 
   */
  update(road) {
    const length = road.length;
    // console.log(keyboard.isKeyDown('arrowUp'))
    if (keyboard.isKeyDown('arrowUp')) {
      this.runningPower = this.runningPower > this.globalMaxSpeed ? this.globalMaxSpeed : this.runningPower += 2;
      this.cursor += this.runningPower;
    }
    else if (keyboard.isKeyDown("arrowDown") && !keyboard.isKeyDown("arrowUp") && this.runningPower >= 4) {
      this.runningPower = this.runningPower % 4 === 0 ? this.runningPower : ceil(this.runningPower / 4) * 4;
      this.runningPower = this.runningPower <= 0 ? 0 : this.runningPower += -4;
      this.cursor += this.runningPower;
    }
    // Removing reverse gear for now
    // else if (keyboard.isKeyDown("arrowDown") && !keyboard.isKeyDown("arrowUp") && this.runningPower <= 0) {
    //   console.log('dando ré', this.runningPower)
    //   this.runningPower = this.runningPower <= -200 ? -200 : this.runningPower += -4;
    //   console.log('dando ré', this.runningPower)
    //   this.cursor += this.runningPower;
    // }
    else if (!keyboard.isKeyDown("arrowUp") && this.runningPower > 0) {
      console.log('desacel', this.runningPower)
      this.runningPower = this.runningPower <= 0 ? 0 : this.runningPower += -1;
      this.cursor += this.runningPower;
    }

    if (this.cursor >= length) {
      this.cursor -= length;
    } else if (this.cursor < 0) {
      this.cursor += length;
    }
  }
}

export default Camera;
