var express = require('express');

var app = express();

var port = 80;
var host = '127.0.0.1';

app.use(express.static(__dirname + '/dist'));

app.listen(port,host,function(){
  console.log("server started!");
});
