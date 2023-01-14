import rain from '../Animations/Rain.js';
import utils from '../Core/utils.js';
import Background from './Background.js';
import Camera from './Camera.js';
import Director from './Director.js';
import Opponent from './Opponent.js';
import Player from './Player.js';
import Road from './Road.js';
import Tachometer from './Tachometer.js';

class Race {
  constructor(config) {
    this.core = config.core;
    this.onComplete = config.onComplete || null;
    this.trackName = config.rpgRace?.trackName || window.gameState.menuSelectedOptions.track;
    this.oppNumber = config.rpgRace?.oppNumber || window.gameState.menuSelectedOptions.opponents;
    this.startTimer = config.rpgRace?.startTimer ?? null;
    this.raceLaps = config.rpgRace?.raceLaps ?? null;
    this.difficulty = config.rpgRace?.difficulty || window.gameState.menuSelectedOptions.difficulty;
    this.raceScene = config.rpgRace?.raceScene || null;
    this.winCondition = config.rpgRace?.winCondition || null;
    this.eventRPG = config.eventRPG;
    this.road = null;
    this.camera = null;
    this.player = null;
    this.director = null;
    this.tachometer = null;
    this.opponents = [];
    this.raining = Math.round(Math.random() * 5) % 3 === 0;
  }

  update() {
    this.background.update();
    this.camera.update();
    this.opponents.forEach((opp) => opp.update());
    this.player.update();
    this.director.update();
    this.tachometer.update();

    if (this.raining) this.rain.forEach((item) => item.update());
  }

  draw() {
    this.background.draw();
    this.road.draw();
    this.player.draw();
    if (this.raining) this.rain.forEach((item) => item.draw(this.core.render, this.player));
    this.director.draw();
    this.tachometer.draw();
  }

  adjustDifficulty() {
    if (typeof this.difficulty === 'number') return this.difficulty;
    if (this.difficulty === 'novato') return 0.87;
    if (this.difficulty === 'corredor') return 0.935;
    return 1;
  }

  init() {
    const { mode } = window.gameState;
    if (mode === 'singleRaceScene' || mode === 'historyRaceScene') {
      utils.resolutionChanger(this.core);
      utils.classRemover('pauseBtn', 'hidden');
      utils.classRemover('muteBtn', 'hidden');
      const okBtn = document.querySelector('.right-controls').firstElementChild;
      okBtn.classList.toggle('hidden');

      this.road = new Road({ race: this });
      this.camera = new Camera({ race: this });
      this.player = new Player({ race: this });
      this.director = new Director({ race: this });
      this.background = new Background({ race: this });
      this.tachometer = new Tachometer({ race: this });

      const { trackSize } = window.tracks.f1Y91[this.trackName];

      window.drivers.f1Y91.forEach((driver) => {
        this.opponents.push(new Opponent({
          race: this,
          maxSpeed: driver.power * this.adjustDifficulty(),
          trackPosition: utils.startPosition(trackSize, driver.position),
          startPos: driver.trackSide,
          opponentName: driver.name,
          carColor: driver.carColor,
        }));
      });

      // setting number of opponents
      this.opponents.length = this.oppNumber;

      if (this.raining) {
        const rainDrops = Math.random() * 1000 + 100;
        this.rain = rain(rainDrops, this);
        utils.htmlElements.gameCanvas().classList.add('filter');
      }

      this.road.init();
      this.player.init();
      this.camera.init();
      this.director.init();
      this.background.init();
      this.tachometer.init();
      this.opponents.forEach((opp) => opp.init());

      this.isInitOnce = true;
    }
  }
}

export default Race;
