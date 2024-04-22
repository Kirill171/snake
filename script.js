const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');

const ground = new Image();
ground.src = 'image/backImage.png';


const carrotImg = new Image();
carrotImg.src = 'image/carrot.png';

const appleImg = new Image();
appleImg.src = 'image/apple.png';

const restartGame = new Image();
restartGame.src = 'image/restart.png';

let box = 32;
let score = 0;

let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box,
};

let snake = [];
snake[0] = {
    x: 9 * box,
    y: 9 * box,
};

document.addEventListener('keydown', direction);

let dir;
function direction(event) {
    if (event.keyCode == 37 && dir != 'right') {
        dir = 'left';
    } else if (event.keyCode == 38 && dir != 'down') {
        dir = 'up';
    } else if (event.keyCode == 39 && dir != 'left') {
        dir = 'right';
    } else if (event.keyCode == 40 && dir != 'up') {
        dir = 'down';
    }
}

function eatTail(head, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (head.x == arr[i].x && head.y == arr[i].y) {
            clearInterval(game);
            showGameOver();
            document.addEventListener('keydown', createNewGame);
        }
    }
}

function showGameOver() {
    ctx.fillStyle = 'black';
    ctx.fillText('Game over', box * 5, box * 10);
}

function createNewGame(event) {
    if (event.keyCode == 13 || event.keyCode == 32 || event.keyCode == 82) {
        newGame();
    }
}

function newGame() {
    score = 0;
    dir = null;
    snake = []; // Очистка массива змеи
    snake[0] = {
        x: 9 * box,
        y: 9 * box,
    };
    clearInterval(game); // Очистка интервала перед запуском новой игры
    game = setInterval(drawGame, 130); // Обновление интервала
}

let isApple = false;
function drawGame() {
    ctx.drawImage(ground, 0, 0);

    if (isApple) {
        ctx.drawImage(appleImg, food.x, food.y);
    } else {
        ctx.drawImage(carrotImg, food.x, food.y);
    }

    ctx.drawImage(restartGame, 17 * box, 0.7 * box);
    canvas.addEventListener('click', function (event) {
        // Получаем координаты клика относительно холста
        const clickX = event.pageX - canvas.offsetLeft;
        const clickY = event.pageY - canvas.offsetTop;

        // Определяем координаты и размеры кнопки restartGame
        const restartButtonX = 17 * box;
        const restartButtonY = 0.7 * box;
        const restartButtonWidth = restartGame.width;
        const restartButtonHeight = restartGame.height;

        // Проверяем, был ли клик выполнен в области кнопки restartGame
        if (
            clickX >= restartButtonX &&
            clickX <= restartButtonX + restartButtonWidth &&
            clickY >= restartButtonY &&
            clickY <= restartButtonY + restartButtonHeight
        ) {
            // Вызываем функцию createNewGame
            newGame();
        }
    });


    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? 'green' : '#24a424';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.fillText(score, box * 2.5, box * 1.7);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box,
        };

        if (Math.random() <= 0.3) {
            ctx.drawImage(appleImg, food.x, food.y);
            isApple = true;
        } else {
            ctx.drawImage(carrotImg, food.x, food.y);
            isApple = false;
        }
    } else {
        snake.pop();
    }

    if (snakeX < box || snakeX > box * 17
        || snakeY < 3 * box || snakeY > box * 17) {
        clearInterval(game);
        showGameOver();
        document.addEventListener('keydown', createNewGame);
    }

    if (dir == 'left') snakeX -= box;
    if (dir == 'right') snakeX += box;
    if (dir == 'up') snakeY -= box;
    if (dir == 'down') snakeY += box;

    let newHead = {
        x: snakeX,
        y: snakeY,
    }

    eatTail(newHead, snake);

    snake.unshift(newHead);
}

let game = setInterval(drawGame, 130);