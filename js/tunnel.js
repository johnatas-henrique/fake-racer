class Tunnel {
  /**
   * @type {String}
   */
  title;

  /**
   * @type {Number}
   */
  py;

  /** 
   * @type {Number}
   */
  clipH;

  /** 
   * @type {Number}
   */
  worldH;
  leftFace = new class {
    offsetX1 = 1.3;
    offsetX2 = 1.3;
  };
  rightFace = new class {
    offsetX1 = 1.3;
    offsetX2 = 1.3;
  };

  visibleFaces = new class {
    leftFront = true;
    rightFront = true;
    centerFront = true;
    leftTop = true;
    rightTop = true;
    centerTop = true;
    leftCover = true;
    rightCover = true;
  };

  /**
   * @type {SegmentLine}
   */
  previousSegment;
}

export default Tunnel;
