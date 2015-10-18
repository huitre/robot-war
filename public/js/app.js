/* 
* @Author: huitre
* @Date:   2015-10-10 22:59:59
* @Last Modified by:   huitre
* @Last Modified time: 2015-10-18 20:16:53
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

socket.on('movement', function (msg, player) {
  Game.updatePlayer(msg, player);
})

socket.on('player number', function (msg) {
  if (msg.id != socket.id)
    Game.addPlayer(msg);
})

socket.on('')



