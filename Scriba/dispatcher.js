/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */ 
 

var app = require("express");
var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(48922);

console.log("Server is Running");

io.on('connection', function (socket) {
    console.log("User Connected");
    socket.on('client_message',function(data){
        console.log(data.text);
        socket.broadcast.emit('server_message',{text:data.text });
    });
});

/*
var io = require('socket.io').listen(48922);
var http = require('http');

console.log("Server is Running");

io.sockets.on('connection', function (socket) {
    console.log("User Connected");
    socket.on('client_message', function (data) {
        console.log(data.text);
        io.socket.broadcast.emit('server_message', { text: data.text });
    });
});
*/ 