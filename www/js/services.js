angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('AuthService', ['$http', '$q',function($http, $q){

  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var USERNAME;
  var username = '';
  var isAuthenticated = false;
  var authToken;
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(username,token) {
  	window.localStorage.setItem(USERNAME, username);
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }
 
  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;
    // Set the token as header for your requests!
    $http.defaults.headers.common['Authorization'] = token;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['Authorization'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    window.localStorage.removeItem(USERNAME);
  }
 
  var login = function(username, password) {
    return $q(function(resolve, reject) {
    	// Build the request object
		var req = {
		  method: 'PUT',
		  url: 'https://tendresse.herokuapp.com/api/v1/users',
		  headers: {
		    'Content-Type': 'application/json'
		  },
		  data: {
		    "username": username,
		    "password": password
		  }
		};

		// Make the API call
		$http(req).success(function(resp){
		    storeUserCredentials(resp.username,resp.token);
        	resolve('Login success.');
        	console.log("login success");
		}).error(function(error){
          reject('Login Failed.');
		  console.log("login error", error);
		});	
    });  
  };

  var sign = function(username, password) {
    return $q(function(resolve, reject) {
    	// Build the request object
		var req = {
		  method: 'POST',
		  url: 'https://tendresse.herokuapp.com/api/v1/users',
		  headers: {
		    'Content-Type': 'application/json'
		  },
		  data: {
		    "username": username,
		    "password": password
		  }
		};

		// Make the API call
		$http(req).success(function(resp){
			console.log("signup success", resp);
		    storeUserCredentials(resp.username,resp.token);
        	resolve('Signup success.');
		}).error(function(error){
          reject('Signup Failed.');
		  console.log("signup error", error);
		});
    });
  };

  var checkToken = function() {
      return $q(function(resolve, reject) {
          var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
          if (token) {
            var req = {
              method: 'GET',
              url: 'https://tendresse.herokuapp.com/api/v1/users/me/reset_token',
              headers: {
                'Content-Type': 'application/json'
              }
            };
            $http(req).success(function(resp){
                storeUserCredentials(resp.username,resp.token);
                  resolve('login/reset token success');
            }).error(function(error){
                  reject('login/reset token error');
            });
          }
      });
  };
 
  var logout = function() {
    destroyUserCredentials();
    // redirect vers /login
  };
 
  var isAuthorized = function() {
    return (isAuthenticated);
  };
 
  loadUserCredentials();
 
  return {
  	sign: sign,
    login: login,
    logout: logout,
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return window.localStorage.getItem(USERNAME);},
    checkToken: checkToken
  };

}])

.factory('AuthInterceptor', ['$rootScope', '$q', function($rootScope, $q){

  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: "notAuthenticated",
        403: "notAuthorized"
      }[response.status], response);
      return $q.reject(response);
    }
  };

}])

.factory('TendresseFactory', ['$http', '$q', function($http, $q){

    var getTendresses = function() {
      return $http.get('https://tendresse.herokuapp.com/api/v1/users/me/pending');
    };

    var stateTendresseAsViewed = function(id){
      return $q(function(resolve, reject) {
        var req = {
          method: 'DELETE',
          url: 'https://tendresse.herokuapp.com/api/v1/users/me/pending',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            "tendresse_id": id
          }
        };
        $http(req).success(function(resp){
              resolve('tendresse state as viewed.');
        }).error(function(error){
              reject('error stating tendresse as viewed');
        });
      });
    }

    var sendTendresse = function(username){
      return $q(function(resolve, reject) {
        var req = {
          method: 'POST',
          url: 'https://tendresse.herokuapp.com/api/v1/users/me/send',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            "username_friend": username
          }
        };
        $http(req).success(function(resp){
              resolve('tendresse state as viewed.');
        }).error(function(error){
              reject('error stating tendresse as viewed');
        });
      });
    }


    return {
        getTendresses: getTendresses,
        sendTendresse: sendTendresse,
        stateTendresseAsViewed: stateTendresseAsViewed
    };

}])

.factory('MeFactory', ['$http', '$q', 'TendresseFactory', function($http, $q, TendresseFactory){

    var addFriend = function(username) {
      return $q(function(resolve, reject) {
        console.log("friend username = ",username);
        var req = {
          method: 'POST',
          url: 'https://tendresse.herokuapp.com/api/v1/users/me/friends',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            "username_friend": username
          }
        };
        $http(req).success(function(resp){
              resolve('friend added');
        }).error(function(error){
              reject('error adding friend');
        });
      });
    };


    var removeFriend = function(username) {
      return $q(function(resolve, reject) {
        console.log("friend username = ",username);
        var req = {
          method: 'DELETE',
          url: 'https://tendresse.herokuapp.com/api/v1/users/me/friends',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            "username_friend": username
          }
        };
        $http(req).success(function(resp){
              resolve('friend removed');
        }).error(function(error){
          console.log(error);
              reject('error removing friend');
        });
      });
    };

    var getFriends = function() {
      return $http.get('https://tendresse.herokuapp.com/api/v1/users/me/friends');
    };

    var getProfile = function(username){
      return $http.get('https://tendresse.herokuapp.com/api/v1/users/'+username+'/profile');
    }

    return {
        addFriend: addFriend,
        getFriends: getFriends,
        getProfile: getProfile,
        removeFriend: removeFriend
    };

}])

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

;

