class Race {
  constructor(config) {
    this.core = config.core;
    this.road = null;
    this.camera = null;
    this.player = null;
    this.director = null;
    this.trackName = null;
    this.difficulty = null;
    this.opponents = [];
    this.raining = Math.round(Math.random() * 5) % 3 === 0;
  }

  update() {
    this.background.update();
    this.camera.update();
    this.opponents.forEach((opp) => opp.update());
    this.player.update();
    this.director.update();

    if (this.raining) this.rain.forEach((item) => item.update());
  }

  draw() {
    this.background.draw();
    this.road.draw();
    this.player.draw();
    if (this.raining) this.rain.forEach((item) => item.draw(this.core.render, this.player));
    this.director.draw();

    // for development only
    // utils.addItens('#line1', `Segment: ${(this.camera.cursor / 200).toFixed(3)}`);
  }

  adjustDifficulty() {
    if (this.difficulty === 'novato') return 0.87;
    if (this.difficulty === 'corredor') return 0.935;
    return 1;
  }

  init() {
    if (window.gameState.mode === 'singleRaceScene' && !this.isInitOnce) {
      this.trackName = window.gameState.menuSelectedOptions.track;
      this.difficulty = window.gameState.menuSelectedOptions.difficulty;

      utils.classRemover('pauseBtn', 'hidden');
      utils.classRemover('muteBtn', 'hidden');
      const okBtn = document.querySelector('.right-controls').firstElementChild;
      okBtn.classList.toggle('hidden');

      this.road = new Road({ race: this });
      this.camera = new Camera({ race: this });
      this.player = new Player({ race: this });
      this.director = new Director({ race: this });
      this.background = new Background({ race: this });

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
      this.opponents.length = window.gameState.menuSelectedOptions.opponents;

      if (this.raining) {
        const rainDrops = Math.random() * 500 + 100;
        this.rain = window.rain(rainDrops);
        utils.htmlElements.gameCanvas().classList.add('filter');
      }

      this.road.init();
      this.player.init();
      this.camera.init();
      this.director.init();
      this.background.init();
      this.opponents.forEach((opp) => opp.init());

      this.isInitOnce = true;
    }
  }
}
