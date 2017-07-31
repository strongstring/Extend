'use strict';

myApp
.controller('UploadCtrl', ['$scope', '$state', 'FileUploadService', 'DatabaseService', '$stateParams',
	function($scope, $state, FileUploadService, DatabaseService, $stateParams) {

		var Ctrl = this;

		$scope.newVersion = {
			version : null,
			option : null,
			binary: null,
			isReady : false,
		}

		$scope.apps = null;

		var currentKey = "";

		Ctrl.init = function() {
			console.log("on load UploadCtrl");
			currentKey = $stateParams.appKey;
			console.log("currentKey", currentKey);
		}


		Ctrl.uploadVersion = function() {
			console.log("newVersion", $scope.newVersion);
			var filename = $scope.newVersion.binary.name;
			var filenameArr = filename.split('.');
			var platform = filenameArr[filenameArr.length - 1];
			console.log(platform);
			if(platform !== 'apk' && platform !== 'ipa') {
				return;
			}
			
			FileUploadService.uploadVersion(currentKey, $scope.newVersion.version, $scope.newVersion.binary).then(
				function(downloadURL) {
					console.log(downloadURL);

					if(platform === 'ipa') {
						platform = 'ios';

						// var xmlString = "<xml></xml>";
						// var xmlFile = jQuery.parseXML(xmlString);

						// iOS 의 경우 manifest.plist 생성하는 로직이 필요함.
						FileUploadService.uploadVersion(currentKey, $scope.newVersion.version, $scope.newVersion.binary).then(
							function(plistUrl) {
								console.log("plistUrl", plistUrl);

								DatabaseService.uploadVersion(currentKey, $scope.newVersion.version, $scope.newVersion.option, plistUrl, platform);
								history.back();
							}, function(error) {
								console.log(error);
							}
						);

					} else if (platform === 'apk') {
						platform = 'android';

						DatabaseService.uploadVersion(currentKey, $scope.newVersion.version, $scope.newVersion.option, downloadURL, platform);
						history.back();
					}

				}, function(error) {
					console.log(error);
				}
			);
		};

		$scope.isVersionReady = function() {
			if($scope.newVersion.version > 0) {
				return true;
			} else {
				return false;
			}
		}

		// $scope.getAllApps = function() {

		// 	return DatabaseService.getAppList().then(
		// 		function(snapshot) {
		// 			var result = [];
		// 			for(var key in snapshot) {
		// 				result.push({
		// 					key : key,
		// 					info : snapshot[key]
		// 				});
		// 			}

		// 			$scope.apps = result;
		// 		}
		// 	);
		// }

		$scope.updadeBinary = function(file) {
			var targetFile = file.files[0];
			console.log(targetFile);

			$scope.newVersion.binary = targetFile;
			$scope.newVersion.isReady = true;
			
		}

		return Ctrl;
	}
]);