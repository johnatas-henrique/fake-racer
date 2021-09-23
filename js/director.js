import { formatTime, addItens } from './util.js';

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
  }

  refreshPositions(player, opponents) {
    const arr = [];
    arr.push({ name: player.name, pos: player.trackPosition });
    opponents.forEach((opp) => arr.push({ name: opp.opponentName, pos: opp.trackPosition }));
    arr.sort((a, b) => b.pos - a.pos);
    this.positions = arr;
  }

  update(player, opponent) {
    this.totalTime += (1 / 60) * 1000;
    this.animTime += (1 / 60) * 1000;
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
  }
}

export default Director;
