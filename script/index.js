class Obstacle {
  constructor({ position, height, width, speed }) {
    this.x = position.x;
    this.y = position.y;
    this.height = height;
    this.width = width;
    this.speed = speed;
  }

  move() {
    this.x -= this.speed;
  }

  hasReachedEnd() {
    return this.x + this.width <= 0;
  }

  hasHit(dino) {
    const { position: { x, y }, height, width } = dino;
    return x + width >= this.x &&
      x <= this.x + this.width &&
      y <= this.y + this.height;
  }

  get info() {
    return {
      height: this.height,
      width: this.width,
      position: { x: this.x, y: this.y }
    };
  }
}

const drawDino = (dino) => {
  const dinoElement = document.getElementById('dino');
  dinoElement.style.height = dino.height;
  dinoElement.style.width = dino.width;
  dinoElement.style.bottom = dino.position.y;
  dinoElement.style.left = dino.position.x;
};

const styleObstacle = (obstacleElement, obstacle) => {
  const { height, width } = obstacle.info;
  obstacleElement.id = 'obstacle';
  obstacleElement.style.height = height;
  obstacleElement.style.width = width;
};

const addObstacle = (obstacleElement, canvas) => {
  const image = document.createElement('img');
  image.src = 'images/obstacle.webp';
  obstacleElement.appendChild(image);
  canvas.appendChild(obstacleElement);
};

const createObstacle = (obstacle) => {
  const canvas = document.getElementById('canvas');
  const obstacleElement = document.createElement('div');
  addObstacle(obstacleElement, canvas);
  styleObstacle(obstacleElement, obstacle);
};

const addScore = () => {
  const score = document.getElementById('score');
  score.innerText++;
};

const drawObstacle = (obstacle) => {
  const { position: { x, y } } = obstacle.info;
  const obstacleElement = document.getElementById('obstacle');
  obstacleElement.style.bottom = y;
  obstacleElement.style.left = x;
};

const canJump = ({ position, jumpHeight }, key) => {
  return (key === 32 || key === 38)
    && position.y < jumpHeight;
};

const jump = (dino, event) => {
  const key = event.keyCode;
  if (canJump(dino, key)) {
    dino.position.y += dino.jumpHeight;
    setTimeout(() => {
      dino.position.y -= dino.jumpHeight;
    }, 300)
  }
};

const hasReachedEnd = (obstacle) => {
  return obstacle.position.x + obstacle.width <= 0;
};

const removeObstacle = (obstacle) => {
  const obstacleElement = document.getElementById('obstacle');
  obstacleElement.remove();
};

const maintainObstacle = (obstacle, obstacleInfo) => {
  removeObstacle(obstacle);
  obstacle = new Obstacle(obstacleInfo);
  createObstacle(obstacle);
  return obstacle;
};

const startGame = () => {
  const dino = {
    position: { x: 60, y: 0 },
    height: 60,
    width: 40,
    jumpHeight: 100
  }
  const obstacleInfo = {
    position: { x: 1000, y: 0 },
    height: 50,
    width: 30,
    speed: 15
  };

  let obstacle = new Obstacle(obstacleInfo);
  createObstacle(obstacle);
  const game = setInterval(() => {
    if (obstacle.hasReachedEnd()) {
      addScore();
      obstacle = maintainObstacle(obstacle, obstacleInfo);
    }
    drawDino(dino);
    if (obstacle.hasHit(dino)) {
      clearInterval(game);
      return;
    }
    obstacle.move();
    drawObstacle(obstacle);
  }, 40);

  window.addEventListener('keydown', (event) => jump(dino, event));
};

window.onload = startGame;
