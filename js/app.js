angular.module('sangHub', [
    'ngRoute',
    'sangHub.quizApp'
  ]).
  config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
  
    $routeProvider.otherwise({redirectTo: '/index'});
  }]);
  