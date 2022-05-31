class Tunnel {
  constructor() {
    this.title = null;
    this.py = null;
    this.clipH = null;
    this.worldH = null;
    this.leftFace = { offsetX1: 1.3, offsetX2: 1.3 };
    this.rightFace = { offsetX1: 1.3, offsetX2: 1.3 };
    this.visibleFaces = {
      leftFront: true,
      rightFront: true,
      centerFront: true,
      leftTop: true,
      rightTop: true,
      centerTop: true,
      leftCover: true,
      rightCover: true,
    };
    this.previousSegment = null;
  }
}
