class SegmentLine {
  scale = 0;
  index = 0;
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

  /**
   * 
   * @param {Camera} camera 
   */
  project(camera) {
    const { world, screen } = this.points;
    const midpoint = camera.screen.midpoint;
    camera.deltaZ = world.z - camera.z;
    const scale = this.scale = camera.distanceToProjectionPlane / camera.deltaZ;
    screen.x = round((1 + (world.x - camera.x) * scale) * midpoint.y);
    screen.y = round((1 - (world.y - camera.y) * scale) * midpoint.y);
    screen.w = round(world.w * scale * camera.screen.width);
  }

}
