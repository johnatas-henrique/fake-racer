class SceneTransition {
  constructor() {
    this.element = null;
  }

  createElement(animation) {
    this.element = document.createElement('div');
    this.element.classList.add(animation);
  }

  fadeOut() {
    this.element.classList.add('fade-out');
    this.element.addEventListener('animationend', () => {
      this.element.remove();
    }, { once: true });
  }

  init(animation, container, callback) {
    this.createElement(animation);
    container.appendChild(this.element);
    this.element.addEventListener('animationend', () => {
      callback();
    }, { once: true });
  }
}

export default SceneTransition;
