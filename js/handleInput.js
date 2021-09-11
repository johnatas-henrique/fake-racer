class HandleInput {
  constructor() {
    const buttons = document.querySelectorAll('button');
    window.addEventListener('keydown', (event) => this.handler(event));
    window.addEventListener('keyup', (event) => this.handler(event));
    buttons.forEach((button) => {
      button.addEventListener('contextmenu', (event) => event.preventDefault());
      button.addEventListener('touchstart', (event) => this.handler(event));
      button.addEventListener('touchend', (event) => this.handler(event));
    });
    this.map = {
      arrowup: false, arrowleft: false, arrowright: false, arrowdown: false,
    };
  }

  /**
   *
   * @param {KeyboardEvent} event
   */
  handler(event) {
    if (event.type === 'keyup' || event.type === 'keydown') {
      const key = event.key.toLowerCase();
      this.map[key] = event.type === 'keydown';
    }
    if (event.type === 'touchstart' || event.type === 'touchend') {
      const key = event.target.name;
      this.map[key] = event.type === 'touchstart';
    }
  }

  isKeyDown(key) {
    return Boolean(this.map[key.toLowerCase()]);
  }
}

export default HandleInput;
