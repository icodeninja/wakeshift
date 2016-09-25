var Ping = require('ping-wrapper');

Ping.configure();

var ping = new Ping('10.0.0.2');

ping.on('ping',function(data){
  console.log(data);
  ping.stop();
});

ping.on('fail',function(data){
  console.log(data);
  ping.stop();
});
