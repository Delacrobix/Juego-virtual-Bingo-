/**
 * *Cuerpo de la aplicación:
 * *Aplicación construida con express y nodejs, mongodb en la  base de datos y
 * *pug como motor de plantillas.
 */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const MONGODB = process.env.MONGODB,
      PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'pug');
app.use(methodOverride());

//* configuracion de las vistas
app.use(express.static(path.join(__dirname, '..', 'frontend', 'static')));
app.set('views', path.join(__dirname, '..', 'frontend', 'views'));


console.log(path.join(__dirname, '..', 'frontend'))
app.use(session({
    secret: 'sec',
    resave: true,
    saveUninitialized: true
}));

app.listen(PORT, () =>{
    console.log(`Server running on: ${PORT}`);
});

/**
 * *Importación de las rutas.
 */
app.use(require('./routes/routes'));

/**
 * *Conexión a la base de datos.
 */
mongoose.connect(MONGODB, {})
    .then(db => console.log('DB is connected.'))
    .catch(err => console.error(err));