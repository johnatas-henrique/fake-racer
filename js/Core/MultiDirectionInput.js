class MultiDirectionInput {
  constructor() {
    this.map = {};
  }

  handler(event) {
    if (event.type === 'keyup' || event.type === 'keydown') {
      const key = event.key.toLowerCase();
      this.map[key] = event.type === 'keydown';
    }
  }

  isKeyDown(key) {
    return Boolean(this.map[key.toLowerCase()]);
  }

  init() {
    window.addEventListener('keydown', (event) => this.handler(event));
    window.addEventListener('keyup', (event) => this.handler(event));
  }

  unbind() {
    window.addEventListener('keydown', (event) => this.handler(event));
    window.addEventListener('keyup', (event) => this.handler(event));
  }
}

export default MultiDirectionInput;
