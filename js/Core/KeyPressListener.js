class KeyPressListener {
  constructor(keyCode, callback) {
    let keySafe = true;
    this.keyCode = keyCode;
    this.callback = callback;
    this.touchButtons = document.querySelectorAll('.control-buttons');

    this.keydownFunction = (e) => {
      if (e.code === this.keyCode || e.target.name === this.keyCode) {
        if (keySafe) {
          keySafe = false;
          this.callback();
        }
      }
    };

    this.keyupFunction = (e) => {
      if (e.code === this.keyCode || e.target.name === this.keyCode) {
        keySafe = true;
      }
    };
  }

  init() {
    document.addEventListener('keydown', this.keydownFunction);
    document.addEventListener('keyup', this.keyupFunction);
    this.touchButtons.forEach((button) => {
      button.addEventListener('contextmenu', (event) => event.preventDefault());
      button.addEventListener('touchstart', this.keydownFunction);
      button.addEventListener('touchend', this.keyupFunction);
    });
  }

  unbind() {
    document.removeEventListener('keydown', this.keydownFunction);
    document.removeEventListener('keyup', this.keyupFunction);
    this.touchButtons.forEach((button) => {
      button.removeEventListener('contextmenu', (event) => event.preventDefault());
      button.removeEventListener('touchstart', this.keydownFunction);
      button.removeEventListener('touchend', this.keyupFunction);
    });
  }
}

export default KeyPressListener;
