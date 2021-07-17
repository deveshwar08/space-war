var canvas = document.createElement("canvas");
var gameArea = document.getElementById("game-area");
let c = canvas.getContext('2d');

let shotSize = 5;
let shotSpeed = 5;
let spaceShipSpeed = 5;
let score = 0;
let playerName;
let gameOver = false;

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
        drawSpaceShip();
    },
    moveRight() {
        this.prevPosition.x = this.currentPosition.x;
        this.currentPosition.x += spaceShipSpeed;
        this.prevPosition.y = this.currentPosition.y;
        drawSpaceShip();
    },
    moveUp() {
        this.prevPosition.y = this.currentPosition.y;
        this.currentPosition.y -= spaceShipSpeed;
        this.prevPosition.x = this.currentPosition.x;
        drawSpaceShip();
    },
    moveDown() {
        this.prevPosition.y = this.currentPosition.y;
        this.currentPosition.y += spaceShipSpeed;
        this.prevPosition.x = this.currentPosition.x;
        drawSpaceShip();
    }
}

function drawSpaceShip() {

	c.fillStyle = 'black';
	c.fillRect(spaceShip.prevPosition.x - spaceShip.width/2, spaceShip.prevPosition.y - spaceShip.height/2, spaceShip.width, spaceShip.height);
	c.fillStyle = 'white';
    c.fillRect(spaceShip.currentPosition.x - spaceShip.width/2, spaceShip.currentPosition.y - spaceShip.height/2, spaceShip.width, spaceShip.height);
}

class Shot {
    constructor() {
        this.x = spaceShip.currentPosition.x - spaceShip.width / 2 - shotSize;
        this.y = spaceShip.currentPosition.y;
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
            if(shot.x > -shotSize)
            {   
                requestAnimationFrame(animate);
                shot.update();
            }
        }
}

function shoot() {
    let tempShot = new Shot();
    tempShot.draw();
    animateShot(tempShot);
}

document.body.onkeydown = function(e) {
    if(e.keyCode == 32 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
        e.preventDefault();
    if(e.keyCode == 32)
        shoot(); 
    if(e.keyCode == 37)
        spaceShip.moveLeft();
    if(e.keyCode == 38)
        spaceShip.moveUp();
    if(e.keyCode == 39)
        spaceShip.moveRight();
    if(e.keyCode == 40)
        spaceShip.moveDown();
}

c.fillStyle = 'black';
c.fillRect(0,0,canvas.width,canvas.height);
drawSpaceShip();

