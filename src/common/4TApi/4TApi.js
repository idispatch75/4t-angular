angular.module('services.4TApi', ['pascalprecht.translate']);

angular.module('services.4TApi')
	.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.defaults.headers.common['X-4T-AppId'] = 'web';
	}])

	.factory('4TApi', ['$http', '$q', function ($http, $q) {
		var baseUrl = 'http://api.4t.com:8080/api/v1';

		var service = {};

		function getUserUrl(urlPart) {
			if (service.user) {
				return baseUrl + '/user/' + service.user.id + urlPart;
			} else {
				return baseUrl + '/user/' + urlPart;
			}
		}

		function get(relativeUrl, config, onSuccess) {
			var deferred = $q.defer();

			$http.get(getUserUrl(relativeUrl), config)
				.success(function (data, status, headers, config) {
					if (!data.header.error) {
						if (onSuccess) {
							onSuccess(data.body);
						}
						deferred.resolve(data.body);
					}
					else {
						requestFailed(data.header.code);
					}
				})
				.error(function (data, status) {
					if (status != 401) {
						requestFailed('4TAccess.unexpectedError', status);
					}
				});

			function requestFailed(reason) {
				deferred.reject(reason);
			}

			return deferred.promise;
		}

		function User(id, token) {
			this.id = id;
			this.token = token;
		}

		service.user = null;

		service.login = function (email, password) {
			return $http({
				url: baseUrl + '/users/login',
				method: 'POST',
				params: {email: email, password: password}
			});
		};

		service.setUser = function (loginData) {
			service.user = new User(loginData.userId, loginData.token);
			$http.defaults.headers.common['X-4T-Token'] = service.user.token;
			
			// get user profile
			get('', null, function (body) {
				service.user.profile = body;
			});
		};

		service.logout = function () {
			return $http({
				url: getUserUrl('/logout'),
				method: 'post',
				params: {token: service.user.token}});
		};

		service.resetUser = function () {
			service.user = null;
			delete $http.defaults.headers.common['X-4T-Token'];
		};

		service.transactions = {
			getAll: function (cache) {
				return get('/transactions', {cache: cache});
			}
		};

		service.contacts = {
			getAll: function (cache) {
				return get('/contacts', {cache: cache});
			}
		};

		return service;
	}]);