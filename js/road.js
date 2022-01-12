import SegmentLine from './segmentLine.js';
import Sprite from './sprite.js';
import Tunnel from './tunnel.js';
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
    this.#segments = [];
    const { rumbleLength } = this;
    for (let i = 0; i < tracks[this.trackName].trackSize; i += 1) {
      const lightestColors = {
        road: '#424142', grass: 'green', rumble: 'white', strip: '', tunnel: 'blue',
      };
      const lightColors = {
        road: '#393839', grass: 'darkgreen', rumble: 'white', strip: '', tunnel: 'blue',
      };
      const darkColors = {
        road: '#393839', grass: 'green', rumble: '#f00', strip: '#fff', tunnel: 'darkblue',
      };
      const darkestColors = {
        road: '#424142', grass: 'darkgreen', rumble: '#f00', strip: '#fff', tunnel: 'darkblue',
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

      // adding speed bump
      // if (i <=rumbleLength) {
      //   world.y = sin(i * 0.5) * 1000;
      // }

      // Road Sprites
      // signalDirections
      const curvePower = this.getSegmentFromIndex(i).curve;
      if (i % (rumbleLength * 2) === 0 && Math.abs(curvePower) > 1) {
        const finishLine = new Sprite();
        finishLine.offsetX = curvePower > 0 ? -1.5 : 1.5;
        finishLine.scaleX = 72;
        finishLine.scaleY = 72;
        finishLine.image = resource.get(curvePower > 0 ? 'leftSignal' : 'rightSignal');
        segmentLine.sprites.push(finishLine);
      }

      // startLine
      if (i === 0) {
        const startLine = new Sprite();
        startLine.offsetX = 0;
        startLine.scaleX = 54;
        startLine.scaleY = 72;
        startLine.image = resource.get('startLine');
        segmentLine.sprites.push(startLine);
      }
    }

    // adding hills
    const createHills = (lastHillSegment, startHillSegment, hillSize, altimetry, position) => {
      let lastWorld = { x: 0, y: 0, z: 200, w: 2000 };
      let counterSegment = 0.5;
      let counterAngle = hillSize / 4;
      const finalSegment = startHillSegment + hillSize;
      for (let i = lastHillSegment, previousSegment; i < finalSegment; i += 1) {
        const baseSegment = this.getSegmentFromIndex(i);
        const world = baseSegment.points.world;

        lastWorld = this.getSegmentFromIndex(i - 1).points.world;
        world.y = lastWorld.y;

        if (i >= startHillSegment && counterSegment <= hillSize) {
          const multiplier = altimetry * hillSize / -4;
          const actualSin = Math.sin((counterAngle + 1) / (hillSize / 2) * Math.PI) * multiplier;
          const lastSin = Math.sin(counterAngle / (hillSize / 2) * Math.PI) * multiplier;
          world.y += (actualSin - lastSin);
          counterSegment += 1;
          counterAngle += 0.5;
        }

        // tunnels
        if (i >= 0 && i <= 0) {
          if (i === 208) {
            previousSegment = baseSegment;
            const tunnel = new Tunnel();
            tunnel.worldH = 5000 + Math.abs(world.y);

            baseSegment.tunnel = tunnel;
            baseSegment.colors.tunnel = '#fff';
            tunnel.title = 'Tunel Racing 3D';

          } else if (i % (rumbleLength * 1) === 0) {
            const tunnel = new Tunnel();
            tunnel.worldH = 5000 + Math.abs(world.y);
            tunnel.previousSegment = previousSegment;
            previousSegment = baseSegment;
            baseSegment.tunnel = tunnel;
          }
        }
      }

      if (tracks[this.trackName].hills[position + 1]) {
        const { initialSegment, size, altimetry } = tracks[this.trackName].hills[position + 1];
        createHills(finalSegment, initialSegment, size, altimetry, position + 1)
      }
    }
    const { initialSegment, size, altimetry } = tracks[this.trackName].hills[0];
    createHills(1, initialSegment, size, altimetry, 0);
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

        if (Math.abs(currentSegment.curve) > 1) {
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
      this.getSegmentFromIndex(i)
        .drawSprite(render, camera, player)
        .drawTunnel(render, camera, player);
    }
  }
}

export default Road;
