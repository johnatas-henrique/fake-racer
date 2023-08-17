import KeyPressListener from '../Core/KeyPressListener.js';
import RevealingText from './RevealingText.js';

class TextMessage {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.who = config.who || null;
    this.text = config.text;
    this.onComplete = config.onComplete;
    this.element = null;
  }

  createElement() {
    this.element = document.createElement('div');

    if (this.who) {
      const objName = this.gameObjects[this.who].id.split('_')[0];
      const personName = objName === 'hero' ? window.playerState.name : objName;
      this.element.classList.add('TextMessage');
      this.element.innerHTML = (`
      <div class='person-face_container'> 
        <div class='person-face_div' style="
          background: url('${this.gameObjects[this.who].sprite.image.src}');
          background-size: 4000%;
          background-position: 5.5% 1.25%;
          "> 
        </div>
        <p class='person-face_p'>${personName}</p>
      </div>
      <p class='TextMessage_p'></p>
      <button class='TextMessage_button'>Next</button>
    `);
    } else {
      this.element.classList.add('TextMessage');
      this.element.innerHTML = (`
        <p class='TextMessage_p'></p>
        <button class='TextMessage_button'>Next</button>
      `);
    }

    this.revealingText = new RevealingText({
      element: this.element.querySelector('.TextMessage_p'),
      text: this.text,
    });

    this.element.querySelector('button').addEventListener('click', () => this.done());

    this.actionListener = new KeyPressListener('Enter', () => {
      this.done();
    });
    this.actionListener.init();
  }

  done() {
    if (this.revealingText.isDone) {
      this.element.remove();
      this.actionListener.unbind();
      window.sfx.talking.stop();
      this.onComplete();
    } else {
      window.sfx.talking.stop();
      this.revealingText.warpToDone();
    }
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
    this.revealingText.init();
  }
}

export default TextMessage;
