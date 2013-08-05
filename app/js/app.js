'use strict';

// Declare app level module which depends on filters, and services
angular.module('4t', ['4t.filters', '4t.services', '4t.directives', '4t.controllers', '4t.login'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/transactions', {templateUrl: 'partials/transactions.html', controller: 'TransactionsCtrl'});
    $routeProvider.when('/contacts', {templateUrl: 'partials/contacts.html', controller: 'ContactsCtrl'});
    $routeProvider.otherwise({redirectTo: '/transactions'});
  }])
  .config(['$httpProvider', function($httpProvider) {
  	$httpProvider.defaults.headers.common['X-4T-AppId'] = 'web';
  	//$httpProvider.defaults.useXDomain = true;
  	//delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }]);
