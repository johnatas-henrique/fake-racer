class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx) {
    ctx.drawImage(this.lowerImage, 0, 0);
  }
  drawUpperImage(ctx) {
    ctx.drawImage(this.upperImage, 0, 0);
  }
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: '../assets/images/maps/DemoLower.png',
    upperSrc: '../assets/images/maps/DemoUpper.png',
    gameObjects: {
      hero: new GameObject({
        x: 5, y: 6,
      }),
      npc1: new GameObject({
        x: 7, y: 9, src: '../assets/images/characters/people/npc1.png'
      })
    }
  },
  Kitchen: {
    lowerSrc: '../assets/images/maps/KitchenLower.png',
    upperSrc: '../assets/images/maps/KitchenUpper.png',
    gameObjects: {
      hero: new GameObject({
        x: 3, y: 5,
      }),
      npcA: new GameObject({
        x: 9, y: 6, src: '../assets/images/characters/people/npc2.png'
      }),
      npcB: new GameObject({
        x: 10, y: 8, src: '../assets/images/characters/people/npc3.png'
      }),
    }
  },
}
