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
		['$scope', 'titleService', 'TransactionsService', 'notifications', 'ContactsService',
			function ($scope, titleService, items, notifications, contactsSvc) {
				titleService.setTitle('transactions.title');

				var total = 0;
				$scope.searchPseudo = "";
				var transactions = [];
				$scope.items = [];

				$scope.filterPseudo = function () {
					total = 0;
					var filteredTotal = 0;
					$scope.items = _.filter(transactions, function (item) {
						var pseudos = $scope.searchPseudo.toLowerCase().split(' ');
						for (i = 0; i < pseudos.length; i++) {
							if (item.pseudo.toLowerCase().indexOf(pseudos[i]) === 0) {
								filteredTotal += item.amount;
								return true;
							}
						}

						return false;
					});

					total = filteredTotal;
				};

				$scope.getTotal = function () {
					return total;
				};

				$scope.addFilter = function (pseudo) {
					$scope.searchPseudo = pseudo;
					$scope.filterPseudo();
				};

				$scope.clearFilter = function () {
					$scope.searchPseudo = '';
					$scope.filterPseudo();
				};

				// stored contacts, in case of update failure
				var contacts = [];

				items.getAll().then(
					function (txs) {
						// get contacts list, to show their name
						contactsSvc.getAll(true).then(
							function (value) {
								contacts = value;
								buildTransactions();
							},
							buildTransactions());

						// create the list of items
						function buildTransactions() {
							total = 0;

							transactions = _.map(txs, function (tx) {
								var item = {};
								item.id = tx.transactionId;
								item.amount = tx.amount;
								item.date = tx.date ? new Date(tx.date) : null;
								item.isPaid = tx.paid;
								item.isDebt = tx.amount < 0;
								var contact = _.find(contacts, function (contact) {
									return contact.contactId == tx.contactId;
								});
								if (contact) {
									item.pseudo = contact.profile.pseudo;
								} else {
									item.pseudo = tx.contactId;
								}
								item.comment = tx.comment;

								total += item.amount;

								return item;
							});

							angular.copy(transactions, $scope.items);
						}
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
