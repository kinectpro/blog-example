var mongoose = require('mongoose');
var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
app.use(express.static("./app"));


require('./config/database.js')(app, mongoose);
require('./config/express.js')(app, express);
require('./routes.js')(app);

app.listen(app.get('port'), function() {
    console.log("Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});

module.exports = app;
