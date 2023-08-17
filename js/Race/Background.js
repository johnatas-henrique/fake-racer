import SpriteRace from './SpriteRace.js';

class Background {
  constructor(config) {
    this.race = config.race;
    this.render = config.race.core.render;
    this.bgImages = config.race.road.actualTrack.backgrounds || {};
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.layerBackSpeed = 0.001;
    this.layerMiddleSpeed = 0.002;
    this.layerFrontSpeed = 0.003;
    this.layerBackOffset = 0;
    this.layerMiddleOffset = 0;
    this.layerFrontOffset = 0;
    this.arrLayers = [];
  }

  init() {
    this.layerBack = new SpriteRace({ name: 'bgBack', imageSrc: this.bgImages.back });
    this.layerMiddle = new SpriteRace({ name: 'bgMiddle', imageSrc: this.bgImages.middle });
    this.layerFront = new SpriteRace({ name: 'bgFront', imageSrc: this.bgImages.front });
    const layers = ['back', 'middle', 'front'];
    layers.forEach((layer) => {
      if (this.bgImages[layer]) {
        this.arrLayers.push(`layer${layer.charAt(0).toUpperCase() + layer.slice(1)}`);
      }
    });
  }

  update() {
    if (this.race.director.paused) {
      const increase = (start, increment, max) => { // with looping
        let result = start + increment;
        while (result >= max) { result -= max; }
        while (result < 0) { result += max; }
        return result;
      };
      const segment = this.race.road.getSegment(this.race.camera.cursor);
      const speedPercent = this.race.player.actualSpeed / this.race.player.maxSpeed;
      const inc = segment.curve * speedPercent * -1;

      this.layerBackOffset = increase(this.layerBackOffset, this.layerBackSpeed * inc, 2);
      this.layerMiddleOffset = increase(this.layerMiddleOffset, this.layerMiddleSpeed * inc, 2);
      this.layerFrontOffset = increase(this.layerFrontOffset, this.layerFrontSpeed * inc, 2);
    }
  }

  draw() {
    const clip = 0;
    const scale = 1 / this.race.camera.h;
    this.arrLayers.forEach((item) => {
      // camera.y * 0.06 does the job here using 1280x240 images
      this[item].scaleX = 5.25;
      this[item].scaleY = 5.25;
      const positionW = this.race.camera.screen.midpoint.x * 2 * this[`${item}Offset`];
      const correctedWidth = this.race.player.sprite.width / 64;
      const scaledRight = scale * 0.05 * correctedWidth;
      this.render.drawRaceSprite(
        this[item],
        this.race.camera,
        this.race.player,
        this.race.road.width,
        scaledRight,
        positionW,
        this[item].height,
        clip,
      );
      if (Math.abs(this[`${item}Offset`]) > 1) {
        this.render.drawRaceSprite(
          this[item],
          this.race.camera,
          this.race.player,
          this.race.road.width,
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
