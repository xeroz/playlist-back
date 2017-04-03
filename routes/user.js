'use strict'

var express = require('express');
var UserController = require('../controllers/UserController');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/pruebas-ps', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);

module.exports = api;
