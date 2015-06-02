/* global __dirname */
var express = require('express'),
    app = express(),
    load = require('express-load'),
    error = require('./middleware/error'),
    http = require('http').Server(app),
    expressLayouts = require('express-ejs-layouts');
    io = require('socket.io').listen(http);


app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
app.set('layout', 'layout'); // defaults to 'layout'     
app.set("layout extractScripts", true);
app.use(expressLayouts);


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set('view options', { layout:  '/views/layout.ejs' });

app.use(express.cookieParser('ntalk'));
app.use(express.session());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(error.notFound);
app.use(error.serverError);



load('models')
.then('controllers')
.then('routes')
.into(app);

io.on('connection', function (socket) {
    console.log('a user connected');
});

/**/
io.on('connection', function(client) {
    client.on('send-server', function(data) {
        var msg = "<b>" + data.nome + ":</b> " + data.msg + "<br>";
        client.emit('send-client', msg);
        client.broadcast.emit('send-client', msg);
    });
});
/**/


 
http.listen(3000, function(){
  console.log("Ntalk no ar.");
});

module.exports = app;