angular.module('app', [
		'templates-app',
		'templates-common',
		'ui.router',
		'pascalprecht.translate',
		'services.security',
		'services.notifications',
		'app.transactions',
		'app.contacts',
		'app.home'
	])

	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');
	}])

	.run(['$rootScope', '$state', '$stateParams', 'titleService', '$window',
		function ($rootScope, $state, $stateParams, titleService, $window) {
			titleService.setSuffix(' | 4Thune');
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
			$rootScope.$window = $window;
		}])

	.controller('AppCtrl',
		['$scope', 'notifications', 'security',
			function ($scope, notifications, security) {
				$scope.notifications = notifications;

				$scope.removeNotification = function (notification) {
					notifications.remove(notification);
				};

				$scope.isAuthenticated = security.isAuthenticated;
			}
		]
	);