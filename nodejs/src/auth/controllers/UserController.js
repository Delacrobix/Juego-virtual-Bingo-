const User = require("../models/UserSchema");

exports.findUserById = async function (req, res) {
  let user_id = req.params.userId;
  
  await User.findById(user_id).exec(function (err, User) {
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
    return res.status(422).jsonp("Empty password");
  }

  if(user.length == 0){
    return res.status(422).jsonp("Empty username");
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
    return res.status(400).jsonp({
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
      return res.status(422).jsonp({
        message: "Incorrect password.",
        flag: true,
      });
    }
  }
};

exports.getUserNameByMongoId = async function(req, res) {
  let mongoId = req.params.mongoId;

  if(mongoId.length == 0) {
    return res.status(422).jsonp("Empty MongoId");
  } 

  const result = await User.findById(mongoId);

  if(result){
    return res.status(200).jsonp({
      user: result.user
    });
  } else {
    return res.status(400).jsonp("MongoId not found");
  }
}

/**
 * * Crea un usuario en base a los datos enviados del formulario de registro.
 * @returns En caso de que el usuario exista, un mensaje de error. Si no existe el usuario,
 * añade el registro a la base de datos.
 */
exports.addUser = async function (req, res) {
  let { user, email, password } = req.body;

  // *Validación de campos vacíos
  if (user.length == 0 || email.length == 0 || password.length == 0) {
    return res.status(422).jsonp({
      message: "Must be fill in all required fields.",
    });
  }

  emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  if (!emailRegex.test(email)){
    return res.status(422).jsonp("The email address: " + email + " is invalid.");
  }

  let _email = await User.findOne({
    email: email,
  });

  let _user = await User.findOne({
    user: user,
  });

  if (_email) {
    return res.status(422).jsonp("The email address is already registered.");
  } else if (_user) {
    return res.status(422).jsonp("The user is already registered.");
  } else {
    let new_user = new User({
      user: user,
      email: email,
      password: password
    });

    new_user.password = await new_user.encryptPassword(password);

    new_user.save(new_user);

    return res.status(200).jsonp({
      message: "User has been registered.",
      flag: true
    });
  }
};
