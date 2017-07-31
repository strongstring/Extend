'use strict';

myApp
.controller('AdhocCtrl', ['$scope', 'DatabaseService', '$timeout', '$state', '$mdDialog',
	function($scope, DatabaseService, $timeout, $state, $mdDialog) {

		var Ctrl = this;

		$scope.apps = [];
		$scope.isLogined = false;

		var isLoading = function(isLoading) {
		  if(isLoading) {
		    $('#indicator').loadingIndicator().show();
		  } else {
		    $('#indicator').loadingIndicator().hide();
		  }
		}

		Ctrl.createApp = function() {
			$state.go('create');
		}

		Ctrl.login = function() {
			$state.go('login');
		}

		var excuteLogout = function() {
			firebase.auth().signOut().then(function() {
			  console.log("Sign-out successful");
			}, function(error) {
			  console.log("An error happened.");
			});
			$state.reload();
		}

		Ctrl.logout = function() {
			var confirm = $mdDialog.confirm()
          .title('Logout')
          .textContent('logout 하시겠습니까? ')
          .ok('logout')
          .cancel('cancel');

    $mdDialog.show(confirm).then(function() {
	      excuteLogout();
	    }, function() {
				console.log("Cancel logout");
	    });
		};

		Ctrl.init = function() {
			isLoading(true);

			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) {
			  	$scope.isLogined = true;
			    console.log("user :", user);
			  } else {
			    console.log("No user is signed in.");
			  }
			});

			DatabaseService.bindAppList(function(key, appInfo) {
				var result = appInfo;
				result.key = key;
				$scope.apps.push(result);

				DatabaseService.getLatestVersion(result.key, function(res) {
					var index = getIndexInArr($scope.apps, 'key', result.key);
					if(res.platform === 'android') {
						$scope.apps[index].android = res;
					} else if (res.platform === 'ios') {
						$scope.apps[index].ios = res;
					}

					$timeout(function() { $scope.$digest(); });
				});

				isLoading(false);
			});

			setTimeout(function() {
				$timeout(function() { $scope.$digest(); });
				isLoading(false);
			}, 2000);
		}

		return Ctrl;
	}
]);