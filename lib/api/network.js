var sys = require('../system');


module.exports = (function(){
	var t = this;

	var ifconfig_re = /([\w\d]+).+?([\d\w]+\:[\w\d\:]+\:[\w\d]+)/g;

	var getInterfaceMACs = function(iface_arr){
		var ret_obj = {};
		for(var x = 0; x < iface_arr.length; x++){
			ret_obj[iface_arr[x][0]] = iface_arr[x][1];
		}
		return ret_obj;
	};

	t.apiHandler = function(req,res){
		switch(req.params.method){
			case 'interfaces':{
				var interfaces = sys.getNetworks();

				sys.getCommandOutput('ifconfig -a',function(str){
					var macs_by_iface = getInterfaceMACs(sys.getRegexMatches(ifconfig_re, str) );
					for(var x in macs_by_iface){
						if(interfaces.hasOwnProperty(x))
						interfaces[x]['mac'] = macs_by_iface[x];
					}
					res.json(interfaces).end()
				});
			};
		}
	};

	return this;
}());
