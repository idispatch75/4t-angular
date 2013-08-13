angular.module('services.security.login.toolbar')
	.config(['$translateProvider', function ($translateProvider) {
		$translateProvider.translations('fr', {
			login: {
				email: 'E-mail',
				password: 'Mot de passe',
				login: 'Se connecter',
				logout: 'Se déconnecter',
				createAccount: 'Créer un compte'
			},
			MISSING_DATA : "Le login et mot de passe doivent être renseignés"
		});
	}])
;
