window.sfx = {
  confirm: new Howl({
    src: ['./assets/sfx/ui_menu_button_confirm_06.wav'],
    volume: (Number(window.gameState.menuSelectedOptions.musicVolume) - 0.5) / 10,
  }),
  menuUpDown: new Howl({
    src: ['./assets/sfx/ui_menu_button_keystroke_01.wav'],
    volume: (Number(window.gameState.menuSelectedOptions.musicVolume) - 0.5) / 10,
  }),
};
