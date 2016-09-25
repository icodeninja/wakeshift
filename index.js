#!/bin/node

var cache = require('./lib/cache');

var express     = require('express');
var parseCookie = require('cookie-parser');
var wol         = require('wake_on_lan');
var wakeshift   = require('./lib/wakeshift');

var inlcude_modules = [
	'angular',
	'angular-resource',
	'angular-route',
	'angular-cookies'
];

var skip_auth = [
	'/api/',
	'/modules/',
	'/img/',
	'/css/',
	'favicon.ico'
];

var skipAuth = function(path){
	return skip_auth.some(function(v) { return path.indexOf(v) >= 0; });
};

var app    = express();
var server = require('http').Server(app);
var io     = require('socket.io')(server);
var port   = 8088;

var _configure = cache.get('configured') ? false : true;
cache.set('configured', !_configure);

app.use(parseCookie());

app.use('/',function(req,res,next){
	if(_configure && req.path.indexOf('/setup/') !== 0 && !skipAuth(req.path)){
		res.set('Location','/setup/');
		res.status(302).end();
		return;
	}
	if(req.path.indexOf('/setup/') == 0 && !_configure){
		res.set('Location','/admin/');
		res.status(302).end();
		return;
	}
	next();
});

app.use(express.static(__dirname + '/dist'));
for(var x in inlcude_modules){
	var mod = inlcude_modules[x];
	app.use('/modules/'+mod+'.js', express.static(__dirname+'/node_modules/'+mod+'/'+mod+'.js'));
	app.use('/modules/'+mod+'.min.js', express.static(__dirname+'/node_modules/'+mod+'/'+mod+'.min.js'));
}


app.get(['/api/:module/:method/*','/api/:module/:method'], wakeshift.apiHandler);
app.post(['/api/:module/:method/*','/api/:module/:method'], wakeshift.apiHandler);

app.use('/favicon.ico',express.static(__dirname+'/dist/img/favicon.ico'));

app.get('/:mode/',wakeshift.webHandler);


server.listen(port, function(){
	console.log("http server started on port " + port);
});

server.on('error',function(err){
	console.log('http server encountered an error');
});

io.on('connection',wakeshift.socketHandler);
