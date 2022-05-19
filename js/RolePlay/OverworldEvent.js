class OverworldEvent {
  constructor(config) {
    this.map = config.map;
    this.event = config.event;
  }

  stand(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior(
      { map: this.map },
      { type: 'stand', direction: this.event.direction, time: this.event.time },
    );

    // Handler to complete when correct person has walked and resolve the promise
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonStandingComplete', completeHandler);
        resolve();
      }
    };

    document.addEventListener('PersonStandingComplete', completeHandler);
  }

  walk(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior(
      { map: this.map },
      { type: 'walk', direction: this.event.direction, retry: true },
    );

    // Handler to complete when correct person has walked and resolve the promise
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonWalkingComplete', completeHandler);
        resolve();
      }
    };
    document.addEventListener('PersonWalkingComplete', completeHandler);
  }

  textMessage(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects.hero.direction);
    }
    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve(),
    });

    message.init(document.querySelector('.game-container'));
    window.sfx.talking.play();
  }

  changeMap(resolve) {
    const mapTransition = new SceneTransition();
    mapTransition.init(
      'map-transition',
      document.querySelector('.game-container'),
      () => {
        this.map.overworld.startMap(window.OverworldMaps[this.event.map]);
        resolve();
        mapTransition.fadeOut();
      },
    );
  }

  static enterRaceAnimation(resolve) {
    const battleTransition = new SceneTransition();
    battleTransition.init(
      'battle-transition',
      document.querySelector('.game-container'),
      () => {
        resolve();
        battleTransition.fadeOut();
      },
    );
  }

  pause(resolve) {
    this.map.overworld.core.isPaused = true;
    const menu = new GameMenu({
      onComplete: () => {
        resolve();
        this.map.overworld.core.isPaused = false;
        this.map.overworld.core.startGameLoop();
      },
    });
    menu.init(utils.htmlElements.gameContainer());
  }

  race(resolve) {
    this.raceScene = new RaceScene({
      map: this.map,
      event: this.event,
      onComplete: (didWin) => {
        resolve(didWin ? 'WON_RACE' : 'LOST_RACE');
      },
    });

    this.raceScene.init();
  }

  addStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = true;
    resolve();
  }

  async init() {
    return new Promise((resolve) => {
      if (this.event.type !== 'enterRaceAnimation') {
        this[this.event.type](resolve);
        return;
      }
      OverworldEvent[this.event.type](resolve);
    });
  }
}
