angular.module('app')
	.config(['$translateProvider', function ($translateProvider) {
		$translateProvider.preferredLanguage('fr');
		$translateProvider.fallbackLanguage('en');
	}])
;
