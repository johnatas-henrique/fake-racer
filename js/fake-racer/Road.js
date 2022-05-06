class Road {
  /**
   * @type {SegmentLine[]}
   */
  #segments = [];

  #segmentLength = 200; // it could be named segmentHeight

  visibleSegments = 600;

  #k = 13; // number of segments to change kerb color

  #width = 2000;

  constructor(config) {
    this.race = config.race;
    this.render = config.race.core.render;
    this.trackName = config.race.trackName;
    this.camera = null;
    this.player = null;
  }

  get k() {
    return this.#k;
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

  init() {
    this.camera = this.race.camera;
    this.player = this.race.player;

    this.#segments = [];
    const { k } = this;
    const actualTrack = utils.tracks[this.trackName];
    const { trackSize, colors } = actualTrack;
    for (let i = 0; i < trackSize; i += 1) {
      const lightestColors = {
        road: colors.lightRoad,
        grass: colors.lightGrass,
        kerb: colors.lightKerb,
        strip: '',
        tunnel: colors.lightTunnel,
      };
      const lightColors = {
        road: '#393839',
        grass: colors.darkGrass,
        kerb: colors.lightKerb,
        strip: '',
        tunnel: colors.lightTunnel,
      };
      const darkColors = {
        road: '#393839',
        grass: colors.lightGrass,
        kerb: colors.darkKerb,
        strip: '#fff',
        tunnel: colors.darkTunnel,
      };
      const darkestColors = {
        road: colors.lightRoad,
        grass: colors.darkGrass,
        kerb: colors.darkKerb,
        strip: '#fff',
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
      this.#segments.push(segmentLine);

      // adding curves
      const createCurve = (min, max, curve, kerb) => {
        if (i >= min && i <= max) {
          segmentLine.curve = curve;
          segmentLine.kerb = kerb;
        }
      };
      actualTrack.curves
        .forEach((curve) => createCurve(curve.min, curve.max, curve.curveInclination, curve.kerb));

      // adding speed bump
      // if (i <=k) {
      //   world.y = sin(i * 0.5) * 1000;
      // }

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
            baseSegment.colors.tunnel = '#fff';
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

        const { x: prevScrX, y: prevScrY, w: prevScrW } = prevScrnPoint;
        const { x: currScrX, y: currScrY, w: currScrW } = currScrnPoint;

        if (currScrY >= prevScrY) {
          continue;
        }

        this.render
          .drawTrapezium(prevScrX, prevScrY, prevScrW, currScrX, currScrY, currScrW, colors.road);

        // left grass
        this.render
          .drawPolygon(
            colors.grass,
            0,
            prevScrY,
            prevScrX - prevScrW,
            prevScrY,
            currScrX - currScrW,
            currScrY,
            0,
            currScrY,
          );

        // right grass
        this.render.drawPolygon(
          colors.grass,
          prevScrX + prevScrW * 1,
          prevScrY,
          this.camera.screen.width,
          prevScrY,
          this.camera.screen.width,
          currScrY,
          currScrX + currScrW,
          currScrY,
        );

        if (currentSegment.kerb) {
          // left kerb
          this.render.drawPolygon(
            colors.kerb,
            prevScrX - prevScrW * 1.3,
            prevScrY,
            prevScrX - prevScrW,
            prevScrY,
            currScrX - currScrW,
            currScrY,
            currScrX - currScrW * 1.3,
            currScrY,
          );

          // right kerb
          this.render.drawPolygon(
            colors.kerb,
            prevScrX + prevScrW * 1.3,
            prevScrY,
            prevScrX + prevScrW,
            prevScrY,
            currScrX + currScrW,
            currScrY,
            currScrX + currScrW * 1.3,
            currScrY,
          );
        }

        // center strip and lateral stripes
        if (colors.strip) {
          // left stripe
          this.render.drawPolygon(
            colors.strip,
            prevScrX + prevScrW * -0.97,
            prevScrY,
            prevScrX + prevScrW * -0.94,
            prevScrY,
            currScrX + currScrW * -0.94,
            currScrY,
            currScrX + currScrW * -0.97,
            currScrY,
          );

          this.render.drawPolygon(
            colors.strip,
            prevScrX + prevScrW * -0.91,
            prevScrY,
            prevScrX + prevScrW * -0.88,
            prevScrY,
            currScrX + currScrW * -0.88,
            currScrY,
            currScrX + currScrW * -0.91,
            currScrY,
          );

          // right stripe
          this.render.drawPolygon(
            colors.strip,
            prevScrX + prevScrW * 0.97,
            prevScrY,
            prevScrX + prevScrW * 0.94,
            prevScrY,
            currScrX + currScrW * 0.94,
            currScrY,
            currScrX + currScrW * 0.97,
            currScrY,
          );

          this.render.drawPolygon(
            colors.strip,
            prevScrX + prevScrW * 0.91,
            prevScrY,
            prevScrX + prevScrW * 0.88,
            prevScrY,
            currScrX + currScrW * 0.88,
            currScrY,
            currScrX + currScrW * 0.91,
            currScrY,
          );

          // center strip
          const value = 0.02;
          this.render.drawTrapezium(
            prevScrX,
            prevScrY,
            prevScrW * value,
            currScrX,
            currScrY,
            currScrW * value,
            colors.strip,
          );
        }

        // checkered road
        if (colors.checkers === 'one') {
          for (let j = -1; j < 0.9; j += 2 / 3) {
            this.render.drawPolygon(
              'black',
              prevScrX + prevScrW * j,
              prevScrY,
              prevScrX + prevScrW * (j + 1 / 3),
              prevScrY,
              currScrX + currScrW * (j + 1 / 3),
              currScrY,
              currScrX + currScrW * j,
              currScrY,
            );
          }
        }
        if (colors.checkers === 'two') {
          for (let j = -2 / 3; j < 0.9; j += 2 / 3) {
            this.render.drawPolygon(
              'black',
              prevScrX + prevScrW * j,
              prevScrY,
              prevScrX + prevScrW * (j + 1 / 3),
              prevScrY,
              currScrX + currScrW * (j + 1 / 3),
              currScrY,
              currScrX + currScrW * j,
              currScrY,
            );
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
