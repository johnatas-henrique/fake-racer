import SpriteGameObjects from './SpriteGameObjects.js';
import OverworldEvent from './OverworldEvent.js';

class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || 'down';
    this.showItem = config.showItem ?? true;
    this.sprite = new SpriteGameObjects({
      gameObject: this,
      src: config.src || '../assets/images/characters/santa.png',
      currentAnimation: config.currentAnimation || null,
      offsetX: config.offsetX,
      offsetY: config.offsetY,
      sizeX: config.sizeX,
      sizeY: config.sizeY,
      useShadow: config.shadow,
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
    this.talking = config.talking || [];
    this.retryTimeout = null;
  }

  mount(map) {
    this.isMounted = true;
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 100);
  }

  // eslint-disable-next-line class-methods-use-this
  update() { }

  async doBehaviorEvent(map) {
    if (this.behaviorLoop.length === 0) {
      return;
    }

    if (map.isCutscenePlaying) {
      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
      }
      this.retryTimeout = setTimeout(() => {
        this.doBehaviorEvent(map);
      }, 1000);
      return;
    }

    const eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    this.doBehaviorEvent(map);
  }
}

export default GameObject;
