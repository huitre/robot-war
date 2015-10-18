/* 
* @Author: huitre
* @Date:   2015-10-11 19:49:24
* @Last Modified by:   huitre
* @Last Modified time: 2015-10-18 21:37:05
*/

'use strict';
var whoami = window.location.pathname, 
    room,
    pad,
    socket,
    player;

whoami = whoami[0] == '/' ? whoami.substr(1) : whoami;
room = whoami.substr(whoami.indexOf('/') + 1);



socket = io(window.location.host, {
         query: 'room='+room
      });

socket.on('player number', function (e) {
  player = e;
})


var pad = nipplejs.create({
    zone: document.getElementById('pad'),
    mode: 'static',
    position: {left: '20%', bottom: '20%'},
    color: 'red'
});
pad.on('added', function (evt, nipple) {
  debugger
    nipple.on('start move end dir plain', function (evt) {
       debugger
    });
}).on('removed', function (evt, nipple) {
    nipple.off('start move end dir plain');
});

/*
joystick.on('move', function (e) {
  debugger;
  socket.emit('movement', {
    position : e.target.nipples[0], 
    player : player
  });
})*/