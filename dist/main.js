(function(){

  var WakeShift = angular.module('WakeShift',[]);

  var messageReceived = function($scope, message){
    console.log(message);
    switch(message.action){
      case 'ping_update':{
        $scope.pings[message.ip] = message.latency + 'ms';

        $scope.$apply();
      }break;
      case 'ping_failed':{
        $scope.pings[message.ip] = '-';
      }break;
    }
  };

  var socketConnected = function($scope, data){
    $scope.sock.off('_');
    console.log('connection established');
    $scope.sock.emit('_', {'action':'confirm_connection'});
    $scope.sock.on('_', messageReceived.bind(this,$scope));
  };

  WakeShift.controller('MainController', function($scope){
    $scope.sock = io.connect('http://' + window.location.hostname + ":" + window.location.port);

    $scope.pings = {};

    $scope.$watch('pings',function(n,o){
        console.log('scope ping changed');
        $scope.showPingTable = Object.keys(n).length > 0;
    },true);

    $scope.sock.on('connect', socketConnected.bind(this,$scope));
  });

}());
