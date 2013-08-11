angular.module('app.contacts', [
		'ui.state',
		'ui.bootstrap',
		'titleService',
		'services.4TAccess',
		'services.notifications'
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
		['$scope', 'titleService', 'ContactsService', 'notifications',
			function ($scope, titleService, items, notifications) {
				titleService.setTitle('contacts.title');

				items.getAll().then(
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
