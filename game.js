const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 600;


let isGameRunning = false;


const scoreDisplay = document.createElement('div');
scoreDisplay.id = 'scoreDisplay';
scoreDisplay.textContent = 'Score: 0'
document.body.appendChild(scoreDisplay)


let enemyCount = 0;

let score = 0;


//game over screen
const gameOverScreen = document.getElementById('gameOverScreen');
const restartGameButton = document.getElementById('restartGameButton')


//working on adding a start screen
const gameCanvas = document.getElementById('gameCanvas');
const startScreen = document.getElementById('startScreen');
const startGameButton = document.getElementById('startGameButton');


//Win screen
const winScreen = document.getElementById('winScreen')
const playAgainButton = document.getElementById('playAgainButton');


const starsContainer = document.getElementById('stars');

function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDuration = Math.random() * 3 + 2 + 's'
    starsContainer.appendChild(star);
}

for (let i = 0; i < 200; i++) {
    createStar();
}

function playAgain(){
    winScreen.style.display = 'none';
    gameCanvas.style.display = 'block';
    resetGame();
    isGameRunning = true;
}




gameCanvas.style.display = 'none';
function resetGame(){
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - 60;


    enemies.length = 0;


    lasers.length = 0;


    score = 0;


    gameLoop();
};


function startGame() {
    startScreen.style.display = 'none';  
    gameCanvas.style.display = 'block';
    isGameRunning = true;
    gameLoop();
};


function restartGame(){
    gameOverScreen.style.display = 'none';
    gameCanvas.style.display = 'block';
    resetGame();
}










function checkCollision(rect1, rect2) {
    return (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y);
};




function checkCollision(rect, circle) {
    let closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    let closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    let distanceX = circle.x - closestX;
    let distanceY = circle.y - closestY;
    let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);




    return distanceSquared <= (circle.radius * circle.radius);
}




















const walls = [
    { x: 0, y: 0, width: 20, height: canvas.height},
    { x: canvas.width - 20, y: 0, width: 20, height: canvas.height}
];








class Spaceship {
    constructor(x, y, width, height, color) {
        this.x = canvas.width / 2 - width / 2;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 5; // speed of player
    }
    draw(){
        ctx.beginPath();
        ctx.moveTo(this.x, this.y); //start at top center
        ctx.lineTo(this.x - this.width / 2, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill()
        // ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    moveLeft(){
        if(this.x > 0 + walls[1].width){
            this.x -= this.speed;
        }
    }
    moveRight(){
        if(this.x + this.width < canvas.width - walls[1].width){
        this.x += this.speed;
        }
    }
}








class Enemy{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }








    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }








    update(){
        this.y += this.velocity;
        if (this.y + this.radius > canvas.height) {
            enemies.splice(this.index, 1);
            score -= 10;
        }
    }


}








class Laser {
    constructor(x, y, width, height, color, velocity){
        this.x = x,
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocity = velocity;
    }
    draw(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update(){
        this.y += this.velocity;
    }
}


// Initialize game objects
const player = new Spaceship(canvas.width / 2, canvas.height - 60, 40, 40, 'white')
const enemies = [];
const lasers = [];




startGameButton.addEventListener('click', startGame);




// event listeners for player movement
document.addEventListener('keydown' , (event) => {
    if (event.key === 'ArrowLeft') {
        player.moveLeft();
    } else if (event.key === 'ArrowRight') {
        player.moveRight();
    }
});








document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        lasers.push(new Laser(player.x, player.y, 5, 10, 'yellow', -5));
    }
})


restartGameButton.addEventListener('click', restartGame);


playAgainButton.addEventListener('click', playAgain);




//game loop function








function gameLoop(){


    if(isGameRunning){


    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);


}








    //update game elements (movements, collisions)


    //const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.textContent = 'Score: ' + score;


    if (score >= 100) {
        isGameRunning = false;
        winScreen.style.display = 'flex';
        gameCanvas.style.display = 'none';
    }






    //draw elements
    walls.forEach(wall => {
        ctx.fillStyle = 'gray';
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height)
    });








    enemies.forEach((enemy, index) => {
        enemy.update();
        enemy.draw();
       
        if(enemy.y + enemy.radius > canvas.height){
            enemies.splice(index, 1);
            score -=10;
            enemyCount--;
        }
    })





    player.draw();
    //draw enemies, lasers'





    let maxEnemies = 10;



    if(Math.random() < 0.01 && enemyCount < maxEnemies) {
        let x = Math.random() * (canvas.width - 20) + 10;
        let y = -50;
        enemies.push(new Enemy(x, y, 10, 'red', 1));
        enemyCount++;
    }








    lasers.forEach((laser, index) => {
        laser.update();
        laser.draw();








        if (laser.y + laser.height < 0) {
            lasers.splice(index, 3);
        }
    });




    enemies.forEach((enemy, enemyIndex)=> {
        if (checkCollision(player, enemy)) {
            console.log('Game Over!');
            gameOverScreen.style.display = 'flex';
            gameCanvas.style.display = 'none'
        }
    });




    lasers.forEach((laser, laserIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (checkCollision(laser, enemy)) {
                enemies.splice(enemyIndex, 1);
                lasers.splice(laserIndex, 1);
                // add score update here
                score += 50;
                enemyCount--;
                console.log(score)
            }
        });
    });








    requestAnimationFrame(gameLoop);

}








gameLoop();
