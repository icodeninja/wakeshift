var fs = require('fs');

module.exports = (function(){
  var t = this;

  var configPath = __dirname + '/../data/cache.json';

  var writeCache = function(){
    var cacheJSON = JSON.stringify(t.cache);
    fs.writeFileSync(configPath, cacheJSON, {encoding:'utf8'});
  };

  t.get = function(key){
    return t.cache.hasOwnProperty(key) ? t.cache[key] : false;
  };

  t.set = function(key,obj){
    t.cache[key] = obj;
    writeCache();
  };

  t.init = function(){
    var cacheJSON = fs.readFileSync(configPath,{encoding:'utf8'}) || {};
    t.cache       = JSON.parse(cacheJSON);
    console.log('initialized cache');
    console.log(t.cache);
  };

  t.init();

  return t;
}());
