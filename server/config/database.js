var config = require('./config.js');

module.exports = function(app, mongoose) {

    var connect = function() {
        var options = {
            server: {
                socketOptions: { keepAlive: 1 }
            },
            auto_reconnect: true
        };
        mongoose.connect(config.database.url, options)
    };
    connect();
 
    mongoose.connection.on('error', function(err) {
        console.error('MongoDB Connection Error. Please make sure MongoDB is running.' + err);
    });
 
    mongoose.connection.on('disconnected', function() {
        connect()
    })

};
