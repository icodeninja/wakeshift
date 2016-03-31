var express = require('express');
var exec = require('child_process').exec;
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 80;

app.use(express.static(__dirname + '/dist'));
app.use('/modules',express.static(__dirname + '/node_modules'))

app.get('/api/',function(req,res){
  exec('ping google.com',function(err,cout,cerr){
    var splits = "\n";
    if(cout.indexOf("\r\n") !== -1) splits = "\r\n";

    res.end(JSON.stringify(cout.split(splits)));
  });
});

server.listen(port,function(){
  console.log("server started!");
});

io.on('connection',function(sock){
  sock.on('message',function(json,from){
    console.log('got me some ' + JSON.stringify(json) + ' from ' + from);
    sock.emit('message',{'hey':'mannnnn'});
  })
});
