class GameMenu {
  constructor({ onComplete }) {
    this.onComplete = onComplete;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('game-menu');
    this.element.innerHTML = (`
    <h2>Game Menu</h2>
    `);
  }

  static musicControl() {
    if (window.gameState.menuSelectedOptions.isMusicActive === 'sim') {
      utils.stopMusic(window.gameState.music);
      window.gameState.menuSelectedOptions.isMusicActive = 'não';
    } else {
      utils.playMusic(window.gameState.music);
      window.gameState.menuSelectedOptions.isMusicActive = 'sim';
    }
  }

  getOptions(pageKey) {
    const backOption = {
      label: 'Voltar',
      description: 'Volta a página anterior',
      handler: () => {
        this.keyboardMenu.setOptions(this.getOptions('root'));
      },
    };

    if (pageKey === 'root') {
      return [
        {
          label: 'Salvar',
          description: 'Salve seu progresso',
          handler: () => {
            console.log('botão de salvar');
          },
        },
        {
          label: 'Opções',
          description: 'Painel de configurações do jogo',
          handler: () => {
            this.keyboardMenu.setOptions(this.getOptions('options'));
          },
        },
        {
          label: 'Fechar',
          description: 'Fecha o menu',
          handler: () => {
            this.close();
          },
        },
      ];
    }

    if (pageKey === 'options') {
      return [
        {
          label: 'Controle da música',
          description: 'Escolha se quer escutar as músicas do jogo',
          handler: () => {
            GameMenu.musicControl();
          },
        },
        // {
        //   label: 'Volume da música',
        //   description: 'Aumenta ou diminui o volume da música',
        //   handler: () => {
        //     this.keyboardMenu.setOptions(this.getOptions('musicVolume'));
        //   },
        // },
        {
          label: 'Aumentar volume',
          description: 'Aumenta o volume da música',
          handler: () => {
            if (window.gameState.menuSelectedOptions.musicVolume < 10) {
              const actualVol = window.gameState.menuSelectedOptions.musicVolume;
              window.gameState.menuSelectedOptions.musicVolume = (Number(actualVol) + 1).toString();
              const newVol = window.gameState.menuSelectedOptions.musicVolume / 10;
              window.music[window.gameState.music].volume(newVol);
            }
          },
        },
        {
          label: 'Diminuir volume',
          description: 'Diminui o volume da música',
          handler: () => {
            if (window.gameState.menuSelectedOptions.musicVolume > 1) {
              window.gameState.menuSelectedOptions.musicVolume -= 1;
              const newVol = window.gameState.menuSelectedOptions.musicVolume / 10;
              window.music[window.gameState.music].volume(newVol);
            }
          },
        },
        backOption,
        {
          label: 'Fechar',
          description: 'Fecha o menu',
          handler: () => {
            this.close();
          },
        },
      ];
    }

    if (pageKey === 'musicVolume') {
      return [
        {
          label: '10% do Volume',
          description: 'Escolha se quer escutar as músicas do jogo',
          handler: () => {
            window.gameState.menuSelectedOptions.musicVolume = 1;
            window.music[window.gameState.music].volume(0.1);
          },
        },
        {
          label: '20% do Volume',
          description: 'Escolha se quer escutar as músicas do jogo',
          handler: () => {
            window.gameState.menuSelectedOptions.musicVolume = 2;
            window.music[window.gameState.music].volume(0.2);
          },
        },
        {
          label: '30% do Volume',
          description: 'Escolha se quer escutar as músicas do jogo',
          handler: () => {
            window.gameState.menuSelectedOptions.musicVolume = 3;
            window.music[window.gameState.music].volume(0.3);
          },
        },
        {
          label: '40% do Volume',
          description: 'Escolha se quer escutar as músicas do jogo',
          handler: () => {
            window.gameState.menuSelectedOptions.musicVolume = 4;
            window.music[window.gameState.music].volume(0.4);
          },
        },
        {
          label: '50% do Volume',
          description: 'Escolha se quer escutar as músicas do jogo',
          handler: () => {
            window.gameState.menuSelectedOptions.musicVolume = 5;
            window.music[window.gameState.music].volume(0.5);
          },
        },
        {
          label: '60% do Volume',
          description: 'Escolha se quer escutar as músicas do jogo',
          handler: () => {
            window.gameState.menuSelectedOptions.musicVolume = 6;
            window.music[window.gameState.music].volume(0.6);
          },
        },
        {
          label: '70% do Volume',
          description: 'Escolha se quer escutar as músicas do jogo',
          handler: () => {
            window.gameState.menuSelectedOptions.musicVolume = 7;
            window.music[window.gameState.music].volume(0.7);
          },
        },
        {
          label: '80% do Volume',
          description: 'Escolha se quer escutar as músicas do jogo',
          handler: () => {
            window.gameState.menuSelectedOptions.musicVolume = 8;
            window.music[window.gameState.music].volume(0.8);
          },
        },
        {
          label: '90% do Volume',
          description: 'Escolha se quer escutar as músicas do jogo',
          handler: () => {
            window.gameState.menuSelectedOptions.musicVolume = 9;
            window.music[window.gameState.music].volume(0.9);
          },
        },
        {
          label: '100% do Volume',
          description: 'Aumenta ou diminui o volume da música',
          handler: () => {
            window.gameState.menuSelectedOptions.musicVolume = 10;
            window.music[window.gameState.music].volume(1);
          },
        },
        backOption,
        {
          label: 'Fechar',
          description: 'Fecha o menu',
          handler: () => {
            this.close();
          },
        },
      ];
    }
    return [];
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  async init(container) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container,
    });
    this.keyboardMenu.init(this.element, null);
    this.keyboardMenu.setOptions(this.getOptions('root'));
    container.appendChild(this.element);

    utils.wait(200);
    this.esc = new KeyPressListener('Escape', () => {
      this.close();
    });
    this.esc.init();
  }
}
