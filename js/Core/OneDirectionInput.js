class OneDirectionInput {
  constructor() {
    this.heldDirections = [];
    this.map = {
      arrowup: 'up',
      keyw: 'up',
      arrowdown: 'down',
      keys: 'down',
      arrowleft: 'left',
      keya: 'left',
      arrowright: 'right',
      keyd: 'right',
    };
    this.touchButtons = document.querySelectorAll('.control-buttons');

    this.keyupFunction = (e) => {
      const direction = e.code?.toLowerCase() || e.target.name;
      const dir = this.map[direction];
      const index = this.heldDirections.indexOf(dir);
      if (index > -1) {
        this.heldDirections.splice(index, 1);
      }
    };

    this.keydownFunction = (e) => {
      const direction = e.code?.toLowerCase() || e.target.name;
      const dir = this.map[direction];
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir);
      }
    };
  }

  get direction() {
    return this.heldDirections[0];
  }

  init() {
    document.addEventListener('keydown', this.keydownFunction);
    document.addEventListener('keyup', this.keyupFunction);
    this.touchButtons.forEach((button) => {
      button.addEventListener('contextmenu', (event) => event.preventDefault());
      button.addEventListener('touchstart', (event) => this.keydownFunction(event));
      button.addEventListener('touchend', (event) => this.keyupFunction(event));
    });
  }

  unbind() {
    document.removeEventListener('keydown', this.keydownFunction);
    document.removeEventListener('keyup', this.keyupFunction);
    this.touchButtons.forEach((button) => {
      button.removeEventListener('contextmenu', (event) => event.preventDefault());
      button.removeEventListener('touchstart', this.handler);
      button.removeEventListener('touchend', this.handler);
    });
  }
}

export default OneDirectionInput;
