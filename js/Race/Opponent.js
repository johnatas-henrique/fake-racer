import utils from '../Core/utils.js';
import SpriteRace from './SpriteRace.js';

class Opponent {
  constructor(config) {
    this.race = config.race;
    this.maxSpeed = config.maxSpeed || 600;
    this.trackPosition = config.trackPosition || 1;
    this.startPos = config.startPos || -1;
    this.opponentName = config.opponentName || 'Desconhecido';
    this.carColor = config.carColor ?? 'random';
    this.image = config.image || '/assets/images/cars/f1Y91Opponents.png';
    this.actualSpeed = 0;
    this.opponentX = 1;
    this.lap = 0;
    this.raceTime = [0];
    this.isCrashed = 0;
    this.sprite = new SpriteRace({
      offsetX: 0.5 * this.startPos,
      scaleX: 2,
      scaleY: 2,
      spritesInX: 8,
      spritesInY: 1,
      imageSrc: this.image,
      name: `op${this.opponentName}`,
    });
  }

  init() {
    this.sprite.sheetPositionX = this.carColor !== 'random' ? this.carColor : Math.floor(Math.random() * 7.99);
    this.sprite.actualSpeed.mult = 1;
    this.maxSpeed += Math.floor(Math.random() * 20);
    this.baseSpeed = this.maxSpeed;
  }

  * carSpeedCorrection() {
    while (this.maxSpeed >= this.baseSpeed) {
      this.maxSpeed -= 0.2;
      if (this.maxSpeed > this.baseSpeed * 1.6 || this.maxSpeed > 1260) {
        this.maxSpeed = Math.min(this.baseSpeed * 1.6, 1260);
      }
      yield this.maxSpeed;
    }
  }

  findFinishedCars(driver) {
    return this.race.director.raceFinishedCars.find(({ name }) => name === driver);
  }

  updateAxisX() {
    if (this.sprite.offsetX <= -1.65 / 2) this.opponentX = 1;
    if (this.sprite.offsetX >= 1.65 / 2) this.opponentX = -1;
  }

  updateOpponentsCarOffset() {
    const playerParam = this.race.player;
    const oppArrParam = this.race.opponents;
    const lookAhead = 80;
    const crash = 4;
    const { carSegments } = this.race.director;
    const cSeg = carSegments.find(({ name }) => name === this.opponentName);
    const arrObjSeg = carSegments.filter(({ pos }) => pos < cSeg.pos + lookAhead && pos > cSeg.pos);
    const objCrash = carSegments.find(({ pos }) => pos < cSeg.pos + crash && pos > cSeg.pos);

    arrObjSeg.forEach((objSeg) => {
      if (objSeg && objSeg.name !== playerParam.name && !this.isCrashed) {
        const isOverlapped = utils.overlap(cSeg.x, 0.663125, objSeg.x, 0.663125, 0.9);

        if (isOverlapped) {
          const diffCarsX = Math.abs(objSeg.x - cSeg.x);
          if (Math.abs(objSeg.x) > 1 || (Math.abs(objSeg.x) > 0 && diffCarsX < 0)) {
            this.opponentX = objSeg.x * -1;
          }

          if (objCrash && objCrash.name !== playerParam.name && !this.isCrashed) {
            const opp = oppArrParam.findIndex(({ opponentName }) => opponentName === objCrash.name);
            oppArrParam[opp].actualSpeed *= 1.04;
            this.actualSpeed *= 0.96;
            this.isCrashed = 1;
          }
        }
      }
      if (objSeg && objSeg.name === playerParam.name) {
        const playerW = playerParam.sprite.scaleX * 320 * 0.001;
        const isOverlapped = utils.overlap(cSeg.x, 0.663125, objSeg.x, playerW, 1);

        if (isOverlapped/*  && this.actualSpeed > playerParam.actualSpeed */) {
          const diffCarsX = Math.abs(objSeg.x - cSeg.x);
          if (objSeg.x > 0.95 || (objSeg.x > 0 && diffCarsX < 0.4)) {
            this.opponentX = -20;
          } else if (objSeg.x < -0.95 || (objSeg.x < 0 && diffCarsX < 0.4)) {
            this.opponentX = 20;
          }

          if (objCrash && !this.isCrashed) {
            const crashSpeeds = {};
            crashSpeeds.player = playerParam.actualSpeed;
            crashSpeeds.opponent = this.actualSpeed;
            crashSpeeds.midpoint = (crashSpeeds.player + crashSpeeds.opponent) / 2;
            crashSpeeds.newPlayer = crashSpeeds.midpoint * 1.1;
            crashSpeeds.newOpponent = crashSpeeds.midpoint * 0.9;
            playerParam.actualSpeed = crashSpeeds.newPlayer;
            this.actualSpeed = crashSpeeds.newOpponent;
            this.isCrashed = 1;
          }
        }
      }
    });
  }

  update() {
    if (this.race.director.running) {
      const newMaxSpeed = this.carSpeedCorrection();
      newMaxSpeed.next();
      if (this.actualSpeed < 0) this.actualSpeed = 0;

      const acceleration = (speed, mult) => ((this.maxSpeed + 300) / (speed + 300))
        * mult * (1.5 - (speed / this.maxSpeed));

      this.actualSpeed = this.actualSpeed >= this.maxSpeed
        ? this.maxSpeed : this.actualSpeed += acceleration(this.actualSpeed, 0.9);

      this.sprite.actualSpeed.speed = this.actualSpeed;
      const oldSegment = this.race.road.getSegment(Math.round(this.trackPosition));
      this.updateAxisX();
      this.updateOpponentsCarOffset();

      this.sprite.offsetX += 0.008 * this.opponentX;
      this.trackPosition += this.actualSpeed;
      this.isCrashed = this.isCrashed > 0 ? this.isCrashed -= 0.01 : 0;

      const actualSegment = this.race.road.getSegment(Math.round(this.trackPosition));
      oldSegment.sprites = oldSegment.sprites.filter(({ name }) => name !== this.sprite.name);
      actualSegment.sprites.push(this.sprite);

      const { trackSize } = window.tracks.f1Y91[this.race.road.trackName];
      const actualPosition = this.trackPosition / 200;
      const actualLap = Math.floor(actualPosition / trackSize);

      if (this.lap < actualLap) {
        this.raceTime.push(this.race.director.totalTime);
        const raceLeader = this.race.director.positions[0].name;
        const leaderHasFinished = this.findFinishedCars(raceLeader)?.finished === true;

        if (leaderHasFinished) {
          this.findFinishedCars(this.opponentName).finished = true;
        }
        this.lap += 1;
      }
      if (this.lap > this.race.director.raceLaps) {
        this.findFinishedCars(this.opponentName).finished = true;
      }
    }
  }
}

export default Opponent;
