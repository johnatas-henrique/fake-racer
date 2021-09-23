import {
  handleInput, tracks, startPosition, drivers,
} from './util.js';
import Opponent from './opponent.js';

class Menu {
  constructor(width, height) {
    this.showMenu = 0;
    this.height = height;
    this.state = 'title';
    this.width = width;
    this.menuY = 0;
    this.menuX = 0;
    this.updateTime = 5 / 60;
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
      if (this.menuX < maxX && arrowdown) {
        this.menuX += 1;
        this.menuY = this.menu[this.menuX]
          .findIndex((item) => item === this.selectedOptions[this.menuX]);
      } else if (this.menuX === maxX && arrowdown) {
        this.menuX = 0;
        this.menuY = this.menu[this.menuX]
          .findIndex((item) => item === this.selectedOptions[this.menuX]);
      }

      if (this.menuX > 0 && arrowup) {
        this.menuX -= 1;
        this.menuY = this.menu[this.menuX]
          .findIndex((item) => item === this.selectedOptions[this.menuX]);
      } else if (this.menuX === 0 && arrowup) {
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
    render.drawText('red', 'Fake Racer', this.width / 2, this.height / 12, 4);

    if (!this.showMenu) {
      if (window.navigator.maxTouchPoints) {
        render.drawText('black', 'Aperte OK para iniciar', this.width / 2, this.height - 20);
      } else {
        render.drawText('black', 'Aperte ENTER para iniciar', this.width / 2, this.height - 20);
      }
    }

    if (this.showMenu) {
      const maxX = Object.keys(this.menu).length - 1;
      const menuLow = this.menuX - 1 >= 0 ? this.menuX - 1 : maxX;
      const menuHigh = this.menuX + 1 <= maxX ? this.menuX + 1 : 0;
      const lowText = `${this.menuPhrase[menuLow]} ${this.selectedOptions[menuLow].toLocaleUpperCase()}`;
      const highText = `${this.menuPhrase[menuHigh]} ${this.selectedOptions[menuHigh].toLocaleUpperCase()}`;

      render.drawText('grey', lowText, this.width / 2, 180 - 75);
      render.drawText('black', this.menuPhrase[this.menuX], this.width / 2, 180 - 22.5);
      render.drawText('black', this.menu[this.menuX][this.menuY].toLocaleUpperCase(), this.width / 2, 180 + 22.5);
      render.drawText('grey', highText, this.width / 2, 180 + 75);
      if (window.navigator.maxTouchPoints) {
        render.drawText('black', 'Escolha com os botões da tela', this.width / 2, this.height - 40, 1.5);
        render.drawText('black', 'Confirme com OK', this.width / 2, this.height - 20, 1.5);
      } else {
        render.drawText('black', 'Escolha com as setas do teclado', this.width / 2, this.height - 40, 1.5);
        render.drawText('black', 'Confirme com ENTER', this.width / 2, this.height - 20, 1.5);
      }
    }
  }
}

export default Menu;
