/* 
* @Author: huitre
* @Date:   2015-10-17 20:01:47
* @Last Modified by:   huitre
* @Last Modified time: 2015-10-19 22:30:07
*/

'use strict';

var game = new Phaser.Game(window.innerWidth, 600, Phaser.AUTO, 'phaser-example', PhaserGame);

var PhaserGame = function () {
    this.players = {};
    this.nbPlayers = 0;
    this.maxSpeed = 300;
};

PhaserGame.prototype = {

    init: function () {
        game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);
    },

    preload: function () {


    },

    create: function () {
        console.log('create');
    },


    update: function () {
    
    },

    getPlayerSprite: function (id) {
        return this.players[id].sprite;
    },

    updatePlayer: function (id, stick) {
        var sprite = this.getPlayerSprite(id);

        var a = game.physics.arcade.velocityFromRotation(stick.angle.radian, stick.force * this.maxSpeed, sprite.body.velocity);
        console.log(a, sprite);
        sprite.rotation = -stick.angle.radian;
    },

    addPlayer: function (player) {
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
        ], color = player.nb, sprite;
        
        playerData[4] = playerData[4].replace(/6/g, color == 2 ?  0 : color);
        game.create.texture('phaserDude' + this.nbPlayers, playerData, 4, 4, 0);
        sprite = game.add.sprite(Math.random() * 300, Math.random() * 300, 'phaserDude' + this.nbPlayers);
        sprite.anchor.set(0.5);

        game.physics.arcade.enable(sprite);
        player.sprite = sprite;
        this.nbPlayers++;
        this.players[player.id] = player;
    },

    removePlayer: function (player) {
        this.nbPlayers--;
    }
};
