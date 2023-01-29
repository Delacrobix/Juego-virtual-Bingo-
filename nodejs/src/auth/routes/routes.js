const express = require("express");
const router = express.Router();
const controllers = require("../controllers/UserController");
const passport = require("passport");
require("../controllers/google-passport");

function isLoggedIn(req, res, next) {
  req.user ? res.sendStatus(401) : next();
}

/**
 * *Render de las vistas con sus respectivas rutas.
 */
router.get("/login", (req, res) => {
  res.render("login", {});
});

router.get("/signup", (req, res) => {
  res.render("signup", {});
});

router.get("/bingo/:id", (req, res) => {
  res.render("bingo", {});
});

router.get("/:id", (req, res) => {
  res.render("lobby", {});
});

router.get("protected/", (req, res) => {
  res.render("lobby", {});
});

router.get("/auth/failure", isLoggedIn, (req, res) => {
  res.render("login", {
    error: "Something wrong with google authentication. Please try again",
  });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callbackURL",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

router.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  req.session = null;
  res.redirect("/login");
});

/**
 * *Rutas dedicadas al registro y control de los usuarios.
 */
router.route("/addUser").post(controllers.addUser);
router.route("/getUser/:userId").get(controllers.findUserById);
router.route("/user/log").post(controllers.findUserAndPassword);

module.exports = router;
