import utils from '../Core/utils.js';

class PlayerState {
  constructor() {
    this.name = 'Adam';
    this.level = 1;
    this.gas = 5;
    this.maxGas = 100;
    this.xp = 5;
    this.maxXp = 100;
    this.money = 200;
    this.savedMap = 'DemoRoom';
    this.items = [
      { actionId: 'bike', type: 'history' },
      { actionId: 'gas1', type: 'consumable', quantity: 3 },
      { actionId: 'taw', type: 'consumable', quantity: 2 },
    ];
    this.storyFlags = {
      KITCHEN_BLOCKED: true,
      TALKED_TO_Bob_DemoRoom: true,
      TALKED_TO_Carol_DemoRoom: true,
    };
  }

  updateGas(updatedGas) {
    if ((this.gas + updatedGas) >= this.maxGas) {
      this.gas = this.maxGas;
      return;
    }

    if ((this.gas + updatedGas) <= 0) {
      this.gas = 0;
      return;
    }

    this.gas += updatedGas;
  }

  updateXp(updatedXp) {
    if ((this.xp + updatedXp) < this.maxXp) {
      this.xp += updatedXp;
      return;
    }
    if ((this.xp + updatedXp) >= this.maxXp) {
      const levelUpXp = this.xp + updatedXp;
      this.xp = this.maxXp;
      utils.emitEvent('HudUpdate');

      setTimeout(() => {
        this.xp = 0;
        utils.emitEvent('HudRecreate');
      }, 1100);

      setTimeout(() => {
        this.level += 1;
        this.xp = levelUpXp - this.maxXp;
        this.maxXp = this.level * 100;
        utils.emitEvent('HudUpdate');
        if (this.xp >= this.maxXp) {
          this.updateXp(0);
        }
      }, 2200);
    }
  }
}

window.playerState = new PlayerState();
