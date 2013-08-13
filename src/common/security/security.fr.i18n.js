angular.module('services.security')
	.config(['$translateProvider', function ($translateProvider) {
		$translateProvider.translations('fr', {
			security: {
				unauthorized: 'Vous devez être connecté pour accéder à cette page',
				unexpectedError: "Une erreur inattendue s'est produite : {{ error }}",
				invalidLogin: "L'e-mail ou mot de passe fournis sont incorrects"
			}
		});
	}])
;
