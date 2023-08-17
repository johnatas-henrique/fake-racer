import utils from '../Core/utils.js';
import Race from '../Race/Race.js';

class RaceScene {
  constructor(config) {
    this.map = config.map;
    this.event = config.event;
    this.onComplete = config.onComplete;
    this.raceId = config.event.raceId;
    this.isFinished = false;
    this.hasPlayerWin = false;
    this.historyRace = null;
  }

  init() {
    this.core = this.map.overworld.core;
    const rpgRace = { ...window.races[this.event.raceId].race, raceScene: this };
    utils.changeMode('historyRaceScene', this.core);
    this.historyRace = new Race({
      core: this.core,
      onComplete: this.onComplete,
      eventRPG: this.event,
      rpgRace,
    });

    this.historyRace.init(true);
  }
}

export default RaceScene;
