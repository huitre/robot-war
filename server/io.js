'use strict';

import io from 'socket.io';

class ServerIo {
	init (io) {
		var playerManager = {
				players : [],
				addPlayer: function (id) {
				if (this.players.indexOf(id) == -1) {
					this.players.push(id);
					return id
				}
				return null;
			},

			removePlayer: function (id) {
				var index = this.players.indexOf(id);
				this.players = this.players.slice(index, index + 1);
			},

			getPlayer: function (id) {
				return this.players[this.players.indexOf(id)];
			}
		}
		io.on('connection', (socket) => {
			var room = socket.handshake['query']['room'];

		  socket.join(room);
		  console.log(`user joined room #${room}`);

		  socket.to(room).emit('player number', playerManager.addPlayer(socket.id));

		  socket.on('disconnect', (e) => {
		    socket.leave(room);
		    playerManager.removePlayer(socket.id)
		    console.log(`user joined room #${room}`);
		  });

		  socket.on('movement', (msg) => {
		  	io.to(room).emit('movement', {
		  		mvt: msg.position, 
		  		player : playerManager.getPlayer(socket.id)
		  	});
		  })
		})

	}
}


export default new ServerIo;
