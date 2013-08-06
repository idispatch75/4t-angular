'use strict';

/* Controllers */

angular.module('4t.controllers', [])
	.controller('MainCtrl', ['$scope', 'UserService', 'AuthService', '$route', function($scope, user, auth, $route) {
		user.refresh();
		$scope.getUserName = user.getUserName;
		
		$scope.logout = function() {
			auth.logout().then(
				function(){
					$route.reload();
				},
				function(){
					$route.reload();
				}
			);
		}
  }])

  .controller('TransactionsCtrl', ['$scope', 'TransactionsService', function($scope, txService) {
  	$scope.transactions = [];
  	
  	txService.getAll().then(
  		function (value) {
  			$scope.transactions = value;
  		},
  		function (value) {
  			$scope.transactions = [];
  		}
  	);
  }])
  
  .controller('ContactsCtrl', ['$scope', 'ContactsService', function($scope, contactsService) {
		$scope.contacts = [];
  	
  	contactsService.getAll().then(
  		function (value) {
  			$scope.contacts = value;
  		},
  		function (value) {
  			$scope.contacts = [];
  		}
  	);
  }]);