'use strict';

myApp.factory('FileUploadService', ['$q', 
	function($q) {

		var STORAGE = firebase.storage();
		var STORAGE_REF = STORAGE.ref();

		var uploadAppImg = function(appName, imgFile) {
			var deferred = $q.defer();
			var ref = STORAGE_REF.child('images').child(appName).child('app.jpg');
			var uploadTask = ref.put(imgFile);

			uploadTask.on('state_changed', function(snapshot) {

				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			  console.log('Upload is ' + progress + '% done');

			  switch (snapshot.state) {
			    case firebase.storage.TaskState.PAUSED: // or 'paused'
			      console.log('Upload is paused');
			      break;
			    case firebase.storage.TaskState.RUNNING: // or 'running'
			      console.log('Upload is running');
			      break;
			  }

			}, function(error) {
				deferred.reject(error);
			}, function() {
				var downloadURL = uploadTask.snapshot.downloadURL;
				deferred.resolve(downloadURL);
			});

			return deferred.promise;
		}

		var getGuideImg = function() {
			var deferred = $q.defer();
			// var enRef = STORAGE.refFromURL('https://firebasestorage.googleapis.com/b/adhoc-ea567.appspot.com/o/images%20guide-en.png');
			// var koRef = STORAGE.refFromURL('https://firebasestorage.googleapis.com/b/adhoc-ea567.appspot.com/o/images%20guide-ko.png');
			var enRef = "";
			var koRef = "";

			STORAGE_REF.child('images/guide-en.PNG').getDownloadURL().then(function(url) {
			  enRef = url;

			  STORAGE_REF.child('images/guide-ko.PNG').getDownloadURL().then(function(url) {
				  koRef = url;

				  deferred.resolve({
						ko : koRef,
						en : enRef
					})
				}).catch(function(error) {
				  // Handle any errors
				});
			}).catch(function(error) {
			  // Handle any errors
			});

			return deferred.promise;
		};

		var uploadVersion = function(currentKey, version, binaryFile) {
			var deferred = $q.defer();
			var ref = STORAGE_REF.child('binary').child(currentKey).child(version).child(binaryFile.name);
			console.log(binaryFile);
			var uploadTask = ref.put(binaryFile);

			uploadTask.on('state_changed', function(snapshot) {

				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			  console.log('Upload is ' + progress + '% done');

			  switch (snapshot.state) {
			    case firebase.storage.TaskState.PAUSED: // or 'paused'
			      console.log('Upload is paused');
			      break;
			    case firebase.storage.TaskState.RUNNING: // or 'running'
			      console.log('Upload is running');
			      break;
			  }

			}, function(error) {
				deferred.reject(error);
			}, function() {
				var downloadURL = uploadTask.snapshot.downloadURL;
				deferred.resolve(downloadURL);
			});

			return deferred.promise;
		}

		var createPlist = function() {
			var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var FILENAME="D:/YourXMLName/xml";
        var file = fso.CreateTextFile(FILENAME, true);
        file.WriteLine('<?xml version="1.0" encoding="utf-8"?>\n');
        file.WriteLine('<PersonInfo>\n');
        file.WriteLine('></Person>\n');
        file.WriteLine('</PersonInfo>\n');
        file.Close();

        return file;
		}

		return {
			uploadAppImg : uploadAppImg,
			getGuideImg : getGuideImg,
			uploadVersion : uploadVersion,
			createPlist : createPlist,
		}
	}]
);