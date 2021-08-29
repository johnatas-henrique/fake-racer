class Sprite {
  /**
   * @type {HTMLImageElement}
   */
  constructor() {
    this.image = {};
    this.offsetX = 0;
    this.offsetY = 0;
    this.scaleX = 1;
    this.scaleY = 1;
  }

  get width() {
    return this.image.width;
  }

  get height() {
    return this.image.height;
  }
}

export default Sprite;
