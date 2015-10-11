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

		  socket.emit('player number', this.addPlayer(socket));

		  socket.on('disconnect', () => {
		    socket.leave(room);
		    this.removePlayer(socket)
		    console.log(`user joined room #${room}`);
		  });

		  socket.on('movement', (msg) => {
		  	io.to(room).emit('movement', msg);
		  })
		})
	}

	addPlayer (socket) {
		this.players.push(socket);
		return this.players.length;
	}
}


export default new ServerIo;
