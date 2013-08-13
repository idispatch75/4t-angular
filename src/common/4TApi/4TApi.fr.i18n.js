angular.module('services.4TApi')
	.config(['$translateProvider', function ($translateProvider) {
		$translateProvider.translations('fr', {
			'4TApi': {
				unexpectedError: "Une erreur inattendue s'est produite : {{ error }}"
			}
		});
	}])
;
