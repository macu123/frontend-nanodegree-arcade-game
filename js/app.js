
var getRandomInt = function(min, max){
    return Math.floor(Math.random()*(max-min+1)) + min;
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -101 - getRandomInt(100, 1000);
    this.y = 70 * getRandomInt(1, 3);
    this.speed = getRandomInt(100, 500);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    if(this.x <= 505){
        this.x += this.speed * dt;
    }else if(this.x > 505){
        this.x = -101 - getRandomInt(100, 1000);
        this.y = 70 * getRandomInt(1, 3);
        this.speed = getRandomInt(100, 500);
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.boy = 'images/char-boy.png';
}

Player.prototype.update = function(){
    if(this.x <= 0){
        this.x = 0;
    }else if(this.x >= 404){
        this.x = 404;
    }

    if(this.y <= -12){
        this.y = -12;
    }else if(this.y >= 378){
        this.y = 378;
    }
}

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.boy), this.x, this.y);
}

Player.prototype.handleInput = function(str){
    if(str === "left"){
        this.x = this.x - 101;
    }
    else if(str === "up"){
        this.y = this.y - 78;
    }
    else if(str === "right"){
        this.x = this.x + 101;
    }
    else if (str === "down"){
        this.y = this.y + 78;
    }

}

var Gems = function(){
    this.gem = this.getRandoimg();
    this.x = 101 * getRandomInt(0, 4);
    this.y = 70 * getRandomInt(1, 3);
    this.points = 0;
}

Gems.prototype.getRandoimg = function(){
    var num = getRandomInt(1, 3);
    if (num === 1) {
        return 'images/Gem Blue.png';
    }
    else if(num === 2){
        return 'images/Gem Green.png';
    }
    else if(num === 3){
        return 'images/Gem Orange.png';
    }
}

Gems.prototype.updatepts = function(){
    if(this.gem === 'images/Gem Blue.png'){
        this.points += 5;
    }
    else if (this.gem === 'images/Gem Green.png') {
        this.points += 10;
    }
    else if(this.gem === 'images/Gem Orange.png'){
        this.points += 15;
    }
}

Gems.prototype.update = function(){
    if((player.x >= this.x-50.5) && (player.x <= this.x+50.5) && (player.y >= this.y-37.5) && (player.y <= this.y+37.5)){
        this.updatepts();
        this.gem = this.getRandoimg();
        this.x = 101 * getRandomInt(0, 4);
        this.y = 70 * getRandomInt(1, 3);
    }
}

Gems.prototype.render = function(){
    ctx.drawImage(Resources.get(this.gem), this.x, this.y);
    $('h1').text("Points: " + this.points); 
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var enemy4 = new Enemy();
var enemy5 = new Enemy();
var player = new Player();
var allEnemies = [];
var gem = new Gems();
allEnemies.push(enemy1);
allEnemies.push(enemy2);
allEnemies.push(enemy3);
allEnemies.push(enemy4);
allEnemies.push(enemy5);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
