class Render {
  constructor(ctx) {
    this.ctx = ctx;
  }

  clear(x, y, w, h) {
    this.ctx.clearRect(x, y, w, h);
  }

  save() {
    this.ctx.save();
  }

  restore() {
    this.ctx.restore();
  }

  drawTrapezium(x1, y1, w1, x2, y2, w2, color = 'green') {
    this.drawPolygon(color, x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2);
  }

  drawPolygon(color, ...coords) {
    if (coords.length > 1) {
      this.ctx.save();
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.moveTo(coords[0], coords[1]);
      for (let i = 2; i < coords.length; i += 2) {
        this.ctx.lineTo(coords[i], coords[(i + 1) % coords.length]);
      }
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  drawCircle(x, y, radius, startAngle, endAngle, anticlockwise, color = 'black') {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    this.ctx.stroke();
  }

  drawText(
    color,
    text,
    screenX = 300,
    screenY = 200,
    fontSize = '2',
    font = 'OutriderCond',
    align = 'center',
    colorStroke = 'black',
    stroke = false,
  ) {
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.font = `${fontSize}em ${font}`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, screenX, screenY);
    this.ctx.strokeStyle = colorStroke;
    if (stroke) {
      this.ctx.strokeText(text, screenX, screenY);
    }
    this.ctx.restore();
  }

  drawRaceSprite(sprite, camera, player, roadWidth, scale, destX, destY, clip) {
    const { spritesInX, spritesInY } = sprite;
    let newDestX = destX;
    let newDestY = destY;
    const { midpoint } = camera.screen;
    const spriteWidth = sprite.width;
    const spriteHeight = sprite.height;
    const factor = 1 / 3;
    const offsetY = sprite.offsetY || 1;
    const {
      sheetPositionX, sheetPositionY, scaleX, scaleY,
    } = sprite;
    const destWidth = (spriteWidth * scale * midpoint.x)
      * (((roadWidth * scaleX) / (player.width ?? 64)) * factor);
    const destHeight = (spriteHeight * scale * midpoint.x)
      * (((roadWidth * scaleY) / (player.width ?? 64)) * factor);
    newDestX += -destWidth * 0.5;
    newDestY -= (destHeight * spritesInX * offsetY) / spritesInY;
    const clipHeight = clip ? Math.max(0, (newDestY + destHeight - clip)) : 0;

    if (clipHeight < destHeight) {
      this.ctx.drawImage(
        sprite.image,
        (spriteWidth / spritesInX) * sheetPositionX,
        (spriteHeight / spritesInY) * sheetPositionY,
        spriteWidth / spritesInX,
        (spriteHeight - (spriteHeight * clipHeight) / (destHeight * spritesInX)) / spritesInY,
        newDestX,
        newDestY,
        destWidth,
        (((destHeight * spritesInX) - clipHeight) / spritesInY),
      );
    }
  }

  roundRect(color, x, y, width, height, fill, radius = 5, stroke = true) {
    const radii = {
      tl: 0, tr: 0, br: 0, bl: 0,
    };
    if (typeof radius === 'number') {
      radii.tl = radius;
      radii.tr = radius;
      radii.br = radius;
      radii.bl = radius;
    }
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x + radii.tl, y);
    this.ctx.lineTo(x + width - radii.tr, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radii.tr);
    this.ctx.lineTo(x + width, y + height - radii.br);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radii.br, y + height);
    this.ctx.lineTo(x + radii.bl, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radii.bl);
    this.ctx.lineTo(x, y + radii.tl);
    this.ctx.quadraticCurveTo(x, y, x + radii.tl, y);
    this.ctx.closePath();

    if (fill) {
      this.ctx.fill();
    }
    if (stroke) {
      this.ctx.stroke();
    }
  }
}
