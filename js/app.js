"use strict";
//shared function to get random integer within given range
var getRandomInt = function(min, max) {
    return Math.floor(Math.random()*(max-min+1)) + min;
};

// Enemies our player must avoid
var Enemy = function(getRandomInt) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    this.sprite = 'images/enemy-bug.png';
    this.x = -101 - getRandomInt(100, 1000);
    this.y = 70 * getRandomInt(2, 4);
    this.speed = getRandomInt(100, 500);
};

// Update the enemy's position, required method for game
// Parameter: dt: a time delta between ticks, getRandomInt: a function to generate random integer
Enemy.prototype.update = function(dt, getRandomInt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    //if enemy is in canvas, make enemy moving
    if (this.x <= 909) {
        this.x += this.speed * dt;
    }
    //if enemy is out of canvas, reassign x, y coordinates and speed
    else if(this.x > 909) {
        this.x = -101 - getRandomInt(100, 1000);
        this.y = 70 * getRandomInt(2, 4);
        this.speed = getRandomInt(100, 500);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function(ctx, Resources) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.char = null; //the character image of the player
    this.x;
    this.y;
    this.life = 5; //the number of lives the player has
    this.heart = 'images/Heart.png'; //the heart image
    this.float_up = true; //indicate if player float up when in the water
    this.hei_above_water = 90; //the height of image above the water.
};

//if player is in the water, simulate player floating effect
Player.prototype.update = function(dt) {
    if (this.y < 144) {
        if (this.hei_above_water <= 80) {
            this.float_up = true;
        }
        else if (this.hei_above_water >= 100) {
            this.float_up = false;
        }

        if (this.float_up === true && this.hei_above_water + 15*dt <= 171) {
            this.hei_above_water += 15*dt;
            this.y -= 15*dt;
        }
        else if (this.float_up === false && this.hei_above_water - 15*dt >= 0) {
            this.hei_above_water -= 15*dt;
            this.y += 15*dt;
        }
    }
};

// Draw the part of player below the water on the screen, required method for game
Player.prototype.render_below_water = function(ctx, Resources) {
    ctx.drawImage(
        Resources.get(this.char),
        0,
        this.hei_above_water,
        Resources.get(this.char).width,
        171 - this.hei_above_water,
        this.x,
        this.y + this.hei_above_water,
        Resources.get(this.char).width,
        171 - this.hei_above_water
        );
};

// Draw the player on the screen, required method for game
Player.prototype.render = function(ctx, Resources) {
    //if the player is in the water, draw the part of player above the water
    if (this.y < 144) {
        ctx.drawImage(
            Resources.get(this.char),
            0,
            0,
            Resources.get(this.char).width,
            this.hei_above_water,
            this.x,
            this.y,
            Resources.get(this.char).width,
            this.hei_above_water
            );
    }
    else if (this.y >= 144) {
        ctx.drawImage(Resources.get(this.char), this.x, this.y);
    }
    //draw hearts above the player
    for (var i=0; i<this.life; i++) {
        ctx.drawImage(Resources.get(this.heart), this.x + i*23, this.y + 10);
    }
};

//Handle inputs for player
Player.prototype.handleInput = function(str, playerMoveSound, backgroundSound) {
    //if player has at least one life, move player according to input
    if (this.life >= 1) {
        if (str === 'left' && this.x >= 101) {
            //play sound when player moves
            playerMoveSound.play();
            this.x -= 101;
        }
        else if (str === 'up' && this.y >= 144) {
            playerMoveSound.play();
            this.y -= 78;
        }
        else if (str === 'right' && this.x <= 707) {
            playerMoveSound.play();
            this.x += 101;
        }
        else if (str === 'down' && this.y <= 378) {
            playerMoveSound.play();
            if (this.y >= 144) {
                this.y += 78;
            }
            else if (this.y < 144) {
                this.y = 144;
                this.hei_above_water = 90;
                this.float_up = true;
            }
        }
    }
    //if player has no life, press 'enter' to restore lives
    else if (this.life < 1) {
        if (str === 'enter') {
            //play background sound when game restart
            backgroundSound.loop_play(gameOverSound);
            this.life = 6;
        }
    }
};

//Gems player can pick up to receive points
var Gems = function(getRandomInt) {
    this.gem = this.getRandomImg(getRandomInt);
    this.x = 101 * getRandomInt(0, 8);
    this.y = 70 * getRandomInt(2, 4);
    this.points = 0;
};

//Get random image for Gems
Gems.prototype.getRandomImg = function(getRandomInt) {
    switch(getRandomInt(1, 3)) {
        case 1: return 'images/Gem Blue.png';
        case 2: return 'images/Gem Green.png';
        case 3: return 'images/Gem Orange.png';
    }
};

//Update points for Gems
Gems.prototype.updatepts = function() {
    switch(this.gem) {
        case 'images/Gem Blue.png': {
            this.points += 5;
            break;
        }
        case 'images/Gem Green.png': {
            this.points += 10;
            break;
        }
        case 'images/Gem Orange.png': {
            this.points += 15;
            break;
        }
    }
};

//Update the position of gems after it's pick up
Gems.prototype.update = function(player, getRandomInt, getPointSound) {
    if ((player.x >= this.x-50.5) && 
        (player.x <= this.x+50.5) && 
        (player.y >= this.y-37.5) && 
        (player.y <= this.y+37.5)) {
            this.updatepts();
            this.gem = this.getRandomImg(getRandomInt);
            this.x = 101 * getRandomInt(0, 8);
            this.y = 70 * getRandomInt(2, 4);
            //play sound when collect Gems
            getPointSound.play();
    }
};

//Draw points and gems on the screen
Gems.prototype.render = function(ctx, Resources) {
    ctx.font = '30px Arial';
    ctx.fillText('Points: ' + this.points, 750, 80);
    ctx.drawImage(Resources.get(this.gem), this.x, this.y);
};

//Selection arrow on the player selection screen
var Selectors = function() {
    this.selector = 'images/Selector.png';
    this.x = 200;
    this.finish = false;
};

//Draw selection arrow on the screen
Selectors.prototype.render = function(ctx, Resources) {
    ctx.drawImage(Resources.get(this.selector), this.x, 204);
};

//Handle inputs for selection arrow
Selectors.prototype.handleInput = function(str, selectorMoveSound, player) {
    if (this.finish === false) {
        if (str === 'left' && this.x >= 301) {  
            //play sound when selector moves
            selectorMoveSound.play();
            this.x -= 101;
        }
        else if (str === 'right' && this.x <= 503) {
            selectorMoveSound.play();
            this.x += 101;
        }
        else if (str === 'enter') {
            this.selectchar(player);
            this.finish = true;
        }
    }
};

//Select the character image of player according to x coordinate of selection arrow
Selectors.prototype.selectchar = function(player) {
    switch(this.x) {
        case 200: {
            player.char = 'images/char-boy.png';
            break;
        }
        case 301: {
            player.char = 'images/char-cat-girl.png';
            break;
        }
        case 402: {
            player.char = 'images/char-horn-girl.png';
            break;
        }
        case 503: {
            player.char = 'images/char-pink-girl.png';
            break;
        }
        case 604: {
            player.char = 'images/char-princess-girl.png';
            break;
        }
    }
};

//Texts on the ending screen
var Texts_end = function() {
    this.x = 454.5;
    this.y = 350;
    this.go_up = true;
};

//Simulate texts up and down effect
Texts_end.prototype.update = function(dt) {
    if (this.y <= 200) {
        this.go_up = false;
    }
    else if (this.y >= 600) {
        this.go_up = true;
    }

    if (this.go_up === true) {
        this.y -= 200*dt;
    }
    else if (this.go_up === false) {
        this.y += 200*dt;
    }
};

//Draw texts on the ending screen
Texts_end.prototype.render = function(ctx) {
    ctx.font = '30px Verdana';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', this.x, this.y);
    ctx.fillText('Please press Enter to restart!', this.x, this.y + 40);
};

//From HTML5 Web Audio Quickstart Tutorial
//This is Sound Object
var Sound = function(source) {
    if(!window.audioContext) {
        window.audioContext = new AudioContext();
    }
    var that = this;
    that.source = source;
    that.buffer = null;
    that.isLoaded = false;
    that.playSound = null;

    var getSound = new XMLHttpRequest();
    getSound.open("GET", that.source, true);
    getSound.responseType = "arraybuffer";
    getSound.onload = function() {
        audioContext.decodeAudioData(getSound.response, function(buffer) {
            that.buffer = buffer;
            that.isLoaded = true;
        });
    };
    getSound.send();
};

//play sound once
Sound.prototype.play = function() {
    if(this.isLoaded) {
        this.playSound = audioContext.createBufferSource();
        this.playSound.buffer = this.buffer;
        this.playSound.connect(audioContext.destination);
        //start playing a sound
        this.playSound.start();
    }

};

//stop playing sound
Sound.prototype.stop = function() {
    this.playSound.stop();
};

//play sound in loop
Sound.prototype.loop_play = function(gameOverSound) {
    if(this.isLoaded) {
        this.playSound = audioContext.createBufferSource();
        this.playSound.buffer = this.buffer;
        this.playSound.connect(audioContext.destination);
        //set play in loop, which means no-stop
        this.playSound.loop = true;
        //event handler fired when the sound ends
        this.playSound.onended = function() {
            gameOverSound.play();
        };
        //start playing a sound
        this.playSound.start();
    }
    
};

// Now instantiate your objects.
//Create audio objects
var gameOverSound = new Sound("sound/gameover.wav");
var backgroundSound = new Sound("sound/background.wav");
var getPointSound = new Sound("sound/getPoint.wav");
var dieSound = new Sound("sound/die.wav");
var selectorMoveSound = new Sound("sound/selectorMove.wav");
var playerMoveSound = new Sound("sound/playerMove.wav");
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemy1 = new Enemy(getRandomInt);
var enemy2 = new Enemy(getRandomInt);
var enemy3 = new Enemy(getRandomInt);
var enemy4 = new Enemy(getRandomInt);
var enemy5 = new Enemy(getRandomInt);
var player = new Player();
var allEnemies = [];
var gem = new Gems(getRandomInt);
var selector = new Selectors();
var text_end = new Texts_end();
allEnemies.push(enemy1);
allEnemies.push(enemy2);
allEnemies.push(enemy3);
allEnemies.push(enemy4);
allEnemies.push(enemy5);

// This listens for key presses and sends the keys to your
// Selector.handleInput() and Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    selector.handleInput(allowedKeys[e.keyCode], selectorMoveSound, player);
    player.handleInput(allowedKeys[e.keyCode], playerMoveSound, backgroundSound);
});
