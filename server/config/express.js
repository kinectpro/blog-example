var bodyParser = require('body-parser');
var routes = require('../routes.js');
var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');
var morgan = require('morgan');
var methodOverride = require('method-override');
var compression = require('compression');


module.exports = function(app, express) {

    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '../../../build')));
    app.use(morgan('dev'));
    app.set('view engine', 'ejs');
    app.set('port', process.env.PORT || 8000);
    app.set('view options', {
        layout: false
    });
    app.use(methodOverride());
}
