var canvas = document.createElement("canvas");
var gameArea = document.getElementById("game-area");
let c = canvas.getContext('2d');

let shotSpeed = 5;
let spaceShipSpeed = 5; 
let alienSpeed = 5;
let timeGap = [0.75,1,1.25,1.5];
let alienLevel = [1];
let time = timeGap[Math.round(Math.random() * (timeGap.length-1))];
let currentTime = 0;
let timePlayed = 0;
let gameLevel = 1;
let score = 0;
let playerName;
let gameOver = false;
let gameStarted = false;

let spaceShipImage = document.createElement('img');
spaceShipImage.setAttribute("src","res/spaceship.png");
let alienImage = document.createElement('img');
alienImage.setAttribute("src","res/alien.png")
let laserImage = document.createElement('img');
laserImage.setAttribute("src","res/laser.png")

var aliens = [];
var shots = [];

gameArea.appendChild(canvas);
canvas.height = gameArea.clientHeight;
canvas.width = gameArea.clientWidth;

var spaceShip =
{
    width: 50,
    height: 50,
    prevPosition:
    {
        x: (canvas.width),
        y: canvas.height/2
    },
    currentPosition:
    {
	    x: (canvas.width - 50),
        y: canvas.height/2
    },
    moveLeft() {
        if(this.currentPosition.x >= 0)
        {
            this.prevPosition.x = this.currentPosition.x;
            this.currentPosition.x -= spaceShipSpeed;
            this.prevPosition.y = this.currentPosition.y;
            this.drawSpaceShip();
        }
    },
    moveRight() {
        if(this.currentPosition.x + this.width <= canvas.width)
        {
            this.prevPosition.x = this.currentPosition.x;
            this.currentPosition.x += spaceShipSpeed;
            this.prevPosition.y = this.currentPosition.y;
            this.drawSpaceShip();
        }
    },
    moveUp() {
        if(this.currentPosition.y >= 0)
        {
            this.prevPosition.y = this.currentPosition.y;
            this.currentPosition.y -= spaceShipSpeed;
            this.prevPosition.x = this.currentPosition.x;
            this.drawSpaceShip();
        }
    },
    moveDown() {
        if(this.currentPosition.y + this.height <= canvas.height)
        {
            this.prevPosition.y = this.currentPosition.y;
            this.currentPosition.y += spaceShipSpeed;
            this.prevPosition.x = this.currentPosition.x;
            this.drawSpaceShip();
        }
    },
    drawSpaceShip() {
        c.clearRect(this.prevPosition.x, this.prevPosition.y, this.width, this.height);
        c.drawImage(spaceShipImage,this.currentPosition.x,this.currentPosition.y,this.width,this.height);
    }
}

function timeKeeper(){
    timePlayed++;
    if(timePlayed >= gameLevel*20)
    {
        gameLevel++;
        alienSpeed += 2;
    }
    document.getElementById("live-score").innerHTML = "Live Score: " + score;
    document.getElementById("live-level").innerHTML = "Level : " + gameLevel;
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
    constructor(alienLevel) {
        this.x = 0;
        this.y = Math.round(Math.random() * canvas.height);
        this.level = alienLevel;
        switch(this.level)
        {
            case 1:
                {
                    this.width = 30;
                    this.height = 15;
                    this.hp = 1;
                    break;
                }
            case 2:
                {
                    this.width = 50;
                    this.height = 25;
                    this.hp = 2;
                    break;
                }
            case 3:
                {
                    this.width = 70;
                    this.height = 35;
                    this.hp = 3;
                    break;
                }
            default:
                {
                    this.width = 30;
                    this.height = 15;
                    this.level = 1;
                    this.hp = 1;
                } 
        }
    }
    draw() {
        c.drawImage(alienImage,this.x,this.y,this.width,this.height);
    }
    update() {
        c.clearRect(this.x, this.y, this.width, this.height);
        this.x += alienSpeed;
        this.draw();
    }
}

function animateAlien(alien)
{
    animate();
    function animate(){
        if(alien.x < canvas.width + alien.width && aliens.includes(alien))
        {  
            if(alien.x + alien.width >= spaceShip.currentPosition.x && alien.x + alien.width <= spaceShip.currentPosition.x + spaceShip.width)
                if(alien.y + alien.height >= spaceShip.currentPosition.y && alien.y <= spaceShip.currentPosition.y + spaceShip.height)
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
        let alien = new Alien(alienLevel[Math.round(Math.random() * (alienLevel.length - 1))]);
        aliens.push(alien);
        alien.draw();
        animateAlien(alien);
        if(score >= 10 && alienLevel.includes(2) == false)
            alienLevel.push(2);
        else if(score >= 20 && alienLevel.includes(3) == false)
            alienLevel.push(3);

    }
    if(gameOver == false){
        t = setTimeout(function() {
            updateTime();
        }, 1000);
    }
}

class Shot {
    constructor() {
        this.x = spaceShip.currentPosition.x;
        this.y = spaceShip.currentPosition.y + spaceShip.height/2;
        this.width = 7;
        this.height = 3;
    }
    draw() {
        c.drawImage(laserImage,this.x,this.y,this.width,this.height);

    }
    update() {
        c.clearRect(this.x, this.y, this.width, this.height);
        this.x -= shotSpeed;
        this.draw();
    }
}

function animateShot(shot)
{
    animate();
    function animate()
        {
            if(shot.x > -shot.width && shots.includes(shot))
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
    shots.push(shot);
    shot.draw();
    animateShot(shot);
}

function checkAlienShot() {
    aliens.forEach(alien => {
        shots.forEach(shot => {
            
            if(shot.x + shot.width >= alien.x && shot.x <= alien.x + alien.width)
            {
                if(shot.y <=  alien.y + alien.height  && shot.y + shot.height >= alien.y)
                {
                    alien.hp -= 1;
                    shots.splice(shots.indexOf(shot),1);
                    console.log(alien.hp);
                    if(alien.hp == 0)
                    {                       
                        score += (gameLevel + alien.level);
                        shots.splice(shots.indexOf(shot),1);
                        aliens.splice(aliens.indexOf(alien),1);
                        c.clearRect(alien.x < shot.x ? alien.x : shot.x, alien.y < shot.y ? alien.y : shot.y, alien.width + shot.width, alien.height + shot.height);
                    }
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

spaceShip.drawSpaceShip();
displayScore();
