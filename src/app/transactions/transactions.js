angular.module('app.transactions', [
		'ui.router',
		'ui.bootstrap',
		'services.title',
		'services.4TApi',
		'services.notifications',
		'pascalprecht.translate',
		'app.transactions.edit'
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

		$stateProvider.state("transactions.add", {
			url: "/add",
			onEnter: ['$stateParams', '$state', '$dialog', '4TApi', function ($stateParams, $state, $dialog, api) {
				$dialog.dialog({
					keyboard: true,
					templateUrl: "transactions/transactions-edit.tpl.html",
					backdropClick: false,
					dialogFade: true,
					resolve: {
						itemId: function () {
							return null;
						},
						contacts: function () { return api.contacts.getAll(true); }
					},
					controller: 'TransactionsEditCtrl'

				}).open().then(function (result) {
						return $state.transitionTo("transactions");
					});
			}]
		});

		$stateProvider.state("transactions.edit", {
			url: "/edit/:id",
			onEnter: ['$stateParams', '$state', '$dialog', '4TApi', function ($stateParams, $state, $dialog, api) {
				$dialog.dialog({
					keyboard: true,
					templateUrl: "transactions/transactions-edit.tpl.html",
					backdropClick: false,
					dialogFade: true,
					resolve: {
						itemId: function () {
							return $stateParams.id;
						},
						contacts: function () { return api.contacts.getAll(true); }
					},
					controller: 'TransactionsEditCtrl'
				}).open().then(function (result) {
						return $state.transitionTo("transactions");
					});
			}]
		});
	})

	.controller('TransactionsCtrl',
		['$scope', 'titleService', '4TApi', 'notifications', '$translate', '$location',
			function ($scope, titleService, api, notifications, $translate, $location) {
				titleService.setTitle($translate('transactions.title'));

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

				$scope.add = function () {
					$location.path('transactions/add'); // workaround for $state.go w/ dialog
				};

				$scope.edit = function (id) {
					$location.path('transactions/edit/' + id); // workaround for $state.go w/ dialog
				};

				$scope.delete = function (id) {
					if ($scope.$window.confirm($translate('confirmation'))) {
						api.transactions.delete(id).then(function() {
							updateTransactions();
						});
					}
				};

				// stored contacts, in case of update failure
				var contacts = [];

				function updateTransactions() {
					api.transactions.getAll().then(
						function (txs) {
							// get contacts list, to show their name
							api.contacts.getAll(true).then(
								function (value) {
									contacts = value;
									buildTransactions();
								},
								buildTransactions());

							// create the list of items
							function buildTransactions() {
								total = 0;

								transactions = _.map(_.filter(txs, function (tx) {
									return !tx.paid;
								}), function (tx) {
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

				updateTransactions();

				$scope.$on('transactions.refresh', updateTransactions);
			}
		]
	)
;
