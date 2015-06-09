
var socket = io.connect('http://localhost:3000');

socket.on('send-client', function (msg) {
    var chat = document.getElementById('chat');
    chat.innerHTML += msg;
});

var enviar = function() {
    var msg = document.getElementById('msg');
    socket.emit('send-server', msg.value);
};