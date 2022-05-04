class HandleInput {
  constructor() {
    const fullScreenBtn = document.getElementById('fullScreenBtn');
    fullScreenBtn.addEventListener('click', (event) => HandleInput.toggleFullScreen(event));
    const pauseButton = document.querySelector('#pauseBtn');
    pauseButton.addEventListener('click', (event) => this.pause(event));
    const moveButtons = document.querySelectorAll('button');
    window.addEventListener('keydown', (event) => this.handler(event));
    window.addEventListener('keyup', (event) => this.handler(event));
    window.addEventListener('keypress', (event) => this.handler(event));
    moveButtons.forEach((button) => {
      if (button.name !== 'fullscreenbtn') {
        button.addEventListener('contextmenu', (event) => event.preventDefault());
        button.addEventListener('touchstart', (event) => this.handler(event));
        button.addEventListener('touchend', (event) => this.handler(event));
      }
    });

    this.map = {};
    this.mapPress = { p: true, enter: false };
  }

  pause(e) {
    const pauseBtn = document.querySelector('#pauseBtn');
    pauseBtn.classList.toggle('off');
    if (!window.navigator.maxTouchPoints && e.type !== 'keypress') {
      this.mapPress.p = !this.mapPress.p;
    }
  }

  /**
   *
   * @param {KeyboardEvent} event
   */
  handler(event) {
    if (event.type === 'keypress') {
      const key = event.key.toLowerCase();
      if (!event.repeat) {
        this.mapPress[key] = !this.mapPress[key];
        if (event.key === 'p') {
          this.pause(event);
        }
      }
    } else if (event.type === 'keyup' || event.type === 'keydown') {
      const key = event.key.toLowerCase();
      this.map[key] = event.type === 'keydown';
    }
    if ((event.target.name !== 'p') && (event.type === 'touchstart' || event.type === 'touchend')) {
      const key = event.target.name;
      this.map[key] = event.type === 'touchstart';
      this.mapPress[key] = event.type === 'touchend';
    }
    if (event.target.name === 'p' && event.type === 'touchend') {
      this.mapPress.p = !this.mapPress.p;
    }
  }

  isKeyDown(key) {
    return Boolean(this.map[key.toLowerCase()]);
  }

  static toggleFullScreen() {
    const gameContainer = document.querySelector('.container');
    if (!document.fullscreenElement) {
      gameContainer.requestFullscreen().catch((err) => {
        alert(`Error, can't enable full-screen ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
}

export default HandleInput;
