angular.module('services.exceptionHandler', ['services.notifications']);

angular.module('services.exceptionHandler').factory('exceptionHandlerFactory', ['$injector', function ($injector) {
	return function ($delegate) {

		return function (exception, cause) {
			// Lazy load notifications to get around circular dependency
			var notifications = $injector.get('notifications');

			// Pass through to original handler
			$delegate(exception, cause);

			// Push a notification error
			notifications.pushForCurrentRoute({type: error, message: 'error.fatal', params: {exception: exception, cause: cause}});
		};
	};
}]);

angular.module('services.exceptionHandler').config(['$provide', function ($provide) {
	$provide.decorator('$exceptionHandler', ['$delegate', 'exceptionHandlerFactory', function ($delegate, exceptionHandlerFactory) {
		return exceptionHandlerFactory($delegate);
	}]);
}]);
