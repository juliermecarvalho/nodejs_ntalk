/* global __dirname */
var express = require('express'), 
	load = require('express-load');

var app = express();
app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
//app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.cookieParser('ntalk'));
app.use(express.session());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));



load('models')
.then('controllers')
.then('routes')
.into(app);

app.listen(3000, function(){
  console.log("Ntalk no ar.");
});

module.exports = app;