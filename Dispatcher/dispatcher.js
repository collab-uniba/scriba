/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var io = require('socket.io').listen(80);
var http = require('http');

io.sockets.on('connection', function (socket) {

//Il server invia un messaggio al client
    //socket.emit('server_message', { text: 'Messaggio dal server' });

    /*Il server potrà ricevere messaggi dal client, che saranno
     
     stampati a video con il comando console.log*/
    socket.on('client_message', function (data) {
        console.log(data.text);
        io.sockets.emit('server_message', { text: data.text });
    });
});