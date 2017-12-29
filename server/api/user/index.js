var config = require('../../config/config');
var express = require('express');
var Route = express.Router();
var controller = require('./user.controller.js');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

Route
    .post('/signup', controller.createUser)
    .delete('/delete', expressJwt({ secret: config.jwtSecret }), controller.updateUser)
    .post('/authenticate', controller.authenticateUser)
    .post('/getallposts', expressJwt({ secret: config.jwtSecret }), controller.getAllPosts)
    .get('/get', expressJwt({ secret: config.jwtSecret }), controller.getUser)
    .put('/update', expressJwt({ secret: config.jwtSecret }), controller.updateUser)
    .get('/find/:email', expressJwt({ secret: config.jwtSecret }), controller.findUserByEmail);

module.exports = Route;
