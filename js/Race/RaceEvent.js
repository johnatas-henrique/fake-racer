class RaceEvent {
  constructor(config) {
    this.event = config.event;
    this.race = config.race;
    this.menu = null;
  }

  pauseMenu(resolve) {
    this.menu = new PauseMenu({
      onComplete: () => {
        resolve();
      },
    });
    this.menu.init(this.race.element);
  }

  init(resolve) {
    this[this.event.type](resolve);
  }
}
