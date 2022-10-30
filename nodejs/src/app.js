require("dotenv").config();
require("./auth/controllers/google-passport");
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const path = require("path");
const auth_routes = require("./auth/routes/routes");
const passport = require('passport');

const app = express();

require("./database/mongodb-connection");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "pug");
app.use(methodOverride());

//* configuración de las vistas
app.use(express.static(path.join(__dirname, "..", "frontend", "static")));
app.set("views", path.join(__dirname, "..", "frontend", "views"));

app.use(session({ secret: "sec" }));
app.use(passport.initialize());
app.use(passport.session());

/**
 * *Importación de las rutas.
 */
app.use(auth_routes);

module.exports = app;