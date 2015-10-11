/* 
* @Author: huitre
* @Date:   2015-10-10 22:59:59
* @Last Modified by:   huitre
* @Last Modified time: 2015-10-11 19:50:08
*/

'use strict';

(function (w) {
	var whoami = window.location.pathname, 
			init,
			room;

	whoami = whoami[0] == '/' ? whoami.substr(1) : whoami;
	init = whoami.substr(0, whoami.indexOf('/'));
	room = whoami.substr(whoami.indexOf('/') + 1);

	var main = function () {
		var link = document.querySelector('#room'),
				socket = {};

		socket = io(window.location.host, {query: 'room='+room});

		socket.on('movement', function (msg) {
			
		})
		
		link.innerHTML = '<div>http://' + window.location.host + window.location.pathname.replace('room', 'join') + '</div>';
	}

	
	
	switch (init) {
		case 'room':
			main();
		break;
		case 'join':
			join();
		break;
	}
})(window)