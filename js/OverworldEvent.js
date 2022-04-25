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
      if(e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonStandingComplete', completeHandler);
        resolve();
      }
    }

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
    }

    document.addEventListener('PersonWalkingComplete', completeHandler);
  };

  async init() {
    return new Promise(resolve => {
      this[this.event.type](resolve);
    })
  }
};