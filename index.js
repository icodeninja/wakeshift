var express = require('express');

var app = express();

var port = 80;

app.use(express.static(__dirname + '/dist'));

app.listen(port,function(){
  console.log("server started!");
});
