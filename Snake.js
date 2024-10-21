// Get the canvas element and its 2D drawing context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define the size of each grid cell and the canvas size
const gridSize = 20;
const canvasSize = 400;

// Initialize the snake with one segment at a specific position
let snake = [{ x: gridSize * 5, y: gridSize * 5 }];

// Initialize the direction of the snake (not moving initially)
let direction = { x: 0, y: 0 };

// Initialize the food position
let food = { x: gridSize * 10, y: gridSize * 10 };

// Add a variable to track the paused state
let isPaused = false;

// Add a variable to track the home screen state
let isHomeScreen = true;

// Function to draw the game elements
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    if (isHomeScreen) {
        // Draw the home screen
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press Enter to Start', canvasSize / 2, canvasSize / 2);
        return;
    }

    // Draw the snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Draw pause message if the game is paused
    if (isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Paused', canvasSize / 2, canvasSize / 2);
    }
}

function update() {
    if (isPaused || isHomeScreen) return; // Skip updating if the game is paused or on the home screen

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check for collision with walls and wrap around
    if (head.x < 0) {
        head.x = canvasSize - gridSize; // Move to the opposite side
    } else if (head.x >= canvasSize) {
        head.x = 0; // Move to the opposite side
    } else if (head.y < 0) {
        head.y = canvasSize - gridSize; // Move to the opposite side
    } else if (head.y >= canvasSize) {
        head.y = 0; // Move to the opposite side
    }

    // Check for collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            resetGame();
            return;
        }
    }

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        snake.push({});
        placeFood();
    }

    // Move the snake by adding the new head and removing the tail
    snake.unshift(head);
    snake.pop();
}

function placeFood() {
    let validPosition = false;

    while (!validPosition) {
        // Generate random position for the food
        food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
        food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;

        // Check if the food position overlaps with any part of the snake
        validPosition = true;
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === food.x && snake[i].y === food.y) {
                validPosition = false;
                break;
            }
        }
    }
}

// Function to reset the game state
function resetGame() {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: 0, y: 0 };
    placeFood();
    isHomeScreen = true;
}

// Function to change the direction of the snake based on key presses
function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    const W = 87;
    const A = 65;
    const S = 83;
    const D = 68;

    // Change direction based on the key pressed, ensuring the snake cannot reverse
    if ((keyPressed === LEFT || keyPressed === A) && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    } else if ((keyPressed === UP || keyPressed === W) && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    } else if ((keyPressed === RIGHT || keyPressed === D) && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
    } else if ((keyPressed === DOWN || keyPressed === S) && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    }
}

// Add a single event listener to handle all key presses
document.addEventListener('keydown', (event) => {
    if (isHomeScreen) {
        if (event.key === 'Enter') {
            isHomeScreen = false;
        }
        return;
    }

    if (isPaused) {
        if (event.key === 'Escape') {
            togglePause();
        }
        return;
    }

    if (event.key === 'Escape') {
        togglePause();
    } else {
        changeDirection(event);
    }
});

// Function to toggle the paused state
function togglePause() {
    isPaused = !isPaused;
}

// Main game loop to update and draw the game at regular intervals
function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 100); // Call gameLoop every 100 milliseconds
}

// Start the game loop
gameLoop();