var config = require('../../config/config');
var User = require('./user.model.js');
var Post = require('../post/post.model.js');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


exports.createUser = function(req, res) {

    var user = new User();

    user.name = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;

    user.createdOn = new Date();

    user.save(function(err) {

        if (err) {
            return res.status(404).end();
        }

        var token = jwt.sign({ _id: user._id, name: user.name}, config.jwtSecret);
        res.send({token: token});



    });
}


exports.authenticateUser = function(req, res) {
    console.log(req.body);
    User.getAuthenticated(req.body.username, req.body.password, function(err, user, reason) {
        if (err) {
            return res.send();
        }

        if (user) {
            req.user = user;

            var token = jwt.sign({ _id: req.user._id, name: req.user.name }, config.jwtSecret);
            return res.send({ token: token });

        }

        return res.sendStatus(404);
    });

}

exports.updateUser = function(req, res) {

    User.findOne({
        _id: req.user._id
    }, 'name email password', function(err, user) {
        if (err)
            return res.send(404);


        user.name = req.body.name;
        user.email = req.body.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        user.save(function(err, doc) {

            if (err) {
                return res.send(404);
            }

            res.json(doc);
        });
    });
}

exports.deleteUser = function(req, res) {

    User.remove({
        _id: req.params.user_id
    }, function(err, user) {
        if (err)
            res.send(err);
        res.json({
            message: 'User deleted'
        });
    });
}



exports.getAllPosts = function(req, res) {
    Post.find({ "owner": req.body.id })
        .exec(function(err, post) {

            if (err) {
                res.end();
            }
            res.json(post);
        });
}




exports.getUser = function(req, res) {

    User.findOne({
        _id: req.user._id
    }, 'name email', function(err, user) {
        if (err)
            return res.end();
        res.json(user);
    });
}




exports.findUserByEmail = function(req, res) {

    var regex = new RegExp('^' + req.params.email + '$', "i");

    User.findOne({
        "email": regex
    }, function(err, user) {
        if (err)
            return res.end();

        if (user) {
            if (req.user._id === user._id.toString()) {
                return res.send(404);

            }
            return res.send();

        } else {
            return res.send(404);
        }
    });
}
