class Core {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
    // this.canvasMidpoint = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
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
    this.isPaused = false;
  }

  startGameLoop() {
    const frame = (time = 0) => {
      this.timeStamp = time;
      this.deltaTime = (this.timeStamp - this.lastTime);
      this.stats.begin();
      if (this.deltaTime > utils.secondInMS / this.fps) {
        this.render.clear(0, 0, this.canvas.width, this.canvas.height);

        if (window.gameState.mode === 'menuScene') {
          this.menu.update(this.deltaTime);
          this.menu.draw();
        }

        if (window.gameState.mode === 'singleRaceScene') {
          this.singleRace.update();
          this.singleRace.draw();
        }

        if (window.gameState.mode === 'RPGScene') {
          this.overworld.update();
          this.overworld.draw();
        }

        this.stats.end();
        this.lastTime = this.timeStamp;
      }
      if (!this.isPaused) {
        requestAnimationFrame((timeCounter) => frame(timeCounter));
      }
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

  canvasResizer() {
    window.gameState.canvasMidpoint = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
  }

  init() {
    this.inputs.oneDirection = new OneDirectionInput();
    this.inputs.oneDirection.init();
    this.inputs.multiDirection = new MultiDirectionInput();
    this.inputs.multiDirection.init();

    this.stats = new Stats();
    utils.htmlElements.fps().appendChild(this.stats.dom);

    this.menu = new Menu({ animations: window.particles, core: this });
    this.menu.init();

    document.addEventListener('canvasResized', () => this.canvasResizer());

    // for development - to enter race instantly
    this.singleRace = new Race({ core: this });
    this.singleRace.init();

    // for development - to enter history mode instantly
    this.overworld = new Overworld({ core: this, element: document.querySelector('.game-container') });
    this.overworld.init();

    utils.htmlElements.fullScreenBtn()
      .addEventListener('click', Core.toggleFullScreen);

    const [firstMusic] = window.musicList;

    window.gameState.music = firstMusic;

    utils.htmlElements.muteBtn()
      .addEventListener('click', (e) => {
        const { menuSelectedOptions } = window.gameState;
        menuSelectedOptions.isMusicActive = menuSelectedOptions.isMusicActive === 'não' ? 'sim' : 'não';
        if (menuSelectedOptions.isMusicActive === 'sim') {
          e.target.classList.remove('off');
          utils.playMusic(window.gameState.music);
        } else {
          e.target.classList.add('off');
          utils.stopMusic(window.gameState.music);
        }
      });

    this.startGameLoop();
  }
}
