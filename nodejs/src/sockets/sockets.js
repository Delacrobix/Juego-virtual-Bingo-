const server = require("../index");
const countControllers = require("../countdown/controllers/countdown-controllers");
const SocketIO = require("socket.io");
const io = SocketIO(server);

var users = [];

//* Web Sockets
io.on("connection", (socket) => {
  console.log("New connection: " + socket.id);

  socket.join('room:lobby');
  socket.join('room:users');

  socket.on("client:user", (userName) => {

    users.push({
      userName: userName,
      socketId: socket.id
    });

    io.to('room:users').emit("server:users", users);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);

    let us = users.find(user => user.socketId == socket.id);
    let pos = users.indexOf(us);

    users.splice(pos, 1);

    io.to('room:users').emit("server:users", users);
  });

  socket.on("server:lobby-connection", async () => {
    if(await countControllers.findDate()){
        console.log("Count is started.");
    } else {
        await countControllers.saveFlag();
        countControllers.startCountdown(io);
    }
  });
});