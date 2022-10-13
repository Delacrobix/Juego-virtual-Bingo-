const express = require('express'),
      router = express.Router(),
      controllers = require('../controllers/UserController');

/**
 * *Render de las vistas con sus respectivas rutas.
 */
router.get('/login', (req, res) => {
    res.render('login', {});
});

router.get('/signup', (req, res) => {
    res.render('signup', {});
});

router.get('/bingo/:id', (req, res) => {
    res.render('bingo', {});
});

router.get('/:id', (req, res) => {
    res.render('lobby', {});
});

/**
 * *Rutas dedicadas al registro y control de los usuarios.
 */
router.route('/addUser').post(controllers.addUser);
router.route('/getUser/:userid').get(controllers.findUserById);
router.route('/user/log').post(controllers.findUserAndPassword);

module.exports = router;