import utils from '../Core/utils.js';

window.music = {
  titleLoadingScreen: new Howl({
    // src: ['./assets/music/FA_Loading_Screen_Jingle_Loop.wav'],
    src: ['./assets/music/titleTopGear.mp3'],
    volume: window.gameState.menuSelectedOptions.musicVolume / 10,
    loop: false,
    onend: () => utils.changeMusic(),
  }),
  titleTopGear: new Howl({
    src: ['./assets/music/titleTopGear.mp3'],
    volume: window.gameState.menuSelectedOptions.musicVolume / 10,
    loop: false,
    onend: () => utils.changeMusic(),
  }),
};

window.musicList = Object.keys(window.music);
