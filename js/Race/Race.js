class Race {
  constructor(config) {
    this.core = config.core;
    this.road = null;
    this.camera = null;
    this.player = null;
    this.director = null;
    this.trackName = null;
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
      this.background = new Background({ race: this });
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

      if (this.raining) {
        const rainDrops = Math.random() * 500 + 100;
        this.rain = window.rain(rainDrops);
        utils.htmlElements.canvas().classList.add('filter');
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
