class GameState {
  constructor() {
    this.mode = 'menuScene';
    this.menuSelectedOptions = {
      track: 'canada',
      opponents: '19',
      difficulty: 'novato',
      isMusicActive: 'não',
      musicVolume: '1',
      isRaceOn: 'corrida',
    };
  }
}

window.gameState = new GameState();
