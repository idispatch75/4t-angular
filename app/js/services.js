'use strict';

/* Services */

var servicesModule = angular.module('4t.services', ['ngCookies']);

servicesModule.constant('apiUrl', 'http://api.4t.com:8080/api/v1');

//
//
//
servicesModule.factory('AuthService', ['$http', 'apiUrl', '$q', '$cookieStore', function ($http, apiUrl, $q, $cookieStore) {
	var auth = {};

	auth.userId = $cookieStore.get('userId') || '{userId}';
	
	var token = $cookieStore.get('token');
	if (token) {
		$http.defaults.headers.common['X-4T-Token'] = token;
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
			auth.userId = '{userId}';
			delete $http.defaults.headers.common['X-4T-Token'];

			$cookieStore.remove('userId');
			$cookieStore.remove('token');
			
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
servicesModule.factory('TransactionsService', ['$http', 'apiUrl', '$q', 'AuthService', function ($http, apiUrl, $q, auth) {
	return {
		getAll : function () {
			var deferred = $q.defer();
			
			$http.get(apiUrl + '/user/' + auth.userId + '/transactions')
			.success(function(data, status, headers, config) {
				if (!data.header.error) {
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
servicesModule.factory('ContactsService', ['$http', 'apiUrl', '$q', 'AuthService', function ($http, apiUrl, $q, auth) {
	return {
		getAll : function () {
			var deferred = $q.defer();
			
			$http.get(apiUrl + '/user/' + auth.userId + '/contacts')
			.success(function(data, status, headers, config) {
				if (!data.header.error) {
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

// Demonstrate how to register services
// In this case it is a simple value service.
servicesModule.value('version', '0.1');