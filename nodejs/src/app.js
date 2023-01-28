require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const path = require("path");
const authRoutes = require("./auth/routes/routes");
//const passport = require("passport");

const app = express();

app.use(session({ secret: "sec" }));
//app.use(passport.initialize());
//app.use(passport.session());

require("./database/mongodb-connection");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "pug");
app.use(methodOverride());

//* configuración de las vistas
app.use(express.static(path.join(__dirname, "..", "frontend", "static")));
app.set("views", path.join(__dirname, "..", "frontend", "views"));

/**
 * *Importación de las rutas.
 */
app.use(authRoutes);

module.exports = app;