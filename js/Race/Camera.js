/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */

class Camera {
  constructor(config) {
    this.race = config.race;
    this.road = config.race.road;
    this.director = config.race.director;
  }
  x = 0;
  y = 1500;
  z = 0;
  h = this.y;
  cursor = 0;
  deltaZ = 0;

  #distanceToProjectionPlane = 1 / Math.tan(utils.theta);

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
      return utils.htmlElements.gameCanvas().width;
    }

    get height() {
      return utils.htmlElements.gameCanvas().height;
    }
  }();

  get distanceToProjectionPlane() {
    return this.#distanceToProjectionPlane;
  }

  init() {
    this.road = this.race.road;
    this.director = this.race.director;
  }

  update() {
    const { length } = this.road;

    if (this.cursor >= length) {
      this.director.totalLaptimes.push(this.director.animTime);
      this.director.animTime = 0;
      this.director.lap += 1;
      if (this.director.totalLaptimes.length >= 2) {
        const lastLap = this.director.totalLaptimes[this.director.lap - 1];
        this.director.laptimes.push(lastLap);
      }
      this.cursor -= length;
    } else if (this.cursor <= 0) {
      this.cursor += length;
    }
  }
}
