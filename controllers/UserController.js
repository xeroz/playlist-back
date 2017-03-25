'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

function pruebas(req, res){
   res.status(200).send({
      message: 'controlador',
   });
}

function saveUser(req, res){
   var user = new User();

   var params = req.body;
   console.log(params);

   user.name = params.name;
   user.surname = params.surname;
   user.email = params.email;
   user.role = 'ROLE_USER';
   user.image = 'null';

   if (params.password) {
      //encriptar
      bcrypt.hash(params.password, null, null, function(err, hash){
         user.password = hash;
         if (user.name != null && user.surname != null && user.email != null) {
            //Guardar el usuario
         } else {

         }
      });
   } else {
      res.status(500).send({ message: 'Introduce Contraseña' });
   }

}

module.exports = {
   pruebas,
   saveUser
};
