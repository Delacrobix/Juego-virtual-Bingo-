const User = require('../models/UserSchema');

exports.findUserById = function(req, res){
  let user_id = req.params.userid;

  User.
    findById(user_id).
    exec(function (err, User) {
      return res.status(200).jsonp({
        user: User.user
      });
    });
}

/**
 * *Se encarga de validar la existencia en la base de datos de los datos ingresados en el login.
 * @returns Mensajes de error en caso de que el sistema no encuentre el usuario o contraseña.
 */
exports.findUserAndPassword = async function(req, res){
  let {user, password} = req.body;
  
  let us = await User.findOne({
    user: user
  });

  if(!us){
    return res.status(200).jsonp({
      message: 'Usuario no existe.',
      flag: true
    });
  } else {
      let match = await us.comparePassword(password);

      if(match){
          return res.status(200).jsonp({
            user: user,
            id: us._id
          });
      } else {
          return res.status(200).jsonp({
            message: 'Contraseña incorrecta.',
            flag: true
          });
      }
  }
}

/**
 * * Crea un usuario en base a los datos enviados del formulario de registro.
 * @returns En caso de que el usuario exista, un mensaje de error. Si no existe el usuario,
 * añade el registro a la base de datos.
 */
exports.addUser = async function (req, res){
  let { user, password } = req.body;

  let us = await User.findOne({
    user: user
  });

  if(us){
    return res.status(200).jsonp({
      message: 'El nombre de usuario ya existe',
      flag: true
    });
  } else {
    let new_user = new User({
      user: user,
      password: password
    });
  
    new_user.password = await new_user.encryptPassword(password);
  
    new_user.save(new_user);
  
    res.send(new_user);
  }
}