/* 
* @Author: huitre
* @Date:   2015-10-10 22:59:59
* @Last Modified by:   huitre
* @Last Modified time: 2015-10-11 22:41:10
*/

'use strict';

(function (w) {
	var whoami = window.location.pathname, 
			init,
			room,
      link = document.querySelector('#room'),
      socket = {};

	whoami = whoami[0] == '/' ? whoami.substr(1) : whoami;
	init = whoami.substr(0, whoami.indexOf('/'));
	room = whoami.substr(whoami.indexOf('/') + 1);

	socket = io(window.location.host, {query: 'room='+room});

	socket.on('movement', function (msg) {
		document.querySelector('#content').value += "\n" + 'player (' + msg.player + ') x ' + msg.position.frontPosition.x + ' y ' + msg.position.frontPosition.y;
	})
	
	link.innerHTML = '<div>http://' + window.location.host + window.location.pathname.replace('room', 'join') + '</div>';

})(window)