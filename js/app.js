//shared function to get random integer within given range
var getRandomInt = function(min, max) {
    return Math.floor(Math.random()*(max-min+1)) + min;
};

// Enemies our player must avoid
var Enemy = function() {
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
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    //if enemy is in canvas, make enemy moving
    if (this.x <= 505) {
        this.x += this.speed * dt;
    }
    //if enemy is out of canvas, reassign x, y coordinates and speed
    else if (this.x > 505) {
        this.x = -101 - getRandomInt(100, 1000);
        this.y = 70 * getRandomInt(2, 4);
        this.speed = getRandomInt(100, 500);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.char; //the character image of the player
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
Player.prototype.render_below_water = function() {
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
Player.prototype.render = function() {
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
Player.prototype.handleInput = function(str) {
    //if player has at least one life, move player according to input
    if (this.life >= 1) {
        if (str === 'left' && this.x >= 101) {
            //play sound when player moves
            playerMoveSound.play(false);
            this.x -= 101;
        }
        else if (str === 'up' && this.y >= 144) {
            playerMoveSound.play(false);
            this.y -= 78;
        }
        else if (str === 'right' && this.x <= 303) {
            playerMoveSound.play(false);
            this.x += 101;
        }
        else if (str === 'down' && this.y <= 378) {
            playerMoveSound.play(false);
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
            backgroundSound.play(true);
            this.life = 6;
        }
    }
};

//Gems player can pick up to receive points
var Gems = function() {
    this.gem = this.getRandoimg();
    this.x = 101 * getRandomInt(0, 4);
    this.y = 70 * getRandomInt(2, 4);
    this.points = 0;
};

//Get random image for Gems
Gems.prototype.getRandoimg = function() {
    switch(getRandomInt(1, 3)) {
        case 1:
            return 'images/Gem Blue.png';
        case 2:
            return 'images/Gem Green.png';
        case 3:
            return 'images/Gem Orange.png';
        }
    };

//Update points for Gems
Gems.prototype.updatepts = function() {
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
    };

//Update the position of gems after it's pick up
Gems.prototype.update = function() {
    if ((player.x >= this.x-50.5) && 
        (player.x <= this.x+50.5) && 
        (player.y >= this.y-37.5) && 
        (player.y <= this.y+37.5)) {
            this.updatepts();
            this.gem = this.getRandoimg();
            this.x = 101 * getRandomInt(0, 4);
            this.y = 70 * getRandomInt(2, 4);
            //play sound when collect Gems
            getPointSound.play(false);
    }
};

//Draw points and gems on the screen
Gems.prototype.render = function() {
    ctx.font = '30px Arial';
    ctx.fillText('Points: ' + this.points, 350, 80);
    ctx.drawImage(Resources.get(this.gem), this.x, this.y);
};

//Selection arrow on the player selection screen
var Selectors = function() {
    this.selector = 'images/Selector.png';
    this.x = 0;
    this.finish = false;
};

//Draw selection arrow on the screen
Selectors.prototype.render = function() {
    ctx.drawImage(Resources.get(this.selector), this.x, 204);
};

//Handle inputs for selection arrow
Selectors.prototype.handleInput = function(str) {
    if (this.finish === false) {
        if(str === 'left' && this.x >= 101) {  
            //play sound when selector moves
            selectorMoveSound.play(false);
            this.x -= 101;
        }
        else if (str === 'right' && this.x <= 303) {
            selectorMoveSound.play(false);
            this.x += 101;
        }
        else if (str === 'enter') {
            this.selectchar();
            this.finish = true;
        }
    }
};

//Select the character image of player according to x coordinate of selection arrow
Selectors.prototype.selectchar = function() {
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
    };

//Texts on the ending screen
var Texts_end = function() {
    this.x = 252.5;
    this.y = 350;
    this.go_up = true;
};

//Simulate texts up and down effect
Texts_end.prototype.update = function(dt) {
    if (this.y <= 300) {
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
Texts_end.prototype.render = function() {
    ctx.font = '30px Verdana';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', this.x, this.y);
    ctx.fillText('Please press Enter to restart!', this.x, this.y + 40);
};

//From HTML5 Web Audio Quickstart Tutorial
//This is Sound Object
var Sound = function(source) {
    if(!window.audioContext) {
        audioContext = new AudioContext;
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

Sound.prototype.play = function(if_loop) {
    if(this.isLoaded) {
        this.playSound = audioContext.createBufferSource();
        this.playSound.buffer = this.buffer;
        this.playSound.connect(audioContext.destination);
        if(if_loop) {
            this.playSound.loop = true;
            //event handler fired when the sound ends
            this.playSound.onended = function() {
                gameOverSound.play(false);
            };
        }
        this.playSound.start();
    }

};

Sound.prototype.stop = function() {
    this.playSound.stop();
}


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
// Selector.handleInput() and Player.handleInput() method. You don't need to modify this.
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
