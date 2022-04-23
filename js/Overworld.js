class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.map = null;
    this.canvasMidpoint = { x: this.canvas.width / 2, y: this.canvas.height / 2 }
  }

  startGameLoop() {
    const step = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const cameraPerson = { ...this.map.gameObjects.hero, canvasMidpoint: this.canvasMidpoint };

      Object.values(this.map.gameObjects).forEach(item => {
        item.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      this.map.drawLowerImage(this.ctx, cameraPerson);

      Object.values(this.map.gameObjects).forEach(item => {
        item.sprite.draw(this.ctx, cameraPerson);
      })

      this.map.drawUpperImage(this.ctx, cameraPerson);

      requestAnimationFrame(() => {
        step();
      })
    }
    step();
  }

  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    this.map.mountObjects();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
  }
}
