angular.module('app.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService) {
  $scope.username = AuthService.username();
 
  $scope.$on("notAuthorized", function(event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });
 
  $scope.$on("notAuthenticated", function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
 
  $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };
})
  
.controller('homeCtrl', function($state, $scope, $interval, $ionicLoading, MeFactory, TendresseFactory) {

  $scope.$on('$ionicView.enter', function(){
      $ionicLoading.show();

      MeFactory.getFriends().then(function(response){
          $scope.friends = response.data;
      }).catch(function(response){
        console.log('erreur : getFriends ',response);
          //request was not successful
          //handle the error
      }).finally(function(){
          $ionicLoading.hide();
      });
      // fetch number of tendresses every 2 seconds
      $interval(function(){
        TendresseFactory.getTendresses().then(function(response){
          $scope.nbTendresses = response.data.length;
        });
      }, 3000);
  });

  $scope.sendTendresse = function(username, $event) {
    // $event.currentTarget
    TendresseFactory.sendTendresse(username).then(function(response) {
      // tendresse sent, animation success

    }, function(err) {
     // tendresse sending error, animation error
    });
  };

  $scope.onSwipeLeft = function() {
    $state.go('tendresses');    
  };

  $scope.onSwipeRight = function() {
    $state.go('me');    
  };

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
   
.controller('tendressesCtrl', function($state, $scope, TendresseFactory, $ionicLoading, $http) {
  $scope.tendresses = "img/R8NmRziMRxKuqNnHOsDM_11.jpg";
  $scope.$on('$ionicView.enter', function(){
      $ionicLoading.show();
      TendresseFactory.getTendresses().then(function(response){
          $scope.tendresses = response.data;
      }).catch(function(response){
      	console.log('erreur : getTendresses ',response);
          //request was not successful
          //handle the error
      }).finally(function(){
          $ionicLoading.hide();
      });
  });

  $scope.displayTendresse = function(id,url) {
    $scope.gifUrl = url;
    // envoyer la requete 
    TendresseFactory.stateTendresseAsViewed(id);
  };

  $scope.onSwipeLeft = function() {
    $state.go('me');    
  };

  $scope.onSwipeRight = function() {
    $state.go('home');    
  };

})
   
.controller('addCtrl', function($scope) {

})
   
.controller('meCtrl', function($state, $scope) {
  $scope.onSwipeLeft = function() {
    $state.go('home');    
  };

  $scope.onSwipeRight = function() {
    $state.go('tendresses');    
  };
})
   
.controller('friendCtrl', function($scope) {

})

.controller('profileCtrl', function($scope, $stateParams) {

})
 