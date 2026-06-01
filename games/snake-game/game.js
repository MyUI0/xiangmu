
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let food = {};
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let score = 0;
let highScore = 0;
let gameLoop = null;
let gameSpeed = 100;
let isPaused = false;
let isGameOver = false;
let leaderboard = [];

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'sine') {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playEatSound() {
    playSound(440, 0.1);
    setTimeout(() => playSound(660, 0.1), 50);
}

function playGameOverSound() {
    playSound(200, 0.2, 'square');
    setTimeout(() => playSound(150, 0.3, 'square'), 100);
}

function initGame() {
    snake = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    isPaused = false;
    isGameOver = false;
    updateScore();
    placeFood();
}

function placeFood() {
    do {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function update() {
    if (isPaused || isGameOver) return;

    direction = { ...nextDirection };
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        playEatSound();
        placeFood();
        if (gameSpeed > 50) {
            gameSpeed -= 2;
            clearInterval(gameLoop);
            gameLoop = setInterval(gameStep, gameSpeed);
        }
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    snake.forEach((segment, index) => {
        const gradient = ctx.createRadialGradient(
            segment.x * gridSize + gridSize / 2,
            segment.y * gridSize + gridSize / 2,
            0,
            segment.x * gridSize + gridSize / 2,
            segment.y * gridSize + gridSize / 2,
            gridSize / 2
        );
        
        if (index === 0) {
            gradient.addColorStop(0, '#00ff88');
            gradient.addColorStop(1, '#00aa55');
        } else {
            const alpha = 1 - (index / snake.length) * 0.5;
            gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha})`);
            gradient.addColorStop(1, `rgba(100, 60, 180, ${alpha})`);
        }

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 15;
        ctx.shadowColor = index === 0 ? '#00ff88' : '#8b5cf6';
        ctx.beginPath();
        ctx.roundRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2,
            5
        );
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    const foodPulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
    const foodGradient = ctx.createRadialGradient(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        0,
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2
    );
    foodGradient.addColorStop(0, '#ff6b6b');
    foodGradient.addColorStop(1, '#ec4899');
    
    ctx.fillStyle = foodGradient;
    ctx.shadowBlur = 20 * foodPulse;
    ctx.shadowColor = '#ec4899';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
}

function gameStep() {
    update();
    draw();
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameLoop);
    playGameOverSound();
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }
    
    saveScore(score);
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverOverlay').classList.remove('hidden');
}

function updateScore() {
    document.getElementById('currentScore').textContent = score;
}

function startGame() {
    document.getElementById('startOverlay').classList.add('hidden');
    initGame();
    gameLoop = setInterval(gameStep, gameSpeed);
}

function restartGame() {
    document.getElementById('gameOverOverlay').classList.add('hidden');
    gameSpeed = 100;
    initGame();
    gameLoop = setInterval(gameStep, gameSpeed);
}

function togglePause() {
    if (isGameOver) return;
    isPaused = !isPaused;
    document.getElementById('pauseBtn').textContent = isPaused ? '▶ 继续' : '⏸ 暂停';
}

function changeDirection(dir) {
    const directions = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
    };

    const newDir = directions[dir];
    if (newDir.x !== -direction.x || newDir.y !== -direction.y) {
        nextDirection = newDir;
    }
}

function loadLeaderboard() {
    const saved = localStorage.getItem('snakeLeaderboard');
    if (saved) {
        leaderboard = JSON.parse(saved);
    }
}

function saveScore(newScore) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-CN');
    leaderboard.push({ score: newScore, date: dateStr });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem('snakeLeaderboard', JSON.stringify(leaderboard));
}

function showLeaderboard() {
    loadLeaderboard();
    const list = document.getElementById('leaderboardList');
    list.innerHTML = '';
    
    if (leaderboard.length === 0) {
        list.innerHTML = '<li style="text-align: center; color: #888; padding: 20px;">暂无记录</li>';
    } else {
        leaderboard.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'leaderboard-item';
            li.innerHTML = `
                <span>
                    <span class="leaderboard-rank">#${index + 1}</span>
                    ${item.date}
                </span>
                <span class="leaderboard-score">${item.score}</span>
            `;
            list.appendChild(li);
        });
    }
    
    document.getElementById('gameOverOverlay').classList.add('hidden');
    document.getElementById('startOverlay').classList.add('hidden');
    document.getElementById('leaderboardOverlay').classList.remove('hidden');
}

function closeLeaderboard() {
    document.getElementById('leaderboardOverlay').classList.add('hidden');
    if (isGameOver) {
        document.getElementById('gameOverOverlay').classList.remove('hidden');
    } else if (!gameLoop) {
        document.getElementById('startOverlay').classList.remove('hidden');
    }
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            changeDirection('up');
            break;
        case 'ArrowDown':
            changeDirection('down');
            break;
        case 'ArrowLeft':
            changeDirection('left');
            break;
        case 'ArrowRight':
            changeDirection('right');
            break;
        case ' ':
            e.preventDefault();
            togglePause();
            break;
    }
});

loadLeaderboard();
highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
document.getElementById('highScore').textContent = highScore;

