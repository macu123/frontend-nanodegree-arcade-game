var getRandomInt = function(min, max){
    return Math.floor(Math.random()*(max-min+1)) + min;
}

// Enemies our player must avoid
var Enemy = function(){
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -101 - getRandomInt(100, 1000);
    this.y = 70 * getRandomInt(2, 4);
    this.speed = getRandomInt(100, 500);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt){
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    if (this.x <= 505) {
        this.x += this.speed * dt;
    }
    else if (this.x > 505) {
        this.x = -101 - getRandomInt(100, 1000);
        this.y = 70 * getRandomInt(2, 4);
        this.speed = getRandomInt(100, 500);
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.char;
    this.x;
    this.y;
    this.life = 5;
    this.heart = 'images/Heart.png';
    this.up_float = true;
    this.len_above_water = 90;
}

Player.prototype.update = function(dt){
    if (this.y < 144) {
        if (this.len_above_water <= 80) {
            this.up_float = true;
        }
        else if (this.len_above_water >= 100) {
            this.up_float = false;
        }

        if (this.up_float === true && this.len_above_water + 15*dt <= 171) {
            this.len_above_water += 15*dt;
            this.y -= 15*dt;
        }
        else if (this.up_float === false && this.len_above_water - 15*dt >= 0) {
            this.len_above_water -= 15*dt;
            this.y += 15*dt;
        }
    }
}

Player.prototype.render_float = function(){
    ctx.drawImage(Resources.get(this.char), 0, this.len_above_water, Resources.get(this.char).width, 171 - this.len_above_water, this.x, this.y + this.len_above_water, Resources.get(this.char).width, 171 - this.len_above_water);
}

Player.prototype.render = function(){
    if (this.y < 144) {
        ctx.drawImage(Resources.get(this.char), 0, 0, Resources.get(this.char).width, this.len_above_water, this.x, this.y, Resources.get(this.char).width, this.len_above_water);
        
    }
    else if (this.y >= 144) {
        ctx.drawImage(Resources.get(this.char), this.x, this.y);
    }
    
    for (var i=0; i<this.life; i++) {
        ctx.drawImage(Resources.get(this.heart), this.x + i*23, this.y + 10);
    }
}

Player.prototype.handleInput = function(str){
     if (this.life >= 1) {   
        if (str === "left" && this.x >= 101) {
            this.x -= 101;
        }
        else if (str === "up" && this.y >= 144) {
            this.y -= 78;
        }
        else if (str === "right" && this.x <= 303) {
            this.x += 101;
        }
        else if (str === "down" && this.y <= 378) {
            if (this.y >= 144) {
                this.y += 78;
            }
            else if (this.y < 144) {
                this.y = 144;
                this.len_above_water = 90;
                this.up_float = true;
            }
        }
    }
    else if (this.life < 1) {
        if (str === "enter") {
            this.life = 6;
        }
    }
}

var Gems = function(){
    this.gem = this.getRandoimg();
    this.x = 101 * getRandomInt(0, 4);
    this.y = 70 * getRandomInt(2, 4);
    this.points = 0;
}

Gems.prototype.getRandoimg = function(){
    switch(getRandomInt(1, 3)) {
        case 1:
            return 'images/Gem Blue.png';
        case 2:
            return 'images/Gem Green.png';
        case 3:
            return 'images/Gem Orange.png';
        }
    }

Gems.prototype.updatepts = function(){
    switch(this.gem) {
        case 'images/Gem Blue.png':
                                this.points += 5;
                                break;
        case 'images/Gem Green.png':
                                this.points += 10;
                                break;
        case 'images/Gem Orange.png':
                                this.points += 15;
                                break;
        }
    }

Gems.prototype.update = function(){
    if ((player.x >= this.x-50.5) && (player.x <= this.x+50.5) && (player.y >= this.y-37.5) && (player.y <= this.y+37.5)) {
        this.updatepts();
        this.gem = this.getRandoimg();
        this.x = 101 * getRandomInt(0, 4);
        this.y = 70 * getRandomInt(2, 4);
    }
}

Gems.prototype.render = function(){
    ctx.font = "30px Arial";
    ctx.fillText("Points: " + this.points, 350, 80);
    ctx.drawImage(Resources.get(this.gem), this.x, this.y);
}

var Selectors = function(){
    this.selector = 'images/Selector.png';
    this.x = 0;
    this.finish = false;
}

Selectors.prototype.update = function(){
    if (this.x <= 0) {
        this.x = 0;
    }
    else if (this.x >= 404) {
        this.x = 404;
    }
}

Selectors.prototype.render = function(){
    ctx.drawImage(Resources.get(this.selector), this.x, 204);
}

Selectors.prototype.handleInput = function(str){
    if (this.finish === false) {
        switch(str) {
            case 'left': 
                this.x -= 101;
                break;
            case 'right':
                this.x += 101;
                break;
            case 'enter':
                this.selectchar();
                this.finish = true;
                break;
            }
        }
    }

Selectors.prototype.selectchar = function(){
    switch(this.x) {
        case 0:
            player.char = 'images/char-boy.png';
            break;
        case 101:
            player.char = 'images/char-cat-girl.png';
            break;
        case 202:
            player.char = 'images/char-horn-girl.png';
            break;
        case 303:
            player.char = 'images/char-pink-girl.png';
            break;
        case 404:
            player.char = 'images/char-princess-girl.png';
            break;
        }
    }

var Texts_end = function(){
    this.x = 252.5;
    this.y = 350;
    this.if_goup = true;
}

Texts_end.prototype.update = function(dt){
    if (this.y <= 300) {
        this.if_goup = false;
    }
    else if (this.y >= 600) {
        this.if_goup = true;
    }

    if (this.if_goup === true) {
        this.y -= 200*dt;
    }
    else if (this.if_goup === false) {
        this.y += 200*dt;
    }
}

Texts_end.prototype.render = function(){
    ctx.font = "30px Verdana";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", this.x, this.y);
    ctx.fillText("Please press Enter to restart!", this.x, this.y + 40);
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
var selector = new Selectors();
var text_end = new Texts_end();
allEnemies.push(enemy1);
allEnemies.push(enemy2);
allEnemies.push(enemy3);
allEnemies.push(enemy4);
allEnemies.push(enemy5);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    selector.handleInput(allowedKeys[e.keyCode]);
    player.handleInput(allowedKeys[e.keyCode]);
});
