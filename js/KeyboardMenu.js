class KeyboardMenu {
  constructor() {
    this.options = [];
    this.up = null;
    this.down = null;
    this.prevFocus = null;
  }

  setOptions(options) {
    this.options = options;
    this.element.innerHTML = this.options.map((option, index) => {
      const disabledAttr = option.disabled ? 'disabled' : '';
      return (`
      <div class='option'>
        <button 
          ${disabledAttr} 
          data-button='${index}' 
          data-description='${option.description}'
        >
          ${option.label}
        </button>
        <span class='right'>${option.right ? option.right() : ''}</span>
      </div>
      `);
    }).join('');

    this.element.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        const chosenOption = this.options[button.dataset.button];
        chosenOption.handler();
      });

      button.addEventListener('mouseenter', () => {
        button.focus();
      });

      button.addEventListener('focus', () => {
        this.prevFocus = button;
        this.descriptionElementText.innerText = button.dataset.description;
      });
    });

    setTimeout(() => {
      this.element.querySelector('button[data-button]:not([disabled])').focus();
    }, 10);
  }

  createElement(menuType) {
    this.element = document.createElement('div');
    this.element.className = `${menuType} keyboard-menu`;

    // Description box
    this.descriptionElement = document.createElement('div');
    this.descriptionElement.classList.add('description-box');
    this.descriptionElement.innerHTML = ('<p>Descrição das opções...</p>');
    this.descriptionElementText = this.descriptionElement.querySelector('p');
  }

  end() {
    this.element.remove();
    this.descriptionElement.remove();

    this.up.unbind();
    this.down.unbind();
  }

  init(container, menuType) {
    this.createElement(menuType);
    container.appendChild(this.element);
    container.appendChild(this.descriptionElement);

    this.up = new KeyPressListener('ArrowUp', () => {
      const current = Number(this.prevFocus.getAttribute('data-button'));
      const prevButton = Array
        .from(this.element.querySelectorAll('button[data-button]'))
        .reverse()
        .find((item) => item.dataset.button < current && !item.disabled);

      prevButton?.focus();
    });
    this.down = new KeyPressListener('ArrowDown', () => {
      const current = Number(this.prevFocus.getAttribute('data-button'));
      const nextButton = Array
        .from(this.element.querySelectorAll('button[data-button]'))
        .find((item) => item.dataset.button > current && !item.disabled);

      nextButton?.focus();
    });

    this.up.init();
    this.down.init();
  }
}
