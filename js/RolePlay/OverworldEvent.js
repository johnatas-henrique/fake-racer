class OverworldEvent {
  constructor(config) {
    this.map = config.map;
    this.event = config.event;
  };

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
    }

    document.addEventListener('PersonStandingComplete', completeHandler);
  };

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
    }
    document.addEventListener('PersonWalkingComplete', completeHandler);
  };

  textMessage(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects['hero'].direction);
    }
    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve(),
    });

    message.init(document.querySelector('.game-container'));
  };

  changeMap(resolve) {
    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector('.game-container'), () => {
      this.map.overworld.startMap(window.OverworldMaps[this.event.map]);
      resolve();
      sceneTransition.fadeOut();
    });
  };

  race(resolve) {
    const race = new RaceScene({
      map: this.map,
      event: this.event,
      onComplete: () => resolve(),
    });

    race.init();
  };

  async init() {
    return new Promise(resolve => {
      this[this.event.type](resolve);
    })
  };
};
