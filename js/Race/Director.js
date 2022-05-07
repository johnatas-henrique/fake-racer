class Director {
  constructor(config) {
    this.race = config.race;
    this.render = config.race.core.render;
    this.trackName = this.race.trackName;
    this.realTime = 0;
    this.totalTime = 0;
    this.animTime = 0;
    this.timeSinceLastFrameSwap = 0;
    this.lap = 0;
    this.lastLap = 0;
    this.fastestLap = 0;
    this.totalLaptimes = [];
    this.laptimes = [];
    this.position = '';
    this.positions = [];
    this.running = true;
    this.paused = true;
    this.startLights = new SpriteRace();
    this.hudPositions = [];
    this.startTimer = 5000;
    this.carSegments = [];
    this.raining = false;
    this.rain = [];
    this.images = {};
    this.road = null;
    this.trackName = null;
    this.player = null;
    this.opponents = null;
  }

  pauseOption() {
    this.paused = !this.paused;
    utils.htmlElements.pauseBtn().classList.toggle('off');
  }

  pauseRace() {
    this.race.core.inputs.keyPressListeners.push(
      new KeyPressListener('KeyP', () => this.pauseOption()),
    );
    utils.keyInitializer('KeyP', this.race.core);
    utils.htmlElements.pauseBtn().addEventListener('click', () => this.pauseOption());
  }

  init() {
    this.trackName = window.gameState.menuSelectedOptions.track;
    this.road = this.race.road;
    this.player = this.race.player;
    this.opponents = this.race.opponents;

    this.pauseRace();

    this.images.startLights = new Image();
    this.images.startLights.src = '../images/sprites/other/startLights.png';
    this.images.startLightsBar = new Image();
    this.images.startLightsBar.src = '../images/sprites/other/startLightsBar.png';
    const segmentLineFirst = this.road.getSegmentFromIndex(0);
    const actualTrack = window.tracks.f1Y91[this.trackName];
    const segmentLineTen = this.road.getSegmentFromIndex(actualTrack.trackSize - 160);
    this.startLights.offsetX = 0;
    this.startLights.offsetY = 2;
    this.startLights.scaleX = 27;
    this.startLights.scaleY = 27;
    this.startLights.spritesInX = 6;
    this.startLights.sheetPositionX = Math.ceil(this.animTime / 500);
    this.startLights.image = this.images.startLights;
    this.startLights.name = 'tsStartLights';
    segmentLineFirst.sprites.push(this.startLights);
    segmentLineTen.sprites.push(this.startLights);

    const startLineLeft = new SpriteRace();
    startLineLeft.offsetX = -1.15;
    startLineLeft.scaleX = 216;
    startLineLeft.scaleY = 708;
    startLineLeft.image = this.images.startLightsBar;
    startLineLeft.name = 'tsStartLightsBar';

    const startLineRight = new SpriteRace();
    startLineRight.offsetX = 1.15;
    startLineRight.scaleX = 216;
    startLineRight.scaleY = 708;
    startLineRight.image = this.images.startLightsBar;
    startLineRight.name = 'tsStartLightsBar';

    segmentLineFirst.sprites.push(startLineLeft);
    segmentLineFirst.sprites.push(startLineRight);
    segmentLineTen.sprites.push(startLineLeft);
    segmentLineTen.sprites.push(startLineRight);

    this.raining = Math.round(Math.random() * 5) % 3 === 0;
    if (this.raining) {
      const rainDrops = Math.random() * 500 + 100;
      this.rain = window.rain(rainDrops);
      utils.htmlElements.canvas().classList.add('filter');
    }
  }

  refreshPositions() {
    let arr = [];
    const {
      name, trackPosition, raceTime, x,
    } = this.player;
    arr.push({
      name, pos: trackPosition, raceTime, x: Number(x.toFixed(3)),
    });

    this.opponents.forEach((opp) => {
      const { opponentName, sprite } = opp;
      arr.push({
        name: opponentName,
        pos: opp.trackPosition,
        raceTime: opp.raceTime,
        x: Number((sprite.offsetX * 2).toFixed(3)),
      });
    });
    arr.sort((a, b) => b.pos - a.pos);
    arr = arr.map((item, index) => ({ ...item, position: index + 1 }));
    this.positions = arr;
  }

  update() {
    if (this.totalTime < this.startTimer || !this.paused) this.running = false;
    else
    if (this.totalTime >= this.startTimer && this.paused) this.running = true;

    this.totalTime += (1 / 60) * 1000 * this.paused;
    this.animTime += (1 / 60) * 1000 * this.paused;
    this.lastLap = this.laptimes[this.lap - 2] ? this.laptimes[this.lap - 2] : 0;
    this.fastestLap = this.laptimes.length ? Math.min.apply(null, this.laptimes) : 0;

    this.position = (this.positions
      .findIndex((elem) => elem.name === this.player.name) + 1).toString();
    if (this.position < 10) this.position = `0${this.position}`;
    let numberOfCars = this.positions.length;
    if (numberOfCars < 10) numberOfCars = `0${numberOfCars}`;

    this.refreshPositions(this.player, this.opponents);
    if (this.animTime > this.startTimer) this.startLights.sheetPositionX = 0;
    else if (this.animTime > 2000 + 2500) this.startLights.sheetPositionX = 5;
    else if (this.animTime > 2000 + 2000) this.startLights.sheetPositionX = 4;
    else if (this.animTime > 2000 + 1500) this.startLights.sheetPositionX = 3;
    else if (this.animTime > 2000 + 1000) this.startLights.sheetPositionX = 2;
    else if (this.animTime > 2000 + 500) this.startLights.sheetPositionX = 1;

    if (this.paused) {
      const actualPos = Number(this.position);
      this.hudPositions = this.positions.filter((_, index) => {
        if (actualPos <= 2) return index <= 2 && index >= 0;
        if (actualPos === this.positions.length) return index === 0 || index >= actualPos - 2;
        return (index === 0) || (index >= actualPos - 2 && index <= actualPos - 1);
      }).map((item, index, array) => {
        const result = {
          pos: item.position, name: item.name, lap: item.raceTime.length, relTime: '- Líder', totalTime: (Math.round(item.raceTime.at(-1)) / 1000).toFixed(3),
        };
        const actualItem = item.raceTime.at(-1);
        const actualLap = item.raceTime.length;

        if (index) {
          const prevItem = array[index - 1].raceTime.at(-1) || 0;
          const prevLap = array[index - 1].raceTime.length || 0;
          if (actualLap === prevLap) {
            result.relTime = `+ ${(Math.round(actualItem - prevItem) / 1000).toFixed(3)}`;
          } else if (actualLap !== prevLap) {
            result.relTime = `- ${prevLap - actualLap} Lap`;
          }
        }
        return result;
      });

      this.carSegments = this.positions.map((driver) => ({
        name: driver.name,
        pos: Math.floor(driver.pos / 200) % window.tracks.f1Y91[this.trackName].trackSize,
        x: driver.x,
      })).sort((a, b) => a.pos - b.pos);

      if (this.raining) this.rain.forEach((item) => item.update());
    }
  }

  draw() {
    if (!this.paused) {
      this.render
        .drawText('#FFFAF4', 'Jogo pausado!', 320, 175, 2, 'OutriderCond', 'center', 'black', true);
    }
    if (!this.paused) {
      this.render
        .drawText('#FFFAF4', 'Aperte "P" para continuar', 320, 215, 2, 'OutriderCond', 'center', 'black', true);
    }
    if (this.totalTime < 2500) {
      this.render
        .drawText('#FFFAF4', 'Prepare-se...', 320, 135, 2, 'OutriderCond', 'center', 'black', true);
    }

    this.render.drawText('#050B1A', `Volta ${this.lap} de ${window.tracks.f1Y91[this.trackName].laps}`, 4, 44, 0.8, 'Computo', 'left');
    this.hudPositions.forEach(({ pos, name, relTime }, index) => {
      const alignPos = pos < 10 ? `0${pos}` : pos;
      this.render.drawText('#050B1A', `${alignPos}`, 4, `${60 + (index * 16)}`, 0.8, 'Computo', 'left');
      this.render.drawText('#050B1A', `${name} ${relTime}`, 32, `${60 + (index * 16)}`, 0.8, 'Computo', 'left');
    });
    this.render.drawText('#050B1A', `Total: ${utils.formatTime(this.totalTime)}`, 636, 44, 0.8, 'Computo', 'right');
    this.render.drawText('#050B1A', `Lap: ${utils.formatTime(this.animTime)}`, 636, 60, 0.8, 'Computo', 'right');
    this.render.drawText('#050B1A', `Last: ${utils.formatTime(this.lastLap)}`, 636, 76, 0.8, 'Computo', 'right');
    this.render.drawText('#050B1A', `Fast: ${utils.formatTime(this.fastestLap)}`, 636, 92, 0.8, 'Computo', 'right');

    if (this.raining) this.rain.forEach((item) => item.draw(this.render, this.player));
  }
}
