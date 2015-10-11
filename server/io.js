'use strict';

import io from 'socket.io';

class ServerIo {
	constructor () {
		this.players = [];
	}

	init (io) {
		io.on('connection', (socket) => {
			var room = socket.handshake['query']['room'];

		  socket.join(room);
		  console.log(`user joined room #${room}`);

		  socket.emit('player number', this.addPlayer(socket.id));

		  socket.on('disconnect', (e) => {
		    socket.leave(room);
		    this.removePlayer(socket.id)
		    console.log(`user joined room #${room}`);
		  });

		  socket.on('movement', (msg, player) => {
		  	console.log(msg, player);
		  	io.to(room).emit('movement', msg);
		  })
		})
	}

	addPlayer (id) {
		this.players.push(id);
		return this.players.length;
	}

	removePlayer (id) {
		var index = this.players.indexOf(id);
		this.players = this.players.slice(index, index + 1);
	}
}


export default new ServerIo;
