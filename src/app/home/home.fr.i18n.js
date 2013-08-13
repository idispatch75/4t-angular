angular.module('app.home')
	.config(['$translateProvider', function ($translateProvider) {
		$translateProvider.translations('fr', {
			home: {
				title: 'Accueil'
			}
		});
	}])
;
