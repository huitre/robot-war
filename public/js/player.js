/* 
* @Author: huitre
* @Date:   2015-10-11 19:49:24
* @Last Modified by:   huitre
* @Last Modified time: 2015-10-11 22:38:10
*/

'use strict';
(function (w) {
  var whoami = window.location.pathname, 
      room,
      pad,
      socket,
      player;

  whoami = whoami[0] == '/' ? whoami.substr(1) : whoami;
  room = whoami.substr(whoami.indexOf('/') + 1);

  pad = nipplejs.create({
      zone: document.getElementById('pad'),
      mode: 'static',
      position: {left: '20%', bottom: '20%'},
      color: 'red'
  });

  socket = io(window.location.host, {
           query: 'room='+room
        });
  
  socket.on('player number', function (e) {
    player = e;
  })

  pad.on('move', function (e) {
    socket.emit('movement', {
      position : e.target.nipples[0], 
      player : player
    });
  })
})(window)