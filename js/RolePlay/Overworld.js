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
        if (item.showItem) {
          item.sprite.draw(this.core.render.ctx, cameraPerson);
        }
      });

    this.map.drawMiddleImage(this.core.render.ctx, cameraPerson);

    this.map.drawUpperImage(this.core.render.ctx, cameraPerson);

    const raceBaloon = this.map.gameObjects.conversationBaloon;
    if (raceBaloon?.showItem) {
      raceBaloon.sprite.draw(this.core.render.ctx, cameraPerson);
    }
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

  startMap(mapConfig, initialHeroPosition = null) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();

    const { hero } = this.map.gameObjects;
    if (initialHeroPosition) {
      this.map.removeWall(hero.x, hero.y);
      hero.x = initialHeroPosition.x;
      hero.y = initialHeroPosition.y;
      hero.direction = initialHeroPosition.direction;
      this.map.addWall(hero.x, hero.y);
    }

    this.progress.mapId = window.playerState.savedMap;
    this.progress.startingHeroX = hero.x;
    this.progress.startingHeroY = hero.y;
    this.progress.startingHeroDirection = hero.direction;
  }

  init() {
    if (window.gameState.mode === 'RPGScene' && !this.isInitOnce) {
      utils.changeMode('RPGScene', this.core, false);
      utils.resolutionChanger(this.core);
      utils.classAdder('gameCanvas', 'pixelated');

      this.progress = new Progress();

      this.startMap(window.overworldMaps[window.playerState.savedMap]);

      this.hud = new Hud({ map: this.map });
      this.hud.init(utils.htmlElements.gameContainer());

      this.helperHeroPositionMapCheck();
      this.bindActionInput();

      utils.keyInitializer('KeyH', this);
      utils.keyInitializer('Enter', this);
      utils.keyInitializer('Escape', this);

      this.bindHeroPositionCheck();

      this.core.inputs.oneDirection.init();

      this.map.startCutscene([
        // { type: 'changeName' },
      ]);

      this.isInitOnce = true;
    }
  }
}
