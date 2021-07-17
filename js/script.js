var canvas = document.createElement("canvas");
var gameArea = document.getElementById("game-area");
let c = canvas.getContext('2d');

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
        this.currentPosition.x--;
        this.prevPosition.y = this.currentPosition.y;
        drawSpaceShip();
    },
    moveRight() {
        this.prevPosition.x = this.currentPosition.x;
        this.currentPosition.x++;
        this.prevPosition.y = this.currentPosition.y;
        drawSpaceShip();
    },
    moveUp() {
        this.prevPosition.y = this.currentPosition.y;
        this.currentPosition.y--;
        this.prevPosition.x = this.currentPosition.x;
        drawSpaceShip();
    },
    moveDown() {
        this.prevPosition.y = this.currentPosition.y;
        this.currentPosition.y++;
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


document.body.onkeydown = function(e) {
    if(e.keyCode == 37)
        spaceShip.moveLeft();
    if(e.keyCode == 38)
        spaceShip.moveUp();
    if(e.keyCode == 39)
        spaceShip.moveRight();
    if(e.keyCode == 40)
        spaceShip.moveDown();
}

c.fillStyle = "rgba(0,0,0,1)";
c.fillRect(0,0,canvas.width,canvas.height);
drawSpaceShip();

