class SegmentLine {
  constructor() {
    this.scale = 0;
    this.index = 0;
    this.curve = 0;
    this.kerb = 0;
    this.tunnel = null;
    this.sprites = [];
    this.clip = 0;
    this.colors = { road: '', grass: '', kerb: '', stripe: '', tunnel: '' };
    this.points = {
      world: { x: 0, y: 0, z: 0, w: 0 },
      screen: { xUnrounded: 0, yUnrounded: 0, wUnrounded: 0, x: 0, y: 0, w: 0 },
    };
  }

  project(camera) {
    const { world, screen } = this.points;
    const { midpoint } = camera.screen;
    camera.deltaZ = world.z - camera.z;
    this.scale = camera.distanceToProjectionPlane / camera.deltaZ;
    screen.xUnrounded = (1 + (world.x - camera.x) * this.scale) * midpoint.x;
    screen.yUnrounded = (1 - (world.y - camera.y) * this.scale) * midpoint.y;
    screen.wUnrounded = world.w * this.scale * camera.screen.width;
    screen.x = Math.round(screen.xUnrounded);
    screen.y = Math.round(screen.yUnrounded);
    screen.w = Math.round(screen.wUnrounded);
  }

  drawSprite(render, camera, player) {
    const { sprites } = this;
    for (let i = sprites.length - 1; i >= 0; i -= 1) {
      const sprite = sprites[i];
      const { scale } = this;
      const { screen, world } = this.points;
      const roadWidth = world.w;
      const destX = screen.xUnrounded + screen.wUnrounded * sprite.offsetX;
      const destY = screen.yUnrounded;
      const destYUp = (1 - (world.y - camera.y + 1550) * scale) * 180;
      if (sprite.name.includes('op') && (scale * 10000 < 5 && scale * 10000 > 1.2)) {
        render
          .drawText('#FFFAF4', `${sprite.name.replace('op', '')}`, destX, destYUp, scale * 10000, 'OutriderCond', 'center', 'black', true);
      }

      render.drawRaceSprite(sprite, camera, player, roadWidth, scale, destX, destY, this.clip);
    }
    return this;
  }

  // CPU intensive method
  drawTunnel(render, camera) {
    if (this.tunnel) {
      const { tunnel } = this;
      const { screen } = this.points;
      const { clip, scale } = this;
      const { worldH } = tunnel;
      tunnel.py = Math.round((1 - worldH * scale) * camera.screen.midpoint.y);
      const { py } = tunnel;
      const h = Math.round(worldH * 0.1 * scale * camera.screen.midpoint.y);
      tunnel.clipH = clip ? Math.max(0, screen.y - clip) : 0;
      const { clipH } = tunnel;
      if (clipH < screen.y - (py + h)) {
        const { leftFace } = tunnel;
        const { rightFace } = tunnel;
        const color = this.colors.tunnel;
        const { visibleFaces } = tunnel;

        if (visibleFaces.leftFront) {
          render.drawPolygon(
            color,
            0,
            py,
            screen.x - screen.w * leftFace.offsetX1,
            py,
            screen.x - screen.w * leftFace.offsetX2,
            screen.y - clipH,
            0,
            screen.y - clipH,
          );
        }

        if (visibleFaces.rightFront) {
          render.drawPolygon(
            color,
            camera.screen.width,
            py,
            screen.x + screen.w * rightFace.offsetX1,
            py,
            screen.x + screen.w * rightFace.offsetX2,
            screen.y - clipH,
            camera.screen.width,
            screen.y - clipH,
          );
        }

        if (visibleFaces.centerFront) {
          render.drawPolygon(
            color,
            0,
            py - h * 3,
            camera.screen.width,
            py - h * 3,
            camera.screen.width,
            py + h,
            0,
            py + h,
          );

          if (tunnel.title) {
            const { renderingContext } = render;
            renderingContext.save();
            renderingContext.font = `${h * 2}px fantasy`;
            renderingContext.fillStyle = 'red';
            renderingContext.textAlign = 'center';
            renderingContext.textBaseline = 'middle';
            renderingContext.fillText(tunnel.title, screen.x, py);
            renderingContext.restore();
          }
        }

        const { previousSegment } = tunnel;

        if (previousSegment) {
          const previousScreenPoint = previousSegment.points.screen;
          const previousTunnel = previousSegment.tunnel;
          const previousLeftFace = previousTunnel.leftFace;
          const previousRightFace = previousTunnel.rightFace;

          if (visibleFaces.leftTop) {
            render.drawPolygon(
              color,
              0,
              previousTunnel.py,
              previousScreenPoint.x - previousScreenPoint.w * previousLeftFace.offsetX1,
              previousTunnel.py,
              screen.x - screen.w * leftFace.offsetX1,
              py,
              0,
              py,
            );
          }

          if (visibleFaces.rightTop) {
            render.drawPolygon(
              color,
              camera.screen.width,
              previousTunnel.py,
              previousScreenPoint.x + previousScreenPoint.w * previousRightFace.offsetX1,
              previousTunnel.py,
              screen.x + screen.w * rightFace.offsetX1,
              py,
              camera.screen.width,
              py,
            );
          }

          if (visibleFaces.centerTop) {
            render.drawPolygon(
              color,
              previousScreenPoint.x - previousScreenPoint.w * previousLeftFace.offsetX1,
              previousTunnel.py,
              previousScreenPoint.x + previousScreenPoint.w * previousRightFace.offsetX1,
              previousTunnel.py,
              screen.x + screen.w * rightFace.offsetX1,
              py,
              screen.x - screen.w * leftFace.offsetX1,
              py,
            );
          }

          if (visibleFaces.leftCover) {
            render.drawPolygon(
              color,
              previousScreenPoint.x - previousScreenPoint.w * previousLeftFace.offsetX1,
              previousTunnel.py,
              previousScreenPoint.x - previousScreenPoint.w * previousLeftFace.offsetX2,
              previousScreenPoint.y,
              screen.x - screen.w * leftFace.offsetX2,
              screen.y - clipH,
              screen.x - screen.w * leftFace.offsetX1,
              py,
            );
          }

          if (visibleFaces.rightCover) {
            render.drawPolygon(
              color,
              previousScreenPoint.x + previousScreenPoint.w * previousRightFace.offsetX1,
              previousTunnel.py,
              previousScreenPoint.x + previousScreenPoint.w * previousRightFace.offsetX2,
              previousScreenPoint.y,
              screen.x + screen.w * rightFace.offsetX2,
              screen.y - clipH,
              screen.x + screen.w * rightFace.offsetX1,
              py,
            );
          }
        }
      }
    }

    return this;
  }
}

export default SegmentLine;
