class KeyPressListener {
  constructor(keyCode, callback) {
    let keySafe = true;
    this.keyCode = keyCode;
    this.callback = callback;

    this.keydownFunction = (e) => {
      if (e.code === this.keyCode) {
        if (keySafe) {
          keySafe = false;
          this.callback();
        }
      }
    };

    this.keyupFunction = (e) => {
      if (e.code === this.keyCode) {
        keySafe = true;
      }
    };

    document.addEventListener('keydown', this.keydownFunction);
    document.addEventListener('keyup', this.keyupFunction);
  }

  unbind() {
    document.removeEventListener('keydown', this.keydownFunction);
    document.removeEventListener('keyup', this.keyupFunction);
  }
}
