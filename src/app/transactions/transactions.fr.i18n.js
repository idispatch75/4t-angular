angular.module('app.transactions')
	.config(['$translateProvider', function ($translateProvider) {
		$translateProvider.translations('fr', {
			transactions: {
				title: 'Transactions',
				pseudo: 'Pseudo',
				amount: 'Montant',
				date: 'Date',
				comment: 'Commentaire'
			}
		});
	}])
;
