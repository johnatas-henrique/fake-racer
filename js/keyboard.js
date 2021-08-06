class Keyboard {
  constructor() {
    window.addEventListener('keydown', (event) => this.handler(event));
    window.addEventListener('keyup', (event) => this.handler(event));
    this.map = {};
  }

  /**
   *
   * @param {KeyboardEvent} event
   */
  handler(event) {
    const key = event.key.toLowerCase();
    console.log('key', key);
    console.table('map', this.map);
    this.map[key] = event.type === 'keydown';
  }

  isKeyDown(key) {
    return Boolean(this.map[key]);
  }
}
