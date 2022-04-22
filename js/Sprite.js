class Sprite {
  constructor(config) {
    // Setup the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }

    // Shadow
    this.shadow = new Image();
    this.useShadow = true;
    if (this.useShadow) {
      this.shadow.src = '../assets/images/characters/shadow.png'
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }

    // Animation and Initial Animation State
    this.animations = config.animations || {
      'idle-down': [[0, 0]],
      'idle-right': [[0, 1]],
      'idle-up': [[0, 2]],
      'idle-left': [[0, 3]],
      'walk-down': [[1, 0], [0, 0], [3, 0], [0, 0]],
      'walk-right': [[1, 1], [0, 1], [3, 1], [0, 1]],
      'walk-up': [[1, 2], [0, 2], [3, 2], [0, 2]],
      'walk-left': [[1, 3], [0, 3], [3, 3], [0, 3]],

    }
    this.currentAnimation = config.currentAnimation || 'walk-down';
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = this.animationFrameLimit;

    // Reference the game object

    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;
    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx, cameraPerson) {
    const x = this.gameObject.x - 8 + utils.withGrid(cameraPerson.canvasMidpoint.x / 16 - 1) - cameraPerson.x;
    const y = this.gameObject.y - 18 + utils.withGrid(cameraPerson.canvasMidpoint.y / 16 - 1) - cameraPerson.y;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    const [frameX, frameY] = this.frame;

    this.isLoaded && ctx.drawImage(
      this.image,
      frameX * 32, frameY * 32,
      32, 32,
      x, y,
      32, 32
    );

    this.updateAnimationProgress();
  }
}
