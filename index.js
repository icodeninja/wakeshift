#!/bin/node

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 8080;
var wol = require('wake_on_lan');
var wakeshift = require('./lib/wakeshift');

app.use(express.static(__dirname + '/dist'));
app.use('/modules',express.static(__dirname + '/node_modules'))

app.get('/:mode/',wakeshift.webHandler);

server.listen(port,function(){
  console.log("server started!");
});

server.on('error',function(err){

});

io.on('connection',wakeshift.socketHandler);
