class MultiDirectionInput {
  constructor() {
    this.map = {};
    this.touchButtons = document.querySelectorAll('.control-buttons');
  }

  handler(event) {
    const controller = window.gameState.menuSelectedOptions.controls;
    if (event.type === 'keyup' || event.type === 'keydown') {
      const key = event.key.toLowerCase();
      this.map[key] = event.type === 'keydown';
    }
    if (event.type === 'deviceorientation' && controller === 'acelerômetro') {
      if (event.beta >= 18) {
        this.map.arrowright = event.beta / 90;
        this.map.arrowleft = false;
      } else if (event.beta <= -18) {
        this.map.arrowright = false;
        this.map.arrowleft = event.beta / 90;
      } else {
        this.map.arrowright = false;
        this.map.arrowleft = false;
      }
    }
    if ((event.type === 'touchstart' || event.type === 'touchend') && controller !== 'teclado') {
      const key = event.target.name;
      this.map[key] = event.type === 'touchstart';
    }
  }

  isKeyDown(key) {
    return Boolean(this.map[key.toLowerCase()]);
  }

  init() {
    window.addEventListener('keydown', (event) => this.handler(event));
    window.addEventListener('keyup', (event) => this.handler(event));
    window.addEventListener('deviceorientation', (event) => this.handler(event), true);
    this.touchButtons.forEach((button) => {
      button.addEventListener('contextmenu', (event) => event.preventDefault());
      button.addEventListener('touchstart', (event) => this.handler(event));
      button.addEventListener('touchend', (event) => this.handler(event));
    });
    // if (typeof DeviceMotionEvent.requestPermission === 'function') {
    //   // Handle iOS 13+ devices.
    //   DeviceMotionEvent.requestPermission()
    //     .then((state) => {
    //       if (state === 'granted') {
    //         window.addEventListener('devicemotion', (event) => this.handler(event), true);
    //       } else {
    //         console.error('Request to access the orientation was rejected');
    //       }
    //     })
    //     .catch(console.error);
    // } else {
    //   // Handle regular non iOS 13+ devices.
    //   window.addEventListener('devicemotion', (event) => this.handler(event), true);
    // }
  }

  unbind() {
    window.removeEventListener('keydown', (event) => this.handler(event));
    window.removeEventListener('keyup', (event) => this.handler(event));
    window.removeEventListener('deviceorientation', (event) => this.handler(event), true);
    this.touchButtons.forEach((button) => {
      button.removeEventListener('contextmenu', (event) => event.preventDefault());
      button.removeEventListener('touchstart', (event) => this.handler(event));
      button.removeEventListener('touchend', (event) => this.handler(event));
    });
  }
}

export default MultiDirectionInput;
