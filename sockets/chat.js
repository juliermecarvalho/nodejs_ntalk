﻿

module.exports = function(io) {
    var crypto = require('crypto'),
        sockets = io.sockets;
    sockets.on('connection', function(client) {

        var session = client.handshake.session,
            usuario = session.usuario;
       // client('email', usuario.email);

       // var onlines = sockets.clients();
       // onlines.forEach(function(online) {
       //     online = sockets.sockets[online.id];
       //     online.get('email', function(err, email) {
       //         client.emit('notify-onlines', email);
       //         client.broadcast.emit('notify-onlines', email);
       //     });
       // });


        client.on('send-server', function(m) {
            //var msg = "<b>" + usuario.nome + ":</b> " + msg + "<br>";
            //client.get('sala', function (erro, sala) {
            //var data = { email: usuario.email, sala: sala };
            //client.broadcast.emit('new-message', data);
            //sockets.in(sala).emit('send-client', msg);
            
            var msg = "<b>" + usuario.nome + ":</b> " + m + "<br>";
            client.emit('send-client', msg);
            client.broadcast.emit('send-client', msg);
            //});
        });


        client.on('join', function(sala) {
            if (sala) {
                sala = sala.replace('?', '');
            } else {
                var timestamp = new Date().toString();
                var md5 = crypto.createHash('md5');
                sala = md5.update(timestamp).digest('hex');
            }
            client.set('sala', sala);
            client.join(sala);
        });

        client.on('disconnect', function () {
            client.get('sala', function (erro, sala) {
                var msg = "<b>" + usuario.nome + ":</b> saiu.<br>";
                client.broadcast.emit('notify-offline', usuario.email);
                sockets.in(sala).emit('send-client', msg);
                client.leave(sala);
            });
        });

        client.on('send-server', function(m) {
            var msg = "<b>" + usuario.nome + ":</b> " + m + "<br>";
            client.get('sala', function(erro, sala) {
                var data = { email: usuario.email, sala: sala };
                client.broadcast.emit('new-message', data);
                sockets.in(sala).emit('send-client', msg);
            });
        });
    });






}