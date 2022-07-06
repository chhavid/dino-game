const getObstacleInfo = () => ({
  position: { x: 1000, y: 0 },
  height: 50,
  width: 30,
  speed: 15
});

const drawDino = (dino) => {
  const dinoElement = document.getElementById('dino');
  dinoElement.style.height = dino.height;
  dinoElement.style.width = dino.width;
  dinoElement.style.bottom = dino.position.y;
  dinoElement.style.left = dino.position.x;
};

const styleObstacle = (obstacleElement, obstacle) => {
  const { height, width, id } = obstacle.info;
  obstacleElement.id = id;
  obstacleElement.className = 'obstacle';
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

const updateScore = (score) => {
  const scoreElement = document.getElementById('score');
  scoreElement.innerText = score;
};

const updateObstacle = (obstacle) => {
  const { position: { x, y }, id } = obstacle.info;
  const obstacleElement = document.getElementById(id);
  obstacleElement.style.bottom = y;
  obstacleElement.style.left = x;
};

const hasReachedEnd = (obstacle) => {
  return obstacle.position.x + obstacle.width <= 0;
};

const isObstacleGone = (obstacleElement) => {
  const pos = + obstacleElement.style.left.slice(0, -2);
  const width = + obstacleElement.style.width.slice(0, -2);
  return pos + width < 0;
};

const maintainObstacle = () => {
  const obstacleElements = document.getElementsByClassName('obstacle');
  for (const obstacleElement of obstacleElements) {

    if (isObstacleGone(obstacleElement)) {
      obstacleElement.remove();
    }
  }
};

const drawGame = ({ dino, score, obstacles }) => {
  drawDino(dino);
  updateScore(score);
  obstacles.forEach(obstacle => {
    const obstacleElement = document.getElementById(obstacle.info.id);
    if (!obstacleElement) {
      createObstacle(obstacle);
    }
    updateObstacle(obstacle);
    maintainObstacle(obstacle);
  });
};

const startGame = () => {
  const dino = {
    position: { x: 60, y: 0 },
    height: 60,
    width: 40,
    jumpHeight: 100
  }

  const game = new Game(dino, 25);
  const intervalId = setInterval(() => {
    game.update(intervalId);
    drawGame(game.info);
  }, 40);

  window.addEventListener('keydown', (event) => {
    game.dinoJump(event);
  });
};

window.onload = startGame;
