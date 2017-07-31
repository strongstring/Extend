'use strict';

myApp
.controller('CreateCtrl', ['$scope', '$state', 'FileUploadService', 'DatabaseService',
	function($scope, $state, FileUploadService, DatabaseService) {

		var Ctrl = this;

		$scope.newApp = {
			name : "",
			img : null,
			imgPath : "",
			isReady : false,
		}

		$scope.newVersion = {
			version : null,
			option : null,
			binary: null,
			isReady : false,
		}

		$scope.selectedApp = null;
		$scope.apps = null;

		Ctrl.init = function() {
			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) {
			    console.log("user :", user);
			  } else {
			    console.log("No user is signed in.");
			    $state.go('login');
			  }
			});
		}

		Ctrl.createApp = function() {
			FileUploadService.uploadAppImg($scope.newApp.name, $scope.newApp.img).then(
				function(downloadURL) {
					console.log(downloadURL);

					DatabaseService.createApp($scope.newApp.name, downloadURL);
					$state.go('home');
				}, function(error) {
					console.log(error);
				}
			);
		};

		Ctrl.uploadVersion = function() {
			console.log("newVersion", $scope.newVersion);
			console.log("selectedApp", $scope.selectedApp);
			var filename = $scope.newVersion.binary.name;
			var filenameArr = filename.split('.');
			var platform = filenameArr[filenameArr.length - 1];
			console.log(platform);
			if(platform !== 'apk' && platform !== 'ipa') {
				return;
			}
			
			FileUploadService.uploadVersion($scope.newVersion.version, $scope.newVersion.binary).then(
				function(downloadURL) {
					console.log(downloadURL);

					if(platform === 'ipa') {
						platform = 'ios';
					} else if (platform === 'apk') {
						platform = 'android';
					}

					DatabaseService.uploadVersion($scope.selectedApp.info.name, $scope.newVersion.version, $scope.newVersion.option, downloadURL, platform);
					$state.reload();

				}, function(error) {
					console.log(error);
				}
			);
		};

		$scope.isVersionReady = function() {
			if($scope.newVersion.version > 0 && $scope.newVersion.isReady) {
				return true;
			} else {
				return false;
			}
		}

		$scope.getAllApps = function() {

			return DatabaseService.getAppList().then(
				function(snapshot) {
					var result = [];
					for(var key in snapshot) {
						result.push({
							key : key,
							info : snapshot[key]
						});
					}

					$scope.apps = result;
				}
			);
		}

		$scope.updadeImg = function(file) {
			var targetFile = file.files[0];
			console.log(targetFile);
			var reader = new FileReader();

			$scope.newApp.img = targetFile;


			reader.onload = function(event) {
				var url = event.target.result;
				console.log(reader);
				$scope.newApp.imgPath = url;
				$scope.newApp.isReady = true;
			}

			reader.readAsDataURL(targetFile);
		}

		$scope.updadeBinary = function(file) {
			var targetFile = file.files[0];
			console.log(targetFile);

			$scope.newVersion.binary = targetFile;
			$scope.newVersion.isReady = true;
			
		}

		return Ctrl;
	}
]);