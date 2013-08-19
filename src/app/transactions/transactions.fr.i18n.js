angular.module('app.transactions')
	.config(['$translateProvider', function ($translateProvider) {
		$translateProvider.translations('fr', {
			transactions: {
				title: 'Transactions',
				pseudo: 'Pseudo',
				amount: 'Montant',
				date: 'Date',
				comment: 'Commentaire',
				edit: {
					legend: 'Transaction',
					contact: 'Contact',
					amount: 'Montant',
					payer: 'Qui a payé',
					credit: 'Moi',
					date: 'Date de la transaction',
					comment: 'Commentaire'
				}
			}
		});
	}])
;
