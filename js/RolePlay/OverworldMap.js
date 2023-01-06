import utils from '../Core/utils.js';
import Person from './Person.js';
import GameObject from './GameObject.js';
import OverworldEvent from './OverworldEvent.js';

class OverworldMap {
  constructor(config) {
    this.overworld = null;

    this.gameObjects = {};
    this.configObjects = config.configObjects;

    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc || '../assets/images/maps/clean.png';

    this.middleImage = new Image();
    this.middleImage.src = config.middleSrc || '../assets/images/maps/clean.png';

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc || '../assets/images/maps/clean.png';

    this.isCutscenePlaying = false;
    this.eventHandler = null;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(cameraPerson.canvasMidpoint.x / utils.pixelBase - 1) - cameraPerson.x,
      utils.withGrid(cameraPerson.canvasMidpoint.y / utils.pixelBase - 1) - cameraPerson.y,
    );
  }

  drawMiddleImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.middleImage,
      utils.withGrid(cameraPerson.canvasMidpoint.x / utils.pixelBase - 1) - cameraPerson.x,
      utils.withGrid(cameraPerson.canvasMidpoint.y / utils.pixelBase - 1) - cameraPerson.y,
    );
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(cameraPerson.canvasMidpoint.x / utils.pixelBase - 1) - cameraPerson.x,
      utils.withGrid(cameraPerson.canvasMidpoint.y / utils.pixelBase - 1) - cameraPerson.y,
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    if (this.walls[`${x},${y}`]) return true;

    const result = Object.values(this.gameObjects).find((obj) => {
      if (obj.x === x && obj.y === y) {
        return true;
      }
      if (obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition[1] === y) {
        return true;
      }
      return false;
    });
    return result;
  }

  mountObjects() {
    Object.keys(this.configObjects).forEach((key) => {
      const object = this.configObjects[key];
      object.id = key;
      object.progress = this.overworld.progress;

      let instance;
      if (object.type === 'Person') {
        instance = new Person(object);
      }
      if (object.type === 'GameObject') {
        instance = new GameObject(object);
      }

      this.gameObjects[key] = instance;
      this.gameObjects[key].id = key;

      instance.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;
    let loseRace = null;
    // Loop of async events
    for (let i = 0; i < events.length; i += 1) {
      this.eventHandler = new OverworldEvent(
        { event: events[i], map: this },
      );

      // Contrary to ESLint rule believes, I can't use a Promise.all here,
      // because I want every event to finish before the next fires.
      // If I fire all events together, the movement will be broken.

      // eslint-disable-next-line no-await-in-loop
      const result = await this.eventHandler.init();
      if (result === 'LOST_RACE') {
        loseRace = 'LOSE_';
        break;
      }
    }

    const npc = this.eventHandler?.event.npc;
    const eventName = `${loseRace}${npc}`;
    if (window.playerState.storyFlags[eventName] && loseRace) {
      this.isCutscenePlaying = true;
      const { savedMap } = window.playerState;
      const npcTalkingEvents = window.overworldMaps[savedMap].gameObjects[npc].talking;
      const afterLoseCutscene = npcTalkingEvents
        .find((item) => item.required?.find((rpgEvent) => rpgEvent === eventName));
      return this.startCutscene(afterLoseCutscene.events);
    }

    this.isCutscenePlaying = false;
  }

  helperCheckHeroMapPosition() {
    const { hero } = this.gameObjects;
    console.table({ x: hero.x / 16, y: hero.y / 16 });
  }

  checkForActionCutscene() {
    const { hero } = this.gameObjects;
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects)
      .find((item) => `${item.x},${item.y}` === `${nextCoords.x},${nextCoords.y}`);

    if (!this.isCutscenePlaying && match && match.talking.length) {
      const relevantScenario = match.talking
        .find((scene) => (scene.required || []).every((sf) => window.playerState.storyFlags[sf]));

      if (relevantScenario) {
        this.startCutscene(relevantScenario.events);
      }
    }
  }

  checkForFootstepCutscene() {
    const { hero } = this.gameObjects;
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];

    if (!this.isCutscenePlaying && match && match.length) {
      const relevantScenario = match
        .find((scene) => (scene.required || []).every((sf) => window.playerState.storyFlags[sf]));

      if (relevantScenario) {
        this.startCutscene(relevantScenario.events);
      }
    }
  }
}

export default OverworldMap;
