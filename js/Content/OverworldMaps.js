
window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: '../assets/images/maps/DemoLower.png',
    upperSrc: '../assets/images/maps/DemoUpper.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(3),
        y: utils.withGrid(6),
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
          { type: 'stand', direction: 'up', time: 3000 },
        ],
        talking: [
          {
            events: [
              { faceHero: 'npcA', type: 'textMessage', text: 'Estou ocupado!' },
              { type: 'textMessage', text: 'Vá logo entregar as pizzas menino!' },
            ],
          },
        ],
      }),
      npcB: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: '../assets/images/characters/people/npc2.png',
        talking: [
          {
            events: [
              { faceHero: 'npcB', type: 'textMessage', text: 'Você não pode entrar.' },
            ],
          },
        ],
      }),
      npcC: new Person({
        x: utils.withGrid(2),
        y: utils.withGrid(6),
        src: '../assets/images/characters/people/npc5.png',
        talking: [
          {
            events: [
              // { faceHero: 'npcC', type: 'textMessage', text: 'Então bora correr!' },
              { faceHero: 'npcC', who: 'npcC', type: 'race' },
              { type: 'textMessage', text: '{depends on}' }
            ],
          },
        ],
      }),
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7, 4)]: [
        {
          events: [
            { who: 'npcB', type: 'walk', direction: 'left' },
            { who: 'npcB', type: 'stand', direction: 'up', time: 300 },
            { type: 'textMessage', text: 'Não entre aí!' },
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
        talking: [
          {
            events: [
              { faceHero: 'npcA', type: 'textMessage', text: 'Você não tem o que fazer não?' },
            ],
          },
        ],
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
          },
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
    },
    walls: {
      //up
      [utils.asGridCoord(1, 4)]: true,
      [utils.asGridCoord(2, 3)]: true,
      [utils.asGridCoord(11, 4)]: true,

      //objects
      [utils.asGridCoord(6, 7)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(9, 7)]: true,
      [utils.asGridCoord(10, 7)]: true,
      [utils.asGridCoord(9, 9)]: true,
      [utils.asGridCoord(10, 9)]: true,
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
    },
  },
};
