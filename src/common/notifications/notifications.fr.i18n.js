angular.module('services.notifications')
	.config(['$translateProvider', function ($translateProvider) {
		$translateProvider.translations('fr', {
			error: {
				fatal: "Une exception s'est produite : {{ exception }} en raison de {{ cause }}"
			}
		});
	}])
;
