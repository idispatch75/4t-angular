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

	.config(function myAppConfig($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');
	})

	.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.defaults.headers.common['X-4T-AppId'] = 'web';
		//delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}])

	.run(['$rootScope', '$state', '$stateParams', 'titleService', function run($rootScope, $state, $stateParams, titleService) {
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
	);