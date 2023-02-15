const server = require("../index");
const countControllers = require("../countdown/controllers/countdown-controllers");
const SocketIO = require("socket.io");
const io = SocketIO(server);

var users = new Array(); 

//* Web Sockets
io.on("connection", (socket) => {
  console.log("New connection: " + socket.id);

  socket.on("client:user", (userName) => {
    console.log("User save: " + userName);
    
    users.push(userName);
    users.forEach(user => console.log("USER: " + JSON.stringify(user)));
    console.log("USERS: " + users)
    console.log("USERS COUNT: " + users.length)

    socket.emit("server:users", users);
  });

  socket.on("disconnect", (user) => {
    console.log("User disconnected: " + socket.id);
    console.log("User delete: " + user);

    let position = users.indexOf(user);

    //_users.slice(position, 1);
    socket.emit("server:users", users);
  });
});

// io.on("connection", async (socket) => {
//   console.log("Connection done: ", socket.id);

//   socket.on("client:user", (user) => {
//     if (users.indexOf(user.user.user) === -1) {
//       users.push(user.user.user);
//     }
//   });

//   socket.emit("server:users", users);

//   let is_started = await count_controllers.findDate(socket);

//   if (is_started) {
//     console.log("countdown is started");
//   } else {
//     await count_controllers.saveFlag();
//     count_controllers.startCountdown(socket);
//   }
// });