class PlayerState {
  constructor() {
    this.race = null;
    this.level = 1;
    this.items = [
      { actionId: 'cellphone', instanceId: 'history1' },
    ];
  }
}

window.playerState = new PlayerState();
