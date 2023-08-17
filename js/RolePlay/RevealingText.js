class RevealingText {
  constructor(config) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 50;

    this.timeout = null;
    this.isDone = false;
  }

  revealOneCharacter(list) {
    const next = list.splice(0, 1)[0];
    next.span.classList.add('revealed');

    if (list.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(list);
      }, next.delayAfter);
    } else {
      this.isDone = true;
    }
  }

  warpToDone() {
    clearTimeout(this.timeout);
    this.isDone = true;
    this.element.querySelectorAll('span').forEach((item) => {
      item.classList.add('revealed');
    });
  }

  init() {
    const characters = [];
    this.text.split('').forEach((character) => {
      const span = document.createElement('span');
      span.textContent = character;
      this.element.appendChild(span);

      characters.push({
        span,
        delayAfter: character === ' ' ? 0 : this.speed,
      });
    });

    this.revealOneCharacter(characters);
  }
}

export default RevealingText;
