'use strict';

myApp.factory('DatabaseService', ['$q', 
	function($q) {

		var DATABASE = firebase.database();

		/*
		 *	실제 사용자가 database 에 등록되어있는지 확인
		 *  Google UID 사용
		 */
		var getUserInfo = function(uid, callback) {
			return DATABASE.ref('users').child(uid).once('value', function(snapshot) {
				callback(snapshot.key, snapshot.val());
			});
		}

		/*
		 *	계정정보를 이요하여 실제 사용자 등록
		 */
		var signupUser = function(uid, nickName, age, height) {
			return DATABASE.ref('users').child(uid).set({
				'nickName' : nickName,
				'age'			 : age,
				'height'   : height,
			});
		}

		/*
		 *	Path, data를 이용하여 데이터 저장.
		 */
		var setData = function(path, data) {
			var deferred = $q.defer();
			var newKey = DATABASE.ref(path).push().key;

			DATABASE.ref(path + "/" + newKey).set(data).then(function() {
				deferred.resolve(newKey);
			});

			return deferred.promise;
		};

		var getData = function(path, callback) {
			DATABASE.ref(path).once('value', function(snapshot) {
				callback(snapshot);
			});
		}

		var addData = function(path, data) {
			var deferred = $q.defer();

			DATABASE.ref(path).push(data).then(function() {
				deferred.resolve();
			});

			return deferred.promise;
		}

		var bindLisener = function(path, addChildCallback, changeCallback, removeCallback) {
			childAddListener(path, addChildCallback);
			childChangedListener(path, changeCallback);
			childRemoveListener(path, removeCallback);
		};

		var unBindLisener = function(path) {
			DATABASE.ref(path).off('child_added', function(res) {});
			DATABASE.ref(path).off('child_changed', function(res) {});
			DATABASE.ref(path).off('child_removed', function(res) {});
		}

		var childAddListener = function(path, callback) {
			return DATABASE.ref(path).on('child_added', function(snapshot) {
				if(callback !== undefined) {
					callback(snapshot);
				}
			});
		};

		var childChangedListener = function(path, callback) {
			return DATABASE.ref(path).on('child_changed', function(snapshot) {
				if(callback !== undefined) {
					callback(snapshot.key, snapshot.val());
				}
			});
		};

		var childRemoveListener = function(path, callback) {
			return DATABASE.ref(path).on('child_removed', function(snapshot) {
				if(callback !== undefined) {
					callback(snapshot.key, snapshot.val());
				}
			});
		};


		var getAppList = function() {
			var deferred = $q.defer();

			DATABASE.ref('app').once('value', function(snapshot) {
				deferred.resolve(snapshot.val());
			});

			return deferred.promise;
		};

		var getAppUID = function(appName) {
			var deferred = $q.defer();

			getAppList().then(function(snapshot) {
				var uid = "";

				for(var key in snapshot) {
					console.log(key, snapshot[key]);
					if(snapshot[key].name === appName) {
						uid = key;
					}
				}

				if(uid !== "") {
					deferred.resolve(uid);
				} else {
					deferred.reject(uid);
				}
			});

			return deferred.promise;
		}

		var getAppInfo = function(key, successFn) {
			return DATABASE.ref('app').child(key).on('value', function(snapshot) {
				successFn(snapshot.val());
			})
		}

		var getLatestVersion = function(key, successFn) {
			return DATABASE.ref('version').child(key).orderByChild('version').on('child_added', function(snapshot) {
				successFn(snapshot.val());
			});
		};

		var bindAppList = function(bindFunc) {
			return DATABASE.ref('app').on('child_added', function(snapshot) {
				if(bindFunc !== undefined) {
					bindFunc(snapshot.key, snapshot.val());
				}
			});
		}

		var init = function() {
			// getAppUID("123123123123").then(
			// 	function(res) {
			// 		console.log("res", res);
			// 	}, function(error) {
			// 		console.log("error", error);
			// 	});
		}

		init();

		return {
			getUserInfo : getUserInfo,
			signupUser : signupUser,
			setData : setData,
			getData : getData,
			addData : addData,
			bindLisener : bindLisener,
			unBindLisener : unBindLisener


			// childAddListener : childAddListener,
			// childChangedListener : childChangedListener,
			// childRemoveListener : childRemoveListener,
		}
	}]
);