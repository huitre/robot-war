/* 
* @Author: huitre
* @Date:   2015-10-17 20:01:47
* @Last Modified by:   huitre
* @Last Modified time: 2015-10-25 11:26:51
*/

'use strict';


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
        
        sprite = this.game.add.sprite(Math.random() * 300, Math.random() * 300, 'phaserDude' + color);
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

        }
    }
}

var PhaserGame = function () {
    this.game = new Phaser.Game(window.innerWidth, 600, Phaser.AUTO, 'phaser-example', {
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
    },


    update: function () {
        for (var o in this.players)
            this.players[o].update();        
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
