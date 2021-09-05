import { formatTime, addItens } from './util.js';

class Director {
  constructor() {
    this.lap = 0;
    this.fastestLap = 0;
    this.lastLap = 0;
    this.timeAtLastLap = 0;
    this.totalTime = 0;
    this.totalLaptimes = [];
    this.laptimes = [];
  }

  update(player) {
    this.totalTime = window.performance.now();

    // HUD
    addItens('#total_lap_time_value', formatTime(this.totalTime));

    const timeOnLastLap = this.totalLaptimes[this.lap - 1] ? this.totalLaptimes[this.lap - 1] : 0;
    addItens('#current_lap_time_value', formatTime(this.totalTime - timeOnLastLap));

    const lastLap = this.laptimes[this.lap - 2] ? this.laptimes[this.lap - 2] : 0;
    addItens('#last_lap_time_value', formatTime(lastLap));

    const fastLap = this.laptimes.length ? Math.min.apply(null, this.laptimes) : 0;
    addItens('#fast_lap_time_value', formatTime(fastLap));

    let speedValue = `${(player.runningPower / 4).toFixed(0)}`;
    if (speedValue < 10) speedValue = `00${speedValue}`;
    if (speedValue >= 10 && speedValue < 100) speedValue = `0${speedValue}`;
    addItens('#speed_value', speedValue);
  }
}

export default Director;
