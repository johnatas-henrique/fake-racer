class HandleInput {
  constructor() {
    window.addEventListener('keydown', (event) => this.handler(event));
    window.addEventListener('keyup', (event) => this.handler(event));
    this.map = {
      arrowup: false, arrowleft: false, arrowright: false, arrowdown: false,
    };
  }

  /**
   *
   * @param {KeyboardEvent} event
   */
  handler(event) {
    const key = event.key.toLowerCase();
    this.map[key] = event.type === 'keydown';
  }

  isKeyDown(key) {
    return Boolean(this.map[key.toLowerCase()]);
  }
}

export default HandleInput;
