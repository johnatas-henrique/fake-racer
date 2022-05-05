class Core {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.render = new Render(this.ctx);
    this.inputs = {
      oneDirection: null,
      multiDirections: null,
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
          const fpsClassList = Array.from(utils.htmlElements.fps().firstElementChild.classList);
          if (fpsClassList.includes('hidden')) {
            utils.htmlElements.fps().firstElementChild.classList.remove('hidden');
          }

          this.menu.drawMenu();
          this.menu.update(this.deltaTime);
        }

        if (window.gameState.mode === 'singleRaceScene') {
          // console.log('raceScene');
          // console.log(this.inputs.oneDirection);
          // console.log(this.inputs.oneDirection);
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
    this.inputs.oneDirection = new DirectionInput();

    this.menu = new Menu({
      animations: window.particles,
      render: this.render,
      core: this,
    });
    this.menu.init();

    this.stats = new Stats();
    utils.htmlElements.fps().appendChild(this.stats.dom);

    utils.htmlElements.fullScreenBtn()
      .addEventListener('click', Core.toggleFullScreen);

    this.startGameLoop();
  }
}
