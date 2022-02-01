import { canvas } from './util.js';

class HandleInput {
  constructor() {
    const fullScreenBtn = document.getElementById('fullScreenBtn');
    fullScreenBtn.addEventListener('click', (event) => HandleInput.toggleFullScreen(event));
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

  /**
   *
   * @param {KeyboardEvent} event
   */
  handler(event) {
    if (event.type === 'keypress') {
      const key = event.key.toLowerCase();
      if (!event.repeat) {
        this.mapPress[key] = !this.mapPress[key];
      }
    } else if (event.type === 'keyup' || event.type === 'keydown') {
      const key = event.key.toLowerCase();
      this.map[key] = event.type === 'keydown';
    }
    if (event.type === 'touchstart' || event.type === 'touchend') {
      const key = event.target.name;
      console.log(key);
      this.map[key] = event.type === 'touchstart';
    }
  }

  isKeyDown(key) {
    return Boolean(this.map[key.toLowerCase()]);
  }

  static toggleFullScreen() {
    console.log(document.fullscreenElement);
    if (!document.fullscreenElement) {
      canvas.requestFullscreen().catch((err) => {
        alert(`Error, can't enable full-screen ${err.message}`);
      });
    } else {
      document.exitFullScreen();
    }
  }
}

export default HandleInput;
