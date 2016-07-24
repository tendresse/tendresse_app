angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/sign',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('tendresses', {
    url: '/tendresses',
    templateUrl: 'templates/tendresses.html',
    controller: 'tendressesCtrl'
  })

  .state('add', {
    url: '/add',
    templateUrl: 'templates/add.html',
    controller: 'addCtrl'
  })

  .state('me', {
    url: '/me',
    templateUrl: 'templates/me.html',
    controller: 'meCtrl'
  })

  .state('friend', {
    url: '/friend',
    templateUrl: 'templates/friend.html',
    controller: 'friendCtrl'
  })

$urlRouterProvider.otherwise('/home')

  

});