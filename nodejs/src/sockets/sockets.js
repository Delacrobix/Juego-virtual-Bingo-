const server = require('../index');
const countControllers = require('../countdown/controllers/countdown-controllers');
const SocketIO = require('socket.io');
const io = SocketIO(server);

var users = [];

io.on('connection', (socket) => {
  // console.log("New connection: " + socket.id);

  socket.join('room:lobby');
  socket.join('room:users');
  socket.join('room:winner');

  socket.on('client:user', (userName) => {
    let condition = true;

    users.forEach((user) => {
      if (user.userName === userName) {
        condition = false;
      }
    });

    if (condition) {
      users.push({
        userName: userName,
        socketId: socket.id,
      });
    }

    io.to('room:users').emit('server:users', users);
  });

  socket.on('disconnect', () => {
    // console.log("User disconnected: " + socket.id);

    let us = users.find((user) => user.socketId == socket.id);
    let pos = users.indexOf(us);

    users.splice(pos, 1);

    io.to('room:users').emit('server:users', users);
  });

  socket.on('server:lobby-connection', async () => {
    socket.join('room:countdown');

    if (await countControllers.findDate()) {
      // console.log("Count is started.");
    } else {
      await countControllers.saveFlag();
      countControllers.startCountdown(io);
    }
  });

  socket.on('client:winner', (winner) => {
    socket.to('room:winner').emit('server:winner', winner);
  });
});
