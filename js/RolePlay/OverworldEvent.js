import utils from '../Core/utils.js';
import TextMessage from './TextMessage.js';
import SceneTransition from './SceneTransition.js';
import RaceScene from './RaceScene.js';
import GameMenu from './GameMenu.js';
import InputElement from './InputElement.js';
import InventoryScreen from './InventoryScreen.js';

class OverworldEvent {
  constructor(config) {
    this.map = config.map;
    this.event = config.event;
  }

  stand(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior(
      { map: this.map },
      { type: 'stand', direction: this.event.direction, time: this.event.time },
    );

    // Handler to complete when correct person has walked and resolve the promise
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonStandingComplete', completeHandler);
        resolve();
      }
    };

    document.addEventListener('PersonStandingComplete', completeHandler);
  }

  walk(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior(
      { map: this.map },
      { type: 'walk', direction: this.event.direction, retry: true },
    );

    // Handler to complete when correct person has walked and resolve the promise
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonWalkingComplete', completeHandler);
        resolve();
      }
    };
    document.addEventListener('PersonWalkingComplete', completeHandler);
  }

  textMessage(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects.hero.direction);
    }
    const message = new TextMessage({
      gameObjects: this.map.gameObjects,
      who: this.event.who,
      text: this.event.text,
      onComplete: () => resolve(),
    });

    message.init(document.querySelector('.game-container'));
    window.sfx.talking.play();
  }

  changeMap(resolve) {
    Object.values(this.map.gameObjects).forEach((obj) => {
      obj.isMounted = false;
    });

    const mapTransition = new SceneTransition();
    window.playerState.savedMap = this.event.map;
    mapTransition.init(
      'map-transition',
      document.querySelector('.game-container'),
      () => {
        this.map.overworld.startMap(
          window.overworldMaps[this.event.map],
          { x: this.event.x, y: this.event.y, direction: this.event.direction },
        );

        utils.emitEvent('HudUpdate');
        resolve();
        mapTransition.fadeOut();
      },
    );
  }

  enterRaceAnimation(resolve) {
    document.querySelector('.Hud').classList.add('hidden');
    const oldBaloon = this.map.gameObjects.conversationBaloon;
    oldBaloon.showItem = false;

    const battleTransition = new SceneTransition();
    battleTransition.init(
      'battle-transition',
      document.querySelector('.game-container'),
      () => {
        resolve();
        battleTransition.fadeOut();
      },
    );
    window.sfx.enterRace.stop();
  }

  pause(resolve) {
    this.map.overworld.core.isPaused = true;
    const menu = new GameMenu({
      progress: this.map.overworld.progress,
      onComplete: () => {
        resolve();
        this.map.overworld.core.isPaused = false;
        this.map.overworld.core.startGameLoop();
      },
    });
    menu.init(utils.htmlElements.gameContainer());
  }

  race(resolve) {
    this.raceScene = new RaceScene({
      map: this.map,
      event: this.event,
      onComplete: (didWin) => {
        resolve(didWin ? 'WON_RACE' : 'LOST_RACE');
      },
    });

    this.raceScene.init();
  }

  addStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = true;
    resolve();
  }

  deleteStoryFlag(resolve) {
    delete window.playerState.storyFlags[this.event.flag];
    resolve();
  }

  showRaceBaloon(resolve) {
    window.sfx.enterRace.play();
    const personTalked = this.map.gameObjects[this.event.who];
    const oldBaloon = this.map.gameObjects.conversationBaloon;
    oldBaloon.showItem = true;
    oldBaloon.x = personTalked.x;
    oldBaloon.y = personTalked.y - 15.9;
    resolve();
  }

  giveGoodies(resolve) {
    setTimeout(() => {
      const { goodies } = window.races[this.event.raceId];
      const changeGas = goodies.gas || 0;
      const changeXp = goodies.xp || 0;
      window.playerState.updateGas(changeGas);
      window.playerState.updateXp(changeXp);

      window.playerState.money += goodies.money || 0;
      utils.emitEvent('HudUpdate');
      resolve();
    }, 1200);
  }

  changeName(resolve) {
    const newInput = new InputElement({
      onComplete: () => resolve(),
      event: this.event,
    });
    newInput.init(document.querySelector('.game-container'));
  }

  showInventory(resolve) {
    const newInput = new InventoryScreen({
      onComplete: () => resolve(),
      event: this.event,
    });
    newInput.init(document.querySelector('.game-container'));
  }

  async init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}

export default OverworldEvent;
