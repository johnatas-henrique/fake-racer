class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
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
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: '../assets/images/maps/DemoLower.png',
    upperSrc: '../assets/images/maps/DemoUpper.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5), y: utils.withGrid(6),
      }),
      npc1: new Person({
        x: utils.withGrid(7), y: utils.withGrid(9),
        src: '../assets/images/characters/people/npc1.png',
      })
    }
  },
  Kitchen: {
    lowerSrc: '../assets/images/maps/KitchenLower.png',
    upperSrc: '../assets/images/maps/KitchenUpper.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(3), y: utils.withGrid(5),
      }),
      npcA: new Person({
        x: utils.withGrid(9), y: utils.withGrid(6),
        src: '../assets/images/characters/people/npc2.png',
      }),
      npcB: new Person({
        x: utils.withGrid(10), y: utils.withGrid(8),
        src: '../assets/images/characters/people/npc3.png',
      }),
    }
  },
}
