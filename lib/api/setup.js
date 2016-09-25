var sys   = require('../system');
var cache = require('../cache');

module.exports = (function(){
	var t = this;

	/* define endpoint handler here */




	/* validate methods here */

	t.checkMethod = function(method, req, res){
		var requestMethod = req.method;
		if(t.methodHandler.hasOwnProperty(method)){
			if(t.methodHandler[method].hasOwnProperty(requestMethod)){
				t.methodHandler[method][requestMethod](req, res);
			}else{
				t.invalidMethod(req,res);
			}
		}else{
			t.invalidMethod(req,res);
		}
	};

	t.invalidMethod = function(req,res){
		var errorObject = {
			'errors':[
				{
					'code':'001',
					'message': 'Invalid request method ('+req.method+') for endpoint: ' + req.originalUrl
				}
			]
		};
		res.status(400).json(errorObject);
	};

	t.apiHandler = function(req,res){
		if(cache.get('configured') === true){
			res.status(400).json({
				errors:[
					{
						code:'101',
						message: 'Setup already completed. Log in to change settings.'
					}
				]
			});
			return;
		}
		checkMethod(req.params.method, req, res);
		return;
	};

	t.methodHandler = {
		'admin':{
			'POST' : t.createAdmin,
			'GET'  : t.invalidMethod
		},
		'interfaces' :{
			'POST' : t.selectInterfaces,
			'GET'  : t.invalidMethod
		}
	};

	return this;
}());
