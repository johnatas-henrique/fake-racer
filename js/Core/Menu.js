class Menu {
  constructor(config) {
    this.render = config.render;
    this.animations = config.animations;
    this.controls = config.controls;
    this.menuArrowKeys = new Image();
    this.menuArrowKeys.src = '../images/sprites/other/arrowKeys.png';
    this.menuEnterKey = new Image();
    this.menuEnterKey.src = '../images/sprites/other/enterKey.png';
    this.keyPressListeners = [];
    this.isConfirmButtonPressed = false;
    this.showMenu = 0;
    this.menuY = 0;
    this.menuX = 5;
    this.fps = 8;
    this.deltaTime = 0;
    this.lastTime = 0;
    this.arrowUpBlink = false;
    this.arrowDownBlink = false;
    this.menuTitle = { pos: 0, direction: 1 };
    this.menuPhrase = {
      0: 'Circuito: ',
      1: 'Oponentes: ',
      2: 'Dificuldade: ',
      3: 'Música: ',
      4: 'Volume da música: ',
      5: 'Iniciar ',
    };
    this.menu = {
      0: Object.keys(utils.tracks),
      1: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19'],
      2: ['novato', 'corredor', 'campeão'],
      3: ['não', 'sim'],
      4: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      5: ['corrida'],
    };
    this.selectedOptions = {
      0: 'canada',
      1: '19',
      2: 'novato',
      3: 'não',
      4: '1',
      5: 'corrida',
    };
  }

  directionPressed() {
    if (!this.controls.heldDirections.length) return null;
    return this.controls.heldDirections[0];
  }

  acceptOption() {
    this.isConfirmButtonPressed = true;
  }

  init() {
    this.keyPressListeners.push(new KeyPressListener('Enter', () => this.acceptOption()));
  }

  adjustDifficulty() {
    if (this.selectedOptions[2] === 'novato') return 0.87;
    if (this.selectedOptions[2] === 'corredor') return 0.935;
    return 1;
  }

  startRace(player, road, opponents, director) {
    const roadParam = road;
    const zero = 0;
    utils.drivers.forEach((driver) => opponents.push(new Opponent(
      driver.power * this.adjustDifficulty(),
      utils.startPosition(utils.tracks[this.selectedOptions[zero]].trackSize, driver.position),
      driver.trackSide,

      'opponents',

      driver.name,

      driver.carColor,
    )));

    opponents.forEach((opponentNumber) => opponentNumber.create());
    opponents.splice(this.selectedOptions[1], opponents.length);
    roadParam.trackName = this.selectedOptions[zero];
    roadParam.create();
    player.create(this, utils.tracks[this.selectedOptions[zero]].trackSize);
    director.create(road, this.selectedOptions[0]);
  }

  update(deltaTime, player, road, opponents, director) {
    this.deltaTime += deltaTime;
    const maxX = Object.keys(this.menu).length - 1;
    const maxY = this.menu[this.menuX].length - 1;

    if (this.isConfirmButtonPressed && !this.showMenu) {
      this.selectedOptions[3] = 'sim';
      this.showMenu = 1;
      this.menuTitle.pos = 0;
      this.isConfirmButtonPressed = false;
    }

    if (this.showMenu && this.deltaTime > utils.secondInMS / this.fps) {
      this.deltaTime = 0;

      if (this.directionPressed() !== 'down') this.arrowDownBlink = false;
      if (this.directionPressed() !== 'up') this.arrowUpBlink = false;

      if (this.menuX < maxX && this.directionPressed() === 'down') {
        this.arrowDownBlink = !this.arrowDownBlink;
        this.menuX += 1;
        this.menuY = this.menu[this.menuX]
          .findIndex((item) => item === this.selectedOptions[this.menuX]);
      } else if (this.menuX === maxX && this.directionPressed() === 'down') {
        this.arrowDownBlink = 1;
        this.menuX = 0;
        this.menuY = this.menu[this.menuX]
          .findIndex((item) => item === this.selectedOptions[this.menuX]);
      }

      if (this.menuX > 0 && this.directionPressed() === 'up') {
        this.arrowUpBlink = 1;
        this.menuX -= 1;
        this.menuY = this.menu[this.menuX]
          .findIndex((item) => item === this.selectedOptions[this.menuX]);
      } else if (this.menuX === 0 && this.directionPressed() === 'up') {
        this.arrowUpBlink = 1;
        this.menuX = maxX;
        this.menuY = this.menu[this.menuX]
          .findIndex((item) => item === this.selectedOptions[this.menuX]);
      }

      if (this.menuY < maxY && this.directionPressed() === 'right') this.menuY += 1;
      else if (this.menuY === maxY && this.directionPressed() === 'right') this.menuY = 0;

      if (this.menuY > 0 && this.directionPressed() === 'left') this.menuY -= 1;
      else if (this.menuY === 0 && this.directionPressed() === 'left') this.menuY = maxY;

      const lastMenuOption = Object.keys(this.menu).length - 1;

      if (this.menuX !== lastMenuOption) {
        this.selectedOptions[this.menuX] = this.menu[this.menuX][this.menuY];
        this.isConfirmButtonPressed = false;
      }

      if (this.isConfirmButtonPressed && this.menuX === lastMenuOption) {
        const pauseBtn = document.querySelector('#pauseBtn');
        const fps = document.querySelector('#fps');
        const mute = document.querySelector('#mute');
        pauseBtn.classList.toggle('hidden');
        mute.classList.toggle('hidden');
        const okBtn = document.querySelector('.rightControls').firstElementChild;
        okBtn.classList.toggle('hidden');
        // this.startRace(player, road, opponents, director);
        window.gameState.mode = 'singleRace';
        this.isConfirmButtonPressed = false;
        fps.firstElementChild.classList.remove('hidden');
      }
    }
  }

  drawButtons(x, y, size, text) {
    this.render.drawCircle(x, y + 3, size, 0, Math.PI * 2);
    this.render.drawText('black', text, x, y, 1.3, 'OutriderCond', 'center');
  }

  drawMenu() {
    this.animations.forEach((item) => {
      item.update();
      item.render(this.render);
    });
    this.render.drawText('#EB4844', 'Fake Racer', 320, 30, 4, 'OutriderCondBold');

    if (!this.showMenu) {
      if (this.menuTitle.pos >= 12) this.menuTitle.direction = -1;
      if (this.menuTitle.pos <= -12) this.menuTitle.direction = 1;
      this.menuTitle.pos += (this.menuTitle.direction / 2);
      if (window.navigator.maxTouchPoints) {
        this.render.drawText('black', 'Aperte OK para iniciar', 320, 180 + this.menuTitle.pos);
      } else {
        this.render.drawText('black', 'Aperte ENTER para iniciar', 320, 180 + this.menuTitle.pos);
      }
    }

    if (this.showMenu) {
      if (this.menuTitle.pos >= 4) this.menuTitle.direction = -1;
      if (this.menuTitle.pos <= -4) this.menuTitle.direction = 1;
      this.menuTitle.pos += (this.menuTitle.direction / 2);
      const maxX = Object.keys(this.menu).length - 1;
      const menuLow = this.menuX - 1 >= 0 ? this.menuX - 1 : maxX;
      const menuHigh = this.menuX + 1 <= maxX ? this.menuX + 1 : 0;
      const lowText = `${this.menuPhrase[menuLow]} ${this.selectedOptions[menuLow].toLocaleUpperCase()}`;
      const highText = `${this.menuPhrase[menuHigh]} ${this.selectedOptions[menuHigh].toLocaleUpperCase()}`;

      this.render.roundRect('#2C69EB', 100, 100, 440, 170, 20, true, false);
      this.render.drawText('#FFFAF4', lowText, 320, 180 - 45, 1.6);
      const phrase = `${this.menuPhrase[this.menuX]} ${this.menu[this.menuX][this.menuY].toLocaleUpperCase()}`;
      this.render.drawText('#050B1A', phrase, 320, 180 + (this.menuTitle.pos / 4), 1.6);
      this.render.drawText('#FFFAF4', highText, 320, 180 + 45, 1.6);

      if (window.navigator.maxTouchPoints) {
        this.drawButtons(145, 310, 15, 'U');
        this.drawButtons(185, 310, 15, 'D');
        this.drawButtons(225, 310, 15, 'L');
        this.drawButtons(265, 310, 15, 'R');
        this.render.drawText('black', 'Navegar', 150, 345, 1.3, 'OutriderCond', 'left');
        this.drawButtons(418, 310, 18, 'OK');
        this.render.drawText('black', 'Confirmar', 490, 345, 1.3, 'OutriderCond', 'right');
      } else {
        this.render.drawText('black', 'Navegar', 590, 320, 1.3, 'OutriderCond', 'right');
        this.render.ctx.drawImage(this.menuArrowKeys, 595, 310, 28, 18);

        this.render.drawText('black', 'Confirmar', 590, 345, 1.3, 'OutriderCond', 'right');
        this.render.ctx.drawImage(this.menuEnterKey, 597, 335, 23, 18);
      }

      if (this.arrowUpBlink) {
        this.render.drawText('#050B1A', 'c', 520, 140, 2, 'Arrows');
      } else {
        this.render.drawText('#FFFAF4', 'c', 520, 140, 2, 'Arrows');
      }
      if (this.arrowDownBlink) {
        this.render.drawText('#050B1A', 'd', 520, 240, 2, 'Arrows');
      } else {
        this.render.drawText('#FFFAF4', 'd', 520, 240, 2, 'Arrows');
      }
    }
  }
}
