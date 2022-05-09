class GameState {
  constructor() {
    this.mode = 'menuScene';
    this.music = null;
    this.menuSelectedOptions = {
      track: 'canada',
      opponents: '19',
      difficulty: 'novato',
      isMusicActive: 'não',
      musicVolume: '1',
      isSingleRaceOn: 'única',
      isRPGOn: 'história',
    };
  }
}

window.gameState = new GameState();
