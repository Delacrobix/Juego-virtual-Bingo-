const User = require("../models/UserSchema");

exports.findUserById = function (req, res) {
  let user_id = req.params.userId;
  
  User.findById(user_id).exec(function (err, User) {
    return res.status(200).jsonp({
      user: User.user,
    });
  });
};

/**
 * *Se encarga de validar la existencia en la base de datos de los datos ingresados en el login.
 * @returns Mensajes de error en caso de que el sistema no encuentre el usuario o contraseña.
 */
exports.findUserAndPassword = async function (req, res) {
  let { user, password } = req.body;

  if(password.length == 0){
    return res.status(200).jsonp("Empty password");
  }

  if(user.length == 0){
    return res.status(200).jsonp("Empty username");
  }

  let us = await User.findOne({
    user: user,
  });

  if (!us) {
    us = await User.findOne({
      email: user,
    });
  }

  if (!us) {
    return res.status(200).jsonp({
      message: "Username or email not found.",
      flag: true,
    });
  } else {
    let match = await us.comparePassword(password);

    if (match) {
      return res.status(200).jsonp({
        user: user,
        id: us._id,
      });
    } else {
      return res.status(200).jsonp({
        message: "Incorrect password.",
        flag: true,
      });
    }
  }
};

/**
 * * Crea un usuario en base a los datos enviados del formulario de registro.
 * @returns En caso de que el usuario exista, un mensaje de error. Si no existe el usuario,
 * añade el registro a la base de datos.
 */
exports.addUser = async function (req, res) {
  let { user, email, password } = req.body;

  // *Validación de campos vacíos
  if (user.length == 0 || email.length == 0 || password.length == 0) {
    return res.status(200).jsonp({
      message: "Must be fill in all required fields.",
    });
  }

  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/.test(email))){
    return res.status(200).jsonp("The email address :" + email + " is invalid.");
  }

  let _email = await User.findOne({
    email: email,
  });

  let _user = await User.findOne({
    user: user,
  });

  if (_email) {
    return res.status(200).jsonp({
      message: "The email address is already registered.",
    });
  } else if (_user) {
    return res.status(200).jsonp({
      message: "The user is already registered.",
    });
  } else {
    let new_user = new User({
      user: user,
      password: password,
      email: email,
    });

    new_user.password = await new_user.encryptPassword(password);

    new_user.save(new_user);
    res.send(new_user);
  }
};
