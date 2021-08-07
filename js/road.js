class Road {
  /**
   * @type {SegmentLine[]} 
   */
  #segments = [];
  #segmentLength = 200; // it could be named segmentHeight
  #rumbleLength = 13; // number of segments to change rumble color
  #width = 2000;

  get rumbleLength() {
    return this.#rumbleLength;
  }

  /**
   * Segment size on road
   */
  get segmentLength() {
    return this.#segmentLength;
  }

  /**
   * Total of segments (track length)
   */
  get segmentsLength() {
    return this.#segments.length;
  }

  get length() {
    return this.segmentsLength * this.segmentLength;
  }

  /**
   * 
   * @param {Number} cursor : ;
   * @returns 
   */
  getSegment(cursor) {
    return this.#segments[floor(cursor / this.#segmentLength) % this.segmentsLength];
  }

  getSegmentFromIndex(index) {
    return this.#segments[index % this.segmentsLength];
  }

  create(segmentsNumber = 500) {
    const rumbleLength = this.rumbleLength;
    for (let i = 0; i < segmentsNumber; i += 1) {
      const darkColors = { road: '#444', grass: 'darkgreen', rumble: '#f00', strip: '' };
      const lightColors = { road: '#444', grass: 'green', rumble: 'white', strip: 'white' };
      const segmentLine = new SegmentLine;
      segmentLine.index = i;
      segmentLine.colors = floor(i / rumbleLength) % 2 ? darkColors : lightColors;
      const world = segmentLine.points.world;
      world.w = this.#width;
      world.z = (i + 1) * this.segmentLength;
      this.#segments.push(segmentLine);
    }

    // marking start of lap

    for (let i=0 ; i< rumbleLength; i+=1) {
      console.log(rumbleLength)
      this.#segments[i].colors.grass = 'gray';
      this.#segments[i].colors.road = 'white';
    }
  }

  /**
   * 
   * @param {Render} render 
   * @param {Camera} camera 
   * @param {Player} player 
   */
  render(render, camera, player) {
    const segmentsLength = this.segmentsLength;
    const baseSegment = this.getSegment(camera.cursor);
    const startPos = baseSegment.index;
    const visibleSegments = 300;

    let maxY = camera.screen.height

    for (let i = startPos; i < startPos + visibleSegments; i += 1) {
      const currentSegment = this.getSegmentFromIndex(i);
      camera.z = camera.cursor - (i >= segmentsLength ? this.length : 0);
      currentSegment.project(camera);
      const currentScreenPoint = currentSegment.points.screen;

      if (
        currentScreenPoint.y >= maxY ||
        camera.deltaZ <= camera.distanceToProjectionPlane
      ) {
        continue;
      }

      maxY = currentScreenPoint.y;

      if (i > 0) {
        const previousSegment = this.getSegmentFromIndex(i - 1);
        const previousScreenPoint = previousSegment.points.screen;
        const colors = currentSegment.colors;

        if (currentScreenPoint.y >= previousScreenPoint.y) {
          continue;
        }

        render.drawTrapezium(
          previousScreenPoint.x, previousScreenPoint.y, previousScreenPoint.w,
          currentScreenPoint.x, currentScreenPoint.y, currentScreenPoint.w,
          colors.road
        );

        // left grass
        render.drawPolygon(
          colors.grass,
          0, previousScreenPoint.y,
          previousScreenPoint.x - previousScreenPoint.w * 1.3, previousScreenPoint.y,
          currentScreenPoint.x - currentScreenPoint.w * 1.3, currentScreenPoint.y,
          0, currentScreenPoint.y
        );

        // right grass
        render.drawPolygon(
          colors.grass,
          previousScreenPoint.x + previousScreenPoint.w * 1.3, previousScreenPoint.y,
          camera.screen.width, previousScreenPoint.y,
          camera.screen.width, currentScreenPoint.y,
          currentScreenPoint.x + currentScreenPoint.w * 1.3, currentScreenPoint.y
        );

        // left rumble
        render.drawPolygon(
          colors.rumble,
          previousScreenPoint.x - previousScreenPoint.w * 1.3, previousScreenPoint.y,
          previousScreenPoint.x - previousScreenPoint.w, previousScreenPoint.y,
          currentScreenPoint.x - currentScreenPoint.w, currentScreenPoint.y,
          currentScreenPoint.x - currentScreenPoint.w * 1.3, currentScreenPoint.y,
        );

        // right rumble
        render.drawPolygon(
          colors.rumble,
          previousScreenPoint.x + previousScreenPoint.w * 1.3, previousScreenPoint.y,
          previousScreenPoint.x + previousScreenPoint.w, previousScreenPoint.y,
          currentScreenPoint.x + currentScreenPoint.w, currentScreenPoint.y,
          currentScreenPoint.x + currentScreenPoint.w * 1.3, currentScreenPoint.y,
        );

        // center strip
        if(colors.strip) {
          const value = 0.03;
          render.drawTrapezium(
            previousScreenPoint.x, previousScreenPoint.y, previousScreenPoint.w * value,
            currentScreenPoint.x, currentScreenPoint.y, currentScreenPoint.w * value,
            colors.strip,
          );
        }
      };
    };
  };
};
