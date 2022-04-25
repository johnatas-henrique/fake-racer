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

      Object.values(this.map.gameObjects)
        .sort((a, b) => a.y - b.y)
        .forEach(item => {
          item.sprite.draw(this.ctx, cameraPerson);
        })

      this.map.drawUpperImage(this.ctx, cameraPerson);

      requestAnimationFrame(() => {
        step();
      })
    }
    step();
  }

  bindActionInput() {
    new KeyPressListener({
      keyCode: 'Enter',
      callback: () => (this.map.checkForActionCutscene()),
    });
  }

  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    this.map.mountObjects();

    this.bindActionInput();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    this.map.startCutscene([
      { who: 'hero', type: 'walk', direction: 'down' },
      { who: 'hero', type: 'walk', direction: 'down' },
      { who: 'npcA', type: 'walk', direction: 'left' },
      { who: 'npcA', type: 'walk', direction: 'up' },
      { who: 'npcA', type: 'stand', direction: 'left', time: 300 },
      { who: 'hero', type: 'stand', direction: 'right', time: 200 },
      { type: 'textMessage', text: 'Olá meu caro, tudo bem contigo?' },
    ]);
  }
}
