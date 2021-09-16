import { max } from './util.js';

class Render {
  #renderingContext;

  /**
   *
   * @param {CanvasRenderingContext2D} renderingContext
   */
  constructor(renderingContext) {
    this.#renderingContext = renderingContext;
  }

  get renderingContext() {
    return this.#renderingContext;
  }

  clear(x, y, w, h) {
    this.renderingContext.clearRect(x, y, w, h);
  }

  save() {
    this.renderingContext.save();
  }

  restore() {
    this.renderingContext.restore();
  }

  drawTrapezium(x1, y1, w1, x2, y2, w2, color = 'green') {
    this.drawPolygon(
      color, x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2,
    );
  }

  drawPolygon(color, ...coords) {
    if (coords.length > 1) {
      const { renderingContext } = this;
      renderingContext.save();
      renderingContext.fillStyle = color;
      renderingContext.beginPath();
      renderingContext.moveTo(coords[0], coords[1]);
      for (let i = 2; i < coords.length; i += 2) {
        renderingContext.lineTo(coords[i], coords[(i + 1) % coords.length]);
      }
      renderingContext.closePath();
      renderingContext.fill();
      renderingContext.restore();
    }
  }
  
  drawText(color, text, screenX = 300, screenY = 200, fontSize = '36', font = 'fantasy') {
    const { renderingContext } = this;
    renderingContext.fillStyle = color;
    renderingContext.font = font
    renderingContext.font = `${fontSize}px ${font}`;
    renderingContext.textAlign = 'center';
    renderingContext.textBaseline = 'middle';
    renderingContext.fillText(text, screenX, screenY);
    renderingContext.restore();
  }

  /**
   *
   * @param {Sprite} sprite
   * @param {Camera} camera
   * @param {Player} player
   * @param {Number} roadWidth
   * @param {Number} scale
   * @param {Number} destX
   * @param {Number} destY
   * @param {Number} clip
   */
  drawSprite(sprite, camera, player, roadWidth, scale, destX, destY, clip, spritesInX = 1, spritesInY = 1) {
    let newDestX = destX;
    let newDestY = destY;
    const { midpoint } = camera.screen;
    const spriteWidth = sprite.width;
    const spriteHeight = sprite.height;
    const factor = 1 / 3;
    const offsetY = sprite.offsetY || 1;
    const sheetPositionX = sprite.sheetPositionX;
    const sheetPositionY = sprite.sheetPositionY;
    const { scaleX, scaleY } = sprite;
    const destWidth = (spriteWidth * scale * midpoint.x)
      * (((roadWidth * scaleX) / (player.width ?? 64)) * factor);
    const destHeight = (spriteHeight * scale * midpoint.x)
      * (((roadWidth * scaleY) / (player.width ?? 64)) * factor);
    newDestX += -destWidth * 0.5;
    newDestY -= destHeight * spritesInX * offsetY / spritesInY;
    const clipHeight = clip ? max(0, (newDestY + destHeight - clip)) : 0;

    if (clipHeight < destHeight) {
      this.renderingContext.drawImage(
        sprite.image,
        (spriteWidth / spritesInX * sheetPositionX), spriteHeight / spritesInY * sheetPositionY,
        spriteWidth / spritesInX,
        (spriteHeight - (spriteHeight * clipHeight) / (destHeight * spritesInX)) / spritesInY,
        newDestX, newDestY,
        destWidth, (((destHeight * spritesInX) - clipHeight) / spritesInY),
      );
    }
  }
}

export default Render;
