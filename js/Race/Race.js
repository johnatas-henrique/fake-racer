class Race {
  constructor(config) {
    this.core = config.core;
    this.road = null;
    this.camera = null;
    this.player = null;
    this.director = null;
    this.trackName = null;
    this.opponents = [];
  }

  update() {
    this.camera.update();
    this.player.update();
    this.opponents.forEach((opp) => opp.update());
    this.director.update();
  }

  draw() {
    this.road.draw();
    this.player.draw();
    this.director.draw();
  }

  init() {
    if (window.gameState.mode === 'singleRaceScene' && !this.isInitOnce) {
      this.trackName = window.gameState.menuSelectedOptions.track;

      utils.classRemover('pauseBtn', 'hidden');
      utils.classRemover('muteBtn', 'hidden');
      const okBtn = document.querySelector('.right-controls').firstElementChild;
      okBtn.classList.toggle('hidden');

      this.road = new Road({ race: this });
      this.camera = new Camera({ race: this });
      this.player = new Player({ race: this });
      this.director = new Director({ race: this });
      this.opponents.push(new Opponent({
        race: this,
        startPos: -1,
        opponentName: 'Forte',
        maxSpeed: 1080,
        trackPosition: 1744000,
      }));
      this.opponents.push(new Opponent({
        race: this,
        startPos: 1,
        opponentName: 'Fraco',
        maxSpeed: 1050,
        trackPosition: 1740800,
      }));

      this.road.init();
      this.player.init();
      this.camera.init();
      this.director.init();
      this.opponents.forEach((opp) => opp.init());
      this.isInitOnce = true;
    }
  }
}
