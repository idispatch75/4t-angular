angular.module('app.transactions', [
		'ui.state',
		'ui.bootstrap',
		'titleService',
		'services.4TAccess',
		'services.notifications'
	])

	.config(function config($stateProvider) {
		$stateProvider.state('transactions', {
			url: '/transactions',
			views: {
				"main": {
					controller: 'TransactionsCtrl',
					templateUrl: 'transactions/transactions.tpl.html'
				}
			}
		});
	})

	.controller('TransactionsCtrl',
		['$scope', 'titleService', 'TransactionsService', 'notifications',
			function ($scope, titleService, items, notifications) {
				titleService.setTitle('transactions.title');

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
