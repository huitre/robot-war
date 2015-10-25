/* 
* @Author: huitre
* @Date:   2015-10-10 22:59:59
* @Last Modified by:   huitre
* @Last Modified time: 2015-10-23 20:34:16
*/

'use strict';

var whoami = window.location.pathname, 
    init,
    room,
    link = document.querySelector('#room'),
    socket = {},
    Game = new PhaserGame();


whoami = whoami[0] == '/' ? whoami.substr(1) : whoami;
init = whoami.substr(0, whoami.indexOf('/'));
room = whoami.substr(whoami.indexOf('/') + 1);

socket = io(window.location.host, {query: 'room='+room});

socket.on('movement', function (msg) {
  Game.updatePlayer(msg.player.id, msg.mvt);
})

socket.on('player connect', function (msg) {
  if (msg.id != socket.id)
    Game.addPlayer(msg);
})

socket.emit('player all');

socket.on('player status', function (players) {
  for (var player in players)
    Game.addPlayer(msg);
})




