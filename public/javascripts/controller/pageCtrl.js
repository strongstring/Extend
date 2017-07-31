'use strict';

myApp
.controller('PageCtrl', ['$scope', '$stateParams', 'DatabaseService', '$timeout', '$state', 'FileUploadService',
	function($scope, $stateParams, DatabaseService, $timeout, $state, FileUploadService) {

		var Ctrl = this;

		$scope.app = {
			name : "",
			imgPath : "",
			ios : {},
			android : {},
		}
		$scope.appImgPath = "";
		$scope.appName = "";
		$scope.versions = {};
		$scope.isLogined = false;
		$scope.isLoading = true;

		$scope.currentKey = "";

		$scope.guideEn = "";
		$scope.guideKo = "";

		var isLoading = function(isLoading) {
			$scope.isLoading = isLoading;
			$timeout(function() { $scope.$digest(); });
		}

		var initPage = function() {
			var key = $stateParams.appKey;
			if(key=== "") {
				history.back();
			}

			$scope.currentKey = $stateParams.appKey;

			DatabaseService.getAppInfo(key, function(res) {
				$scope.app.imgPath = res.imgPath;
				$scope.app.name = res.name;

				// isLoading(false);
			});

			DatabaseService.getLatestVersion(key, function(res) {
				console.log(res);

				if($scope.versions[res.version] === undefined) {
					$scope.versions[res.version] = {version : res.version};
				}

				if(res.platform === 'android') {
					$scope.app.android = res;
					$scope.versions[res.version].android = res;
				} else if(res.platform === 'ios') {
					$scope.app.ios = res;
					$scope.versions[res.version].ios = res;
				}

				console.log($scope.versions);
			});

			FileUploadService.getGuideImg().then(function(res) {
				console.log(res);

				$scope.guideEn = res.en;
				$scope.guideKo = res.ko;

				$timeout(function() { $scope.$digest(); });

			}, function(error) {
				console.log(error);
			})
		}

		Ctrl.init = function() {
			isLoading(true);

			initPage();

			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) {
			  	$scope.isLogined = true;
			    console.log("user :", user);
			  } else {
			  	$scope.isLogined = false;
			    console.log("No user is signed in.");
			  }
			});
		}

		return Ctrl;
	}
]);