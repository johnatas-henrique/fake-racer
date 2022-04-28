class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  };

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(cameraPerson.canvasMidpoint.x / 16 - 1) - cameraPerson.x,
      utils.withGrid(cameraPerson.canvasMidpoint.y / 16 - 1) - cameraPerson.y,
    );
  };

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(cameraPerson.canvasMidpoint.x / 16 - 1) - cameraPerson.x,
      utils.withGrid(cameraPerson.canvasMidpoint.y / 16 - 1) - cameraPerson.y,
    );
  };

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  };

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      const object = this.gameObjects[key];
      object.id = key;
      object.mount(this);
    })
  };

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    //Loop of async events
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent(
        { event: events[i], map: this }
      );

      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    Object.values(this.gameObjects).forEach(item => item.doBehaviorEvent(this));
  };

  helperCheckHeroMapPosition() {
    const hero = this.gameObjects['hero'];
    console.log({ x: hero.x / 16, y: hero.y / 16 });
  };

  checkForActionCutscene() {
    const hero = this.gameObjects['hero'];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(item => {
      return `${item.x},${item.y}` === `${nextCoords.x},${nextCoords.y}`;
    });

    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    };
  };

  checkForFootstepCutscene() {
    const hero = this.gameObjects['hero'];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];

    if (!this.isCutscenePlaying && match && match.length) {
      this.startCutscene(match[0].events);
    };
  };

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  };

  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  };

  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  };
};

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: '../assets/images/maps/DemoLower.png',
    upperSrc: '../assets/images/maps/DemoUpper.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(7),
        y: utils.withGrid(5),
        src: '../assets/images/characters/people/hero.png',
      }),
      npcA: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: '../assets/images/characters/people/npc1.png',
        behaviorLoop: [
          { type: 'stand', direction: 'left', time: 800 },
          { type: 'stand', direction: 'up', time: 800 },
          { type: 'stand', direction: 'right', time: 1200 },
          { type: 'stand', direction: 'up', time: 300 },
        ],
        talking: [
          {
            events: [
              { faceHero: 'npcA', type: 'textMessage', text: 'Estou ocupado!' },
              { type: 'textMessage', text: 'Vá logo entregar as pizzas menino!' },
            ],
          }
        ],
      }),
      npcB: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: '../assets/images/characters/people/npc2.png',
        // behaviorLoop: [
        //   { type: 'walk', direction: 'left' },
        //   { type: 'stand', direction: 'up', time: 800 },
        //   { type: 'walk', direction: 'up' },
        //   { type: 'walk', direction: 'right' },
        //   { type: 'stand', direction: 'right', time: 800 },
        //   { type: 'walk', direction: 'down' },
        // ],
        talking: [
          {
            events: [
              { faceHero: 'npcB', type: 'textMessage', text: 'Então bora correr!' },
              { who: 'npcB', type: 'race' },
              { type: 'textMessage', text: '{depends on}' }
            ],
          }
        ],
      }),
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7, 4)]: [
        {
          events: [
            { who: 'npcB', type: 'walk', direction: 'left' },
            { who: 'npcB', type: 'stand', direction: 'up', time: 300 },
            { type: 'textMessage', text: 'Você não pode entrar aí!' },
            { who: 'npcB', type: 'walk', direction: 'right' },
            { who: 'hero', type: 'walk', direction: 'down' },
            { who: 'hero', type: 'walk', direction: 'left' },
            { who: 'npcB', type: 'stand', direction: 'down', time: 300 },
          ],
        },
      ],
      [utils.asGridCoord(5, 10)]: [
        {
          events: [
            { type: 'changeMap', map: 'Kitchen' },
          ],
        },
      ],
    },
    walls: {
      //up
      [utils.asGridCoord(1, 3)]: true,
      [utils.asGridCoord(2, 3)]: true,
      [utils.asGridCoord(3, 3)]: true,
      [utils.asGridCoord(4, 3)]: true,
      [utils.asGridCoord(5, 3)]: true,
      [utils.asGridCoord(6, 3)]: true,
      [utils.asGridCoord(6, 4)]: true,
      [utils.asGridCoord(7, 3)]: true,
      [utils.asGridCoord(8, 3)]: true,
      [utils.asGridCoord(8, 4)]: true,
      [utils.asGridCoord(9, 3)]: true,
      [utils.asGridCoord(10, 3)]: true,

      //down
      [utils.asGridCoord(1, 10)]: true,
      [utils.asGridCoord(2, 10)]: true,
      [utils.asGridCoord(3, 10)]: true,
      [utils.asGridCoord(4, 10)]: true,
      [utils.asGridCoord(5, 11)]: true,
      [utils.asGridCoord(6, 10)]: true,
      [utils.asGridCoord(7, 10)]: true,
      [utils.asGridCoord(8, 10)]: true,
      [utils.asGridCoord(9, 10)]: true,
      [utils.asGridCoord(10, 10)]: true,

      //left
      [utils.asGridCoord(0, 4)]: true,
      [utils.asGridCoord(0, 5)]: true,
      [utils.asGridCoord(0, 6)]: true,
      [utils.asGridCoord(0, 7)]: true,
      [utils.asGridCoord(0, 8)]: true,
      [utils.asGridCoord(0, 9)]: true,

      //right
      [utils.asGridCoord(11, 4)]: true,
      [utils.asGridCoord(11, 5)]: true,
      [utils.asGridCoord(11, 6)]: true,
      [utils.asGridCoord(11, 7)]: true,
      [utils.asGridCoord(11, 8)]: true,
      [utils.asGridCoord(11, 9)]: true,

      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true,
    },
  },
  Kitchen: {
    lowerSrc: '../assets/images/maps/KitchenLower.png',
    upperSrc: '../assets/images/maps/KitchenUpper.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(3),
        y: utils.withGrid(9),
      }),
      npcA: new Person({
        x: utils.withGrid(9),
        y: utils.withGrid(6),
        src: '../assets/images/characters/people/npc4.png',
      }),
      npcB: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(8),
        src: '../assets/images/characters/people/npc3.png',
        talking: [
          {
            events: [
              { faceHero: 'npcB', type: 'textMessage', text: 'Como você entrou aqui?' },
            ],
          }
        ],
      }),
    },
    cutsceneSpaces: {
      [utils.asGridCoord(5, 10)]: [
        {
          events: [
            { type: 'changeMap', map: 'DemoRoom' },
          ],
        },
      ],
    }
  },
  PizzaShop: {
    lowerSrc: '../assets/images/maps/PizzaShopLower.png',
    upperSrc: '../assets/images/maps/PizzaShopUpper.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(1), y: utils.withGrid(7),
      }),
      npcA: new Person({
        x: utils.withGrid(4), y: utils.withGrid(11),
        src: '../assets/images/characters/people/npc2.png',
      }),
      npcB: new Person({
        x: utils.withGrid(9), y: utils.withGrid(10),
        src: '../assets/images/characters/people/npc3.png',
      }),
    }
  },
};
