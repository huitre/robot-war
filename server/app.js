'use strict';

import fs from 'fs';
import express  from 'express';
import serverio from './io';
import IO from 'socket.io';
import jade from 'jade';

// Determin config
let env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
let config = {
  port: 4242
}

// Our app
let app = express();

// public and view engine
app.set('view engine', 'jade');
app.set('views', __dirname + '/../views');
app.use(express.static(__dirname + '/../public'));

app.use((req, res, next) => {
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Access-Token, X-Requested-With, Cookie, Set-Cookie, Accept, Access-Control-Allow-Credentials, Origin, Content-Type, Request-Id , X-Api-Version, X-Request-Id');
  res.header('Access-Control-Expose-Headers', 'Set-Cookie');
  res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
  res.header('Allow', req.headers['access-control-request-method']);
  return next();
});


let rooms = {
}, hasRoom = false;

app.get('/', (req, res) => {
  if (hasRoom)
    res.redirect('/join');
  else
    res.render('index');
})

app.get('/join/:room', (req, res) => {
  res.render('join');
})

app.get('/join', (req, res) => {
  res.render('rooms', {rooms : rooms});
})

app.post('/create', (req, res) => {
  let s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=@_-',
      room = '';
  for (var i = 0; i < 10; i++) {
    room += s[Math.floor(Math.random() * (s.length))];
  }
  if (!rooms[room]) {
    rooms[room] = {
        players : 4
      };
    hasRoom = true;
  }
  res.redirect(`/room/${room}`);
})

app.get('/room/:room', (req, res) => {
  if (rooms[req.params.room])
    res.render('main');
  else
    res.redirect('/join');
})

serverio.init(IO.listen(app.listen(config.port)));
console.log(`Listening on ${config.port}`);
