import { canvas, tan, theta, keyboard, ceil } from './util.js';

class Camera {
  x = 0;
  y = 1500;
  z = 0;
  h = this.y;
  cursor = 0;
  deltaZ = 0;
  maxSpeed = 1200;
  runningPower = 0;
  startPress = 0;

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
<<<<<<< HEAD
    // console.log(keyboard.isKeyDown('arrowUp'))
    const accel = (speed, constant) => ((this.maxSpeed + 100) / (speed + 100) -0.275) * constant
=======
    const accel = (speed, constant) => ((this.maxSpeed + 300) / (speed + 300) + 0.4) * constant
>>>>>>> 4ec2566 (Feat: Melhorias na curva de aceleração)
    if (keyboard.isKeyDown('arrowUp')) {
      if (this.runningPower === 0) this.startPress = window.performance.now()
      if (ceil(this.runningPower) > 200 && ceil(this.runningPower) < 206) console.log('51/0.74', Math.round(window.performance.now() - this.startPress))
      if (ceil(this.runningPower) > 280 && ceil(this.runningPower) < 284) console.log('71/1.05', Math.round(window.performance.now() - this.startPress))
      if (ceil(this.runningPower) > 398 && ceil(this.runningPower) < 402) console.log('100/1.80', Math.round(window.performance.now() - this.startPress))
      if (ceil(this.runningPower) > 566 && ceil(this.runningPower) < 569) console.log('142/2.92', Math.round(window.performance.now() - this.startPress))
      if (ceil(this.runningPower) > 854 && ceil(this.runningPower) < 857) console.log('214/5.20', Math.round(window.performance.now() - this.startPress))
      if (ceil(this.runningPower) > 1197 && ceil(this.runningPower) < 1200) console.log('300/15.00', Math.round(window.performance.now() - this.startPress))
      this.runningPower = this.runningPower >= this.maxSpeed ? this.maxSpeed : this.runningPower += accel(this.runningPower, 0.9); //0.9
      this.cursor += this.runningPower;
    }
    else if (keyboard.isKeyDown("arrowDown") && !keyboard.isKeyDown("arrowUp") && this.runningPower >= 0) {
      const brakePower = 6;
      if (this.runningPower === 0) console.log('carro parou', Math.round(window.performance.now() - this.startPress))
      this.runningPower = this.runningPower % brakePower === 0 ? this.runningPower : ceil(this.runningPower / brakePower) * brakePower;
      this.runningPower = this.runningPower <= 0 ? 0 : this.runningPower += -brakePower;
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
      this.runningPower = this.runningPower % 1 === 0 ? this.runningPower : ceil(this.runningPower);
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
