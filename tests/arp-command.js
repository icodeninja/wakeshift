var sys = require('../lib/system');



sys.getCommandOutput('arp -a',function(str){
	var re = /.+?\((\d+\.\d+\.\d+\.\d+?)\).+?([\w\d]+\:[\w\d\:]+).+?on\s(.+)/g;
	var network_interfaces = sys.getRegexMatches(re,str);
	console.log('arp -a');
	console.log(network_interfaces);
});


sys.getCommandOutput('nbtscan -s : 192.168.0.0/24', function(str){
	var re = /(\d+\.\d+\.\d+\.\d+)\:([\S]+).+?([\d\w]+\:[\d\w\:]+)/g;
	var netbios_hostnames = sys.getRegexMatches(re,str);
	console.log('nbtscan -s : 192.168.0.0/24');
	console.log(netbios_hostnames);
})

sys.getCommandOutput('ifconfig -a', function(str){
	var re = /([\w\d]+).+?([\d\w]+\:[\w\d\:]+\:[\w\d]+)/g;
	var interface_macs = sys.getRegexMatches(re,str);
	console.log(str);
	console.log('ifconfig -a');
	console.log(interface_macs);
});
