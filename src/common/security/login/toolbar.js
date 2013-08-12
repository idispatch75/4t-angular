angular.module('security.login.toolbar', ['ui.state', 'pascalprecht.translate'])

// The loginToolbar directive is a reusable widget that can show login or logout buttons
// and information the current authenticated user
	.directive('loginToolbar', ['security', '$state', function (security, $state) {
		var directive = {
			templateUrl: 'security/login/toolbar.tpl.html',
			restrict: 'E',
			replace: true,
			scope: true,
			link: function ($scope, $element, $attrs, $controller) {
				$scope.form = {};
				$scope.isAuthenticated = security.isAuthenticated;
				$scope.login = function () {
					security.login($scope.form.email, $scope.form.password).then(
						function() {
							$state.transitionTo($attrs.redirect);
						}
					);
				};
				$scope.logout = security.logout;
				$scope.$watch(function () {
					return security.user;
				}, function (user) {
					$scope.user = user;
				});
			}
		};
		return directive;
	}])

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
	}]);