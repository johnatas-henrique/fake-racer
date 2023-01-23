class SpriteRace {
  constructor(config = {}) {
    this.image = new Image();
    this.offsetX = config.offsetX || 0;
    this.offsetY = config.offsetY || 0;
    this.sheetPositionX = config.sheetPositionX || 0;
    this.sheetPositionY = config.sheetPositionY || 0;
    this.scaleX = config.scaleX || 1;
    this.scaleY = config.scaleY || 1;
    this.spritesInX = config.spritesInX || 1;
    this.spritesInY = config.spritesInY || 1;
    this.name = config.name || 'sprite';
    this.actualSpeed = { speed: 0, mult: 0 };
    const transparentImage = '../assets/images/clean.png';
    this.image.src = config.imageSrc || transparentImage;
  }

  get width() {
    return this.image.width;
  }

  get height() {
    return this.image.height;
  }
}

export default SpriteRace;
