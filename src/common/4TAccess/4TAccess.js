angular.module('services.4TAccess', ['security.service']);

angular.module('services.4TAccess')
	.factory('RequestPerformer', ['$http', 'apiUrl', '$q', 'security', function ($http, apiUrl, $q, security) {
		return {
			get: function (relativeUrl, onSuccess) {
				var deferred = $q.defer();

				$http.get(security.getUserUrl(relativeUrl))
					.success(function (data, status, headers, config) {
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
					.error(function (data, status) {
						requestFailed('4TAccess.unexpectedError');
					});

				function requestFailed(reason) {
					deferred.reject(reason);
				}

				return deferred.promise;
			}
		};
	}])

	.factory('TransactionsService', ['RequestPerformer', function (req) {
		return {
			getAll: function () {
				return req.get('/transactions');
			}
		};
	}])

	.factory('ContactsService', ['RequestPerformer', function (req) {
		return {
			getAll: function () {
				return req.get('/contacts');
			}
		};
	}])
;