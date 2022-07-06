class Obstacle {
  #x; #y; #height; #width; #speed; #id;
  constructor({ position, height, width, speed, id }) {
    this.#x = position.x;
    this.#y = position.y;
    this.#height = height;
    this.#width = width;
    this.#speed = speed;
    this.#id = id;
  }

  move() {
    this.#x -= this.#speed;
  }

  hasReachedEnd() {
    return this.#x + this.#width <= 0;
  }

  hasHit(dino) {
    const { position: { x, y }, height, width } = dino;
    return x + width >= this.#x &&
      x <= this.#x + this.#width &&
      y <= this.#y + this.#height;
  }

  get info() {
    return {
      height: this.#height,
      width: this.#width,
      position: { x: this.#x, y: this.#y },
      id: this.#id
    };
  }
}
