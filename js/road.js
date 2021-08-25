import SegmentLine from "./segmentLine.js";
import Sprite from "./sprite.js";
import { sin, floor, random, PI, resource } from './util.js';

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

  get width() {
    return this.#width;
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

  create(segmentsNumber = 2002) {
    const rumbleLength = this.rumbleLength;
    // great tip: if you put more counter variables, they increment too!
    for (let i = 0, angleSegment = 0; i < segmentsNumber; i += 1) {
      const lightestColors = { road: '#525152', grass: 'green', rumble: 'white', strip: '' };
      const lightColors = { road: '#4A494A', grass: 'green', rumble: 'white', strip: '' };
      const darkColors = { road: '#424142', grass: 'darkgreen', rumble: '#f00', strip: '#fff' };
      const darkestColors = { road: '#393839', grass: 'darkgreen', rumble: '#f00', strip: '#fff' };
      const segmentLine = new SegmentLine;
      segmentLine.index = i;

      segmentLine.colors = floor(i / rumbleLength) % 4 === 0
        ? lightestColors : floor(i / rumbleLength) % 4 === 1
          ? darkestColors : floor(i / rumbleLength) % 4 === 2
            ? lightColors : darkColors;

      const world = segmentLine.points.world;
      world.w = this.width;
      world.z = (i + 1) * this.segmentLength;
      this.#segments.push(segmentLine);

      // adding curves
      if (i > 50 && i < 300) {
        segmentLine.curve = -2;
      }
      if (i > 500 && i < 700) {
        segmentLine.curve = 5;
      }
      if (i >= 700 && i < 900) {
        segmentLine.curve = -3;
      }


      // adding hills
      if (i > 1000 && angleSegment < 720) {
        world.y = sin(angleSegment++ / 180 * PI) * 3000;
        if (i < 1280) {
          segmentLine.curve = 1;
        } else if (i > 1440) {
          segmentLine.curve = -1;
        }
      }

      // adding speed bump
      // if (i <=rumbleLength) {
      //   world.y = sin(i * 0.5) * 1000;
      // }



      // Road Sprites

      // signalDirections
      const curvePower = this.getSegmentFromIndex(i).curve;
      if (i % (rumbleLength * 2) === 0 && curvePower !== 0) {
        const finishLine = new Sprite;
        finishLine.offsetX = curvePower > 0 ? -1.5 : 1.5;
        finishLine.scaleX = 12;
        finishLine.image = resource.get(curvePower > 0 ? 'leftSignal' : 'rightSignal');
        segmentLine.sprites.push(finishLine);
      }

      // startLine
      if (i === 0) {
        const startLine = new Sprite;
        startLine.offsetX = 0;
        startLine.scaleX = 9;
        startLine.image = resource.get('startLine');
        segmentLine.sprites.push(startLine);
      }
    }
    // marking finish line

    for (let i = 0; i < rumbleLength; i += 1) {
      this.#segments[i].colors.road = '#888';
      this.#segments[i].colors.strip = '#fff';
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
    camera.y = camera.h + baseSegment.points.world.y;
    let maxY = camera.screen.height;
    let anx = 0;
    let snx = 0;

    for (let i = startPos; i < startPos + visibleSegments; i += 1) {
      const currentSegment = this.getSegmentFromIndex(i);
      camera.z = camera.cursor - (i >= segmentsLength ? this.length : 0);
      camera.x = player.x * currentSegment.points.world.w - snx;
      currentSegment.project(camera);
      anx += currentSegment.curve;
      snx += anx;

      const currentScreenPoint = currentSegment.points.screen;
      currentSegment.clip = maxY;
      if (
        currentScreenPoint.y >= maxY ||
        camera.deltaZ <= camera.distanceToProjectionPlane
      ) {
        continue;
      }

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
          previousScreenPoint.x - previousScreenPoint.w, previousScreenPoint.y,
          currentScreenPoint.x - currentScreenPoint.w, currentScreenPoint.y,
          0, currentScreenPoint.y
        );

        // right grass
        render.drawPolygon(
          colors.grass,
          previousScreenPoint.x + previousScreenPoint.w * 1, previousScreenPoint.y,
          camera.screen.width, previousScreenPoint.y,
          camera.screen.width, currentScreenPoint.y,
          currentScreenPoint.x + currentScreenPoint.w, currentScreenPoint.y
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
          //right stripe
          render.drawPolygon(
            colors.strip,
            previousScreenPoint.x + previousScreenPoint.w * -0.96, previousScreenPoint.y,
            previousScreenPoint.x + previousScreenPoint.w * -0.92, previousScreenPoint.y,
            currentScreenPoint.x + currentScreenPoint.w * -0.92, currentScreenPoint.y,
            currentScreenPoint.x + currentScreenPoint.w * -0.96, currentScreenPoint.y,
          );

          //right stripe
          render.drawPolygon(
            colors.strip,
            previousScreenPoint.x + previousScreenPoint.w * 0.96, previousScreenPoint.y,
            previousScreenPoint.x + previousScreenPoint.w * 0.92, previousScreenPoint.y,
            currentScreenPoint.x + currentScreenPoint.w * 0.92, currentScreenPoint.y,
            currentScreenPoint.x + currentScreenPoint.w * 0.96, currentScreenPoint.y,
          );

          // center strip
          const value = 0.03;
          render.drawTrapezium(
            previousScreenPoint.x, previousScreenPoint.y, previousScreenPoint.w * value,
            currentScreenPoint.x, currentScreenPoint.y, currentScreenPoint.w * value,
            colors.strip,
          );
        }
      };

      maxY = currentScreenPoint.y;
    };
    for (let i = (visibleSegments + startPos) - 1; i >= startPos; i -= 1) {
      this.getSegmentFromIndex(i).drawSprite(render, camera, player);
    }
  };
};

export default Road;
