var system = require('./system');
var parse = require('./parsers');
var Servicer = require('./servicer');

var WakeShift = function(){
  var t = this;
  console.log('wakeshift module loaded');

  t.connection_pool = {};

  t.connection_length = 0;

  t.webHandler = function(req,res){
    res.set('Content-Type', 'text/html; charset=utf-8');
    switch(req.params.mode){
      case 'test':{
        res.write('Scanning IP addresses...');
        system.getCommandOutput('nmap -sn ' + system.getNetworks(true),function(output){
          var nodes = parse.getNodesFromNmap(output);

          var responded_stats = {};
          var sent_stats = 0;

          var html_response = '';

          res.write('found ' + Object.keys(nodes).length + ' live IPs. Resolving hostnames...');

          for(var z in nodes){
            sent_stats ++;
            system.getCommandOutput(system.netBIOS + ' -A ' + nodes[z]['ip'] + system.grep("<00>"),(function(op){
              if(op !== false){
                var splitKey = system.win ? "\r\n" : "\n";
                var hosts = op.split(splitKey);
                var ffl = '';
                for(var x in hosts){
                  if(hosts[x] !== '')
                    if(hosts[x].indexOf("GROUP") == -1){
                      ffl = hosts[x].split("<00>")[0].trim();
                    }
                }
                responded_stats[this] = ffl;
              }else{
                responded_stats[this] = 'None';
              }
              html_response += '<tr><td>' + nodes[this]['ip'] + '</td><td>'+nodes[this]['mac'] +'</td><td>'+nodes[this]['manufacturer']+"</td><td>" + "["+responded_stats[this]+"]" + "</td></tr>";

            }).bind(z));
          }
          var xxx = setInterval(function(){
            if(Object.keys(responded_stats).length >= sent_stats){
              clearInterval(xxx);
              res.write('done.');
              res.end('<table border=1 cellpadding=4><thead><tr><th>IP</th><th>MAC Address</th><th>Manufacturer</th><th>NetBIOS Hostname</th></thead>'+ html_response + "</table>");
            }
          },1000);
          return;

        });
      }break;
      case 'info':{
        res.write('getting sys info...\n');

        res.write(JSON.stringify(system.getNetworks(true)));

        res.end();
      }break;
      default:{
        res.end('haha okay buddy');
      }break;
    }

  };

  t.socketHandler = function(sock){
    var service = t.connection_pool[sock.client.id] = new Servicer(sock);

    sock.on('message',function(json,from){
      sock.emit('message',{'hey':'mannnnn'});
      console.log('Pinging a host...');
      var h = '192.168.0.199';
      service.getLatency(h,function(result){
          console.log(h + " status: " + ( result ? ('Alive, ' + result + 'ms latency.') : 'Asleep.' ) );
      });
    });

    sock.on('disconnect',function(){
      console.log('omg nobody there anymore');
      service.endAll();
      delete t.connection_pool[sock.client.id];
    });
  };

  // setInterval(function(){
  //   console.log('--- Connections: ' + Object.keys(t.connection_pool).length + ' ---');
  // },5000);

};

module.exports = new WakeShift();