'use strict';

/* Services */

var servicesModule = angular.module('4t.services', ['ngCookies']);

servicesModule.constant('apiUrl', 'http://api.4t.com:8080/api/v1');

//
//
//
servicesModule.factory('AuthService', ['$http', 'apiUrl', '$q', '$cookieStore', '$rootScope', function ($http, apiUrl, $q, $cookieStore, $rootScope) {
	var auth = {};

	auth.userId = $cookieStore.get('userId') || '{userId}';
	
	var token = $cookieStore.get('token');
	if (token) {
		$http.defaults.headers.common['X-4T-Token'] = token;
		$rootScope.$broadcast('event:loginSuccess');
	}
	
	function clearAuth() {
		auth.userId = '{userId}';
		delete $http.defaults.headers.common['X-4T-Token'];

		$cookieStore.remove('userId');
		$cookieStore.remove('token');
	}
	
	auth.login = function (email, password) {
		var deferred = $q.defer();
		
		$http.post(apiUrl + '/users/login?email=' + email + '&password=' + password)
			.success(function(data, status, headers, config) {
				if (!data.header.error) {
					auth.userId = data.body.userId;
					$http.defaults.headers.common['X-4T-Token'] = data.body.token;

					$cookieStore.put('userId', auth.userId);
					$cookieStore.put('token', data.body.token);
					
					deferred.resolve(true);
				}
				else {
					requestFailed(data.header.message);
				}
			})
			.error(function(data, status, headers, config) {
				if (status == 400) {
					requestFailed(data.header.message);
				} else {
					requestFailed("Unexpected error : " + status);
				}
			});
		
		function requestFailed(reason) {
			clearAuth();
			
			deferred.reject(reason);
		}
		
		return deferred.promise;
	};
	
	auth.logout = function() {
		var deferred = $q.defer();
	
		$http.get(apiUrl + '/user/' + auth.userId + '/logout?token=' + $cookieStore.get('token'))
			.success(function(data, status, headers, config) {
				if (!data.header.error) {
					clearAuth();
					
					deferred.resolve(true);
				}
				else {
					requestFailed(data.header.message);
				}
			})
			.error(function(data, status, headers, config) {
				if (status == 400) {
					requestFailed(data.header.message);
				} else {
					requestFailed("Unexpected error : " + status);
				}
			});
		
		function requestFailed(reason) {
			deferred.reject(reason);
		}
		
		return deferred.promise;
	};
	
	auth.injectUserId = function(url) {
		return url.replace('{userId}', auth.userId);
	}
	
	return auth;
}]);

//
//
//
servicesModule.factory('RequestPerformer', ['$http', 'apiUrl', '$q', 'AuthService', function ($http, apiUrl, $q, auth) {
	return {
		get : function (relativeUrl, onSuccess) {
			var deferred = $q.defer();
			
			$http.get(apiUrl + relativeUrl.replace('{userId}', auth.userId))
			.success(function(data, status, headers, config) {
				if (!data.header.error) {
					if (onSuccess) {
						onSuccess();
					}
					deferred.resolve(data.body);
				}
				else {
					requestFailed(data.header.message);
				}
			})
			.error(function(data, status, headers, config) {
				requestFailed("Unexpected error : " + status);
			});
			
			function requestFailed(reason) {
				deferred.reject(reason);
			}
			
			return deferred.promise;
		}
	}
}]);

//
//
//
servicesModule.factory('UserService', ['RequestPerformer', function (req) {
	var user = {};
	
	user.data = null;
	
	user.refresh = function () {
		req.get('/user/{userId}').then(
			function (value) {
				user.data = value;
			}
		);
	}
	
	user.getUserName = function() {
		return user.data ? user.data.firstName + ' ' + user.data.lastName : '';
	}

	return user;
}]);

//
//
//
servicesModule.factory('TransactionsService', ['RequestPerformer', function (req) {
	return {
		getAll : function () {
			return req.get('/user/{userId}/transactions');
		}
	}
}]);

//
//
//
servicesModule.factory('ContactsService', ['RequestPerformer', function (req) {
	return {
		getAll : function () {
			return req.get('/user/{userId}/contacts');
		}
	}
}]);

servicesModule.run([
		'$rootScope',
		'UserService',
		function($rootScope, user) {
			// when the login is successful, refresh the user data
			$rootScope.$on('event:loginSuccess', function() {
				user.refresh();
			});
		}
	])

// Demonstrate how to register services
// In this case it is a simple value service.
servicesModule.value('version', '0.1');