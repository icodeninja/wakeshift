(function() {
	'use strict';

	var App = angular.module('Setup',['ngRoute','ngCookies']);

	App.config(function($routeProvider){
		$routeProvider
		.when('/',{
			templateUrl: 'Loading.htm',
			controller: 'LoadController'
		})
		.when('/user',{
			templateUrl: 'User.htm',
			controller: 'LoginController'
		})
		.when('/interfaces',{
			templateUrl: 'Interfaces.htm',
			controller: 'Interface'
		})
		.otherwise({
			templateUrl: 'Loading.htm',
			controller: 'LoadController'
		})
		;
	});

	var ApiService = App.factory('$api',function($http, $timeout){
		var t = {};
		t.authTicket = function(cb){
			$http.get('/api/auth/login').then(function(result){
				$timeout(function(){
					console.log(result.data);
					cb(result.data);
				});
			});
		};

		t.getNetworkInterfaces = function(cb){
			$http.get('/api/network/interfaces').then(function(result){
				$timeout(function(){
					cb(result.data);
				});
			});
		};
		return t;
	});

	var SetupController = App.controller('SetupController', function($scope, $api){
		$scope.title = "wakeshift";
		$api.authTicket(function(result){
			$scope.dummy = result;
			$scope.$apply();
		});
	});

	var LoadController = App.controller('LoadController', function($scope, $api, $location, $cookies){
		console.log('LoadController...');
		var hiCookies = $cookies.get('hi');
		console.log(hiCookies);
		$scope.continue = function(){
			$location.path('user');
		};
		return;
	});

	var InterfaceController = App.controller('Interface', function($scope, $api){
		$scope.interfaces = {};
		$api.getNetworkInterfaces(function(result){
			console.log(result);
			$scope.interfaces = result;
			$scope.hasInterfaces = Object.keys(result).length > 0;
			$scope.$apply();
		});
	});

	var LoginController = App.controller('LoginController', function($scope, $api){
		console.log('LoginController starting...');
	});

	var NavigationController = App.controller('Navigation', function($scope){
		$scope.title = 'wakeshift setup';
	});

	App.run(function($rootScope){
		$rootScope.$on('$routeChangeStart',function(event, new_url, old_url){
			var controller = new_url.$$route.controller;
			switch(controller){
				case 'LoginController':{
					console.log('yay');
				}break;
			}
		});
	});

	var dControlIcon = App.directive('controlIcon',function(){
		return {
			link: function($scope, $el, $attr){
				$el.bind('click',function(){
					$scope.authed = true;
					$scope.$apply();
				});
			},
			template: function(el, attr){
				return '<div class="ci-text">' + attr.view + '</div>' +
				'<div class="ci-icon icon-'+attr.icon+'"></div>'
			}
		};
	});

	var dTextInput = App.directive('textInput',function(){
		return{
			restrict:'E',
			scope:{

			},
			template:function($el, $attr){
				var content = '<input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="text-input" type="'+$attr.type+'" />';
				if($attr.label)
				content = '<label>'+$attr.label+'&nbsp;'+content+'</label>';
				return content;
			}
		}
	});

}());
