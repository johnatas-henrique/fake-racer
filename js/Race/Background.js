import SpriteRace from './SpriteRace.js';

class Background {
  constructor(config) {
    this.race = config.race;
    this.render = config.race.core.render;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.layer1Speed = 0.001;
    this.layer2Speed = 0.002;
    this.layer3Speed = 0.003;
    this.layer1Offset = 0;
    this.layer2Offset = 0;
    this.layer3Offset = 0;
    this.layer1 = new SpriteRace();
    this.layer2 = new SpriteRace();
    this.layer3 = new SpriteRace();
    this.images = {};
    this.raining = null;
    this.player = null;
    this.camera = null;
    this.road = null;
    this.director = null;
  }

  init() {
    this.images.skyClear = new Image();
    this.images.skyDark = new Image();
    this.images.hill = new Image();
    this.images.tree = new Image();

    this.images.skyClear.src = './images/sprites/background/skyClear.png';
    this.images.skyDark.src = './images/sprites/background/skyDark.png';
    this.images.hill.src = './images/sprites/background/hill.png';
    this.images.tree.src = './images/sprites/background/tree.png';

    this.layer1.image = this.race.raining ? this.images.skyDark : this.images.skyClear;
    this.layer2.image = this.images.hill;
    this.layer3.image = this.images.tree;

    this.layer1.name = 'bgSky';
    this.layer2.name = 'bgHill';
    this.layer3.name = 'bgTree';

    this.player = this.race.player;
    this.camera = this.race.camera;
    this.road = this.race.road;
    this.director = this.race.director;
  }

  update() {
    if (this.director.paused) {
      const increase = (start, increment, max) => { // with looping
        let result = start + increment;
        while (result >= max) { result -= max; }
        while (result < 0) { result += max; }
        return result;
      };
      const segment = this.road.getSegment(this.camera.cursor);
      const speedPercent = this.player.actualSpeed / this.player.maxSpeed;
      const increment = segment.curve * speedPercent * -1;

      this.layer1Offset = increase(this.layer1Offset, this.layer1Speed * increment, 2);
      this.layer2Offset = increase(this.layer2Offset, this.layer2Speed * increment, 2);
      this.layer3Offset = increase(this.layer3Offset, this.layer3Speed * increment, 2);
    }
  }

  draw() {
    const clip = 0;
    const scale = 1 / this.camera.h;
    const arrLayers = ['layer1', 'layer2', 'layer3'];
    arrLayers.forEach((item) => {
      this[item].scaleX = 9;
      this[item].scaleY = 9;
      const positionW = this.camera.screen.midpoint.x * 2 * this[`${item}Offset`];
      const correctedWidth = this.player.width / 64;
      const scaledRight = scale * 0.05 * correctedWidth;

      this.render.drawRaceSprite(
        this[item],
        this.camera,
        this.player,
        this.road.width,
        scaledRight,
        positionW,
        this[item].height,
        clip,
      );
      if (Math.abs(this[`${item}Offset`]) > 1) {
        this.render.drawRaceSprite(
          this[item],
          this.camera,
          this.player,
          this.road.width,
          scaledRight,
          positionW - this[item].width,
          this[item].height,
          clip,
        );
      }
    });
  }
}

export default Background;
