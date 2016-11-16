//Require Express
var express = require('express');
var app = express();
var os = require('os');
var bodyParser = require('body-parser');
var log4js = require('log4js');

// Setup Logger
log4js.configure({
    appenders: [
        { type: 'file', filename: 'app.log', category: 'app'}
    ]
})
var logger = log4js.getLogger('app');

//Pull env port or default to 3000
var port = process.env.PORT || 3000;

// Gather hostname information
var hostname = os.hostname();

// Set view engine
app.set('view engine', 'pug');
// Serves static files
app.use(express.static(__dirname + '/static/'));

//Parser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Setup API logger
app.use(function(req, res, next){
    var rawData = JSON.stringify(req.body)
    logger.info('%s %s %s', req.method, req.url, rawData);
    next();
});

//Simple route
var route = require('./routes/route.js')(app);

// Start the server
var server = app.listen(port, function(){
    console.log('Server running at http://' + hostname + ':' + port + '/');
});

module.exports = server;
