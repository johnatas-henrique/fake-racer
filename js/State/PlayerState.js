class PlayerState {
  constructor() {
    this.name = 'John Doe'; // TODO Way to choose player's name
    this.level = 1;
    this.xp = 0;
    this.items = [
      { actionId: 'cellphone', instanceId: 'history1' },
    ];
    this.storyFlags = {
      KITCHEN_BLOCKED: true,
    };
  }
}

window.playerState = new PlayerState();
