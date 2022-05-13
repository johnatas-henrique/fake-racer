class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc || '../assets/images/maps/clean.png';

    this.middleImage = new Image();
    this.middleImage.src = config.middleSrc || '../assets/images/maps/clean.png';

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc || '../assets/images/maps/clean.png';

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(cameraPerson.canvasMidpoint.x / 16 - 1) - cameraPerson.x,
      utils.withGrid(cameraPerson.canvasMidpoint.y / 16 - 1) - cameraPerson.y,
    );
  }

  drawMiddleImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.middleImage,
      utils.withGrid(cameraPerson.canvasMidpoint.x / 16 - 1) - cameraPerson.x,
      utils.withGrid(cameraPerson.canvasMidpoint.y / 16 - 1) - cameraPerson.y,
    );
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(cameraPerson.canvasMidpoint.x / 16 - 1) - cameraPerson.x,
      utils.withGrid(cameraPerson.canvasMidpoint.y / 16 - 1) - cameraPerson.y,
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      const object = this.gameObjects[key];
      object.id = key;
      object.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    // Loop of async events
    for (let i = 0; i < events.length; i += 1) {
      const eventHandler = new OverworldEvent(
        { event: events[i], map: this },
      );

      // Contrary to ESLint rule believes, I can't use a Promise.all here,
      // because I want every event to finish before the next fires.
      // If I fire all events together, the movement will be broken.

      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    Object.values(this.gameObjects).forEach((item) => item.doBehaviorEvent(this));
  }

  helperCheckHeroMapPosition() {
    const { hero } = this.gameObjects;
    console.table({ x: hero.x / 16, y: hero.y / 16 });
  }

  checkForActionCutscene() {
    const { hero } = this.gameObjects;
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((item) => `${item.x},${item.y}` === `${nextCoords.x},${nextCoords.y}`);

    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    }
  }

  checkForFootstepCutscene() {
    const { hero } = this.gameObjects;
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];

    if (!this.isCutscenePlaying && match && match.length) {
      this.startCutscene(match[0].events);
    }
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }

  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }

  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}
