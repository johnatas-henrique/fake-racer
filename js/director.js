import {
  handleInput, formatTime, addItens, resource, tracks,
} from './util.js';
import Sprite from './sprite.js';

class Director {
  constructor() {
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
    this.startLights = new Sprite();
    this.paused = false;
  }

  create(road) {
    handleInput.mapPress.p = true;

    const segmentLineFirst = road.getSegmentFromIndex(0);
    const segmentLineTen = road.getSegmentFromIndex(tracks[road.trackName].trackSize - 160);
    this.startLights.offsetX = 0;
    this.startLights.offsetY = 2;
    this.startLights.scaleX = 27;
    this.startLights.scaleY = 27;
    this.startLights.spritesInX = 6;
    this.startLights.sheetPositionX = Math.ceil(this.animTime / 500);
    this.startLights.image = resource.get('startLights');
    segmentLineFirst.sprites.push(this.startLights);
    segmentLineTen.sprites.push(this.startLights);

    const startLineLeft = new Sprite();
    startLineLeft.offsetX = -1.14;
    startLineLeft.scaleX = 216;
    startLineLeft.scaleY = 708;
    startLineLeft.image = resource.get('startLightsBar');

    const startLineRight = new Sprite();
    startLineRight.offsetX = 1.14;
    startLineRight.scaleX = 216;
    startLineRight.scaleY = 708;
    startLineRight.image = resource.get('startLightsBar');

    segmentLineFirst.sprites.push(startLineLeft);
    segmentLineFirst.sprites.push(startLineRight);
    segmentLineTen.sprites.push(startLineLeft);
    segmentLineTen.sprites.push(startLineRight);
  }

  refreshPositions(player, opponents) {
    const arr = [];
    arr.push({ name: player.name, pos: player.trackPosition });
    opponents.forEach((opp) => arr.push({ name: opp.opponentName, pos: opp.trackPosition }));
    arr.sort((a, b) => b.pos - a.pos);
    this.positions = arr;
  }

  update(player, opponent) {
    const startTimer = 5000;
    this.paused = handleInput.mapPress.p;

    if (this.totalTime < startTimer || !this.paused) this.running = false;
    else if (this.totalTime >= startTimer && this.paused) this.running = true;

    this.totalTime += (1 / 60) * 1000 * this.paused;
    this.animTime += (1 / 60) * 1000 * this.paused;
    this.lastLap = this.laptimes[this.lap - 2] ? this.laptimes[this.lap - 2] : 0;
    this.fastestLap = this.laptimes.length ? Math.min.apply(null, this.laptimes) : 0;

    this.position = (this.positions.findIndex((elem) => elem.name === player.name) + 1).toString();
    if (this.position < 10) this.position = `0${this.position}`;
    let numberOfCars = this.positions.length;
    if (numberOfCars < 10) numberOfCars = `0${numberOfCars}`;

    // HUD
    let speedValue = `${(player.runningPower / 4).toFixed(0)}`;
    if (speedValue < 10) speedValue = `00${speedValue}`;
    if (speedValue >= 10 && speedValue < 100) speedValue = `0${speedValue}`;
    addItens('#speed_value', speedValue);
    addItens('#total_lap_time_value', formatTime(this.totalTime));
    addItens('#current_lap_time_value', formatTime(this.animTime));
    addItens('#last_lap_time_value', formatTime(this.lastLap));
    addItens('#fast_lap_time_value', formatTime(this.fastestLap));
    addItens('#position_value', `${this.position} / ${numberOfCars}`);

    this.refreshPositions(player, opponent);
    if (this.animTime > startTimer) this.startLights.sheetPositionX = 0;
    else if (this.animTime > 2000 + 2500) this.startLights.sheetPositionX = 5;
    else if (this.animTime > 2000 + 2000) this.startLights.sheetPositionX = 4;
    else if (this.animTime > 2000 + 1500) this.startLights.sheetPositionX = 3;
    else if (this.animTime > 2000 + 1000) this.startLights.sheetPositionX = 2;
    else if (this.animTime > 2000 + 500) this.startLights.sheetPositionX = 1;
  }

  render(render) {
    if (!this.paused) {
      render.drawText('#050B1A', 'Jogo pausado!', 320, 100 - 45,
        2, 'OutriderCond', 'center');
    }
    if (!this.paused) {
      render.drawText('#050B1A', 'Aperte "P" para continuar', 320, 140 - 45,
        2, 'OutriderCond', 'center');
    }
    if (this.totalTime < 2500) {
      render.drawText('#FFFAF4', 'Prepare-se...', 320, 180 - 45,
        2, 'OutriderCond', 'center', 'black', true);
    }
  }
}

export default Director;
