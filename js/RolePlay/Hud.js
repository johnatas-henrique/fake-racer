class Hud {
  constructor(config) {
    this.map = config.map;
    this.gameObjects = null;
    this.element = null;
    this.container = null;
    this.hpFills = null;
    this.xpFills = null;
  }

  update() {
    const { name, level, gas, maxGas, xp, maxXp, savedMap } = window.playerState;
    this.gameObjects = window.overworldMaps[savedMap].gameObjects;

    this.gasFills = this.element.querySelectorAll('.Hud_gas-container > rect');
    this.xpFills = this.element.querySelectorAll('.Hud_xp-container > rect');
    this.hudName = this.element.querySelector('.Hud_name');
    this.hudLevel = this.element.querySelector('.Hud_level');
    this.hudCharacter = this.element.querySelector('.Hud_character_crop');
    const actualImage = this.hudCharacter.style['background-image'].split('"')[1];
    if (actualImage !== this.gameObjects.hero.sprite.image.src) {
      this.hudCharacter.style = `
      background: url('${this.gameObjects.hero.sprite.image.src}');
      background-size: 4000%;
      background-position: 5.32% 1.5%;
      `;
    }

    this.hudName.innerText = name;
    this.hudLevel.innerText = level;
    this.gasFills.forEach((rect) => {
      rect.style.width = `${(gas / maxGas) * 100}%`;
    });
    this.xpFills.forEach((rect) => {
      rect.style.width = `${(xp / maxXp) * 100}%`;
    });
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('Hud');
    const { name, level } = window.playerState;

    this.element.innerHTML = (`
        <p class="Hud_name">${name}</p>
        <p class="Hud_level">${level}</p>
        <div class="Hud_character_crop" style="
        background: url('${this.gameObjects.hero.sprite.image.src}');
        background-size: 4000%;
        background-position: 5.32% 1.5%;
        ">
        </div>
        <svg viewBox="0 0 26 3" class="Hud_gas-container">
          <rect x=0 y=0 width="0%" height="40%" fill="#82ff71" />
          <rect x=0 y=1 width="0%" height="65%" fill="#3ef126" />
        </svg>
        <svg viewBox="0 0 26 2" class="Hud_xp-container">
          <rect x=0 y=0 width="0%" height="55%" fill="#ffd76a" />
          <rect x=0 y=1 width="0%" height="50%" fill="#ffc934" />
        </svg>
        <p class="Hud_status"></p>
      `);
    this.update();
  }

  recreate() {
    this.element.remove();
    window.playerState.xp = 0;
    this.createElement();
    this.container.appendChild(this.element);
  }

  init(container) {
    this.container = container;
    this.gameObjects = this.map.gameObjects;
    this.createElement();
    this.container.appendChild(this.element);
    document.addEventListener('HudUpdate', () => {
      this.update();
    });
    document.addEventListener('HudRecreate', () => {
      this.recreate();
    });
  }
}
