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
      const destYUp = (1 - (world.y - camera.y + 1550) * scale) * 180;
      if(sprite.name.includes('op') && scale * 10000 > 1.2) {
        render.drawText('#FFFAF4', `${sprite.name.replace('op', '')}`, destX, destYUp,
        scale * 10000, 'OutriderCond', 'center', 'black', true)
      }

      render.drawSprite(
        sprite, camera,
        player, roadWidth,
        scale, destX,
        destY, this.clip,
        sprite.spritesInX, sprite.spritesInY
      );
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
      const { screen } = this.points;
      const { clip, scale } = this;
      const worldH = tunnel.worldH;
      const py = tunnel.py = round((1 - worldH * scale) * camera.screen.midpoint.y);
      const h = round(worldH * 0.1 * scale * camera.screen.midpoint.y);
      const clipH = tunnel.clipH = clip ? max(0, screen.y - clip) : 0;
      if (clipH < screen.y - (py + h)) {
        const leftFace = tunnel.leftFace;
        const rightFace = tunnel.rightFace;
        const color = this.colors.tunnel;
        const visibleFaces = tunnel.visibleFaces;

        if (visibleFaces.leftFront) {
          render.drawPolygon(
            color,
            0, py,
            screen.x - screen.w * leftFace.offsetX1, py,
            screen.x - screen.w * leftFace.offsetX2, screen.y - clipH,
            0, screen.y - clipH,
          );
        }

        if (visibleFaces.rightFront) {
          render.drawPolygon(
            color,
            camera.screen.width, py,
            screen.x + screen.w * rightFace.offsetX1, py,
            screen.x + screen.w * rightFace.offsetX2, screen.y - clipH,
            camera.screen.width, screen.y - clipH,
          );
        }

        if (visibleFaces.centerFront) {
          render.drawPolygon(
            color,
            0, py - h * 3,
            camera.screen.width, py - h * 3,
            camera.screen.width, py + h,
            0, py + h,
          );

          if (tunnel.title) {
            const renderingContext = render.renderingContext;
            renderingContext.save();
            renderingContext.font = `${h * 2}px fantasy`;
            renderingContext.fillStyle = 'red';
            renderingContext.textAlign = 'center';
            renderingContext.textBaseline = 'middle';
            renderingContext.fillText(tunnel.title, screen.x, py);
            renderingContext.restore();
          }
        }

        const previousSegment = tunnel.previousSegment;

        if (previousSegment) {
          const previousScreenPoint = previousSegment.points.screen;
          const previousTunnel = previousSegment.tunnel;
          const previousLeftFace = previousTunnel.leftFace;
          const previousRightFace = previousTunnel.rightFace;

          if (visibleFaces.leftTop) {
            render.drawPolygon(
              color,
              0, previousTunnel.py,
              previousScreenPoint.x - previousScreenPoint.w * previousLeftFace.offsetX1, previousTunnel.py,
              screen.x - screen.w * leftFace.offsetX1, py,
              0, py
            );
          }

          if (visibleFaces.rightTop) {
            render.drawPolygon(
              color,
              camera.screen.width, previousTunnel.py,
              previousScreenPoint.x + previousScreenPoint.w * previousRightFace.offsetX1, previousTunnel.py,
              screen.x + screen.w * rightFace.offsetX1, py,
              camera.screen.width, py
            );
          }



          if (visibleFaces.centerTop) {
            render.drawPolygon(
              color,
              previousScreenPoint.x - previousScreenPoint.w * previousLeftFace.offsetX1, previousTunnel.py,
              previousScreenPoint.x + previousScreenPoint.w * previousRightFace.offsetX1, previousTunnel.py,
              screen.x + screen.w * rightFace.offsetX1, py,
              screen.x - screen.w * leftFace.offsetX1, py,
            );
          }

          if (visibleFaces.leftCover) {
            render.drawPolygon(
              color,
              previousScreenPoint.x - previousScreenPoint.w * previousLeftFace.offsetX1, previousTunnel.py,
              previousScreenPoint.x - previousScreenPoint.w * previousLeftFace.offsetX2, previousScreenPoint.y,
              screen.x - screen.w * leftFace.offsetX2, screen.y - clipH,
              screen.x - screen.w * leftFace.offsetX1, py,
            );
          }

          if (visibleFaces.rightCover) {
            render.drawPolygon(
              color,
              previousScreenPoint.x + previousScreenPoint.w * previousRightFace.offsetX1, previousTunnel.py,
              previousScreenPoint.x + previousScreenPoint.w * previousRightFace.offsetX2, previousScreenPoint.y,
              screen.x + screen.w * rightFace.offsetX2, screen.y - clipH,
              screen.x + screen.w * rightFace.offsetX1, py,
            );
          }
        }
      }
    }

    return this;
  }
}

export default SegmentLine;
