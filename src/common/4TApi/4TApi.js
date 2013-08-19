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

		function execute(httpPromise) {
			var deferred = $q.defer();

			httpPromise
				.success(function (data, status) {
					if (!data.header.error) {
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

		function get(relativeUrl, config) {
			return execute($http.get(getUserUrl(relativeUrl), config));
		}

		function add(relativeUrl, body) {
			return execute($http.post(getUserUrl(relativeUrl), body));
		}

		function update(relativeUrl, body) {
			return execute($http.put(getUserUrl(relativeUrl), body));
		}

		function remove(relativeUrl) {
			return execute($http.delete(getUserUrl(relativeUrl)));
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
			},

			get: function (id, cache) {
				return get('/transaction/' + id, {cache: cache});
			},

			add: function (contactId, amount, date, comment) {
				var tx = {contactId: contactId, amount: amount, date: date, comment: comment};
				return add('/transactions', tx);
			},

			update: function (txId, contactId, amount, date, comment) {
				var tx = {contactId: contactId, amount: amount, date: date, comment: comment};
				return update('/transaction/' + txId, tx);
			},

			delete: function (txId) {
				return remove('/transaction/' + txId);
			}
		};

		service.contacts = {
			getAll: function (cache) {
				return get('/contacts', {cache: cache});
			}
		};

		return service;
	}]);