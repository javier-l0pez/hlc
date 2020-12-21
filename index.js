// Setup basic express server
let express = require('express');
let app = express();
var path = require('path');
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Player Data
let numUsers = 0;

var players = {};

var scores = {
  player1: 0,
  player2: 0
};


io.on('connection', function (socket) {
  console.log('Connected user: ' + socket.id);

  players[socket.id] = {
    playerId: socket.id,
    score: 0,
    active: false,
  };

  socket.emit('currentPlayers', players);

  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('playerStartStats', function (data) {
    players[socket.id].active = true;
    io.emit('currentPlayers', players);
    socket.emit('scoreUpdate', scores);
  });

  //DISCONNECT
  socket.on('disconnect', function () {
    console.log('User disconnected :' + socket.id);
    delete players[socket.id];
    io.emit('disconnect', socket.id);

  });

  socket.on('levelPassed', function () {
    players[socket.id].score++
    io.emit('scoreUpdate', players);
  });


});

// Heroku Listener
// server.listen(process.env.PORT, '0.0.0.0');