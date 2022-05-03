class PauseMenu {
  constructor(config) {
    this.onComplete = config.onComplete;
  }

  getPages() {
    const backOption = {
      label: 'Voltar',
      description: 'Volta a página anterior',
      handler: () => {
        this.keyboardMenu.setOptions(this.getPages().root);
      }
    };

    return {
      root: [
        {
          label: 'Ataque',
          description: "Escolha um ataque",
          handler: () => {
            this.keyboardMenu.setOptions(this.getPages().attacks);
          },
        },
        {
          label: 'Items',
          description: "Escolha um item",
          handler: () => {
            console.log('página de items');
          },
        },
        {
          label: 'Troca',
          description: "Escolha outro pokémon",
          handler: () => {
            console.log('página de troca');
          },
        },
      ],
      attacks: [
        {
          label: 'My first atk',
          description: 'Does something',
          handler: () => {
            console.log('attack!')
          }
        },
        backOption,
      ],
      items: [
        backOption,
      ],
    };
  };

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container, 'pause-menu');
    this.keyboardMenu.setOptions(this.getPages().root);
  };

  init(container) {
    this.showMenu(container)
  };
};
