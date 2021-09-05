import SegmentLine from './segmentLine.js';
import Sprite from './sprite.js';
import { resource, tracks } from './util.js';

class Road {
  /**
   * @type {SegmentLine[]}
   */
  #segments = [];
  #segmentLength = 200; // it could be named segmentHeight
  #rumbleLength = 13; // number of segments to change rumble color
  #width = 2000;
  constructor(trackName) {
    this.trackName = trackName;
  }

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

  get width() {
    return this.#width;
  }

  /**
   *
   * @param {Number} cursor
   * @returns
   */
  getSegment(cursor) {
    return this.#segments[Math.floor(cursor / this.#segmentLength) % this.segmentsLength];
  }

  getSegmentFromIndex(index) {
    return this.#segments[index % this.segmentsLength];
  }

  create() {
    const { rumbleLength } = this;
    // great tip: if you put more counter variables, they increment too!
    for (let i = 0, angleSegment = 0; i < tracks[this.trackName].segmentLength; i += 1) {
      const lightestColors = {
        road: '#525152', grass: 'green', rumble: 'white', strip: '',
      };
      const lightColors = {
        road: '#4A494A', grass: 'green', rumble: 'white', strip: '',
      };
      const darkColors = {
        road: '#424142', grass: 'darkgreen', rumble: '#f00', strip: '#fff',
      };
      const darkestColors = {
        road: '#393839', grass: 'darkgreen', rumble: '#f00', strip: '#fff',
      };
      const segmentLine = new SegmentLine();
      segmentLine.index = i;

      if (Math.floor(i / rumbleLength) % 4 === 0) segmentLine.colors = lightestColors;
      if (Math.floor(i / rumbleLength) % 4 === 1) segmentLine.colors = darkestColors;
      if (Math.floor(i / rumbleLength) % 4 === 2) segmentLine.colors = lightColors;
      if (Math.floor(i / rumbleLength) % 4 === 3) segmentLine.colors = darkColors;

      const { world } = segmentLine.points;
      world.w = this.width;
      world.z = (i + 1) * this.segmentLength;
      this.#segments.push(segmentLine);

      // adding curves
      const createCurve = (min, max, curve) => {
        if (i >= min && i <= max) segmentLine.curve = curve;
      }
      tracks[this.trackName].curves
        .forEach((curve) => createCurve(curve.min, curve.max, curve.curveInclination));

      // adding hills
      // if (i >= 0 && angleSegment <= 360) {
      //   world.y = sin(angleSegment++ / 180 * PI) * 5000;
      // }
      // if (i === 0) {
      //   world.y = -35000;
      // }
      let lastY = 0;
      if (i > 0) {
        lastY = this.getSegmentFromIndex(i - 1).points.world.y;
        world.y = lastY;
      }

      // console.log(i, world.y)

      const easeIn = (a, b, percent) => a + (b - a) * Math.pow(percent, 2);
      const easeInOut = (a, b, percent) => a + (b - a) * ((-Math.cos(percent * Math.PI) / 2) + 0.5);

      if (i >= 0 && i < 900) {
        // Util.easeInOut(startY, endY, n/total)
        // var endY     = startY + (Util.toInt(y, 0) * segmentLength);
        // if (i >= 0 && i < 100) world.y = easeInOut(lastY, lastY + -30, 900/900);
        // if (i >= 100 && i < 800) world.y = easeInOut(lastY, lastY + -60, 900/900);
        // if (i >= 800 && i < 900) world.y = easeInOut(lastY, lastY + -30, 900+800/900);
        // if (i >= 300 && i < 600) world.y += easeInOut(300, -40, 1);
        // if (i >= 600 && i < 900) world.y += easeInOut(600, -60, 1);
      }

      // if (i >= 900 && i < 1500) world.y = easeInOut(this.getSegmentFromIndex(i - 1).points.world.y, 40, 1);
      // if (i >= 900 && world.y > 0) world.y += 60;


      // adding speed bump
      // if (i <=rumbleLength) {
      //   world.y = sin(i * 0.5) * 1000;
      // }

      // Road Sprites

      // signalDirections
      const curvePower = this.getSegmentFromIndex(i).curve;
      if (i % (rumbleLength * 2) === 0 && curvePower !== 0) {
        const finishLine = new Sprite();
        finishLine.offsetX = curvePower > 0 ? -1.5 : 1.5;
        finishLine.scaleX = 12;
        finishLine.scaleY = 12;
        finishLine.image = resource.get(curvePower > 0 ? 'leftSignal' : 'rightSignal');
        segmentLine.sprites.push(finishLine);
      }

      // startLine
      if (i === 0) {
        const startLine = new Sprite();
        startLine.offsetX = 0;
        startLine.scaleX = 9;
        startLine.scaleY = 12;
        startLine.image = resource.get('startLine');
        segmentLine.sprites.push(startLine);
      }
    }

    // marking finish line
    for (let i = 0; i < rumbleLength; i += 1) {
      this.#segments[i].colors.road = '#888';
    }
  }

