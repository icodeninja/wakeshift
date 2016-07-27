var fs = require('fs');

module.exports = (function(){
  var t = this;

  var configPath = __dirname + '/../data/cache.json';

  var writeCache = function(){
    var cacheJSON = JSON.stringify(t.cache);
    fs.writeFileSync(configPath,{encoding:'utf8'});
  };

  t.get = function(key){
    return t.cache[key];
  };

  t.set = function(key,obj){
    t.cache[key] = obj;
    writeCache();
  };

  t.init = function(){
    var cacheJSON = fs.readFileSync(configPath,{encoding:'utf8'});
    t.cache       = JSON.parse(cacheJSON);
    console.log('initialized cache');
  };



  t.init();

  return t;
}());
