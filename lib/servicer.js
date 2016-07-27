var requireNew = require('require-new');
var Ping       = require('ping-wrapper');
var cache      = require('./cache');

Ping.configure();

var Servicer = function(sock){
    var t = this;

    t.pings = {};

    var makePing = function(){
      var p = requireNew('ping-wrapper');
      p.configure();
      return p;
    };

    t.Servicer = function(){
      console.log('Servicer created for: ' + sock.client.id);
      console.log('retrieving list of IP addresses...');
      var ips = cache.get('ips');

      if(ips instanceof Object){
        console.log(Object.keys(ips).length + ' IP addresses found, starting ping services...')
      }else{
        console.log('no IP addresses found, will wait for new IPs');
      }

      for(var x in ips){
        var ip = ips[x];
        var pPing = makePing();
        var ping = t.pings[ip] = new pPing(ip);
        ping.on('ping',(function(ip,data){
          sock.emit('message',{
            'action':'ping_update',
            'ip':ip,
            'latency':data.time
          });
        }).bind(this,ip));
        ping.on('fail',(function(ip,data){
          sock.emit('message',{
            'action':'ping_failed',
            'ip':ip
          });
        }).bind(this,ip));
      }
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

    };

    t.endAll = function(){
      console.log('ending all for: ' + sock.client.id);
      for(var x in t.pings){
        var ping = t.pings[x];
        ping.stop();
        console.log('ended ' + x);
      }
    };

    t.Servicer();
};

module.exports = Servicer;