  /**
   *
   * @param {Render} render
   * @param {Camera} camera
   * @param {Player} player
   */
  render(render, camera, player) {
    const cameraClass = camera;
    const { segmentsLength } = this;
    const baseSegment = this.getSegment(camera.cursor);
    const startPos = baseSegment.index;
    const visibleSegments = 600;
    cameraClass.y = camera.h + baseSegment.points.world.y;
    let maxY = camera.screen.height;
    let anx = 0;
    let snx = 0;

    for (let i = startPos; i < startPos + visibleSegments; i += 1) {
      const currentSegment = this.getSegmentFromIndex(i);
      cameraClass.z = camera.cursor - (i >= segmentsLength ? this.length : 0);
      cameraClass.x = player.x * currentSegment.points.world.w - snx;
      currentSegment.project(camera);
      anx += currentSegment.curve;
      snx += anx;

      const currentScreenPoint = currentSegment.points.screen;
      currentSegment.clip = maxY;
      if (
        currentScreenPoint.y >= maxY
        || camera.deltaZ <= camera.distanceToProjectionPlane
      ) {
        continue;
      }

      if (i > 0) {
        const previousSegment = this.getSegmentFromIndex(i - 1);
        const previousScreenPoint = previousSegment.points.screen;
        const { colors } = currentSegment;

        if (currentScreenPoint.y >= previousScreenPoint.y) {
          continue;
        }

        render.drawTrapezium(
          previousScreenPoint.x, previousScreenPoint.y, previousScreenPoint.w,
          currentScreenPoint.x, currentScreenPoint.y, currentScreenPoint.w,
          colors.road,
        );

        // left grass
        render.drawPolygon(
          colors.grass,
          0, previousScreenPoint.y,
          previousScreenPoint.x - previousScreenPoint.w, previousScreenPoint.y,
          currentScreenPoint.x - currentScreenPoint.w, currentScreenPoint.y,
          0, currentScreenPoint.y,
        );

        // right grass
        render.drawPolygon(
          colors.grass,
          previousScreenPoint.x + previousScreenPoint.w * 1, previousScreenPoint.y,
          camera.screen.width, previousScreenPoint.y,
          camera.screen.width, currentScreenPoint.y,
          currentScreenPoint.x + currentScreenPoint.w, currentScreenPoint.y,
        );

        if (currentSegment.curve) {
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
        }

        // center strip and lateral stripes
        if (colors.strip) {
          // left stripe
          render.drawPolygon(
            colors.strip,
            previousScreenPoint.x + previousScreenPoint.w * -0.97, previousScreenPoint.y,
            previousScreenPoint.x + previousScreenPoint.w * -0.94, previousScreenPoint.y,
            currentScreenPoint.x + currentScreenPoint.w * -0.94, currentScreenPoint.y,
            currentScreenPoint.x + currentScreenPoint.w * -0.97, currentScreenPoint.y,
          );

          render.drawPolygon(
            colors.strip,
            previousScreenPoint.x + previousScreenPoint.w * -0.91, previousScreenPoint.y,
            previousScreenPoint.x + previousScreenPoint.w * -0.88, previousScreenPoint.y,
            currentScreenPoint.x + currentScreenPoint.w * -0.88, currentScreenPoint.y,
            currentScreenPoint.x + currentScreenPoint.w * -0.91, currentScreenPoint.y,
          );

          // right stripe
          render.drawPolygon(
            colors.strip,
            previousScreenPoint.x + previousScreenPoint.w * 0.97, previousScreenPoint.y,
            previousScreenPoint.x + previousScreenPoint.w * 0.94, previousScreenPoint.y,
            currentScreenPoint.x + currentScreenPoint.w * 0.94, currentScreenPoint.y,
            currentScreenPoint.x + currentScreenPoint.w * 0.97, currentScreenPoint.y,
          );

          render.drawPolygon(
            colors.strip,
            previousScreenPoint.x + previousScreenPoint.w * 0.91, previousScreenPoint.y,
            previousScreenPoint.x + previousScreenPoint.w * 0.88, previousScreenPoint.y,
            currentScreenPoint.x + currentScreenPoint.w * 0.88, currentScreenPoint.y,
            currentScreenPoint.x + currentScreenPoint.w * 0.91, currentScreenPoint.y,
          );

          // center strip
          const value = 0.02;
          render.drawTrapezium(
            previousScreenPoint.x, previousScreenPoint.y, previousScreenPoint.w * value,
            currentScreenPoint.x, currentScreenPoint.y, currentScreenPoint.w * value,
            colors.strip,
          );
        }
      }

      maxY = currentScreenPoint.y;
    }
    for (let i = (visibleSegments + startPos) - 1; i >= startPos; i -= 1) {
      this.getSegmentFromIndex(i).drawSprite(render, camera, player);
    }
  }
}

export default Road;
