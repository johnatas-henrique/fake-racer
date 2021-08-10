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
    this.drawPolygon(color,
      x1 - w1, y1,
      x1 + w1, y1,
      x2 + w2, y2,
      x2 - w2, y2
    );
  }

  drawPolygon(color, ...coords) {
    if (coords.length > 1) {
      const renderingContext = this.renderingContext;
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
  drawSprite(sprite, camera, player, roadWidth, scale, destX, destY, clip) {
    const midpoint = camera.screen.midpoint;
    const spriteWidth = sprite.width;
    const spriteHeight = sprite.height;
    const factor = 1 / 3;
    const offsetY = sprite.offsetY || 1;
    const scaleX = sprite.scaleX;
    const scaleY = sprite.scaleY;
    const destWidth = (spriteWidth * scale * midpoint.x) *
      ((roadWidth * scaleX / (player.width ?? 64)) * factor);
    const destHeight = (spriteHeight * scale * midpoint.x) *
      ((roadWidth * scaleX / (player.width ?? 64)) * factor);
    destX += -destWidth * 0.5;
    destY -= destHeight * offsetY;
    const clipHeight = clip ? max(0, (destY + destHeight - clip)) : 0;

    if (clipHeight < destHeight) {
      this.renderingContext.drawImage(
        sprite.image,
        0, 0,
        spriteWidth, spriteHeight - spriteHeight * clipHeight / destHeight,
        destX, destY, destWidth, destHeight - clipHeight
      )
    }
  }
}
