const server = require("../index");
const count_controllers = require("../countdown/controllers/countdown-controllers");
const SocketIO = require("socket.io");

var users = [];

//* Web Sockets
const io = SocketIO(server);

io.on("connection", async (socket) => {
  console.log("Connection done:", socket.id);

  socket.on("client:user", (user) => {
    if (users.indexOf(user.user.user) === -1) {
      users.push(user.user.user);
    }
  });

  socket.emit("server:users", users);

  //let is_started = await count_controllers.findDate(socket);

  // if (is_started) {
  //   console.log("countdown is started");
  // } else {
  //   await count_controllers.saveFlag();
  //   count_controllers.startCountdown(socket);
  // }
});
