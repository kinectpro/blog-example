var express = require('express');
var config = require('../../config/config');
var Route = express.Router();
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var controller = require('./post.controller.js');

Route
    .post('/create', expressJwt({ secret: config.jwtSecret }), controller.createPost)
    .put('/update', expressJwt({ secret: config.jwtSecret }), controller.updatePost)
    .delete('/delete:post_id', expressJwt({ secret: config.jwtSecret }), controller.deletePost)
	.put('/publish', expressJwt({ secret: config.jwtSecret }), controller.publishPost)
	.get('/:year/:month/:day/:slug', controller.getPostBySlug)
    .get('/getall', controller.getAllPosts)
    .get('/like:post_id', controller.like)
    .get('/dislike:post_id', controller.dislike);

module.exports = Route;
