var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 8080;
var system = require('./lib/system');
var parse = require('./lib/parsers');
var wol = require('wake_on_lan');

app.use(express.static(__dirname + '/dist'));
app.use('/modules',express.static(__dirname + '/node_modules'))

app.get('/info/',function(req,res){
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.write('getting sys info...\n');

  res.write(JSON.stringify(system.getNetworks(true)));

  res.end();
});


app.get('/test/',function(req,res){
  res.set('Content-Type', 'text/html; charset=utf-8');
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
});

server.listen(port,function(){
  console.log("server started!");
});

server.on('error',function(err){

});

io.on('connection',function(sock){
  sock.on('message',function(json,from){
    console.log('got me some ' + JSON.stringify(json) + ' from ' + from);
    sock.emit('message',{'hey':'mannnnn'});
  })
});
