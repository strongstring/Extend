'use strict';

myApp
.controller('LoginCtrl', ['$scope', '$state', '$mdDialog', '$timeout', 'DatabaseService',
	function($scope, $state, $mdDialog, $timeout, DatabaseService) {

		var Ctrl = this;

		$scope.isLogined = false;
		$scope.isSignUp  = false;
		$scope.user  = {
			uid : undefined,
			nickname : "",
			age      : undefined,
			height   : undefined,
		}

		var provider = new firebase.auth.GoogleAuthProvider();
		provider.addScope('https://www.googleapis.com/auth/plus.login');
		provider.setCustomParameters({
		  'login_hint': 'user@example.com',
		  'birthday' : 'birthday',
		});


		Ctrl.login = function() {
			
			firebase.auth().signInWithPopup(provider).then(function(result) {
			  // This gives you a Google Access Token. You can use it to access the Google API.
			  var token = result.credential.accessToken;
			  // The signed-in user info.
			  var user = result.user;

			  console.log(user);
			  // ...
			}).catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  // The email of the user's account used.
			  var email = error.email;
			  // The firebase.auth.AuthCredential type that was used.
			  var credential = error.credential;
			  // ...
			});
		};

		Ctrl.signup = function() {
			if($scope.user.nickname.length === 4) {
				Ctrl.showAlert("Sign Up Error", "닉네임을 최대 4글자 이상 지정해주세요.");
				return;
			}

			if($scope.user.age === undefined) {
				Ctrl.showAlert("Sign Up Error", "나이를 입력해주세요.");
				return;
			}

			if($scope.user.height === undefined) {
				Ctrl.showAlert("Sign Up Error", "현재 키를 입력해주세요.");
				return;
			}

			DatabaseService.signupUser($scope.user.uid, $scope.user.nickname, $scope.user.age, $scope.user.height, function(val) {
				console.log(val);
			});
		}

		Ctrl.logout = function() {
			firebase.auth().signOut().then(function() {
			  console.log("Sign-out successful");
			}, function(error) {
			  console.log("An error happened.");
			});
			$state.reload();
		};


		Ctrl.showAlert = function(title, msg) {
	    // Appending dialog to document.body to cover sidenav in docs app
	    // Modal dialogs should fully cover application
	    // to prevent interaction outside of dialog
	    $mdDialog.show(
	      $mdDialog.alert()
	        .parent(angular.element(document.querySelector('#loginView')))
	        .clickOutsideToClose(true)
	        .title(title)
	        .textContent(msg)
	        .ariaLabel('Alert Dialog Demo')
	        .ok('Got it!')
	    );
  	};

		Ctrl.init = function() {
			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) {
			  	$scope.isLogined = true;
			    console.log("user :", user);

			    if(user !== undefined) {
			    	$scope.user.uid = user.uid;
						$scope.user.nickname = user.displayName;
			    }

			    DatabaseService.getUserInfo(user.uid, function(val) {
			    	console.log("DatabaseService", val);
			    	if(val === null) {
			    		$scope.isSignUp = false;
			    	} else {
			    		$scope.isSignUp = true;
			    		$state.go('design');
			    	}

			    	$timeout(function() { $scope.$digest(); });
			    });
			  } else {
			  	$scope.isLogined = false;
			    console.log("No user is signed in.");

			    $timeout(function() { $scope.$digest(); });
			  }
			});
		}

		return Ctrl;
	}
]);