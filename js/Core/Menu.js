class Menu {
  constructor(config) {
    this.core = config.core;
    this.animations = config.animations;
    this.menuArrowKeys = new Image();
    this.menuArrowKeys.src = '../images/sprites/other/arrowKeys.png';
    this.menuEnterKey = new Image();
    this.menuEnterKey.src = '../images/sprites/other/enterKey.png';
    this.keyPressListeners = [];
    this.isConfirmButtonPressed = false;
    this.showMenu = 0;
    this.menuY = 0;
    this.menuX = 6;
    this.fps = 8;
    this.deltaTime = 0;
    this.arrowUpBlink = false;
    this.arrowDownBlink = false;
    this.menuTitle = { pos: 0, direction: 1 };
    this.menuPhrase = {
      track: 'Circuito: ',
      opponents: 'Oponentes: ',
      difficulty: 'Dificuldade: ',
      isMusicActive: 'Música: ',
      musicVolume: 'Volume da música: ',
      isSingleRaceOn: 'Corrida ',
      isRPGOn: 'Modo ',
    };
    this.menu = {
      track: Object.keys(window.tracks.f1Y91),
      opponents: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19'],
      difficulty: ['novato', 'corredor', 'campeão'],
      isMusicActive: ['não', 'sim'],
      musicVolume: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      isSingleRaceOn: ['única'],
      isRPGOn: ['história'],
    };
    this.menuOptions = {
      0: 'track',
      1: 'opponents',
      2: 'difficulty',
      3: 'isMusicActive',
      4: 'musicVolume',
      5: 'isSingleRaceOn',
      6: 'isRPGOn',
    };
  }

  directionPressed() {
    if (!this.core.inputs.oneDirection.heldDirections.length) return null;
    return this.core.inputs.oneDirection.heldDirections[0];
  }

  acceptOption() {
    this.isConfirmButtonPressed = true;
  }

  init() {
    if (window.gameState.mode === 'menuScene' && !this.isInitOnce) {
      utils.resolutionChanger(this.core);
      utils.classToggler('pauseBtn', 'hidden');
      utils.classToggler('muteBtn', 'hidden');

      this.core.inputs.keyPressListeners.push(
        new KeyPressListener('Enter', () => this.acceptOption()),
      );
      utils.keyInitializer('Enter', this.core);
      this.core.inputs.oneDirection.init();
      this.isInitOnce = true;
    }
  }

  enterSingleRaceScene() {
    utils.keyUnbinder('Enter', this.core);
    utils.modeChanger('singleRaceScene');
    this.core.singleRace = new Race({ core: this.core });
    this.core.singleRace.init();
  }

  enterRPGScene() {
    utils.keyUnbinder('Enter', this.core);
    utils.modeChanger('RPGScene');
  }

  static musicControl() {
    if (window.gameState.menuSelectedOptions.isMusicActive === 'sim') {
      utils.playMusic(window.gameState.music);
    } else {
      utils.stopMusic(window.gameState.music);
    }
  }

  update(deltaTime) {
    const { menuSelectedOptions } = window.gameState;

    Menu.musicControl();

    this.deltaTime += deltaTime;
    const maxX = Object.keys(this.menu).length - 1;
    const maxY = this.menu[this.menuOptions[this.menuX]].length - 1;

    if (this.isConfirmButtonPressed) {
      window.sfx.confirm.play();
    }

    if (this.isConfirmButtonPressed && !this.showMenu) {
      menuSelectedOptions.isMusicActive = 'sim';
      utils.htmlElements.muteBtn().classList.remove('off');
      this.showMenu = 1;
      this.menuTitle.pos = 0;
      this.isConfirmButtonPressed = false;
    }

    if (this.showMenu && this.deltaTime > utils.secondInMS / this.fps) {
      this.deltaTime = 0;

      if (this.directionPressed() !== 'down') this.arrowDownBlink = false;
      if (this.directionPressed() !== 'up') this.arrowUpBlink = false;

      if (this.directionPressed() === 'down' || this.directionPressed() === 'up') {
        window.sfx.menuUpDown.play();
      }

      if (this.menuX < maxX && this.directionPressed() === 'down') {
        this.arrowDownBlink = !this.arrowDownBlink;
        this.menuX += 1;
        this.menuY = this.menu[this.menuOptions[this.menuX]]
          .findIndex((item) => item === menuSelectedOptions[this.menuOptions[this.menuX]]);
      } else if (this.menuX === maxX && this.directionPressed() === 'down') {
        this.arrowDownBlink = 1;
        this.menuX = 0;
        this.menuY = this.menu[this.menuOptions[this.menuX]]
          .findIndex((item) => item === menuSelectedOptions[this.menuOptions[this.menuX]]);
      }

      if (this.menuX > 0 && this.directionPressed() === 'up') {
        this.arrowUpBlink = !this.arrowUpBlink;
        this.menuX -= 1;
        this.menuY = this.menu[this.menuOptions[this.menuX]]
          .findIndex((item) => item === menuSelectedOptions[this.menuOptions[this.menuX]]);
      } else if (this.menuX === 0 && this.directionPressed() === 'up') {
        this.arrowUpBlink = 1;
        this.menuX = maxX;
        this.menuY = this.menu[this.menuOptions[this.menuX]]
          .findIndex((item) => item === menuSelectedOptions[this.menuOptions[this.menuX]]);
      }

      if (this.menuY < maxY && this.directionPressed() === 'right') this.menuY += 1;
      else if (this.menuY === maxY && this.directionPressed() === 'right') this.menuY = 0;

      if (this.menuY > 0 && this.directionPressed() === 'left') this.menuY -= 1;
      else if (this.menuY === 0 && this.directionPressed() === 'left') this.menuY = maxY;

      const inconfirmableOptions = Object.keys(this.menu).length - 2;

      if (this.isConfirmButtonPressed && this.menuX === 5) {
        this.isConfirmButtonPressed = false;
        this.enterSingleRaceScene();
      }

      if (this.isConfirmButtonPressed && this.menuX === 6) {
        this.isConfirmButtonPressed = false;
        this.enterRPGScene();
      }

      if (this.menuX < inconfirmableOptions) {
        const changeOption = this.menu[this.menuOptions[this.menuX]][this.menuY];
        menuSelectedOptions[this.menuOptions[this.menuX]] = changeOption;
        this.isConfirmButtonPressed = false;
      }
    }
  }

  drawButtons(x, y, size, text) {
    this.core.render.drawCircle(x, y + 3, size, 0, Math.PI * 2);
    this.core.render.drawText('black', text, x, y, 1.3, 'OutriderCond', 'center');
  }

  draw() {
    this.core.render.drawRect('#FAF6F2', 0, 0, this.core.canvas.width, this.core.canvas.height);
    this.animations.forEach((item) => {
      item.update();
      item.draw(this.core.render);
    });
    this.core.render.drawText('#EB4844', 'Fake Racer', 320, 30, 4, 'OutriderCondBold');

    if (!this.showMenu) {
      if (this.menuTitle.pos >= 12) this.menuTitle.direction = -1;
      if (this.menuTitle.pos <= -12) this.menuTitle.direction = 1;
      this.menuTitle.pos += (this.menuTitle.direction / 2);
      if (window.navigator.maxTouchPoints) {
        this.core.render.drawText('black', 'Aperte OK para iniciar', 320, 180 + this.menuTitle.pos);
      } else {
        this.core.render.drawText('black', 'Aperte ENTER para iniciar', 320, 180 + this.menuTitle.pos);
      }
    }

    if (this.showMenu) {
      if (this.menuTitle.pos >= 4) this.menuTitle.direction = -1;
      if (this.menuTitle.pos <= -4) this.menuTitle.direction = 1;
      this.menuTitle.pos += (this.menuTitle.direction / 2);
      const maxX = Object.keys(this.menu).length - 1;
      const menuLow = this.menuX - 1 >= 0 ? this.menuX - 1 : maxX;
      const menuHigh = this.menuX + 1 <= maxX ? this.menuX + 1 : 0;
      const lowText = `${this.menuPhrase[this.menuOptions[menuLow]]} ${window.gameState.menuSelectedOptions[this.menuOptions[menuLow]].toLocaleUpperCase()}`;
      const highText = `${this.menuPhrase[this.menuOptions[menuHigh]]} ${window.gameState.menuSelectedOptions[this.menuOptions[menuHigh]].toLocaleUpperCase()}`;

      this.core.render.drawRoundRect('#2C69EB', 100, 100, 440, 170, true, 20, false);
      this.core.render.drawText('#FFFAF4', lowText, 320, 180 - 45, 1.6);

      const phrase = `${this.menuPhrase[this.menuOptions[this.menuX]]} ${this.menu[this.menuOptions[this.menuX]][this.menuY].toLocaleUpperCase()}`;
      this.core.render.drawText('#050B1A', phrase, 320, 180 + (this.menuTitle.pos / 4), 1.6);
      this.core.render.drawText('#FFFAF4', highText, 320, 180 + 45, 1.6);

      if (window.navigator.maxTouchPoints) {
        this.drawButtons(145, 310, 15, 'U');
        this.drawButtons(185, 310, 15, 'D');
        this.drawButtons(225, 310, 15, 'L');
        this.drawButtons(265, 310, 15, 'R');
        this.core.render.drawText('black', 'Navegar', 150, 345, 1.3, 'OutriderCond', 'left');
        this.drawButtons(418, 310, 18, 'OK');
        this.core.render.drawText('black', 'Confirmar', 490, 345, 1.3, 'OutriderCond', 'right');
      } else {
        this.core.render.drawText('black', 'Navegar', 590, 320, 1.3, 'OutriderCond', 'right');
        this.core.render.ctx.drawImage(this.menuArrowKeys, 595, 310, 28, 18);

        this.core.render.drawText('black', 'Confirmar', 590, 345, 1.3, 'OutriderCond', 'right');
        this.core.render.ctx.drawImage(this.menuEnterKey, 597, 335, 23, 18);
      }

      if (this.arrowUpBlink) {
        this.core.render.drawText('#050B1A', 'c', 520, 140, 2, 'Arrows');
      } else {
        this.core.render.drawText('#FFFAF4', 'c', 520, 140, 2, 'Arrows');
      }

      if (this.arrowDownBlink) {
        this.core.render.drawText('#050B1A', 'd', 520, 240, 2, 'Arrows');
      } else {
        this.core.render.drawText('#FFFAF4', 'd', 520, 240, 2, 'Arrows');
      }
    }
  }
}
