class Overworld {
  constructor(config) {
    this.core = config.core;
    this.map = null;
    this.inputs = {
      keyPressListeners: [],
    };
  }

  update() {
    if (window.gameState.mode === 'historyRaceScene') {
      this.map.eventHandler.raceScene.historyRace.update();
      return;
    }
    Object.values(this.map.gameObjects).forEach((item) => {
      item.update({ arrow: this.core.inputs.oneDirection.direction, map: this.map });
    });
  }

  draw() {
    if (window.gameState.mode === 'historyRaceScene') {
      this.map.eventHandler.raceScene.historyRace.draw();
      return;
    }
    const cameraPerson = {
      ...this.map.gameObjects.hero,
      canvasMidpoint: window.gameState.canvasMidpoint,
    };

    this.map.drawLowerImage(this.core.render.ctx, cameraPerson);

    const gameObj = Object.values(this.map.gameObjects);

    gameObj
      .sort((a, b) => a.y - b.y)
      .forEach((item) => {
        item.sprite.draw(this.core.render.ctx, cameraPerson);
      });

    this.map.drawMiddleImage(this.core.render.ctx, cameraPerson);

    this.map.drawUpperImage(this.core.render.ctx, cameraPerson);
  }

  helperHeroPositionMapCheck() {
    this.inputs.keyPressListeners.push(new KeyPressListener(
      'KeyH',
      () => this.map.helperCheckHeroMapPosition(),
    ));
  }

  bindActionInput() {
    this.inputs.keyPressListeners.push(new KeyPressListener('Enter', () => {
      this.map.checkForActionCutscene();
    }));
    this.inputs.keyPressListeners.push(new KeyPressListener('Escape', () => {
      if (!this.map.isCutscenePlaying) {
        this.map.startCutscene([
          { type: 'pause' },
        ]);
      }
    }));
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
      utils.keyInitializer('Enter', this);
      utils.keyInitializer('Escape', this);

      this.bindHeroPositionCheck();

      this.core.inputs.oneDirection.init();

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
