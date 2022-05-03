const utils = {
  gameContainer: () => document.querySelector('.game-container'),
  pauseMenu: () => document.querySelector('.keyboard-menu'),
  descriptionPauseMenu: () => document.querySelector('.description-box'),
  withGrid: (n) => (n * 16),
  asGridCoord: (x, y) => `${x * 16},${y * 16}`,
  nextPosition: (initialX, initialY, direction) => {
    let x = initialX;
    let y = initialY;
    const size = 16;
    if (direction === 'left') {
      x -= size;
    } else if (direction === 'right') {
      x += size;
    } else if (direction === 'up') {
      y -= size;
    } else if (direction === 'down') {
      y += size;
    }
    return { x, y };
  },
  emitEvent: (name, detail) => {
    const event = new CustomEvent(name, { detail });
    document.dispatchEvent(event);
  },
  oppositeDirection: (direction) => {
    if (direction === 'left') return 'right';
    if (direction === 'right') return 'left';
    if (direction === 'up') return 'down';
    return 'up';
  },
  chooseTalk: (win, lose, result) => {
    if (result) return win;
    return lose;
  },
  changeTalk: (newMessage, eventsArr, oldMessage) => {
    const eventItem = eventsArr.find((item) => {
      const [depends, loseAlready] = oldMessage;
      return item.text === depends || item.text === loseAlready;
    });
    eventItem.text = newMessage;
  },
  hasEventTextWin: (winMessage, eventsArr) => (
    eventsArr.find((item) => (item.text === winMessage))
  ),
};
