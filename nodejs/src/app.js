require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const path = require("path");
const authRoutes = require("./auth/routes/routes");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const flash = require("connect-flash");

const COOKIE_PARSER_SEC = process.env.COOKIE_PARSER_SECRET;
const EXPRESS_SESSION_SEC = process.env.EXPRESS_SESSION_SECRET;

const app = express();

app.use(cookieParser(COOKIE_PARSER_SEC));
app.use(
  session({
    secret: EXPRESS_SESSION_SEC,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));

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
require("./auth/controllers/PassportControllers");

module.exports = app;
