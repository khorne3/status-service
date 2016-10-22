//Require Express
var express = require('express');
var app = express();
var os = require('os');
var bodyParser = require('body-parser');

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

//Simple route
var route = require('./routes/route.js')(app);

// Start the server
var server = app.listen(port, function(){
    console.log('Server running at http://' + hostname + ':' + port + '/');
});

module.exports = server;
