var MainController = angular.module('MainController',[]);
MainController.controller('MainController',function($scope){
  console.log('test');
  $scope.sock = io.connect('http://' + window.location.hostname + ":" + window.location.port);
  $scope.sock.on('connect', function(data){
    console.log('inital connect');
    $scope.sock.emit('message',{hey:'man'});
    $scope.sock.on('message',function(data){
      console.log(data);
    });
  });
  $scope.hiThere = 'hey';
});
