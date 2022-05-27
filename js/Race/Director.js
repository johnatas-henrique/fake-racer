class Director {
  constructor(config) {
    this.race = config.race;
    this.render = config.race.core.render;
    this.trackName = config.race.trackName;
    this.raceLaps = config.race.raceLaps;
    this.startTimer = config.race.startTimer ?? 5000;
    this.totalTime = 0;
    this.animTime = 0;
    this.lap = 0;
    this.lastLap = 0;
    this.fastestLap = 0;
    this.totalLaptimes = [];
    this.laptimes = [];
    this.position = '';
    this.positions = [];
    this.finalPositions = false;
    this.running = true;
    this.paused = true;
    this.isRaceFinished = false;
    this.raceFinishedCars = [];
    this.shakeMessageY = { pos: 0, direction: 1 };
    this.startLights = new SpriteRace();
    this.hudPositions = [];
    this.carSegments = [];
    this.images = {};
    this.road = null;
    this.player = null;
    this.opponents = null;
  }

  pauseOption() {
    this.paused = !this.paused;
    utils.htmlElements.pauseBtn().classList.toggle('off');
  }

  pauseRace() {
    utils.keyUnbinder('KeyP', this.race.core);
    this.race.core.inputs.keyPressListeners.push(
      new KeyPressListener('KeyP', () => this.pauseOption()),
    );
    utils.keyInitializer('KeyP', this.race.core);
    utils.htmlElements.pauseBtn().addEventListener('click', () => this.pauseOption());
  }

  closeRaceEvent() {
    if (this.isRaceFinished) {
      utils.keyUnbinder('Enter', this.race.core);
      utils.classRemover('gameCanvas', 'filter');
      if (window.gameState.mode === 'singleRaceScene') {
        utils.changeMode('menuScene', this.race.core);
      }
      if (window.gameState.mode === 'historyRaceScene') {
        const playerName = window.playerState.name;

        const playerPos = this.finalPositions
          .find((driver) => driver.name === playerName)?.position || this.race.oppNumber + 1;
        const hasPlayerWin = playerPos <= this.race.winCondition;

        if (!hasPlayerWin) {
          window.playerState.storyFlags[`LOST_${this.race.eventRPG.npc}`] = true; // HACK Should be an async event
          window.playerState.storyFlags[`LOSE_${this.race.eventRPG.npc}`] = true; // HACK Should be an async event
        } else {
          delete window.playerState.storyFlags[`LOST_${this.race.eventRPG.npc}`];
        }

        const endRaceTransition = new SceneTransition();
        endRaceTransition.init(
          'map-transition',
          document.querySelector('.game-container'),
          () => {
            this.race.onComplete(hasPlayerWin);
            utils.changeMode('RPGScene', this.race.core, false);
            document.querySelector('.Hud').classList.remove('hidden');
            endRaceTransition.fadeOut();
          },
        );
      }
    }
  }

  createLights() {
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
  }

  init() {
    if (this.raceLaps < 0 || typeof this.raceLaps !== 'number') {
      this.raceLaps = Math.round(window.tracks.f1Y91[this.trackName].laps * 0.1);
    }
    this.race.core.inputs.keyPressListeners.push(
      new KeyPressListener('Enter', () => this.closeRaceEvent()),
    );
    utils.keyInitializer('Enter', this.race.core);

    this.road = this.race.road;
    this.player = this.race.player;
    this.opponents = this.race.opponents;

    this.raceFinishedCars = this.opponents
      .map(({ opponentName }) => ({ name: opponentName, finished: false }));

    this.pauseRace();
    this.createLights();
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

  finishRace() {
    if (this.raceFinishedCars.every((opp) => opp.finished === true)) this.isRaceFinished = true;

    if (this.lap > this.raceLaps) {
      this.isRaceFinished = true;
    }

    if (this.isRaceFinished) {
      utils.keyUnbinder('KeyP', this.race.core);

      // correcting X and Y axis of player
      if (this.player.maxSpeed > 800) this.player.maxSpeed -= 1;
      if (this.player.maxRange > 1.6) this.player.maxRange -= 0.1;
      if (Math.abs(this.player.x) > 1.6) {
        this.player.x = (Math.abs(this.player.x) - 0.1) * Math.sign(this.player.x);
      }

      // arranging position;
      if (!this.finalPositions) {
        this.finalPositions = this.positions
          .slice(0, Math.min(this.positions.length, 3))
          .map(({ name, raceTime, position }, index, arr) => {
            let totalTime = utils.formatTime(raceTime.at(-1));
            if (index > 0) {
              const isSameLap = raceTime.at(-1) > arr[index - 1].raceTime.at(-1);
              const diff = raceTime.at(-1) - arr[index - 1].raceTime.at(-1);
              totalTime = isSameLap ? `+${utils.formatTime(diff, true)}` : '-1 volta';
            }
            return { position, name, totalTime, laps: raceTime.length - 2 };
          });
      }
    }
  }

  update() {
    this.finishRace();
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
    }
  }

  drawFinishStandings() {
    if (this.isRaceFinished) {
      this.render.drawRoundRect('#08142d98', 32, 64, 576, 224, true, 20, false);

      this.render.drawText('#FFFAF4', 'Classificação Final', 320, 80, 2.5, 'OutriderCond', 'center', 'black', true);
      this.finalPositions.forEach(({ position, name, laps, totalTime }, index) => {
        const alignPos = position < 10 ? `0${position}` : position;
        this.render.drawText('#FFFAF4', `${alignPos}`, 80, `${128 + (index * 24)}`, 1.5, 'OutriderCond', 'left', 'black', true);
        this.render.drawText('#FFFAF4', `${name}`, 144, `${128 + (index * 24)}`, 1.5, 'OutriderCond', 'left', 'black', true);
        this.render.drawText('#FFFAF4', `${totalTime}`, 512, `${128 + (index * 24)}`, 1.5, 'OutriderCond', 'right', 'black', true);
        this.render.drawText('#FFFAF4', `${laps}`, 560, `${128 + (index * 24)}`, 1.5, 'OutriderCond', 'right', 'black', true);
      });
      if (this.shakeMessageY.pos >= 4) this.shakeMessageY.direction = -0.5;
      if (this.shakeMessageY.pos <= -4) this.shakeMessageY.direction = 0.5;
      this.shakeMessageY.pos += (this.shakeMessageY.direction / 2);
      if (window.navigator.maxTouchPoints) {
        this.render.drawText('#FFFAF4', 'Clique OK', 320, 216 + this.shakeMessageY.pos, 2, 'OutriderCond', 'center', 'black', true);
        this.render.drawText('#FFFAF4', 'para continuar', 320, 248 + this.shakeMessageY.pos, 2, 'OutriderCond', 'center', 'black', true);
      } else {
        this.render.drawText('#FFFAF4', 'Aperte ENTER', 320, 216 + this.shakeMessageY.pos, 2, 'OutriderCond', 'center', 'black', true);
        this.render.drawText('#FFFAF4', 'para continuar', 320, 248 + this.shakeMessageY.pos, 2, 'OutriderCond', 'center', 'black', true);
      }
    }
  }

  draw() {
    this.drawFinishStandings();

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

    if (!this.isRaceFinished) {
      this.render.drawText('#050B1A', `Volta ${this.lap} de ${this.raceLaps}`, 4, 44, 0.8, 'Computo', 'left');
      this.hudPositions.forEach(({ pos, name, relTime }, index) => {
        const alignPos = pos < 10 ? `0${pos}` : pos;
        this.render.drawText('#050B1A', `${alignPos}`, 4, `${60 + (index * 16)}`, 0.8, 'Computo', 'left');
        this.render.drawText('#050B1A', `${name} ${relTime}`, 32, `${60 + (index * 16)}`, 0.8, 'Computo', 'left');
      });
      this.render.drawText('#050B1A', `Total: ${utils.formatTime(this.totalTime)}`, 636, 44, 0.8, 'Computo', 'right');
      this.render.drawText('#050B1A', `Lap: ${utils.formatTime(this.animTime)}`, 636, 60, 0.8, 'Computo', 'right');
      this.render.drawText('#050B1A', `Last: ${utils.formatTime(this.lastLap)}`, 636, 76, 0.8, 'Computo', 'right');
      this.render.drawText('#050B1A', `Fast: ${utils.formatTime(this.fastestLap)}`, 636, 92, 0.8, 'Computo', 'right');
    }
  }
}
