const express = require('express'),
      router = express.Router(),
      controllers = require('../controllers/countdown-controllers');


/**
 * *Rutas dedicadas al registro y control de los usuarios.
 */
router.route('/getDate').get(controllers.findDate);

module.exports = router;