class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  init() {
    const map = new Image();
    map.onload = () => {
      this.ctx.drawImage(map, 0, 0)
    }
    map.src = '../assets/images/maps/DemoLower.png';

    const x = 5;
    const y = 6;

    const shadow = new Image();
    shadow.onload = () => {
      this.ctx.drawImage(shadow,
        0, 0, //x, y start point
        32, 32, //x, y cut size
        x * 16 - 8, y * 16 - 18, // position on canvas
        32, 32 //x, y render size
      )
    }
    shadow.src = '../assets/images/characters/shadow.png';

    const hero = new Image();
    hero.onload = () => {
      this.ctx.drawImage(hero,
        0, 0, //x, y start point
        32, 32, //x, y cut size
        x * 16 - 8, y * 16 - 18, // position on canvas
        32, 32 //x, y render size
      )
    }
    hero.src = '../assets/images/characters/people/hero.png';
  }
}
