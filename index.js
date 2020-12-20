// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

let numUsers = 0;

var  players = {};

var scores = {
  player1: 0,
  player2: 0
};


io.on('connection', (socket) => {
  console.log('a user connected:' + socket.id);

  players[socket.id] = {
    playerId: socket.id,
    score:0,
    active: false, 
  };

  socket.emit('currentPlayers', players);

  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('playerStartGame',function(data){
    players[socket.id].active = true;
    io.emit('currentPlayers', players);
    socket.emit('scoreUpdate', scores);
  });

  //DISCONNECT
  socket.on('disconnect', function () {
    console.log('user disconnected:' + socket.id);
    delete players[socket.id];
    io.emit('disconnect', socket.id);

  });

socket.on('levelPassed', function () {
  players[socket.id].score ++
  io.emit('scoreUpdate', players);
});


});

// Heroku Listener
// server.listen(process.env.PORT, '0.0.0.0');