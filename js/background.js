import Sprite from './sprite.js';
import { resource } from './util.js';

class Background {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.layer1Speed = 0.001;
    this.layer2Speed = 0.002;
    this.layer3Speed = 0.003;
    this.layer1Offset = 0;
    this.layer2Offset = 0;
    this.layer3Offset = 0;
    this.layer1 = new Sprite();
    this.layer2 = new Sprite();
    this.layer3 = new Sprite();
  }

  create() {
    this.layer1.image = resource.get('skyClear');
    this.layer2.image = resource.get('hill');
    this.layer3.image = resource.get('tree');
    this.layer1.name = 'bgSky';
    this.layer2.name = 'bgHill';
    this.layer3.name = 'bgTree';
  }

  update(player, camera, road, director) {
    if (director.paused) {
      const increase = (start, increment, max) => { // with looping
        let result = start + increment;
        while (result >= max) { result -= max; }
        while (result < 0) { result += max; }
        return result;
      };
      const segment = road.getSegment(camera.cursor);
      const speedPercent = player.runningPower / player.maxSpeed;
      this.layer1Offset = increase(
        this.layer1Offset, this.layer1Speed * segment.curve * speedPercent * -1, 2,
      );
      this.layer2Offset = increase(
        this.layer2Offset, this.layer2Speed * segment.curve * speedPercent * -1, 2,
      );
      this.layer3Offset = increase(
        this.layer3Offset, this.layer3Speed * segment.curve * speedPercent * -1, 2,
      );
    }
  }

  /**
   *
   * @param {Render} render
   * @param {Camera} camera
   * @param {Number} roadWidth
   */
  render(render, camera, player, roadWidth) {
    const clip = 0;
    const scale = 1 / camera.h;
    const arrLayers = ['layer1', 'layer2', 'layer3'];
    arrLayers.forEach((item) => {
      this[item].scaleX = 9;
      this[item].scaleY = 9;
      const positionW = camera.screen.midpoint.x * 2 * this[`${item}Offset`];
      const correctedWidth = player.width / 64;
      render.drawSprite(
        this[item], camera, player, roadWidth, scale * 0.05 * correctedWidth,
        positionW, this[item].height, clip,
      );
      if (Math.abs(this[`${item}Offset`]) > 1) {
        render.drawSprite(
          this[item], camera, player, roadWidth,
          scale * 0.05 * correctedWidth, positionW - this[item].width, this[item].height, clip,
        );
      }
    });
  }
}

export default Background;
