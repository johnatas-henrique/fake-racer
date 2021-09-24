import {
  handleInput, tracks, startPosition, drivers, resource,
} from './util.js';
import Opponent from './opponent.js';
import Sprite from './sprite.js';

class Menu {
  constructor(width, height) {
    this.showMenu = 0;
    this.height = height;
    this.state = 'title';
    this.width = width;
    this.menuY = 0;
    this.menuX = 0;
    this.updateTime = 6 / 60;
    this.menuPhrase = {
      0: 'Circuito: ',
      1: 'Oponentes: ',
      2: 'Música: ',
      3: 'Volume da música: ',
      4: 'Bora correr? ',
    };
    this.menu = {
      0: Object.keys(tracks),
      1: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19'],
      2: ['não', 'sim'],
      3: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      4: ['race'],
    };
    this.selectedOptions = {
      0: 'monaco',
      1: '19',
      2: 'não',
      3: '3',
      4: 'race',
    };
    this.arrowUpBlink = 0;
    this.arrowDownBlink = 0;
  }

  startRace(player, road, opponents) {
    const roadParam = road;
    const zero = 0;
    drivers.forEach((driver) => opponents.push(new Opponent(
      driver.power, startPosition(tracks[this.selectedOptions[zero]].trackSize, driver.position),
      driver.trackSide, driver.image, driver.name,
    )));

    opponents.forEach((opponentNumber) => opponentNumber.create());
    opponents.splice(this.selectedOptions[1], opponents.length);
    roadParam.trackName = this.selectedOptions[zero];
    roadParam.create();
    player.create(this, tracks[this.selectedOptions[zero]].trackSize);
  }

  update(player, road, opponents) {
    const {
      arrowup, arrowdown, arrowleft, arrowright, enter,
    } = handleInput.map;
    const maxX = Object.keys(this.menu).length - 1;
    const maxY = this.menu[this.menuX].length - 1;

    if (enter && !this.showMenu) this.showMenu = 1;

    if (this.showMenu) {
      if (!arrowdown) {
        this.arrowDownBlink = false;
      }
      if (!arrowup) {
        this.arrowUpBlink = false;
      }

      if (this.menuX < maxX && arrowdown) {
        this.arrowDownBlink = !this.arrowDownBlink;
        this.menuX += 1;
        this.menuY = this.menu[this.menuX]
          .findIndex((item) => item === this.selectedOptions[this.menuX]);
      } else if (this.menuX === maxX && arrowdown) {
        this.arrowDownBlink = 1;
        this.menuX = 0;
        this.menuY = this.menu[this.menuX]
          .findIndex((item) => item === this.selectedOptions[this.menuX]);
      }

      if (this.menuX > 0 && arrowup) {
        this.arrowUpBlink = 1;
        this.menuX -= 1;
        this.menuY = this.menu[this.menuX]
          .findIndex((item) => item === this.selectedOptions[this.menuX]);
      } else if (this.menuX === 0 && arrowup) {
        this.arrowUpBlink = 1;
        this.menuX = maxX;
        this.menuY = this.menu[this.menuX]
          .findIndex((item) => item === this.selectedOptions[this.menuX]);
      }

      if (this.menuY < maxY && arrowright) this.menuY += 1;
      else if (this.menuY === maxY && arrowright) this.menuY = 0;

      if (this.menuY > 0 && arrowleft) this.menuY -= 1;
      else if (this.menuY === 0 && arrowleft) this.menuY = maxY;

      const lastMenuOption = Object.keys(this.menu).length - 1;

      if (enter && this.menuX !== lastMenuOption) {
        this.selectedOptions[this.menuX] = this.menu[this.menuX][this.menuY];
      }

      if (enter && this.menuX === lastMenuOption) {
        const hud = document.querySelector('#hud');
        hud.classList.toggle('hidden');
        const okBtn = document.querySelector('.rightControls').firstElementChild;
        okBtn.classList.toggle('hidden');
        this.startRace(player, road, opponents);
        this.state = 'race';
      }
    }
  }

  render(render) {
    render.drawText('#EB4844', 'Fake Racer', 320, 30, 4, 'OutriderCondBold');

    if (!this.showMenu) {
      if (window.navigator.maxTouchPoints) {
        render.drawText('black', 'Aperte OK para iniciar', 320, 180);
      } else {
        render.drawText('black', 'Aperte ENTER para iniciar', 320, 180);
      }
    }

    if (this.showMenu) {
      const maxX = Object.keys(this.menu).length - 1;
      const menuLow = this.menuX - 1 >= 0 ? this.menuX - 1 : maxX;
      const menuHigh = this.menuX + 1 <= maxX ? this.menuX + 1 : 0;
      const lowText = `${this.menuPhrase[menuLow]} ${this.selectedOptions[menuLow].toLocaleUpperCase()}`;
      const highText = `${this.menuPhrase[menuHigh]} ${this.selectedOptions[menuHigh].toLocaleUpperCase()}`;

      // render.drawPolygon('#2C69EB', 100, 100, 540, 100, 540, 270, 100, 270);
      render.roundRect('#2C69EB', 100, 100, 440, 170, 20, true, false);
      render.drawText('#FFFAF4', lowText, 320, 180 - 45, 1.6);
      const phrase = `${this.menuPhrase[this.menuX]} ${this.menu[this.menuX][this.menuY].toLocaleUpperCase()}`;
      render.drawText('#050B1A', phrase, 320, 180, 1.6);
      render.drawText('#FFFAF4', highText, 320, 180 + 45, 1.6);
      if (window.navigator.maxTouchPoints) {
        render.drawText('black', 'Navegar', 590, 320, 1.3, 'OutriderCond', 'right');
        render.drawText('black', 'Confirmar', 590, 345, 1.3, 'OutriderCond', 'right');
      } else {
        const arrowKeys = new Sprite();
        arrowKeys.image = resource.get('arrowKeys');
        const enterKey = new Sprite();
        enterKey.image = resource.get('enterKey');
        render.drawText('black', 'Navegar', 590, 320, 1.3, 'OutriderCond', 'right');
        render.renderingContext.drawImage(arrowKeys.image, 595, 310, 28, 18);
        render.drawText('black', 'Confirmar', 590, 345, 1.3, 'OutriderCond', 'right');
        render.renderingContext.drawImage(enterKey.image, 597, 335, 23, 18);
      }

      if (this.arrowUpBlink) {
        render.drawText('#050B1A', 'c', 520, 140, 2, 'Arrows');
      } else {
        render.drawText('#FFFAF4', 'c', 520, 140, 2, 'Arrows');
      }
      if (this.arrowDownBlink) {
        render.drawText('#050B1A', 'd', 520, 240, 2, 'Arrows');
      } else {
        render.drawText('#FFFAF4', 'd', 520, 240, 2, 'Arrows');
      }
    }
  }
}

export default Menu;
