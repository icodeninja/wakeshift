
var exec = require('child_process').exec;
var os = require('os');

var System = function(){
  var t = this;

  t.getCommandOutput = function(command,cb){
    exec(command,function(err,cout,cerr){
        cb(err ? false : cout);
    });
  };

  t.win = os.type() == "Windows_NT";
  t.nChar = t.win ? '\\r\\n' : '\\n';
  t.netBIOS = t.win ? 'nbtstat' : 'nmblookup'

  t.grep = function(search){
      return t.win ? ' | findstr /R /C:"'+search+'"' : ' | grep '+search;
  };

  t.getNetworks = function(giveBase){
    var nets = os.networkInterfaces();
    var rets = {};
    for(var x in nets){
      for(var y = 0; y < nets[x].length; y++){
        if(nets[x][y].family == "IPv4" && nets[x][y].address !== "127.0.0.1" && nets[x][y].mac !== "00:00:00:00:00:00")
          rets[x] = nets[x][y];
      }
    }
    if(giveBase === true){
      var ip = rets[Object.keys(rets)[0]].address;
      ip = ip.split('.');
      ip.splice(ip.length-1,1);
      ip = ip.join('.') + '.0/24';
      rets = ip;
    }
    return rets;
  };

  t.getRegexMatches = function(re,str){
    var matches = [];
    while((m = re.exec(str)) !== null){
      if(m.index === re.lastIndex){
        re.lastIndex++;
      }
      m.shift();
      var match = [];
      for(var x=0;x < m.length; x++){
        match.push(m[x]);
      }
      matches.push(match);
    }
    return matches;
  };

};

module.exports = new System();
