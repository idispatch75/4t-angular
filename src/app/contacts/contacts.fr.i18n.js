angular.module('app.contacts')
	.config(['$translateProvider', function ($translateProvider) {
		$translateProvider.translations('fr', {
			contacts: {
				title: 'Contacts'
			}
		});
	}])
;
