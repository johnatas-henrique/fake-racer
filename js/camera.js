class Camera {
  x = 0;
  y = 1500;
  z = 0;
  h = y;
  cursor = 0;
  deltaZ = 0;
  #distanceToProjectionPlane = 1 / tan(theta);
  screen = new class {
    midpoint = new class {
      constructor(screen) {
        this.screen = screen;
      }
      get x() {
        return screen.width / 2;
      }
      get y() {
        return screen.height / 2;
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
    this.#distanceToProjectionPlane;
  }

  /**
   * 
   * @param {Road} road 
   */
  update(road) {
    if(keyboard.isKeyDown('arrowUp')){
      console.log('go faster');
    }else if(keyboard.isKeyDown("arrowDown")){
      console.log('stopping');
    }
  }
}
