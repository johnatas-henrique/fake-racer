class Core {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.render = new Render(this.ctx);
    this.inputs = {
      oneDirection: null,
      multiDirection: null,
      keyPressListeners: [],
    };
    this.menu = null;
    this.stats = null;
    this.fps = 61;
    this.deltaTime = 0;
    this.timeStamp = 0;
    this.lastTime = 0;
  }

  startGameLoop() {
    const frame = (time = 0) => {
      this.timeStamp = time;
      this.deltaTime = (this.timeStamp - this.lastTime);
      this.stats.begin();
      if (this.deltaTime > utils.secondInMS / this.fps) {
        this.render.clear(0, 0, this.canvas.width, this.canvas.height);

        if (window.gameState.mode === 'menuScene') {
          this.menu.init();
          this.menu.update(this.deltaTime);
          this.menu.draw();
        }

        if (window.gameState.mode === 'singleRaceScene') {
          this.singleRace.init();
          this.singleRace.update();
          this.singleRace.draw();
        }

        this.stats.end();
        this.lastTime = this.timeStamp;
      }

      requestAnimationFrame((timeCounter) => frame(timeCounter));
    };
    frame();
  }

  static toggleFullScreen() {
    if (!document.fullscreenElement) {
      utils.htmlElements.gameContainer().requestFullscreen().catch((err) => {
        alert(`Error, can't enable full-screen ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  init() {
    this.inputs.oneDirection = new OneDirectionInput();
    this.inputs.multiDirection = new MultiDirectionInput();

    this.stats = new Stats();
    utils.htmlElements.fps().appendChild(this.stats.dom);

    this.menu = new Menu({ animations: window.particles, core: this });

    this.singleRace = new Race({ core: this });

    utils.htmlElements.fullScreenBtn()
      .addEventListener('click', Core.toggleFullScreen);

    this.startGameLoop();
  }
}