import utils from '../Core/utils.js';

class Camera {
  constructor(config) {
    this.race = config.race;
    this.road = config.race.road;
    this.director = config.race.director;
    this.x = 0;
    this.y = 1500;
    this.z = 0;
    this.h = this.y;
    this.cursor = 0;
    this.deltaZ = 0;
    this.distanceToProjectionPlane = 1 / Math.tan(utils.theta);
    this.screen = {
      midpoint: {
        x: utils.htmlElements.gameCanvas().width * 0.5,
        y: utils.htmlElements.gameCanvas().height * 0.5,
      },
      width: utils.htmlElements.gameCanvas().width,
      height: utils.htmlElements.gameCanvas().height,
    };
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

export default Camera;
