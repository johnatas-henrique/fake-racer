class InputElement {
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
        <p class="InputElement_p">Antes de começar...</p>
        <p class="InputElement_p">Insira seu nome entre 4 a 10 letras e clique em OK!</p>
        <input class="InputElement_input" type='text' placeholder='Seu nome aqui jovem piloto...'>
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
