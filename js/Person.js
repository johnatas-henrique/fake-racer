class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.isPlayerControlled = config.isPlayerControlled || false;
    this.directionUpdate = {
      'up': ['y', -1],
      'down': ['y', 1],
      'left': ['x', -1],
      'right': ['x', 1],
    }
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      // other cases here

      // case when an arrow are pressed and you want the game to answer
      if (this.isPlayerControlled && state.arrow) {
        this.startBehavior(state, {
          type: 'walk',
          direction: state.arrow,
        })
      }
      this.updateSprite();
    }
  }

  startBehavior(state, behavior) {
    this.direction = behavior.direction;
    if (behavior.type === 'walk') {
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        return;
      }

      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation(`walk-${this.direction}`);
      return;
    }
    this.sprite.setAnimation(`idle-${this.direction}`);
  }
}
