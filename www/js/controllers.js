angular.module('app.controllers', [])
  
.controller('homeCtrl', function($scope) {

})

.controller('loginCtrl', function($scope, $state, $ionicPopup, AuthService) {

  $scope.data = {};
 
  $scope.login = function(data) {
    AuthService.login(data.username, data.password).then(function(authenticated) {
      $state.go('home', {}, {reload: true});
      $scope.setCurrentUsername(data.username);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  };

})
   
.controller('signupCtrl', function($scope, $state, $ionicPopup, AuthService) {

  $scope.data = {};
 
  $scope.sign = function(data) {
    AuthService.sign(data.username, data.password).then(function(authenticated) {
      $state.go('home', {}, {reload: true});
      $scope.setCurrentUsername(data.username);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Sign-up failed!',
        template: 'error'
      });
    });
  };

})
   
.controller('tendressesCtrl', function($scope) {

})
   
.controller('addCtrl', function($scope) {

})
   
.controller('meCtrl', function($scope) {

})
   
.controller('friendCtrl', function($scope) {

})
 