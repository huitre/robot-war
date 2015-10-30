/* 
* @Author: huitre
* @Date:   2015-10-17 20:01:47
* @Last Modified by:   huitre
* @Last Modified time: 2015-10-30 17:05:09
*/

'use strict';

var W = window.innerWidth,
    H = window.innerHeight;

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
    sprite = this.game.add.sprite(W/ 2, H/ 2, 'ball');
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
    var getIndex = function (index) {
        var t = {
            'A' : 10,
            'B' : 11,
            'C' : 12,
            'D' : 13,
            'E' : 14,
            'F' : 15,
        }
        index += 3;
        if (index > 9)
            return t[index];
        return index;
    }
    this.isMoving = false;
    this.index = 3 + index;
    this.game = game;
    this.maxSpeed = 200;
    this.speed = 200;
    this.friction = 3;
    this.team = team;
    this.sprite = this.getTexture(index);
}

Player.prototype.getTexture = function (color) {
    var playerTexture = [
                '.11111111',
                '112222210',
                '12222210.',
                '1222560..',
                '1666560..',
                '1222560..',
                '12222210.',
                '112222210',
                '.11111111'
            ], 
            sprite,
            teamColor = this.team ? 'F' : 'A';
    
    // change player color
    playerTexture[3] = playerTexture[3].replace(/6/g, color == 2 ?  0 : color);
    playerTexture[4] = playerTexture[4].replace(/6/g, color == 2 ?  color : color);
    playerTexture[5] = playerTexture[5].replace(/6/g, color == 2 ?  0 : color);
    for (var i = 0, m = playerTexture.length; i < m; ++i) {
        playerTexture[i] = playerTexture[i].replace(/1/g, teamColor);
    }
    this.game.create.texture('robot' + color, playerTexture, 4, 4, 0);
    
    sprite = this.game.add.sprite(W/ 2 - Math.random() * 50, H/ 2 - Math.random() * 50, 'robot' + color);
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

var Ground = function (game) {
    var wallTexture = [
            '55555'
        ], wall, wall2, wall3, wall4, wall5;
    
    game.create.texture('wall', wallTexture, 4, 4, 0);
    game.create.texture('center', ['22222'], 4, 4, 0);
    wall4 = game.add.sprite((W -10) / 2, 0, 'center');
    wall4.width = 10;
    wall4.height = H;
    
    wall = game.add.sprite(0, 0, 'wall');
    wall.width = W;
    wall.height = 10;

    wall2 = game.add.sprite(0, H - 10, 'wall');
    wall2.width = W;
    wall2.height = 10;

    wall2 = game.add.sprite(0, H - 10, 'wall');
    wall2.width = W;
    wall2.height = 10;

    wall3 = game.add.sprite(0, 0, 'wall');
    wall3.width = 10;
    wall3.height = H;

    wall4 = game.add.sprite(W -10, 0, 'wall');
    wall4.width = 10;
    wall4.height = H;

}


var PhaserGame = function () {
    var ratio = 1; // calcul de ratio futur pour device != 16/10
    this.game = new Phaser.Game(W * ratio, H * ratio, Phaser.AUTO, 'phaser-example', {
        create : this.create.bind(this),
        update : this.update.bind(this),
        render : this.render.bind(this)
    });
    this.players = {};
    this.nbPlayers = 0;
    this.maxSpeed = 300;
    this.team = [[], []];
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
        this.ground = new Ground(this.game);
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

    addPlayer: function (playerMsg) {
        var teamName = this.getTeamForPlayer(),
            player = null;
        player = new Player(playerMsg.nb, this.game, teamName);
        this.players[playerMsg.id] = player;
        this.team[teamName].push(player);
        this.nbPlayers++;
    },

    getTeamForPlayer: function () {
        if (this.team[0].length < this.team[1].length)
            return 0;
        return 1;
    },

    removePlayer: function (player) {
        this.nbPlayers--;
    }
};
