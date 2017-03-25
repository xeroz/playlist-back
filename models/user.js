'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
   name: String,
   surname: String,
   email: String,
   paswsword: String,
   role: String,
   image: String
});

module.exports = mongoose.model('User', UserSchema);
