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
      TendresseFactory.getTendresses().then(function(response){
          $scope.nbTendresses = response.data.length;
      });
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
      interval_tendresses = $interval(function(){
        TendresseFactory.getTendresses().then(function(response){
          $scope.nbTendresses = response.data.length;
        });
      }, 3000);
  });

  $scope.$on('$ionicView.leave', function(){
    if (angular.isDefined(interval_tendresses)) {
      $interval.cancel(interval_tendresses);
      interval_tendresses = undefined;
    }
  });

  $scope.sendTendresse = function(username, $event) {
    // $event.currentTarget
    TendresseFactory.sendTendresse(username).then(function(response) {
      // tendresse sent, animation success
    }, function(err) {
     // tendresse sending error, animation error
    });
  };

  $scope.profile = function(username) {
   $state.go('friend',{"username":username});
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

  $scope.$on('$ionicView.enter', function(){
    AuthService.checkToken().then(function(authenticated) {
      $state.go('home', {}, {reload: true});
    }, function(err) {
      console.log("token is not valid anymore");
    });
  });
 
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
   
.controller('tendressesCtrl', function($state, $scope, TendresseFactory, $ionicLoading, $http, $ionicScrollDelegate) {
  $scope.$on('$ionicView.enter', function(){
      $scope.gifUrl = "img/R8NmRziMRxKuqNnHOsDM_11.jpg";
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

  $scope.displayTendresse = function(id,url,tendresse) {
    tendresse.clicked = true;
    $ionicScrollDelegate.scrollTop();
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
   
.controller('meCtrl', function($state, $scope, AuthService, $ionicLoading, $ionicPopup, MeFactory) {
  $scope.data = {};

  $scope.$on('$ionicView.enter', function(){
      $ionicLoading.show();
      MeFactory.getProfile(AuthService.username()).then(function(response){
          $scope.achievements = response.data.achievements;
      }).catch(function(response){
        console.log('erreur : getProfile ',response);
      }).finally(function(){
          $ionicLoading.hide();
      });
  });

  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'L0g0ut',
      template: "You've been disconnected :( "
    });
  };

  $scope.onSwipeLeft = function() {
    $state.go('home');    
  };

  $scope.onSwipeRight = function() {
    $state.go('tendresses');    
  };

  $scope.addFriend = function(data) {
    MeFactory.addFriend(data.username_friend).then(function(response) {
      console.log("adding friend success");
      $scope.data = {
        username_friend : ''
      };
    }, function(err) {
      console.log("adding friend error",err);
    });
  };

})
   
.controller('friendCtrl', function($scope, $stateParams, $ionicLoading, MeFactory, $state) {

  $scope.$on('$ionicView.enter', function(){
      $ionicLoading.show();
      $scope.username = $stateParams.username;
      MeFactory.getProfile($stateParams.username).then(function(response){
          $scope.achievements = response.data.achievements;
      }).catch(function(response){
        console.log('erreur : getProfile ',response);
      }).finally(function(){
          $ionicLoading.hide();
      });
  });

  $scope.removeFriend = function() {
    MeFactory.removeFriend($stateParams.username).then(function(response) {
      console.log("adding friend success");
      $state.go('home');
    }, function(err) {
      console.log("adding friend error",err);
    });
  };

})
;