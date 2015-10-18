/* 
* @Author: huitre
* @Date:   2015-10-17 20:01:47
* @Last Modified by:   huitre
* @Last Modified time: 2015-10-18 20:51:17
*/

'use strict';

var game = new Phaser.Game(window.innerWidth, 600, Phaser.AUTO, 'phaser-example', PhaserGame);

var PhaserGame = function () {
    this.players = {};
    this.nbPlayers = 0;
};

PhaserGame.prototype = {

    init: function () {
        this.maxSpeed = 300;
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

    updatePlayer: function (msg) {
        var sprite = this.getPlayerSprite(msg.player);

        game.physics.arcade.velocityFromRotation(msg.mvt.rotation, this.stick.force * this.maxSpeed, sprite.body.velocity);
        game.sprite.rotation = this.stick.rotation;
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
