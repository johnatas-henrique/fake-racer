class Overworld {
  constructor(config) {
    this.core = config.core;
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.map = null;
    this.canvasMidpoint = config.core.canvasMidpoint;
    this.inputs = {
      oneDirection: null,
      multiDirection: null,
      keyPressListeners: [],
    };
  }

  startGameLoop() {
    console.log('loop');
    const frame = () => {
      console.log('frame');
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      requestAnimationFrame(() => {
        frame();
      });
    };
    frame();
  }

  update() {
    Object.values(this.map.gameObjects).forEach((item) => {
      item.update({
        arrow: this.directionInput.direction,
        map: this.map,
      });
    });
  }

  draw() {
    const cameraPerson = {
      ...this.map.gameObjects.hero,
      canvasMidpoint: this.canvasMidpoint,
    };

    this.map.drawLowerImage(this.ctx, cameraPerson);

    const gameObj = Object.values(this.map.gameObjects);

    gameObj
      .sort((a, b) => a.y - b.y)
      .forEach((item) => {
        item.sprite.draw(this.ctx, cameraPerson);
      });

    this.map.drawMiddleImage(this.ctx, cameraPerson);

    this.map.drawUpperImage(this.ctx, cameraPerson);
  }

  helperHeroPositionMapCheck() {
    this.inputs.keyPressListeners.push(new KeyPressListener(
      'KeyH',
      () => this.map.helperCheckHeroMapPosition(),
    ));
  }

  bindActionInput() {
    this.inputs.keyPressListeners.push(new KeyPressListener(
      'Enter',
      () => this.map.checkForActionCutscene(),
    ));
  }

  bindHeroPositionCheck() {
    document.addEventListener('PersonWalkingComplete', (e) => {
      if (e.detail.whoId === 'hero') {
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  init() {
    if (window.gameState.mode === 'RPGScene' && !this.isInitOnce) {
      utils.resolutionChanger(this.core);
      utils.classAdder('gameCanvas', 'pixelated');

      this.startMap(window.OverworldMaps.DemoRoom);

      this.helperHeroPositionMapCheck();

      this.bindActionInput();
      utils.keyInitializer('KeyH', this);
      this.bindHeroPositionCheck();
      utils.keyInitializer('Enter', this);

      this.directionInput = new OneDirectionInput();
      this.directionInput.init();

      this.map.startCutscene([
        // { who: 'npcC', type: 'race', raceId: 'kart1', textWin: 'testwin', textLose: 'testlose' },
        //   { who: 'hero', type: 'walk', direction: 'down' },
        //   { who: 'hero', type: 'walk', direction: 'down' },
        //   { who: 'npcA', type: 'walk', direction: 'left' },
        //   { who: 'npcA', type: 'walk', direction: 'up' },
        //   { who: 'npcA', type: 'stand', direction: 'left', time: 300 },
        //   { who: 'hero', type: 'stand', direction: 'right', time: 200 },
        //   { type: 'textMessage', text: 'Olá meu caro, tudo bem contigo?' },
      ]);

      this.isInitOnce = true;
    }
  }
}
