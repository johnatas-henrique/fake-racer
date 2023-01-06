import SegmentLine from './SegmentLine.js';
import SpriteRace from './SpriteRace.js';
import Tunnel from './Tunnel.js';

class Road {
  constructor(config) {
    this.race = config.race;
    this.render = config.race.core.render;
    this.trackName = config.race.trackName;
    this.segments = [];
    this.segmentLength = 200; // it could be named segmentHeight
    this.visibleSegments = 450;
    this.k = 13; // number of segments to change kerb color
    this.width = 2000;
    this.camera = null;
    this.player = null;
  }

  get segmentsLength() {
    return this.segments.length;
  }

  get length() {
    return this.segmentsLength * this.segmentLength;
  }

  getSegment(cursor) {
    return this.segments[Math.floor(cursor / this.segmentLength) % this.segmentsLength];
  }

  getSegmentFromIndex(index) {
    return this.segments[index % this.segmentsLength];
  }

  init() {
    this.camera = this.race.camera;
    this.player = this.race.player;

    this.segments = [];
    const { k } = this;
    const actualTrack = window.tracks.f1Y91[this.trackName];
    const { trackSize, colors } = actualTrack;
    for (let i = 0; i < trackSize; i += 1) {
      const lightestColors = {
        road: colors.lightRoad,
        grass: colors.lightGrass,
        kerb: colors.lightKerb,
        stripe: colors.lightStripe,
        tunnel: colors.lightTunnel,
      };
      const lightColors = {
        road: colors.darkRoad,
        grass: colors.darkGrass,
        kerb: colors.lightKerb,
        stripe: colors.lightStripe,
        tunnel: colors.lightTunnel,
      };
      const darkColors = {
        road: colors.darkRoad,
        grass: colors.lightGrass,
        kerb: colors.darkKerb,
        stripe: colors.darkStripe,
        tunnel: colors.darkTunnel,
      };
      const darkestColors = {
        road: colors.lightRoad,
        grass: colors.darkGrass,
        kerb: colors.darkKerb,
        stripe: colors.darkStripe,
        tunnel: colors.darkTunnel,
      };

      const segmentLine = new SegmentLine();
      segmentLine.index = i;

      if (Math.floor(i / k) % 4 === 0) segmentLine.colors = lightestColors;
      if (Math.floor(i / k) % 4 === 1) segmentLine.colors = darkestColors;
      if (Math.floor(i / k) % 4 === 2) segmentLine.colors = lightColors;
      if (Math.floor(i / k) % 4 === 3) segmentLine.colors = darkColors;

      if (i <= 11) {
        segmentLine.colors.road = '#fff';
        if (i % 4 === 0 || i % 4 === 1) {
          segmentLine.colors.checkers = 'one';
        } else {
          segmentLine.colors.checkers = 'two';
        }
      }

      const { world } = segmentLine.points;
      world.w = this.width;
      world.z = (i + 1) * this.segmentLength;
      this.segments.push(segmentLine);

      // adding curves
      const createCurve = (min, max, curve, kerb) => {
        if (i >= min && i <= max) {
          segmentLine.curve = curve;
          segmentLine.kerb = kerb;
        }
      };
      actualTrack.curves
        .forEach((curve) => createCurve(curve.min, curve.max, curve.curveInclination, curve.kerb));

      // Road Sprites
      // signalDirections
      const { curve: curvePower, kerb } = this.getSegmentFromIndex(i);
      if (i % (k * 2) === 0 && Math.abs(curvePower) > 1 && kerb) {
        const curveSignal = new SpriteRace();
        curveSignal.offsetX = curvePower > 0 ? -1.5 : 1.5;
        curveSignal.scaleX = 72;
        curveSignal.scaleY = 72;
        curveSignal.image = new Image();
        const leftSignal = '../images/sprites/other/leftSignal.png';
        const rightSignal = '../images/sprites/other/rightSignal.png';
        curveSignal.image.src = curvePower > 0 ? leftSignal : rightSignal;
        curveSignal.name = 'tsCurveSignal';
        segmentLine.sprites.push(curveSignal);
      }
    }

    // adding hills
    const createHills = (lastHillSegment, startHillSegment, hillSize, alt, position) => {
      let lastWorld = { x: 0, y: 0, z: 200, w: 2000 };
      let counterSegment = 0.5;
      let counterAngle = hillSize / 4;
      const finalSegment = startHillSegment + hillSize;
      for (let i = lastHillSegment, previousSegment; i < finalSegment; i += 1) {
        const baseSegment = this.getSegmentFromIndex(i);
        const { world } = baseSegment.points;

        lastWorld = this.getSegmentFromIndex(i - 1).points.world;
        world.y = lastWorld.y;

        if (i >= startHillSegment && counterSegment <= hillSize) {
          const multiplier = (alt * hillSize) / -4;
          const actualSin = Math.sin(((counterAngle + 1) / (hillSize / 2)) * Math.PI) * multiplier;
          const lastSin = Math.sin((counterAngle / (hillSize / 2)) * Math.PI) * multiplier;
          world.y += (actualSin - lastSin);
          counterSegment += 1;
          counterAngle += 0.5;
        }

        const tunnelInfo = actualTrack.tunnels[0];
        // tunnels
        if (i >= tunnelInfo.min && i <= tunnelInfo.max) {
          if (i === tunnelInfo.min) {
            previousSegment = baseSegment;
            const tunnel = new Tunnel();
            tunnel.worldH = tunnelInfo.height;

            baseSegment.tunnel = tunnel;
            baseSegment.colors.tunnel = colors.frontTunnel;
            tunnel.title = tunnelInfo.name;
          } else if (i % (k * 1) === 0) {
            const tunnel = new Tunnel();
            tunnel.worldH = tunnelInfo.height;
            tunnel.previousSegment = previousSegment;
            previousSegment = baseSegment;
            baseSegment.tunnel = tunnel;
          }
        }
      }

      if (actualTrack.hills[position + 1]) {
        const { initialSegment, size, altimetry } = actualTrack.hills[position + 1];
        createHills(finalSegment, initialSegment, size, altimetry, position + 1);
      }
    };
    const { initialSegment, size, altimetry } = actualTrack.hills[0];
    createHills(1, initialSegment, size, altimetry, 0);
  }

