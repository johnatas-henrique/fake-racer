import { handleInput, tracks } from './util.js';

class Menu {
  constructor(width, height) {
    this.showMenu = 0;
    this.height = height;
    this.state = 'title';
    this.width = width;
    this.menuY = 0;
    this.menuX = 0;
    this.menuPhrase = {
      0: 'Selecione a pista: ',
      1: 'Número de oponentes: ',
      2: 'Bora correr? ',
    };
    this.menu = {
      0: Object.keys(tracks),
      1: ['19', '1', '3', '5', '7', '9', '11', '13', '15', '17'],
      2: ['race'],
    };
    this.chosenTrack = 'brazil';
    this.chosenOpponents = '19';
  }

  update() {
    const {
      arrowup, arrowdown, arrowleft, arrowright, enter,
    } = handleInput.map;
    if (enter && !this.showMenu) {
      this.showMenu = 1;
    }

    const maxX = Object.keys(this.menu).length - 1;
    const maxY = this.menu[this.menuX].length - 1;

    if (this.showMenu) {
      if (this.menuX < maxX && arrowdown) {
        this.menuX += 1;
        this.menuY = 0;
      } else if (this.menuX === maxX && arrowdown) {
        this.menuX = 0;
        this.menuY = 0;
      }

      if (this.menuX > 0 && arrowup) {
        this.menuX -= 1;
        this.menuY = 0;
      } else if (this.menuX === 0 && arrowup) {
        this.menuX = maxX;
        this.menuY = 0;
      }

      if (this.menuY < maxY && arrowright) {
        this.menuY += 1;
      } else if (this.menuY === maxY && arrowright) {
        this.menuY = 0;
      }

      if (this.menuY > 0 && arrowleft) {
        this.menuY -= 1;
      } else if (this.menuY === 0 && arrowleft) {
        this.menuY = maxY;
      }

      if (enter && this.menuX === 0) {
        this.chosenTrack = this.menu[this.menuX][this.menuY];
      }
      if (enter && this.menuX === 2) {
        this.state = 'race';
      }
    }
  }

  render(render) {
    render.drawText('red', 'FakeRacer', this.width / 2, this.height / 8);

    if (!this.showMenu) {
      render.drawText('black', 'Aperte ENTER para iniciar', this.width / 2, this.height - 20);
    }

    if (this.showMenu) {
      const maxX = Object.keys(this.menu).length - 1;
      const menuLow = this.menuX - 1 > 0 ? this.menuX - 1 : maxX;
      const menuHigh = this.menuX + 1 < maxX ? this.menuX + 1 : 0;
      const lowText = `${this.menuPhrase[menuLow]} ${this.menu[menuLow][0].toLocaleUpperCase()}`;
      const highText = `${this.menuPhrase[menuHigh]} ${this.menu[menuHigh][0].toLocaleUpperCase()}`;

      render.drawText('black', lowText, this.width / 2, 180 - 90);
      render.drawText('black', this.menuPhrase[this.menuX], this.width / 2, 180 - 22.5);
      render.drawText('black', this.menu[this.menuX][this.menuY].toLocaleUpperCase(), this.width / 2, 180 + 22.5);
      render.drawText('black', highText, this.width / 2, 180 + 90);

      render.drawText('black', 'Escolha com as setas do teclado. Confirme com ENTER.', this.width / 2, this.height - 20, 18);
    }
  }
}

export default Menu;
