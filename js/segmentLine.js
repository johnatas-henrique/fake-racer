import { round } from './util.js';

class SegmentLine {
  scale = 0;
  index = 0;
  curve = 0;
  /**
   * @type {Sprite[]}
   */
  sprites = [];
  clip = 0;
  #colors = {
    road: '', grass: '', rumble: '', strip: ''
  };
  points = new class {
    world = new class {
      x = 0;
      y = 0;
      z = 0;
      w = 0;
    };
    screen = new class {
      xUnrounded = 0;
      yUnrounded = 0;
      wUnrounded = 0;
      x = 0;
      y = 0;
      w = 0;
    };
  };

  get colors() {
    return this.#colors;
  }

  set colors(colors) {
    this.#colors = colors;
  }
  /**
   * 
   * @param {Camera} camera 
   */
  project(camera) {
    const { world, screen } = this.points;
    const midpoint = camera.screen.midpoint;
    camera.deltaZ = world.z - camera.z;
    const scale = this.scale = camera.distanceToProjectionPlane / camera.deltaZ;
    screen.xUnrounded = (1 + (world.x - camera.x) * scale) * midpoint.x;
    screen.yUnrounded = (1 - (world.y - camera.y) * scale) * midpoint.y;
    screen.wUnrounded = world.w * scale * camera.screen.width;
    screen.x = round(screen.xUnrounded);
    screen.y = round(screen.yUnrounded);
    screen.w = round(screen.wUnrounded);
  }

  /**
   * 
   * @param {Render} render 
   * @param {Camera} camera 
   * @param {Player} player 
   */
  drawSprite(render, camera, player) {
    const sprites = this.sprites;
    for (let i = sprites.length - 1; i >= 0; i -= 1) {
      const sprite = sprites[i];
      const scale = this.scale;
      const { screen, world } = this.points;
      const roadWidth = world.w;
      const destX = screen.xUnrounded + screen.wUnrounded * sprite.offsetX;
      const destY = screen.yUnrounded;
      render.drawSprite(sprite, camera, player, roadWidth, scale, destX, destY, this.clip);
    }
  }
}

export default SegmentLine;
