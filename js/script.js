var canvas = document.createElement("canvas");
var gameArea = document.getElementById("game-area");
let c = canvas.getContext('2d');

let shotSize = 5;
let shotSpeed = 5;

let spaceShipSpeed = 5;

let alienSize = 10; 
let alienSpeed = 5;
let timeGap = [1];
let time = timeGap[Math.round(Math.random() * (timeGap.length-1))];
let currentTime = 0;
let timePlayed = 0;
let level = 1;
let score = 0;
let playerName;
let gameOver = false;
let gameStarted = false;

var aliens = [];
var shots = [];

gameArea.appendChild(canvas);
canvas.height = gameArea.clientHeight;
canvas.width = gameArea.clientWidth;

var spaceShip =
{
    width: 8,
    height: 22,
    prevPosition:
    {
        x: canvas.width,
        y: canvas.height/2
    },
    currentPosition:
    {
	    x: canvas.width,
        y: canvas.height/2
    },
    moveLeft() {
        this.prevPosition.x = this.currentPosition.x;
        this.currentPosition.x -= spaceShipSpeed;
        this.prevPosition.y = this.currentPosition.y;
        this.drawSpaceShip();
    },
    moveRight() {
        this.prevPosition.x = this.currentPosition.x;
        this.currentPosition.x += spaceShipSpeed;
        this.prevPosition.y = this.currentPosition.y;
        this.drawSpaceShip();
    },
    moveUp() {
        this.prevPosition.y = this.currentPosition.y;
        this.currentPosition.y -= spaceShipSpeed;
        this.prevPosition.x = this.currentPosition.x;
        this.drawSpaceShip();
    },
    moveDown() {
        this.prevPosition.y = this.currentPosition.y;
        this.currentPosition.y += spaceShipSpeed;
        this.prevPosition.x = this.currentPosition.x;
        this.drawSpaceShip();
    },
    drawSpaceShip() {
        c.fillStyle = 'black';
        c.fillRect(spaceShip.prevPosition.x - spaceShip.width/2, spaceShip.prevPosition.y - spaceShip.height/2, spaceShip.width, spaceShip.height);
        c.fillStyle = 'white';
        c.fillRect(spaceShip.currentPosition.x - spaceShip.width/2, spaceShip.currentPosition.y - spaceShip.height/2, spaceShip.width, spaceShip.height);
    }

}

function timeKeeper(){
    timePlayed++;
    if(timePlayed >= level*20)
    {
        level++;
        alienSpeed += 2;
    }
    document.getElementById("live-score").innerHTML = "Live Score: " + score;
    document.getElementById("live-level").innerHTML = "Level : " + level;
    t = setTimeout(function() {
        timeKeeper();
    }, 1000);
}

function displayScore()
{
    document.getElementById("score-area").innerHTML = "";
    if(localStorage.getItem("Highscore") == null)
    {
        return;
    }
    let retrievedHighScore = JSON.parse(localStorage.getItem("Highscore"));
    let h1 = document.createElement("h1");
    let highScoreText = document.createTextNode("HIGH SCORE");
    h1.appendChild(highScoreText);
    let h21 = document.createElement("h2");
    let highScoreName = document.createTextNode("Name : " + retrievedHighScore[0]);
    let h22 = document.createElement("h2");
    let highScoreScore = document.createTextNode("Score : " + retrievedHighScore[1]);
    h21.appendChild(highScoreName);
    h22.appendChild(highScoreScore);
    document.getElementById("score-area").appendChild(h1);
    document.getElementById("score-area").appendChild(h21);
    document.getElementById("score-area").appendChild(h22);
}
function closePopup(){
    document.getElementById("overlay").classList.remove("active");
    document.getElementById("score-popup").classList.remove("active");
    document.getElementById("score-popup-body").innerText = ""; 
    location.reload();
}

function popUpScore(){
    document.getElementById("overlay").classList.add("active");
    document.getElementById("score-popup").classList.add("active");
    let highestScore;
    if(localStorage.getItem("Highscore") != null)
    {
        let retrievedHighScore = JSON.parse(localStorage.getItem("Highscore"));
        highestScore = retrievedHighScore[1];
    }
    else
        highestScore = score;
    document.getElementById("score-popup-body").innerHTML = ("Score : " + score + "<br/>" + "High Score : " + highestScore); 
    let highScore = [];
    highScore[0] = playerName;
    highScore[1] = score;
    if(localStorage.getItem("Highscore") == null)
        localStorage.setItem("Highscore",JSON.stringify(highScore));
    else{
        let retrievedHighScore = JSON.parse(localStorage.getItem("Highscore"));
        if(retrievedHighScore[1] <= score)
        {
            localStorage.removeItem("Highscore");
            localStorage.setItem("Highscore",JSON.stringify(highScore));
        }
    }
}

