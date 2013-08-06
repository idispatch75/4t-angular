'use strict';

/* Controllers */

angular.module('4t.controllers', []).
  controller('TransactionsCtrl', ['$scope', 'TransactionsService', function($scope, txService) {
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