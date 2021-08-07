class Camera {
  x = 0;
  y = 1500;
  z = 0;
  h = this.y;
  cursor = 0;
  deltaZ = 0;
  #distanceToProjectionPlane = 1 / tan(theta);
  screen = new class {
    midpoint = new class {
      #screen;
      constructor(screen) {
        this.#screen = screen;
      }
      get x() {
        return this.#screen.width * 0.5;
      }
      get y() {
        return this.#screen.height * 0.5;
      }
    }(this);

    get width() {
      return canvas.width;
    }

    get height() {
      return canvas.height;
    }
  };
  get distanceToProjectionPlane() {
    return this.#distanceToProjectionPlane;
  }

  /**
   * 
   * @param {Road} road 
   */
  update(road) {
    const step = road.segmentLength;
    const length = road.length;
    // console.log(keyboard.isKeyDown('arrowUp'))
    if (keyboard.isKeyDown('arrowUp')) {
      this.cursor += step;
    } else if (keyboard.isKeyDown("arrowDown")) {
      this.cursor -= step;
    }

    if (this.cursor >= length) {
      this.cursor -= length;
    } else if (this.cursor < 0) {
      this.cursor += length;
    }
  }
}
