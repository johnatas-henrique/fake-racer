class Sprite {

  /**
   * @type {HTMLImageElement}
   */
  image;

  offsetX = 0;
  offsetY = 0;
  scaleX = 1;
  scaleY = 1;

  get width() {
    return this.image.width;
  }
  get height() {
    return this.image.height;
  }
}
