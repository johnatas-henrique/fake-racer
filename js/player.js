class Player {
  x = 0;
  y = 0;
  z = 0;
  maxRange = 6;
  curvePower = 0.04;
  sprite = new Sprite;

  get width() {
    return this.sprite.width;
  };

  get height() {
    return this.sprite.height;
  };

  changeXToLeft(curvePower){
    this.x <= -this.maxRange ? this.x = -this.maxRange : this.x -= curvePower;
  }

  changeXToRight(curvePower){
    this.x >= this.maxRange ? this.x = this.maxRange : this.x += curvePower;
  }

  update(camera, road) {
    // making a centrifugal force to pull the car
    const segment = road.getSegment(camera.cursor);
    if ((camera.cursor / 200) === segment.index && segment.curve) {
      if (segment.curve < 0) {
        this.changeXToRight(-segment.curve * 0.03)
      }
      if (segment.curve > 0) {
        this.changeXToLeft(+segment.curve * 0.03)
      }
    }

    // making playerCar moves in X axis
    if (keyboard.isKeyDown('arrowleft')) {
      this.changeXToLeft(this.curvePower);
    } else if (keyboard.isKeyDown('arrowright')) {
      this.changeXToRight(this.curvePower);
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
