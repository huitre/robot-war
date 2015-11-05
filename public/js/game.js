/* 
* @Author: huitre
* @Date:   2015-10-17 20:01:47
* @Last Modified by:   huitre
* @Last Modified time: 2015-11-05 22:10:31
*/

'use strict';

var W = window.innerWidth,
    H = window.innerHeight;

var Ball = function (game) {
    this.game = game;
    this.maxSpeed = 200;
    this.speed = 0;
    this.friction = 3;
    this.sprite = this.getTexture();
    this.last = null;
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
    sprite.body.debug = true;
    return sprite;
}

Ball.prototype.isHit = function (playerID) {
    //this.speed = 300;
    this.last = playerID;
}

Ball.prototype.update = function () {
    this.sprite.body.velocity.x *= 0.98;
    this.sprite.body.velocity.y *= 0.98;
}

var Player = function (index, game, team, teamIndex) {
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
    this.index = index;
    this.teamIndex = teamIndex;
    this.game = game;
    this.maxSpeed = 200;
    this.speed = 200;
    this.friction = 3;
    this.team = team;
    this.sprite = this.getTexture(getIndex(index));
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
    
    sprite = this.game.add.sprite(W/ 2 - 50, H/ 2 - Math.random() * 50, 'robot' + color);
    this.game.physics.arcade.enable(sprite);
    sprite.anchor.set(0.5);
    sprite.body.collideWorldBounds = true;
    sprite.body.bounce.setTo(0.3, 0.3);
    sprite.body.immovable = false;
    sprite.body.debug = true;

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

Player.prototype.victory = function () {

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

var Goal = function (game) {
    this.goal1 = this.goal2 = null;
    this.create(game);
}

Goal.prototype.create = function (game) {
    var goal1Texture = [
            'FF',
            'F',
            'F',
            'F',
            'F',
            'F',
            'F',
            'FF',
        ], goal2Texture = [
            'FF',
            '.F',
            '.F',
            '.F',
            '.F',
            '.F',
            '.F',
            'FF',
        ],goal, goal2;
    
    game.create.texture('goal', goal1Texture, 4, 4, 0);
    game.create.texture('goal2', goal2Texture, 4, 4, 0);
    
    goal = game.add.sprite(0, (H - 30/100 * H) / 2, 'goal');
    goal2 = game.add.sprite((W - 10), (H - 30/100 * H) / 2, 'goal2');

    goal2.height = goal.height = 30/100 * H;
    goal.width = goal2.width = 10;

    game.physics.arcade.enable(goal);
    game.physics.arcade.enable(goal2);
    goal.body.immovable = true;
    goal2.body.immovable = true;

    this.goal1 = goal;
    this.goal2 = goal2;
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
    this.maxPlayers = 4;
    this.ground = this.ball = this.goal = null;
    this.score = [0, 0];
    this.hasScored = false;
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
        this.goal = new Goal(this.game);
        this.ball = new Ball(this.game);
    },


    update: function () {
        var ball = this.ball,
            self = this;

        for (var o in this.players) {
            this.game.physics.arcade.collide(this.players[o].sprite, this.ball.sprite, function () {
                ball.isHit(o);
            });
            this.game.physics.arcade.collide(this.ball.sprite, this.goal.goal1, function () {
                self.playerScored(ball.last, 1);
            });
            this.game.physics.arcade.collide(this.ball.sprite, this.goal.goal2, function () {
                self.playerScored(ball.last, 0);
            });
            this.players[o].update();
        }
        this.ball.update();
    },

    render: function () {
    },

    playerScored: function (id, team) {
        if (this.hasScored)
            return;
        this.hasScored = true;
        this.score[team] += 1;
        this.getPlayer(id).victory();
        this.setStartPosition();
    },

    setStartPosition: function () {
        for (var o in this.team) {

        }
        this.hasScored = false;
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
        player = new Player(playerMsg.nb, this.game, teamName, this.team[teamName].length + 1);
        this.players[playerMsg.id] = player;
        this.team[teamName].push(player);
        this.nbPlayers++;
        player.x = 10;
        player.y = 20;
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
