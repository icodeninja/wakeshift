//var pings = require('net-ping');
var Ping = require('ping-wrapper');
Ping.configure();

var Servicer = function(sock){
    var t = this;


    t.Servicer = function(){
      console.log('new Servicer created for: ' + sock.client.id);

    };

    t.getLatency = function(host,cb){

      t.ping = new Ping(host);

      var pinged = false;
      var killafter = 10;
      var tries = 0;
      var int = setInterval(function(){
        if(tries >= killafter){
          cb(false);
          t.ping.stop();
          clearInterval(int);
        }else tries ++;
      },1000);

      //t.ping = pings.createSession();

      t.ping.on('ping',function(data){
        console.log('easily reached host: ' + host);
        cb(data.time);
        t.ping.stop();
        clearInterval(int);
      });

      t.ping.on('fail', function(data){
        console.log('coult not reach host: ' + host);
        cb(false);
        t.ping.stop();
        clearInterval(int);
      });
      //
      // if(t.ping === null){
      //   cb(false);
      // }else{
      //   t.ping.pingHost(host,function(err,tgt,snt,rcv){
      //     if(err){
      //       cb(false)
      //     }else{
      //       var ms = rcv-snt;
      //       console.log(host + " -> " + ms + "ms");
      //       cb(ms);
      //     }
      //   });
      // }
    };

    t.endAll =function(){
      console.log('ending all for this services');
    };

    t.Servicer();
};

module.exports = Servicer;