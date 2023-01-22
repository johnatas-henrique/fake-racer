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
    const transparentImage = '../assets/images/maps/clean.png';

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc || transparentImage;

    this.middleImage = new Image();
    this.middleImage.src = config.middleSrc || transparentImage;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc || transparentImage;

    this.isCutscenePlaying = false;
    this.eventHandler = null;
  }

  drawLowerImage(ctx, cameraPerson) {
    const { canvasMidpoint, x, y } = cameraPerson;
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(canvasMidpoint.x / utils.pixelBase - 1) - x,
      utils.withGrid(canvasMidpoint.y / utils.pixelBase - 1) - y,
    );
  }

  drawMiddleImage(ctx, cameraPerson) {
    const { canvasMidpoint, x, y } = cameraPerson;
    ctx.drawImage(
      this.middleImage,
      utils.withGrid(canvasMidpoint.x / utils.pixelBase - 1) - x,
      utils.withGrid(canvasMidpoint.y / utils.pixelBase - 1) - y,
    );
  }

  drawUpperImage(ctx, cameraPerson) {
    const { canvasMidpoint, x, y } = cameraPerson;
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(canvasMidpoint.x / utils.pixelBase - 1) - x,
      utils.withGrid(canvasMidpoint.y / utils.pixelBase - 1) - y,
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x: nextPosX, y: nextPosY } = utils.nextPosition(currentX, currentY, direction);
    if (this.walls[`${nextPosX},${nextPosY}`]) {
      return true;
    }

    const result = Object.values(this.gameObjects).find(({ x, y, intentPosition }) => {
      if (x === nextPosX && y === nextPosY) {
        return true;
      }
      if (intentPosition && intentPosition[0] === nextPosX && intentPosition[1] === nextPosY) {
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
      this.eventHandler = new OverworldEvent({ event: events[i], map: this });

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
      const npcTalkingEvents = window.overworldMaps[savedMap].configObjects[npc].talking;
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
