angular.module('app', [
		'templates-app',
		'templates-common',
		'ui.state',
		'ui.route',
		'pascalprecht.translate',
		'security',
		'services.notifications',
		'app.transactions',
		'app.contacts',
		'app.home'
	])

	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');
	}])

	.run(['$rootScope', '$state', '$stateParams', 'titleService',
		function ($rootScope, $state, $stateParams, titleService) {
			titleService.setSuffix(' | 4Thune');
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
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
	)

	.config(['$translateProvider', function ($translateProvider) {
		$translateProvider.preferredLanguage('fr');
		$translateProvider.fallbackLanguage('en');
	}]);