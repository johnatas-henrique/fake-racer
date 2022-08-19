class InventoryScreen {
  constructor(config) {
    this.onComplete = config.onComplete;
    this.event = config.event;
    this.element = null;
    this.actionListener = null;
  }

  changeName = () => {
    const input = this.element.querySelector('input');
    if (input.value.length <= 10 && input.value.length > 3) {
      window.playerState.name = input.value;
      utils.emitEvent('HudUpdate');

      this.element.remove();
      this.actionListener.unbind();
      if (this.onComplete) {
        this.onComplete();
      }
    }
  };

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('InputElement');
    this.element.innerHTML = (`
        <p class="InputElement_p">Inventário</p>
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button class='InputElement_button'>Ok</button>
      `);

    const input = this.element.querySelector('input');
    const btn = this.element.querySelector('button');
    btn.addEventListener('click', this.changeName);

    this.actionListener = new KeyPressListener('Enter', () => {
      this.changeName();
    });
    this.actionListener.init();

    setTimeout(() => {
      input.focus();
    }, 100);
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}
