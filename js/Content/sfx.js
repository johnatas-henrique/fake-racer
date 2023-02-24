window.sfx = {
  // example: new Howl({
  //   src: ['./assets/sfx/talking/typing_keystroke_short.wav'],
  //   volume: (Number(0.5)),
  //   loop: true,
  //   onplay: () => console.log(window.sfx.talking),
  //   onend: () => window.sfx.talking2.play(), // TODO Controle de volume SFX
  // }),
  confirm: new Howl({
    // src: ['./assets/sfx/ui_menu_button_confirm_06.wav'],
    src: ['./assets/sfx/tick.wav'],
    volume: (Number(window.gameState.menuSelectedOptions.musicVolume) - 0.5) / 10,
  }),
  menuUpDown: new Howl({
    // src: ['./assets/sfx/ui_menu_button_keystroke_01.wav'],
    src: ['./assets/sfx/tick.wav'],
    volume: (Number(window.gameState.menuSelectedOptions.musicVolume) - 0.5) / 10,
  }),
  talking: new Howl({
    // src: ['./assets/sfx/talking/typing_keystroke_short.wav'],
    src: ['./assets/sfx/tick.wav'],
    volume: (Number(window.gameState.menuSelectedOptions.musicVolume) + 1) / 10,
  }),
  talkingLong: new Howl({
    // src: ['./assets/sfx/talking/typing_keystroke_long.wav'],
    src: ['./assets/sfx/tick.wav'],
    volume: (Number(window.gameState.menuSelectedOptions.musicVolume) + 1) / 10,
  }),
  enterRace: new Howl({
    // src: ['./assets/music/enterRaceLoop.ogg'],
    src: ['./assets/music/titleTopGear.mp3'],
    volume: (Number(window.gameState.menuSelectedOptions.musicVolume) + 1) / 10,
  }),
  tick: new Howl({
    src: ['./assets/sfx/tick.wav'],
    volume: (Number(window.gameState.menuSelectedOptions.musicVolume) + 1) / 10,
  }),
  engine: new Howl({
    src: ['./assets/sfx/engine_loop.wav'],
    loop: true,
    rate: 2,
    volume: (Number(window.gameState.menuSelectedOptions.sfxVolume)) / 10,
    onplay: () => {
      window.sfx.engine.volume((Number(window.gameState.menuSelectedOptions.sfxVolume)) / 10);
    },
  }),
};
