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

    const hero = new GameObject({
      x: 5, y: 6,
    });

    const npc1 = new GameObject({
      x: 7, y: 9, src: '../assets/images/characters/people/npc1.png'
    });

    setTimeout(() => {
      hero.sprite.draw(this.ctx);
      npc1.sprite.draw(this.ctx);
    }, 200);
  }
}
