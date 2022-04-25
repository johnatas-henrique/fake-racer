class TextMessage {
  constructor(config) {
    this.text = config.text;
    this.onComplete = config.onComplete;
    this.element = null;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('TextMessage');

    this.element.innerHTML = (`
      <p class='TextMessage_p'>${this.text}</p>
      <button class='TextMessage_button'>Next</button>
    `);

    this.element.querySelector('button').addEventListener('click', () => this.done());

    this.actionListener = new KeyPressListener({
      keyCode: 'Enter',
      callback: () => {
        this.actionListener.unbind();
        this.done();
      },
    });
  };

  done() {
    this.element.remove();
    this.onComplete();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  };
};
