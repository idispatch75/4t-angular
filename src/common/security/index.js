// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('services.security', [
  'services.security.main',
  'services.security.interceptor',
  'services.security.login']);
