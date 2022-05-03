class RaceScene {
  constructor(config) {
    this.map = config.map;
    this.event = config.event;
    this.onComplete = config.onComplete;
    this.isFinished = false;
    this.timeout = null;
    this.textWin = config.event.textWin || 'Win (need a text here)';
    this.textLose = config.event.textLose || 'Lose (need a text here)';
    this.hasPlayerWin = false;
    this.bindPauseListener = null;
    this.eventClass = undefined;
  };

  showPauseMenu() {
    if (utils.pauseMenu()) {
      utils.pauseMenu().remove();
      utils.descriptionPauseMenu().remove();
    } else {
      this.eventClass = new RaceEvent({
        event: { type: 'pauseMenu' },
        race: { element: utils.gameContainer() },
      });
      this.eventClass.init();
    };
  };

  bindPauseInput() {
    this.bindPauseListener = new KeyPressListener('KeyP', () => this.showPauseMenu());
  };

  init() {
    const talkToChange = this.map.gameObjects[this.event.who].talking[0].events;

    this.bindPauseInput();

    if (!utils.hasEventTextWin(this.textWin, talkToChange)) {
      //setTimeout here below just to simulate a race, will not be here on final code
      this.timeout = setTimeout(() => {
        this.isFinished = true;
        clearTimeout(this.timeout);
        const random = Math.round(Math.random() * 10);
        if (random >= 5) {
          this.hasPlayerWin = true;
        }
        const talkChosen = utils.chooseTalk(this.textWin, this.textLose, this.hasPlayerWin);
        const oldMessage = ['{depends on}', this.textLose];
        utils.changeTalk(talkChosen, talkToChange, oldMessage);
        if (this.eventClass) {
          this.eventClass.menu.keyboardMenu.end();
        }
        this.bindPauseListener.unbind();
        this.onComplete();
      }, 20000);
    } else {
      this.onComplete();
    }
  };
};
