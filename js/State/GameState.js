class GameState {
  constructor() {
    this.debugPhoneMode = 0;
    this.mode = 'menuScene';
    this.isTouchActive = window.navigator.maxTouchPoints;
    this.canvasMidpoint = { x: 640 / 2, y: 360 / 2 };
    this.music = null;
    this.menuSelectedOptions = {
      track: 'belgica',
      opponents: '19',
      difficulty: 'novato',
      isMusicActive: 'não',
      controls: this.isTouchActive ? 'acelerômetro' : 'teclado',
      musicVolume: '1',
      sfxVolume: '1',
      isRPGOn: 'história',
      isRPGOnSave: 'jogo',
      isSingleRaceOn: 'rápida',
    };
  }
}

window.gameState = new GameState();
