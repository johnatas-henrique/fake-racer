class Race {
  constructor(config) {
    this.core = config.core;
    this.road = null;
    this.camera = null;
    this.player = null;
    this.director = null;
    this.trackName = window.gameState.menuSelectedOptions.track;
  }

  update() {
    this.camera.update(this.road, this.director);
    this.player.update(this.camera, this.road, this.director, []);
  }

  draw() {
    this.road.draw(this.camera, this.player);
    this.player.draw(this.camera, this.road.width);
  }

  init() {
    if (window.gameState.mode === 'singleRaceScene' && !this.isInitOnce) {
      utils.classRemover('pauseBtn', 'hidden');
      utils.classRemover('muteBtn', 'hidden');
      const okBtn = document.querySelector('.right-controls').firstElementChild;
      okBtn.classList.toggle('hidden');
      this.road = new Road({ race: this });
      this.camera = new Camera({ race: this });
      this.player = new Player({ race: this });
      this.director = new Director({ race: this });

      this.road.init();
      this.player.init();
      this.camera.init();
      this.isInitOnce = true;
    }
  }
}
