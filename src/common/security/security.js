angular.module('services.security.main', [
		'services.security.retryQueue',    // Keeps track of failed requests that need to be retried once the user logs in
		'ngCookies',
		'ui.route',
		'services.notifications',
		'services.4TApi',
		'pascalprecht.translate'
	])

	.factory('security',
		['4TApi', '$q', 'securityRetryQueue', '$cookieStore', '$state', 'notifications',
			function (api, $q, queue, $cookieStore, $state, notifications) {

				// Redirect to the given url (defaults to 'home')
				function redirect(state) {
					state = state || 'home';
					$state.transitionTo(state);
				}

				// Register a handler for when an item is added to the retry queue
				queue.onItemAddedCallbacks.push(function (retryItem) {
					if (queue.hasMore()) {
						clearAuth();
						queue.cancelAll();

						var message;
						if (retryItem.url.indexOf('/users/login') > 0) {
							message = 'security.invalidLogin';
						} else {
							message = 'security.unauthorized';
						}

						if ($state.current.name == 'home') {
							notifications.pushForCurrentRoute({type: 'error', message: message});
						} else {
							notifications.pushForNextRoute({type: 'error', message: message});
						}
						redirect('home');
					}
				});

				function clearAuth() {
					api.resetUser();

					$cookieStore.remove('userId');
					$cookieStore.remove('token');
				}

				// The public API of the service
				var service = {
					user: api.user,

					// Get the first reason for needing a login
					getLoginReason: function () {
						return queue.retryReason();
					},

					// Attempt to authenticate a user by the given email and password
					// If the login succeeded, try to get the user profile too
					login: function (email, password) {
						var deferred = $q.defer();

						api.login(email, password)
							.success(function (data) {
								if (!data.header.error) {
									api.setUser(data.body);

									// store in cookies
									$cookieStore.put('userId', api.user.userId);
									$cookieStore.put('token', api.user.token);

									deferred.resolve(true);
								}
								else {
									requestFailed(data.header.code);
								}
							})
							.error(function (data, status) {
								if (status == 400) {
									requestFailed(data.header.code);
								} else if (status != 401) {
									requestFailed('security.unexpectedError', {error : status});
								}
							});

						function requestFailed(reason, params) {
							clearAuth();
							notifications.pushForCurrentRoute({type: 'error', message: reason, params: params});

							deferred.reject(reason);
						}

						return deferred.promise;
					},

					// Logout the current user and redirect
					logout: function (redirectTo) {
						api.logout().then(function () {
								clearAuth();
								redirect(redirectTo);
							});
					},

					// Ask the backend to see if a user is already authenticated - this may be from a previous session.
					requestUser: function () {
						if (service.isAuthenticated()) {
							return $q.when(api.user);
						} else {
							return $q.reject();
						}
					},

					// Is the current user authenticated?
					isAuthenticated: function () {
						return !!api.user;
					},

					// Is the current user an adminstrator?
					isAdmin: function () {
						return !!(api.user && api.user.admin);
					}
				};

				// try to restore auth from cookies
				var userId = $cookieStore.get('userId');
				if (userId) {
					// restore auth
					api.setUser({ userId: userId, token: $cookieStore.get('token')});
				}

				return service;
			}
		]
	);
