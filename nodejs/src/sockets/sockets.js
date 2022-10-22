const server = require('../index');
const SocketIO = require('socket.io');

//* Web Sockets
const io = SocketIO(server);
const count_controllers = require('../countdown/controllers/countdown-controllers');

io.on('connection', (socket) => {
  console.log('Connection done', socket.id);
  //socket.join('room1');
  
  const count = (deadline) => {
    const timer_update = setInterval( async () => {
      let now = new Date();
      
      let remain = (deadline - now + 1000) / 1000 % 60;
      let t = count_controllers.getRemainTime(remain);

      console.log( (deadline - now + 1000) / 1000 % 60)

      socket.emit('Tiempo', {
        seg: t.seg,
        min: t.min
      });
      // socket.broadcast.emit('Tiempo', {
      //   seg: t.seg,
      //   min: t.min
      // });
  
      if(t.remain < 1){
          clearInterval(timer_update);
      }
    }, 1000);
  }

  let now = new Date();
  let deadline = ((30 * 1000) + (now.getTime()));
  count(deadline);
});