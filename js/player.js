class Player {
  x = 0;
  y = 0;
  z = 0;
  maxRange = 6;
  sprite = new Sprite;

  get width() {
    return this.sprite.width;
  };

  get height() {
    return this.sprite.height;
  };

  update() {
    if (keyboard.isKeyDown('arrowleft')) {
      this.x <= -this.maxRange ? this.x = -this.maxRange : this.x -= 4 / 100;
      console.log(this.x);
    } else if (keyboard.isKeyDown('arrowright')) {
      this.x >= this.maxRange ? this.x = this.maxRange : this.x += 4 / 100;
      console.log(this.x);
    }
  }

  /**
   * 
   * @param {Render} render 
   * @param {Camera} camera 
   * @param {Number} roadWidth 
   */
  render(render, camera, roadWidth) {
    const clip = 0;
    const scale = 1 / camera.h;
    render.drawSprite(
      this.sprite, camera, this, roadWidth, scale,
      camera.screen.midpoint.x, camera.screen.height, clip
    );
  }
}
