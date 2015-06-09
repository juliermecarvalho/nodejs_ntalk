/* global __dirname */
const KEY = 'ntalk.sid';
const SECRET = 'ntalk';

var express = require('express'),
    app = express(),
    load = require('express-load'),
    error = require('./middleware/error'),
    http = require('http').Server(app),
    expressLayouts = require('express-ejs-layouts');
    io = require('socket.io').listen(http),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    cookie = cookieParser(SECRET),
    store = new expressSession.MemoryStore();




app.set('views', __dirname + '/views');
app.set('layout', 'layout'); // defaults to 'layout'     
app.set("layout extractScripts", true);
app.use(expressLayouts);

//app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use(cookie);
app.use(expressSession({
    secret: SECRET, 
    name: KEY, 
    resave: true, 
    saveUninitialized: true,
    store: store
}));

app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(error.notFound);
app.use(error.serverError);

/** /
io.set('authorization', function (data, accept) {
    cookie(data, {}, function (err) {
        var sessionId = data.signedCookies['connect.sid'];
        store.get(sessionId, function (e, session) {
            
            if (e || !session) {
                accept(null, false);
            } else {
                data.session = session;
                accept(null, true);
            }
        });
    });
});
/**/

io.use(function (socket, next) {
    var data = socket.request;
    cookie(data, {}, function (err) {
        var sessionID = data.signedCookies[KEY];
        store.get(sessionID, function (err, session) {
            if (err || !session) {
                return next(new Error('Acesso negado!'));
            } else {
                socket.handshake.session = session;
                return next();
            }
        });
    });
});



load('models')
    .then('controllers')
    .then('routes')
    .into(app);

load('sockets')
    .into(io);


 
http.listen(3000, function(){
  console.log("Ntalk no ar.");
});

module.exports = app;