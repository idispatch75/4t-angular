angular.module('app.contacts', [
		'ui.router',
		'ui.bootstrap',
		'services.title',
		'services.4TApi',
		'services.notifications',
		'pascalprecht.translate'
	])

	.config(function config($stateProvider) {
		$stateProvider.state('contacts', {
			url: '/contacts',
			views: {
				"main": {
					controller: 'ContactsCtrl',
					templateUrl: 'contacts/contacts.tpl.html'
				}
			}
		});
	})

	.controller('ContactsCtrl',
		['$scope', 'titleService', '4TApi', 'notifications',
			function ($scope, titleService, api, notifications) {
				titleService.setTitle('contacts.title');

				api.contacts.getAll().then(
					function (value) {
						$scope.items = value;
					},
					function (reason) {
						notifications.pushForCurrentRoute({type: 'error', message: reason});
						$scope.items = [];
					}
				);
			}
		]
	)
;
