/* 
* @Author: huitre
* @Date:   2015-10-17 20:01:47
* @Last Modified by:   huitre
* @Last Modified time: 2015-10-25 21:48:39
*/

'use strict';

var Ball = function (game) {
    this.game = game;
    this.maxSpeed = 200;
    this.speed = 200;
    this.friction = 3;
    this.sprite = this.getTexture();
}

Ball.prototype.getTexture = function (color) {
    var ballData = [
                '.111.',
                '11311',
                '13331',
                '11311',
                '.111.',
            ], 
            sprite;
    this.game.create.texture('ball', ballData, 4, 4, 0);
    sprite = this.game.add.sprite(window.innerWidth/ 2, window.innerHeight/ 2, 'ball');
    this.game.physics.arcade.enable(sprite);
    sprite.anchor.set(0.5);
    sprite.body.collideWorldBounds = true;
    sprite.body.bounce.setTo(0.3, 0.3);
    return sprite;
}

Ball.prototype.isHit = function () {
    console.log(arguments);
}

var Player = function (index, game, team) {
    this.isMoving = false;
    this.index = index;
    this.game = game;
    this.maxSpeed = 200;
    this.speed = 200;
    this.friction = 3;
    this.team = team;
    this.sprite = this.getTexture(index);
}

Player.prototype.getTexture = function (color) {
    var playerData = [
                '.11111111',
                '112222210',
                '12222210.',
                '1222510..',
                '1666510..',
                '1222510..',
                '12222210.',
                '112222210',
                '.11111111'
            ], 
            sprite;
        
        // change player color
        playerData[4] = playerData[4].replace(/6/g, color == 2 ?  0 : color);
        this.game.create.texture('phaserDude' + color, playerData, 4, 4, 0);
        
        sprite = this.game.add.sprite(window.innerWidth/ 2 - Math.random() * 50, window.innerHeight/ 2 - Math.random() * 50, 'phaserDude' + color);
        this.game.physics.arcade.enable(sprite);
        sprite.anchor.set(0.5);
        sprite.body.collideWorldBounds = true;
        sprite.body.bounce.setTo(0.3, 0.3);
        sprite.body.immovable = false;

        return sprite;
}

Player.prototype.update = function (stick) {
    if (stick !== undefined && stick != null && stick) {
        this.sprite.rotation = -stick.angle.radian;
        this.speed = this.maxSpeed;
    } else 
        this.speed = this.speed ? this.speed - this.friction : 0;
    if (this.speed > 0) {
        try {
            this.game.physics.arcade.velocityFromRotation(this.sprite.rotation, this.speed, this.sprite.body.velocity);
        } catch (e) {
            this.speed = this.speed ? this.speed - this.friction : 0;
        }
    }
}

var PhaserGame = function () {
    var ratio = 1; // calcul de ratio futur pour device != 16/10
    this.game = new Phaser.Game(window.innerWidth * ratio, window.innerHeight * ratio, Phaser.AUTO, 'phaser-example', {
        create : this.create.bind(this),
        update : this.update.bind(this),
        render : this.render.bind(this)
    });
    this.players = {};
    this.nbPlayers = 0;
    this.maxSpeed = 300;
};

PhaserGame.prototype = {

    init: function () {
        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);
    },

    preload: function () {


    },

    create: function () {
        console.log('create');
        this.ball = new Ball(this.game);
    },


    update: function () {
        for (var o in this.players) {
            this.game.physics.arcade.collide(this.players[o].sprite, this.ball.sprite);  
            this.players[o].update();
        }
    },

    render : function () {

    },

    getPlayer: function (id) {
        return this.players[id];
    },

    updatePlayer: function (id, stick) {
        this.getPlayer(id).update(stick);
    },

    addPlayer: function (player) {
       this.players[player.id] = new Player(player.nb, this.game);
       this.nbPlayers++;
    },

    removePlayer: function (player) {
        this.nbPlayers--;
    }
};
