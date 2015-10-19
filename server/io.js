'use strict';

import io from 'socket.io';

class ServerIo {
	init (io) {
		var playerManager = {
				players : {},
				addPlayer: function (id) {
				if (!this.players[id]) {
					this.players[id] = {
						id : id,
						nb : this.getPlayerLength()
					};
					return this.players[id];
				}
				return null;
			},

			removePlayer: function (id) {
				/*var index = this.players.indexOf(id);
				this.players = this.players.slice(index, index + 1);
				*/
				delete this.players[id];
			},

			getPlayer: function (id) {
				if (this.players[id])
					return this.players[id];
				return {
					id : null,
					nb : 0
				}
			},

			getPlayerLength: function (id) {
				var i = 0;
				for (var o in this.players) {
					++i;
				}
				return i;
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
