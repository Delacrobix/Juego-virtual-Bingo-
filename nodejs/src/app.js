/**
 * *Cuerpo de la aplicación:
 * *Aplicación construida con express y nodejs, mongodb en la  base de datos y
 */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const SocketIO = require('socket.io');
const countdown = require('./controllers/countdown');

const app = express();

const MONGODB = process.env.MONGODB,
  PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');
app.use(methodOverride());

//* configuración de las vistas
app.use(express.static(path.join(__dirname, '..', 'frontend', 'static')));
app.set('views', path.join(__dirname, '..', 'frontend', 'views'));

console.log(path.join(__dirname, '..', 'frontend'));
app.use(
  session({
    secret: 'sec',
    resave: true,
    saveUninitialized: true,
  })
);

const server = app.listen(PORT, () => {
  console.log(`Server running on: ${PORT}`);
});

//* Web Sockets
const io = SocketIO(server);

io.on('connection', (socket) => {
  console.log('Connection done', socket.id);

  function getRemainTime(remain) {
    // let now = new Date();
    // let remain = (new Date(deadline) - now + 1000) / 1000;
    let remain_seconds = ("0" + Math.floor(remain % 60)).slice(-2);
    let remain_minutes = ("0" + Math.floor((remain / 60) % 60)).slice(-2);
  
    return {
      remain: remain,
      seg: remain_seconds,
      min: remain_minutes,
    };
  }

  socket.join('room1');
  
  const count = (deadline) => {
    const timer_update = setInterval( async () => {
      let now = new Date();
      
      let remain = (deadline - now + 1000) / 1000 % 60;
      let t = getRemainTime(remain);

      console.log( (now_sec - now + 1000) / 1000 % 60)

      socket.broadcast.emit('Tiempo', {
        seg: t.seg,
        min: t.min
      });
  
      if(t.remain < 1){
          clearInterval(timer_update);
      }
    }, 1000);
  }

  let now = new Date();
  let now_sec = ((30 * 1000) + (now.getTime()));
  count(now_sec);
});

/**
 * *Importación de las rutas.
 */
app.use(require('./routes/routes'));

/**
 * *Conexión a la base de datos.
 */
mongoose
  .connect(MONGODB, {})
  .then((db) => console.log('DB is connected.'))
  .catch((err) => console.error(err));