class Alien {
    constructor() {
        this.x = alienSize;
        this.y = Math.round(Math.random() * canvas.height);
    }
    draw() {
        c.fillStyle = 'white';
        c.fillRect(this.x, this.y, alienSize, alienSize);
    }
    update() {
        c.fillStyle = 'black';
        c.fillRect(this.x, this.y, alienSize, alienSize);
        this.x += alienSpeed;
        this.draw();
    }
}

function animateAlien(alien)
{
    animate();
    function animate(){
        if(alien.x < canvas.width + alienSize && aliens.includes(alien))
        {  
            if(alien.x + alienSize >= spaceShip.currentPosition.x - spaceShip.width/2 && alien.x + alienSize <= spaceShip.currentPosition.x + spaceShip.width/2)
                if(alien.y + alienSize >= spaceShip.currentPosition.y - spaceShip.height/2 && alien.y <= spaceShip.currentPosition.y + spaceShip.height/2)
                {
                    gameOver = true;
                    playerName = window.prompt("Hey!What's your name");
                    popUpScore();
                }

            if(gameOver == false)
            {   
                requestAnimationFrame(animate);
                alien.update();
            }
        }
        else if(aliens.includes(alien))
        {
            aliens.splice(aliens.indexOf(alien),1);
        }
    }
}

function updateTime() {
    currentTime ++;
    if(currentTime >= time)
    {
        currentTime = 0;
        time = timeGap[Math.round(Math.random() * (timeGap.length-1))];
        let alien = new Alien();
        aliens.push(alien);
        alien.draw();
        animateAlien(alien);
    }
    if(gameOver == false){
        t = setTimeout(function() {
            updateTime();
        }, 1000);
    }
}

class Shot {
    constructor() {
        this.x = spaceShip.currentPosition.x - spaceShip.width / 2 - shotSize;
        this.y = spaceShip.currentPosition.y;
        shots.push(this);
    }
    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.x,this.y,shotSize,shotSize);
    }
    update() {
        c.fillStyle = 'black';
        c.fillRect(this.x, this.y, shotSize, shotSize);
        this.x -= shotSpeed;
        this.draw();
    }
}

function animateShot(shot)
{
    animate();
    function animate()
        {
            if(shot.x > -shotSize && shots.includes(shot))
            {   
                requestAnimationFrame(animate);
                checkAlienShot();
                shot.update();
            }
            else if(shots.includes(shot))
            {
                shots.splice(shots.indexOf(shot),1);
            }
        }
}

function shoot() {
    let shot = new Shot();
    shot.draw();
    animateShot(shot);
}

function checkAlienShot() {
    aliens.forEach(alien => {
        shots.forEach(shot => {
            
            if(shot.x + shotSize >= alien.x && shot.x <= alien.x + alienSize)
            {
                if(shot.y <=  alien.y + alienSize  && shot.y + shotSize >= alien.y)
                {
                    score += level;
                    shots.splice(shots.indexOf(shot),1);
                    aliens.splice(aliens.indexOf(alien),1);
                    c.fillStyle = 'black';
                    c.fillRect(alien.x < shot.x ? alien.x : shot.x, alien.y < shot.y ? alien.y : shot.y, alienSize + shotSize, alienSize + shotSize);
                }
            }
    })})    
}

document.body.onkeydown = function(e) {
    if(e.keyCode == 32 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
        e.preventDefault();
    if(e.keyCode == 32 && gameOver == false)
        shoot(); 
    if(e.keyCode == 37 && gameOver == false)
        spaceShip.moveLeft();
    if(e.keyCode == 38 && gameOver == false)
        spaceShip.moveUp();
    if(e.keyCode == 39 && gameOver == false)
        spaceShip.moveRight();
    if(e.keyCode == 40 && gameOver == false)
        spaceShip.moveDown();
    if(e.keyCode && gameStarted == false)
    {
        gameStarted = true;
        updateTime();
        timeKeeper();
    }
}

c.fillStyle = 'black';
c.fillRect(0,0,canvas.width,canvas.height);

spaceShip.drawSpaceShip();
displayScore();