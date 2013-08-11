angular.module('security.service', [
		'security.retryQueue',    // Keeps track of failed requests that need to be retried once the user logs in
		'ngCookies',
		'ui.route',
		'services.notifications'
	])

	.constant('apiUrl', 'http://api.4t.com:8080/api/v1')

	.factory('security',
		['$http', 'apiUrl', '$q', 'securityRetryQueue', '$cookieStore', '$state', 'notifications',
			function ($http, apiUrl, $q, queue, $cookieStore, $state, notifications) {

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
						notifications.pushForNextRoute({type: 'error', message: retryItem});
						redirect();
					}
				});

				function clearAuth() {
					service.user = null;
					delete $http.defaults.headers.common['X-4T-Token'];

					$cookieStore.remove('userId');
					$cookieStore.remove('token');
				}

				// The public API of the service
				var service = {

					// Get the first reason for needing a login
					getLoginReason: function () {
						return queue.retryReason();
					},

					// Attempt to authenticate a user by the given email and password
					// If the login succeeded, try to get the user profile too
					login: function (email, password) {
						var deferred = $q.defer();

						$http({
							url: apiUrl + '/users/login',
							method: 'POST',
							params: {email: email, password: password}
						})
							.success(function (data) {
								if (!data.header.error) {
									service.user = data.body;

									// set token header
									$http.defaults.headers.common['X-4T-Token'] = service.user.token;

									// get user profile
									$http.get(service.getUserUrl(''), {userId: service.user.userId})
										.success(function (data) {
											// add profile to the user
											service.user.profile = data.body;

											// store in cookies
											$cookieStore.put('userId', service.user.userId);
											$cookieStore.put('token', service.user.token);
										})
										.error(function (data, status) {
											if (status == 400) {
												requestFailed(data.header.code);
											} else {
												requestFailed('security.unexpectedError', {error : status});
											}
										});

									deferred.resolve(true);
								}
								else {
									requestFailed(data.header.code);
								}
							})
							.error(function (data, status) {
								if (status == 400) {
									requestFailed(data.header.code);
								} else {
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

					getUserUrl: function (urlPart) {
						if (service.user) {
							return apiUrl + '/user/' + service.user.userId + urlPart;
						} else {
							return apiUrl + '/user/' + urlPart;
						}
					},

					// Logout the current user and redirect
					logout: function (redirectTo) {
						$http({
							url: service.getUserUrl('/logout'),
							method: 'post',
							params: {token: service.user.token}}).then(function () {
								clearAuth();
								redirect(redirectTo);
							});
					},

					// Ask the backend to see if a user is already authenticated - this may be from a previous session.
					requestUser: function () {
						if (service.isAuthenticated()) {
							return $q.when(service.user);
						} else {
							return $q.reject();
						}
					},

					// Information about the current user
					user: null,

					// Is the current user authenticated?
					isAuthenticated: function () {
						return !!service.user;
					},

					// Is the current user an adminstrator?
					isAdmin: function () {
						return !!(service.user && service.user.admin);
					}
				};

				// try to restore auth from cookies
				var userId = $cookieStore.get('userId');
				if (userId) {
					// restore auth
					service.user = { userId: userId, token: $cookieStore.get('token')};
					$http.defaults.headers.common['X-4T-Token'] = service.user.token;

					// get profile
					$http.get(service.getUserUrl(''), {userId: service.user.userId})
						.success(function (data) {
							service.user.profile = data.body;
						});
				}

				return service;
			}
		]
	);
