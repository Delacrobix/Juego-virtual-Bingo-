/**
 * *Cuerpo de la aplicación:
 * *Aplicación construida con express y nodejs, mongodb en la  base de datos y
 */

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const SocketIO = require("socket.io");

const app = express();

const MONGODB = process.env.MONGODB,
  PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "pug");
app.use(methodOverride());

//* configuración de las vistas
app.use(express.static(path.join(__dirname, "..", "frontend", "static")));
app.set("views", path.join(__dirname, "..", "frontend", "views"));

console.log(path.join(__dirname, "..", "frontend"));
app.use(
  session({
    secret: "sec",
    resave: true,
    saveUninitialized: true,
  })
);

const server = app.listen(PORT, () => {
  console.log(`Server running on: ${PORT}`);
});

//* Web Sockets configuration
const io = SocketIO(server);

io.on("connection", (socket) => {
  console.log("Connection done", socket.id);

  socket.on("Tiempo", (message) => {
    
  });
});

/**
 * *Importación de las rutas.
 */
app.use(require("./routes/routes"));

/**
 * *Conexión a la base de datos.
 */
mongoose
  .connect(MONGODB, {})
  .then((db) => console.log("DB is connected."))
  .catch((err) => console.error(err));
