class RaceScene {
  constructor(config) {
    this.map = config.map;
    this.event = config.event;
    this.onComplete = config.onComplete;
    this.isFinished = false;
    this.timeout = null;
    this.textWin = config.textWin || 'Você me venceu!';
    this.textLose = config.textLose || 'Haha, perdeu tartaruga!';
    this.hasPlayerWin = false;
  };

  init() {
    const talkToChange = this.map.gameObjects[this.event.who].talking[0].events;

    if (!utils.hasEventTextWin(this.textWin, talkToChange)) {
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
        this.onComplete();
      }, 500);
    }
    else {
      this.onComplete();
    }
  }
};
