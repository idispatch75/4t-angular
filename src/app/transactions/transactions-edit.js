angular.module('app.transactions.edit', [
		'ui.router',
		'ui.bootstrap',
		'services.4TApi',
		'services.notifications',
		'pascalprecht.translate'
	])

	.controller('TransactionsEditCtrl',
		['$scope', '4TApi', 'notifications', '$translate', 'itemId', 'contacts', 'dialog', '$timeout', '$rootScope',
			function ($scope, api, notifications, $translate, itemId, contacts, dialog, $timeout, $rootScope) {
				$scope.contacts = contacts;

				$scope.item = {};
				if (itemId) {
					api.transactions.get(itemId).then(function (tx) {
						$scope.item.contact = _.find(contacts, function (c) {
							return c.contactId == tx.contactId;
						});
						$scope.item.amount = Math.abs(tx.amount);
						$scope.item.debt = tx.amount > 0 ? 0 : 1;
						$scope.item.date = moment(tx.date, 'YYYY-MM-DD');
						$scope.item.comment = tx.comment;
						$scope.item.paid = tx.paid;
						$scope.item.paidDate = moment(tx.paidDate, 'YYYY-MM-DD');
						$scope.item.paidComment = tx.paidComment;
					});
				} else {
					$scope.item.debt = 1;
					$scope.item.date = moment();
				}

				$scope.save = function () {
					if (!$scope.transactionForm.$valid) {
						$scope.transactionForm.$setDirty();
						return;
					}

					var operation;
					if (itemId) {
						operation = api.transactions.update(itemId,
								$scope.item.contact.contactId, $scope.item.debt == 1 ? -$scope.item.amount : $scope.item.amount,
								$scope.item.date.format('YYYY-MM-DD'), $scope.item.comment);
					} else {
						operation = api.transactions.add(
								$scope.item.contact.contactId, $scope.item.debt == 1 ? -$scope.item.amount : $scope.item.amount,
								$scope.item.date.format('YYYY-MM-DD'), $scope.item.comment);
					}

					operation.then(function () {
							$rootScope.$broadcast('transactions.refresh');
							dialog.close(true);
						},
						function (reason) {
							window.alert(reason);
						});
				};

				$scope.cancel = function () {
					dialog.close(false);
				};

				$scope.openDatePicker = function () {
					$timeout(function () {
						$scope.openedDatePicker = true;
					});
				};
			}
		]
	)

	.directive('date', function () {
		return {
			require: 'ngModel',
			link: function (scope, elm, attrs, ngModel) {
				var dateFormat = attrs['date'] || 'YYYY-MM-DD';

				ngModel.$parsers.unshift(function (viewValue) {
					var date = moment(viewValue, dateFormat);
					if (date.isValid()) {
						ngModel.$setValidity('date', true);
						return date;
					}

					// in all other cases it is invalid, return undefined (no model update)
					ngModel.$setValidity('date', false);
					return undefined;
				});

				ngModel.$formatters.unshift(function (modelValue) {
					return modelValue.format(dateFormat);
				});
			}
		};
	});
