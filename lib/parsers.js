var system = require('./system');

var Parsers = function(){
  var t = this;

  t.getNodesFromNmap = function(nmap){
    nmap = JSON.stringify(nmap);
    var ret = {};
    var mapKeys = ['ip','mac','manufacturer'];
    var nmapStartIndex = nmap.indexOf('Starting Nmap');
    if(nmapStartIndex !== -1){
      var next = t.findNextBreak(nmap,nmapStartIndex,true);
      nmap = nmap.substring(next,nmap.length);
      var nmaps = nmap.split('Nmap done:');
      var preParsed = nmaps[0].split('Nmap scan report for ');
      preParsed.splice(0,1);
      preParsed.splice(preParsed.length-1,1);
      var toMatch= /(.*[0-9]).*Host.*MAC Address: (.*) \((.*)\)/;
      for(var x = 0; x < preParsed.length; x++){
        ret[x] = t.getMatches(toMatch,preParsed[x],mapKeys);
      }
    }

    return ret;
  };

  t.getMatches = function(regex,string,keys){
    var returnResult = string.match(regex);
    var returnObject = {};
    for(var x in returnResult){
      if(x=='index' || x=='0' || x==returnResult.length || x=='input'){

      }else{
        var key = x;
        if(keys !== undefined && keys.length > 0 && keys.length >= parseInt(x)){
          key = keys[parseInt(x)-1];
        }
        returnObject[key] = returnResult[x];
      }
    }
    return returnObject.length == 0 ? false : returnObject;
  };

  t.findNextBreak = function(str,index,after){
    var nlLength = system.nChar.length;
    for(var x = index; x < (str.length-index-nlLength); x++){
      var chkstr = str.substring(x,x+nlLength);
      if(chkstr == system.nChar)
        return after === true ? (x + nlLength) : x;
    }
    return -1;
  };


};

module.exports = new Parsers();