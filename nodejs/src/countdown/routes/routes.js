const express = require("express");
const router = express.Router();
const controllers = require("../controllers/countdown-controllers");

/**
 * *Rutas dedicadas al registro y control de los usuarios.
 */
router.route("/getDate").get(controllers.findDate);

module.exports = router;
