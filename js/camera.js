import { canvas, theta } from './util.js';

class Camera {
  x = 0;
  y = 1500;
  z = 0;
  h = this.y;
  cursor = 0;
  deltaZ = 0;

  #distanceToProjectionPlane = 1 / Math.tan(theta);

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
  update(road, director) {
    const length = road.length;
    if (this.cursor >= length) {
      director.totalLaptimes.push(window.performance.now());
      director.lap += 1;
      if (director.totalLaptimes.length >= 2) {
        const lastLap = director.totalLaptimes[director.lap - 1] - director.totalLaptimes[director.lap - 2];
        director.laptimes.push(lastLap);
      }

      this.cursor -= length;
    } else if (this.cursor <= 0) {
      this.cursor += length;
    }
  }
}

export default Camera;
