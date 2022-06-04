class Progress {
  constructor() {
    this.mapId = 'DemoRoom';
    this.startingHeroX = NaN;
    this.startingHeroY = NaN;
    this.startingHeroDirection = 'down';
    this.saveFileKey = 'FakeRacer_SaveFile1';
  }

  save() {
    window.localStorage.setItem(this.saveFileKey, JSON.stringify({
      mapId: this.mapId,
      startingHeroX: this.startingHeroX,
      startingHeroY: this.startingHeroY,
      startingHeroDirection: this.startingHeroDirection,
      playerState: {
        ...window.playerState,
      },
    }));
  }

  getSaveFile() {
    const file = window.localStorage.getItem(this.saveFileKey);
    return file ? JSON.parse(file) : null;
  }

  load() {
    const file = this.getSaveFile();
    if (file) {
      this.mapId = file.mapId;
      this.startingHeroX = file.startingHeroX;
      this.startingHeroY = file.startingHeroY;
      this.startingHeroDirection = file.startingHeroDirection;
      Object.keys(file.playerState).forEach((key) => {
        window.playerState[key] = file.playerState[key];
      });
    }
  }
}
