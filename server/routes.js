'use strict';

module.exports = function(app) {
    app.use('/api/post', require('./api/post'));
    app.use('/api/user', require('./api/user'));
    // app.route('/')
    //     .get(function(req, res) {
    //         res.sendfile('./app/index.html');
    //     });
    app.use(function(err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.status(401).send('invalid token...');
        }
    });
};
