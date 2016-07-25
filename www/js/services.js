angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('AuthService', ['$http', '$q',function($http, $q){
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
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
    $http.defaults.headers.common['Authorization'] = token+":";
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
		    storeUserCredentials(resp.data.username,resp.data.token);
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
		    'Content-Type': 'application/json',
		    'Origin': '93.121.152.15'
		  },
		  data: {
		    "username": username,
		    "password": password
		  }
		};

		// Make the API call
		$http(req).success(function(resp){
		    storeUserCredentials(resp.data.username,resp.data.token);
        	resolve('Signup success.');
        	console.log("signup success");
		}).error(function(error){
          reject('Signup Failed.');
		  console.log("signup error", error);
		});
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
    username: function() {return username;}
  };

}])

.factory('AuthInterceptor', [function($rootScope, $q, AUTH_EVENTS){

  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };

}])

;

