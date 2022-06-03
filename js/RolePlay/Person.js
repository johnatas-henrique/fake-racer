class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.isStanding = false;

    this.isPlayerControlled = config.isPlayerControlled || false;
    this.directionUpdate = {
      up: ['y', -1],
      down: ['y', 1],
      left: ['x', -1],
      right: ['x', 1],
    };
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      // other cases here

      // case when an arrow are pressed and you want the game to answer
      if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
        this.startBehavior(state, {
          type: 'walk',
          direction: state.arrow,
        });
      }
      this.updateSprite();
    }
  }

  startBehavior(state, behavior) {
    this.direction = behavior.direction;
    if (behavior.type === 'walk') {
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        if (behavior.retry) {
          setTimeout(() => {
            this.startBehavior(state, behavior);
          }, 10);
        }
        return;
      }

      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
      this.updateSprite();
    }

    if (behavior.type === 'stand') {
      this.isStanding = true;
      setTimeout(() => {
        utils.emitEvent('PersonStandingComplete', { whoId: this.id });
        this.isStanding = false;
      }, behavior.time);
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;
    if (this.movingProgressRemaining === 0) {
      utils.emitEvent('PersonWalkingComplete', { whoId: this.id });

      if (this.isPlayerControlled) {
        this.progress.startingHeroX = this.x;
        this.progress.startingHeroY = this.y;
        this.progress.startingHeroDirection = this.direction;
      }
    }
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation(`walk-${this.direction}`);
      return;
    }
    this.sprite.setAnimation(`idle-${this.direction}`);
  }
}