  draw() {
    const { segmentsLength } = this;
    const baseSegment = this.getSegment(this.camera.cursor);
    const startPos = baseSegment.index;
    this.camera.y = this.camera.h + baseSegment.points.world.y;
    let maxY = this.camera.screen.height;
    let anx = 0;
    let snx = 0;

    for (let i = startPos; i < startPos + this.visibleSegments; i += 1) {
      const currentSegment = this.getSegmentFromIndex(i);
      this.camera.z = this.camera.cursor - (i >= segmentsLength ? this.length : 0);
      this.camera.x = this.player.x * currentSegment.points.world.w - snx;
      currentSegment.project(this.camera);
      anx += currentSegment.curve;
      snx += anx;

      const currScrnPoint = currentSegment.points.screen;
      currentSegment.clip = maxY;
      if (currScrnPoint.y >= maxY || this.camera.deltaZ <= this.camera.distanceToProjectionPlane) {
        continue;
      }

      if (i > 0) {
        const previousSegment = this.getSegmentFromIndex(i - 1);
        const prevScrnPoint = previousSegment.points.screen;
        const { colors } = currentSegment;
        const { road, grass, kerb, stripe, checkers } = colors;

        const { x: pX, y: pY, w: pW } = prevScrnPoint;
        const { x: cX, y: cY, w: cW } = currScrnPoint;
        const { width: camWidth } = this.camera.screen;

        if (cY >= pY) {
          continue;
        }

        this.render.drawTrapezium(pX, pY, pW, cX, cY, cW, road);

        // left grass
        this.render.drawPolygon(grass, 0, pY, pX - pW, pY, cX - cW, cY, 0, cY);

        // right grass
        this.render.drawPolygon(grass, pX + pW * 1, pY, camWidth, pY, camWidth, cY, cX + cW, cY);

        if (currentSegment.kerb) {
          // left kerb
          this.render
            .drawPolygon(kerb, pX - pW * 1.3, pY, pX - pW, pY, cX - cW, cY, cX - cW * 1.3, cY);

          // right kerb
          this.render
            .drawPolygon(kerb, pX + pW * 1.3, pY, pX + pW, pY, cX + cW, cY, cX + cW * 1.3, cY);
        }

        // center strip and lateral stripes
        if (stripe) {
          // left stripe
          this.render
            .drawPolygon(stripe, pX + pW * -0.97, pY, pX + pW * -0.94, pY, cX + cW * -0.94, cY, cX + cW * -0.97, cY);

          this.render
            .drawPolygon(stripe, pX + pW * -0.91, pY, pX + pW * -0.88, pY, cX + cW * -0.88, cY, cX + cW * -0.91, cY);

          // right stripe
          this.render
            .drawPolygon(stripe, pX + pW * 0.97, pY, pX + pW * 0.94, pY, cX + cW * 0.94, cY, cX + cW * 0.97, cY);

          this.render
            .drawPolygon(stripe, pX + pW * 0.91, pY, pX + pW * 0.88, pY, cX + cW * 0.88, cY, cX + cW * 0.91, cY);

          // center stripe
          const value = 0.02;
          this.render.drawTrapezium(pX, pY, pW * value, cX, cY, cW * value, stripe);
        }

        // checkered road
        if (checkers === 'one') {
          for (let j = -1; j < 0.9; j += 2 / 3) {
            this.render
              .drawPolygon('black', pX + pW * j, pY, pX + pW * (j + 1 / 3), pY, cX + cW * (j + 1 / 3), cY, cX + cW * j, cY);
          }
        }
        if (checkers === 'two') {
          for (let j = -2 / 3; j < 0.9; j += 2 / 3) {
            this.render
              .drawPolygon('black', pX + pW * j, pY, pX + pW * (j + 1 / 3), pY, cX + cW * (j + 1 / 3), cY, cX + cW * j, cY);
          }
        }
      }

      maxY = currScrnPoint.y;
    }
    for (let i = (this.visibleSegments + startPos) - 1; i >= startPos; i -= 1) {
      this.getSegmentFromIndex(i)
        .drawSprite(this.render, this.camera, this.player)
        .drawTunnel(this.render, this.camera, this.player);
    }
  }
}

export default Road;
