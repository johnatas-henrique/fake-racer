window.overworldMaps = {
  DemoRoom: {
    lowerSrc: '../assets/images/maps/DemoLower.png',
    upperSrc: '../assets/images/maps/DemoUpper.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
        src: '../assets/images/characters/people/hero.png',
      }),
      conversationBaloon: new GameObject({
        x: utils.withGrid(3),
        y: utils.withGrid(4),
        src: '../assets/images/ui/UI_angry_emote_16x16.png',
        sizeX: 1,
        currentAnimation: 'change-right-4',
        showItem: false,
      }),
      Carol_DemoRoom: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: '../assets/images/characters/people/schoolgirl1.png',
        behaviorLoop: [
          { type: 'stand', direction: 'right', time: 600 },
          { type: 'stand', direction: 'up', time: 1800 },
          { type: 'stand', direction: 'left', time: 600 },
          { type: 'stand', direction: 'down', time: 2000 },
        ],
        talking: [
          {
            events: [
              { who: 'Carol_DemoRoom', type: 'textMessage', text: 'Estou tão ocupada!', faceHero: 'Carol_DemoRoom' },
              { who: 'hero', type: 'textMessage', text: 'Mas a Bee...' },
              { who: 'Carol_DemoRoom', type: 'textMessage', text: 'Vá logo entregar as pizzas menino!' },
              { type: 'addStoryFlag', flag: 'TALKED_TO_Carol_DemoRoom' },
            ],
          },
        ],
      }),
      Bob_DemoRoom: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: '../assets/images/characters/people/thug1.png',
        behaviorLoop: [
          { type: 'stand', direction: 'left', time: 800 },
          { type: 'stand', direction: 'down', time: 3200 },
          { type: 'stand', direction: 'right', time: 900 },
        ],
        talking: [
          {
            required: ['WON_Bob_DemoRoom'],
            events: [
              { who: 'Bob_DemoRoom', type: 'textMessage', text: 'Será que eu ainda posso ser o guarda?', faceHero: 'Bob_DemoRoom' },
              { who: 'Bob_DemoRoom', type: 'textMessage', text: 'Pode avisar a Bee que te deixo passar.', faceHero: 'Bob_DemoRoom' },
            ],
          },
          {
            required: ['LOSE_Bob_DemoRoom'],
            events: [
              { who: 'Bob_DemoRoom', type: 'textMessage', text: 'Você é uma piada mesmo!', faceHero: 'Bob_DemoRoom' },
              { type: 'deleteStoryFlag', flag: 'LOSE_Bob_DemoRoom' },
            ],
          },
          {
            required: ['SECRET_RACE_Bob_DemoRoom'],
            events: [
              { type: 'showRaceBaloon', who: 'Bob_DemoRoom' },
              { who: 'Bob_DemoRoom', type: 'textMessage', text: 'Depois que eu te vencer, você não vai tentar mais nada!', faceHero: 'Bob_DemoRoom' },
              { type: 'enterRaceAnimation' },
              { type: 'race', raceId: 'raceB', npc: 'Bob_DemoRoom' },
              { type: 'addStoryFlag', flag: 'WON_Bob_DemoRoom' },
              { type: 'giveGoodies', raceId: 'raceB' },
              { who: 'Bob_DemoRoom', type: 'textMessage', text: 'Não posso acreditar que perdi para você...', faceHero: 'Bob_DemoRoom' },
            ],
          },
          {
            events: [
              { who: 'Bob_DemoRoom', type: 'textMessage', text: 'Você não pode entrar.', faceHero: 'Bob_DemoRoom' },
              { type: 'addStoryFlag', flag: 'TALKED_TO_Bob_DemoRoom' },
            ],
          },
        ],
      }),
      Bee_DemoRoom: new Person({
        x: utils.withGrid(2),
        y: utils.withGrid(6),
        src: '../assets/images/characters/people/bee1.png',
        behaviorLoop: [
          { type: 'stand', direction: 'up', time: 1100 },
          { type: 'stand', direction: 'left', time: 800 },
          { type: 'stand', direction: 'right', time: 2300 },
          { type: 'stand', direction: 'down', time: 4000 },
        ],
        talking: [
          {
            required: ['WON_Bob_DemoRoom', 'SECRET_RACE_Bob_DemoRoom'],
            events: [
              { who: 'Bee_DemoRoom', type: 'textMessage', text: 'Nossa, você venceu aquele maluco! Não acredito.', faceHero: 'Bee_DemoRoom' },
              { who: 'Bob_DemoRoom', type: 'walk', direction: 'left' },
              { who: 'Bob_DemoRoom', type: 'walk', direction: 'left' },
              { who: 'Bob_DemoRoom', type: 'walk', direction: 'left' },
              { who: 'Bob_DemoRoom', type: 'walk', direction: 'left' },
              { who: 'Bob_DemoRoom', type: 'stand', direction: 'down', time: 100 },
              { who: 'Bob_DemoRoom', type: 'textMessage', text: 'Sim, ele me venceu e agora ele tem todo o direito de entrar na cozinha.' },
              { who: 'Bob_DemoRoom', type: 'walk', direction: 'right' },
              { who: 'Bob_DemoRoom', type: 'walk', direction: 'right' },
              { who: 'Bob_DemoRoom', type: 'walk', direction: 'right' },
              { who: 'Bob_DemoRoom', type: 'walk', direction: 'right' },
              { who: 'Bob_DemoRoom', type: 'walk', direction: 'right' },
              { who: 'Bob_DemoRoom', type: 'stand', direction: 'down', time: 100 },
              { type: 'deleteStoryFlag', flag: 'BLOCK_KITCHEN_Bob_DemoRoom_2' },
              { type: 'deleteStoryFlag', flag: 'SECRET_RACE_Bob_DemoRoom' },
              { type: 'addStoryFlag', flag: 'KITCHEN_OPEN' },
            ],
          },
          {
            required: ['WON_Bee_DemoRoom'],
            events: [
              { who: 'Bee_DemoRoom', type: 'textMessage', text: 'Eu voltarei, mas com um carro mais rápido!', faceHero: 'Bee_DemoRoom' },
            ],
          },
          {
            required: ['LOST_Bee_DemoRoom'],
            events: [
              { type: 'showRaceBaloon', who: 'Bee_DemoRoom' },
              { who: 'Bee_DemoRoom', type: 'textMessage', text: 'Já te venci antes, posso vencer de novo!', faceHero: 'Bee_DemoRoom' },
              { type: 'enterRaceAnimation' },
              { type: 'race', raceId: 'raceB', npc: 'Bee_DemoRoom' },
              { type: 'addStoryFlag', flag: 'WON_Bee_DemoRoom' },
              { type: 'giveGoodies', raceId: 'raceB' },
              { who: 'Bee_DemoRoom', type: 'textMessage', text: 'Não posso acreditar que perdi para você...', faceHero: 'Bee_DemoRoom' },
            ],
          },
          {
            required: ['TALKED_TO_Carol_DemoRoom', 'TALKED_TO_Bob_DemoRoom'],
            events: [
              { type: 'showRaceBaloon', who: 'Bee_DemoRoom' },
              { who: 'Bee_DemoRoom', type: 'textMessage', text: 'Então bora correr!', faceHero: 'Bee_DemoRoom' },
              { type: 'enterRaceAnimation' },
              { type: 'race', raceId: 'raceA', npc: 'Bee_DemoRoom' },
              { type: 'addStoryFlag', flag: 'WON_Bee_DemoRoom' },
              { type: 'giveGoodies', raceId: 'raceB' },
              { who: 'Bee_DemoRoom', type: 'textMessage', text: 'Não posso acreditar que perdi para você...', faceHero: 'Bee_DemoRoom' },
            ],
          },
          {
            required: ['TALKED_TO_Bob_DemoRoom'],
            events: [
              { who: 'Bee_DemoRoom', type: 'textMessage', text: 'Fale com a Carol, ela está nervosa.', faceHero: 'Bee_DemoRoom' },
            ],
          },
          {
            events: [
              { who: 'Bee_DemoRoom', type: 'textMessage', text: 'O Bob não quer deixar ninguém passar.', faceHero: 'Bee_DemoRoom' },
            ],
          },
        ],
      }),
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7, 4)]: [
        {
          required: ['KITCHEN_OPEN'],
          events: [
            { who: 'Bob_DemoRoom', type: 'textMessage', text: 'Não conta pra ninguém que te deixei passar' },
            {
              type: 'changeMap',
              map: 'Kitchen',
              x: utils.withGrid(5),
              y: utils.withGrid(9),
              direction: 'up',
            },
          ],
        },
        {
          required: ['BLOCK_KITCHEN_Bob_DemoRoom_2'],
          events: [
            { who: 'Bob_DemoRoom', type: 'walk', direction: 'left' },
            { who: 'Bob_DemoRoom', type: 'stand', direction: 'up', time: 300 },
            { who: 'Bob_DemoRoom', type: 'textMessage', text: 'Ok engraçadinho, saia daí agora!' },
            { who: 'Bob_DemoRoom', type: 'walk', direction: 'right' },
            { who: 'hero', type: 'walk', direction: 'down' },
            { who: 'hero', type: 'walk', direction: 'left' },
            { who: 'Bob_DemoRoom', type: 'walk', direction: 'left' },
            { who: 'Bob_DemoRoom', type: 'stand', direction: 'down', time: 300 },
            { who: 'Bob_DemoRoom', type: 'textMessage', text: 'Quero ver você passar por mim!' },
            { type: 'addStoryFlag', flag: 'SECRET_RACE_Bob_DemoRoom' },
          ],
        },
        {
          required: ['BLOCK_KITCHEN_Bob_DemoRoom_1'],
          events: [
            { who: 'Bob_DemoRoom', type: 'walk', direction: 'left' },
            { who: 'Bob_DemoRoom', type: 'stand', direction: 'up', time: 300 },
            { who: 'Bob_DemoRoom', type: 'textMessage', text: 'Você é surdo?' },
            { who: 'Bob_DemoRoom', type: 'walk', direction: 'right' },
            { who: 'hero', type: 'walk', direction: 'down' },
            { who: 'hero', type: 'walk', direction: 'left' },
            { who: 'Bob_DemoRoom', type: 'stand', direction: 'down', time: 300 },
            { type: 'deleteStoryFlag', flag: 'BLOCK_KITCHEN_Bob_DemoRoom_1' },
            { type: 'addStoryFlag', flag: 'BLOCK_KITCHEN_Bob_DemoRoom_2' },
          ],
        },
        {
          required: ['KITCHEN_BLOCKED'],
          events: [
            { who: 'Bob_DemoRoom', type: 'walk', direction: 'left' },
            { who: 'Bob_DemoRoom', type: 'stand', direction: 'up', time: 300 },
            { who: 'Bob_DemoRoom', type: 'textMessage', text: 'Não entre aí!' },
            { who: 'Bob_DemoRoom', type: 'walk', direction: 'right' },
            { who: 'hero', type: 'walk', direction: 'down' },
            { who: 'hero', type: 'walk', direction: 'left' },
            { who: 'Bob_DemoRoom', type: 'stand', direction: 'down', time: 300 },
            { type: 'addStoryFlag', flag: 'BLOCK_KITCHEN_Bob_DemoRoom_1' },
            { type: 'addStoryFlag', flag: 'TALKED_TO_Bob_DemoRoom' },
          ],
        },
      ],
      [utils.asGridCoord(5, 10)]: [
        {
          required: ['WON_Bee_DemoRoom'],
          events: [
            {
              type: 'changeMap',
              map: 'PizzaShop',
              x: utils.withGrid(5),
              y: utils.withGrid(11),
              direction: 'up',
            },
          ],
        },
        {
          events: [
            { who: 'Bee_DemoRoom', type: 'walk', direction: 'down' },
            { who: 'Bee_DemoRoom', type: 'walk', direction: 'right' },
            { who: 'Bee_DemoRoom', type: 'walk', direction: 'down' },
            { who: 'Bee_DemoRoom', type: 'walk', direction: 'right' },
            { who: 'Bee_DemoRoom', type: 'walk', direction: 'down' },
            { who: 'Bee_DemoRoom', type: 'walk', direction: 'right' },
            { who: 'Bee_DemoRoom', type: 'stand', direction: 'down', time: 300 },
            { who: 'hero', type: 'stand', direction: 'up', time: 300 },
            { who: 'Bee_DemoRoom', type: 'textMessage', text: 'Não te avisaram para não sair sem falar comigo?' },
            { who: 'Bee_DemoRoom', type: 'walk', direction: 'up' },
            { who: 'hero', type: 'walk', direction: 'up' },
            { who: 'Bee_DemoRoom', type: 'walk', direction: 'left' },
            { who: 'Bee_DemoRoom', type: 'walk', direction: 'up' },
            { who: 'Bee_DemoRoom', type: 'walk', direction: 'left' },
            { who: 'Bee_DemoRoom', type: 'walk', direction: 'up' },
            { who: 'Bee_DemoRoom', type: 'walk', direction: 'left' },
            { who: 'Bee_DemoRoom', type: 'stand', direction: 'down', time: 300 },
          ],
        },
      ],
    },
    walls: {
      // up
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

      // down
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

      // left
      [utils.asGridCoord(0, 4)]: true,
      [utils.asGridCoord(0, 5)]: true,
      [utils.asGridCoord(0, 6)]: true,
      [utils.asGridCoord(0, 7)]: true,
      [utils.asGridCoord(0, 8)]: true,
      [utils.asGridCoord(0, 9)]: true,

      // right
      [utils.asGridCoord(11, 4)]: true,
      [utils.asGridCoord(11, 5)]: true,
      [utils.asGridCoord(11, 6)]: true,
      [utils.asGridCoord(11, 7)]: true,
      [utils.asGridCoord(11, 8)]: true,
      [utils.asGridCoord(11, 9)]: true,

      // fakeGameObjects
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
        src: '../assets/images/characters/people/hero.png',
      }),
      Carol_DemoRoom: new Person({
        x: utils.withGrid(9),
        y: utils.withGrid(6),
        src: '../assets/images/characters/people/woman1.png',
        talking: [
          {
            events: [
              { faceHero: 'Carol_DemoRoom', type: 'textMessage', text: 'Você não tem o que fazer não?' },
            ],
          },
        ],
      }),
      Bob_DemoRoom: new Person({
        x: utils.withGrid(6),
        y: utils.withGrid(8),
        src: '../assets/images/characters/people/man1.png',
        talking: [
          {
            events: [
              { faceHero: 'Bob_DemoRoom', type: 'textMessage', text: 'Como você entrou aqui?' },
            ],
          },
        ],
      }),
    },
    cutsceneSpaces: {
      [utils.asGridCoord(5, 10)]: [
        {
          events: [
            {
              type: 'changeMap',
              map: 'DemoRoom',
              x: utils.withGrid(7),
              y: utils.withGrid(5),
              direction: 'down',
            },
          ],
        },
      ],
      [utils.asGridCoord(3, 8)]: [
        {
          events: [
            {
              type: 'changeMap',
              map: 'TVStudio',
              x: utils.withGrid(7),
              y: utils.withGrid(8),
              direction: 'up',
            },
          ],
        },
      ],
    },
    walls: {
      // up
      [utils.asGridCoord(1, 4)]: true,
      [utils.asGridCoord(2, 3)]: true,
      [utils.asGridCoord(11, 4)]: true,

      // objects
      [utils.asGridCoord(6, 7)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(9, 7)]: true,
      [utils.asGridCoord(10, 7)]: true,
      [utils.asGridCoord(9, 9)]: true,
      [utils.asGridCoord(10, 9)]: true,
    },
  },
  PizzaShop: {
    lowerSrc: '../assets/images/maps/PizzaShopLower.png',
    upperSrc: '../assets/images/maps/PizzaShopUpper.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(1),
        y: utils.withGrid(7),
      }),
      Carol_DemoRoom: new Person({
        x: utils.withGrid(4),
        y: utils.withGrid(11),
        src: '../assets/images/characters/people/man1.png',
      }),
      Bob_DemoRoom: new Person({
        x: utils.withGrid(9),
        y: utils.withGrid(10),
        src: '../assets/images/characters/people/man2.png',
      }),
    },
    cutsceneSpaces: {

      [utils.asGridCoord(5, 12)]: [
        {
          events: [
            {
              type: 'changeMap',
              map: 'Kitchen',
              x: utils.withGrid(4),
              y: utils.withGrid(4),
              direction: 'down',
            },
          ],
        },
      ],
    },
  },
  TVStudio: {
    lowerSrc: '../assets/images/maps/TVStudioLower.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(7),
        y: utils.withGrid(8),
        src: '../assets/images/characters/people/hero.png',
      }),
      Carol_DemoRoom: new Person({
        x: utils.withGrid(3),
        y: utils.withGrid(3),
        src: '../assets/images/characters/people/man1.png',
        offsetX: 8,
      }),
      Bob_DemoRoom: new Person({
        x: utils.withGrid(6),
        y: utils.withGrid(3),
        src: '../assets/images/characters/people/man2.png',
        offsetX: 8,
      }),
      desk: new GameObject({
        x: utils.withGrid(3),
        y: utils.withGrid(4),
        src: '../assets/images/maps/TVStudioMiddle1.png',
        sizeX: 5,
        offsetY: -2,
      }),
    },
    walls: {
      // up
      [utils.asGridCoord(1, 2)]: true,
      [utils.asGridCoord(2, 2)]: true,
      [utils.asGridCoord(3, 2)]: true,
      [utils.asGridCoord(4, 2)]: true,
      [utils.asGridCoord(5, 2)]: true,
      [utils.asGridCoord(6, 2)]: true,
      [utils.asGridCoord(7, 2)]: true,
      [utils.asGridCoord(8, 2)]: true,
      [utils.asGridCoord(9, 2)]: true,

      // down
      [utils.asGridCoord(1, 9)]: true,
      [utils.asGridCoord(2, 9)]: true,
      [utils.asGridCoord(3, 9)]: true,
      [utils.asGridCoord(4, 9)]: true,
      [utils.asGridCoord(5, 9)]: true,
      [utils.asGridCoord(6, 9)]: true,
      [utils.asGridCoord(9, 9)]: true,
      [utils.asGridCoord(10, 9)]: true,

      // left
      [utils.asGridCoord(2, 3)]: true,
      [utils.asGridCoord(1, 4)]: true,
      [utils.asGridCoord(0, 5)]: true,
      [utils.asGridCoord(0, 6)]: true,
      [utils.asGridCoord(0, 7)]: true,
      [utils.asGridCoord(0, 8)]: true,

      // right
      [utils.asGridCoord(8, 3)]: true,
      [utils.asGridCoord(9, 4)]: true,
      [utils.asGridCoord(10, 5)]: true,
      [utils.asGridCoord(10, 6)]: true,
      [utils.asGridCoord(10, 7)]: true,
      [utils.asGridCoord(10, 8)]: true,

      // fakeGameObjects
      [utils.asGridCoord(1, 7)]: true,
      [utils.asGridCoord(1, 8)]: true,
      [utils.asGridCoord(2, 8)]: true,
      [utils.asGridCoord(3, 4)]: true,
      [utils.asGridCoord(3, 6)]: true,
      [utils.asGridCoord(3, 7)]: true,
      [utils.asGridCoord(4, 4)]: true,
      [utils.asGridCoord(5, 4)]: true,
      [utils.asGridCoord(5, 6)]: true,
      [utils.asGridCoord(5, 7)]: true,
      [utils.asGridCoord(6, 4)]: true,
      [utils.asGridCoord(7, 4)]: true,
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(9, 8)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7, 9)]: [
        {
          events: [
            {
              type: 'changeMap',
              map: 'DemoRoom',
              x: utils.withGrid(3),
              y: utils.withGrid(6),
              direction: 'left',
            },
          ],
        },
      ],
      [utils.asGridCoord(8, 9)]: [
        {
          events: [
            {
              type: 'changeMap',
              map: 'PizzaShop',
              x: utils.withGrid(6),
              y: utils.withGrid(8),
              direction: 'down',
            },
          ],
        },
      ],
    },
  },
};
