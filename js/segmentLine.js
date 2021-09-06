import Player from './player.js';
import { max, round } from './util.js';

class SegmentLine {
  scale = 0;
  index = 0;
  curve = 0;
  /**
   * @type {Tunnel}
   */
  tunnel;
  /**
   * @type {Sprite[]}
   */
  sprites = [];
  clip = 0;
  #colors = { road: '', grass: '', rumble: '', strip: '', tunnel: '' };
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
    return this;
  }

  /**
   * 
   * @param {Render} render 
   * @param {Camera} camera 
   * @param {Player} player 
   */
  drawTunnel(render, camera, player) {
    if (this.tunnel) {
      const tunnel = this.tunnel;
      const offsetX = tunnel.offsetX;
      const { screen, world } = this.points;
      const { clip, scale } = this;
      const worldH = 5000 + Math.abs(world.y);
      const py = round((1 - (worldH - camera.y) * scale) * camera.screen.midpoint.y);
      const h = round(worldH * 0.2 * scale * camera.screen.midpoint.y);
      const clipH = clip ? max(0, screen.y - clip) : 0;
      if (clipH < screen.y - (py + h)) {
        const color = this.colors.tunnel;

        // left part
        render.drawPolygon(
          color,
          0, py,
          screen.x - screen.w * offsetX, py,
          screen.x - screen.w, screen.y - clipH,
          0, screen.y - clipH,
        );

        // center part
        render.drawPolygon(
          color,
          0, py,
          camera.screen.width, py,
          camera.screen.width, py + h,
          0, py + h,
        );

        // right part
        render.drawPolygon(
          color,
          camera.screen.width, py,
          screen.x + screen.w * offsetX, py,
          screen.x + screen.w, screen.y - clipH,
          camera.screen.width, screen.y - clipH,
        );

        if (tunnel.title) {
          const renderingContext = render.renderingContext;
          renderingContext.save();
          renderingContext.font = `${h * 0.5}px monospace`;
          renderingContext.fillStyle = 'blue';
          renderingContext.textAlign = 'center';
          renderingContext.textBaseline = 'middle';
          renderingContext.fillText(tunnel.title, screen.x, py + h * 0.5);
          renderingContext.restore();
        }
      }
    }

    return this;
  }
}

export default SegmentLine;
