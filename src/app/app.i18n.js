angular.module('app')
	.config(['$translateProvider', function ($translateProvider) {
		$translateProvider.translations('fr', {
			validation: {
				fieldRequired: 'Champ obligatoire',
				invalidFormat: 'Format non valide'
			},
			save: 'Sauver',
			cancel: 'Annuler',
			add: 'Ajouter',
			confirmation: 'Etes-vous sûr ?'
		});

		$translateProvider.preferredLanguage('fr');
		$translateProvider.fallbackLanguage('en');

		moment.lang('fr');
	}])
;
