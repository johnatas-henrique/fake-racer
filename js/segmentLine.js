class SegmentLine {
  scale = 0;
  index = 0;
  curve = 0;
  /**
   * @type {Sprite[]}
   */
  sprites = [];
  clip = 0;
  #colors = {
    road: '', grass: '', rumble: '', strip: ''
  };
  points = new class {
    world = new class {
      x = 0;
      y = 0;
      z = 0;
      w = 0;
    };
    screen = new class {
      x = 0;
      y = 0;
      w = 0;
    };
  };

  get colors() {
    return this.#colors;
  }

  set colors(colors) {
    this.#colors = colors;
  }
  /**
   * 
   * @param {Camera} camera 
   */
  project(camera) {
    const { world, screen } = this.points;
    const midpoint = camera.screen.midpoint;
    camera.deltaZ = world.z - camera.z;
    const scale = this.scale = camera.distanceToProjectionPlane / camera.deltaZ;
    screen.x = round((1 + (world.x - camera.x) * scale) * midpoint.x);
    screen.y = round((1 - (world.y - camera.y) * scale) * midpoint.y);
    screen.w = round(world.w * scale * camera.screen.width);
  }

  /**
   * 
   * @param {Render} render 
   * @param {Camera} camera 
   * @param {Player} player 
   */
  drawSprite(render, camera, player) {
    const sprites = this.sprites;
    for (let i = sprites.length - 1; i >= 0; i -= 1) {
      const sprites = sprites[i];
      const scale = this.scale;
      const { screen, world } = this.points;
      const roadWidth = world.w;
      const destX = screen.x + screen.w * sprite.offsetX;
      const destY = screen.y;
      render.drawSprite(sprite, camera, player, roadWidth, scale, destX, destY, this.clip);
    }
  }
}
