'use strict';

angular
	.module('4t.login', [ 'ui.bootstrap' ])
	
	// intercept $http responses to raise event:loginRequired on 401 or 403
	// and store the failed request for further processing when the user is logged
	.config(['$httpProvider', function($httpProvider) {
		$httpProvider.responseInterceptors.push(['$rootScope', '$q',

		function(scope, $q) {
			return function(promise) {
				return promise.then(success, error);
			};

			function success(response) {
				return response;
			}

			function error(response) {
				if (response.status == 401 || response.status == 403) {
					var deferred = $q.defer();

					scope.failedRequests.push({
						config : response.config,
						deferred : deferred
					});

					scope.$broadcast('event:loginRequired');
					return deferred.promise;
				} else {
					return $q.reject(response);
				}
			}
		} ]);
	} ])
	.run([
		'$rootScope',
		'$dialog',
		'$http',
		function($rootScope, $dialog, $http) {
			$rootScope.failedRequests = [];

			// when login is required, show the login popup
			$rootScope.$on('event:loginRequired', function() {
				var d = $dialog.dialog({
					backdrop : true,
					dialogFade : true,
					templateUrl : 'partials/login.html',
					controller : 'LoginController',
					backdropClick : false,
					keyboard : false
				});

				d.open();
			});

			// when the login is successful, execute all stored failed requests 
			$rootScope.$on('event:loginSuccess', function() {
				for (var i = 0; i < $rootScope.failedRequests.length; i++) {
					var request = $rootScope.failedRequests[i];

					$http(request.config)
						.then(function(response) {
							request.deferred.resolve(response);
						});
				}

				$rootScope.failedRequests = [];
			});
		}
	]);

function LoginController($scope, dialog, authService, $rootScope) {
	$scope.errorMessage = '';

	$scope.login = function() {
		authService.login($scope.email, $scope.password)
			.then(
				function(value){
					$rootScope.$broadcast('event:loginSuccess');
					dialog.close();
				},
				function(value){
					$scope.errorMessage = 'Error logging in.';
				}
			);
	};
}