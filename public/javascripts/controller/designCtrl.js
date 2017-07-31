'use strict';

myApp
.controller('DesignCtrl', ['$scope', '$state', '$mdDialog', '$timeout', 'DatabaseService', '$mdSidenav', '$log',
	function($scope, $state, $mdDialog, $timeout, DatabaseService, $mdSidenav, $log) {

		var Ctrl = this;

    var TYPES_PATH     = 'types';
    var EXERCISES_PATH = 'exercises';
    var TYPE_EXER_PATH = 'type-exercise';

    $scope.userName = "";

    /* 
     * $scope.types : 운동에 대한 타입 저장, DB 동기화
     * savedExercises : 운동 각각에 대한 데이터 저장, DB 동기화
     * typesExercises : type - exercise 연결해주는 TUID - EUID table
     *
     * $scope.exercises : 토글 선택시 마다 업데이트 사용자에 보여줄 exercise 데이터 자정
     */

     /*
      *  $scope.types = {
      *    key : <String>
      *    name : <String>
      *  };
      }
      */
		$scope.types = {};
    var exercises = {};
    // $scope.exercises = {};
    // $scope.typeExercise = [];

  //   var savedExercises = {};
  //   var typesExercises = {};
		// $scope.exercises = {};

    
    /*
     * toggle 을 이용하여 선택된 데이터들 저장합.
     */
    $scope.selectedType = [];
    $scope.selectedExercise = [];


    /*
     * 신규 운동 및 타입 저장
     *
     */
    $scope.newExerciseType = "";
    $scope.newExercise = {};

    $scope.toggleLeft = buildDelayedToggler('left');

    var toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      }
      else {
        list.push(item);
      }
    };

    $scope.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };

    var refreshUI = function() {
      $timeout(function() { $scope.$digest(); });
    }

    // ------------------------------------  Actions 작업 ---------------------------- //

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

    var showInputAlert = function(title, msg, successCallback, failCallback) {
      var confirm = $mdDialog.prompt()
        .title(title)
        .textContent(msg)
        .ok('Ok')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(successCallback, failCallback);
    };

    var addExerciseInternal = function(typeKey, exerciseName) {
      console.log("addExerciseInternal typeKey", typeKey, "exerciseName", exerciseName);

      DatabaseService.setData(EXERCISES_PATH, {
        "name" : exerciseName,
      }).then(function(exerciseKey) {
        DatabaseService.setData(TYPE_EXER_PATH + '/' + typeKey, exerciseKey); 
      });
    };

    Ctrl.addExercise = function(type) {
      showInputAlert('Create New Exercise', 'please write new exercise\'s name', 
        function(res) {
          addExerciseInternal(type, res);
        }, function() {
          console.log("addExercise cancel");
        })
    };









  	Ctrl.addNewTheme = function() {
  		DatabaseService.setData(TYPES_PATH, {
  			"name" : $scope.newExerciseType,
  		}).then(function(res) {
  			$scope.newExerciseType = "";
        console.log(res);
  			// refresh
  			refreshUI();
  		});
  	};

  	Ctrl.addNewExercise = function(key) {
      var newExercise = $scope.newExercise[key];

      console.log("addNewExercise", key, newExercise);

      DatabaseService.setData(EXERCISES_PATH, {
        "name" : newExercise,
      }).then(function(exerciseKey) {
        DatabaseService.setData(TYPE_EXER_PATH + '/' + key, exerciseKey).then(function() {
          $scope.newExercise = {};

          // refresh
          refreshUI();

          updateExerciseList();
        }); 
      });
  	};

    Ctrl.startExercise = function() {
      console.log("$scope.selectedExercise", $scope.selectedExercise);
      $timeout(function() { 
        $('md-tab-item:eq(1)').click();
      });
    }

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      console.log("hi");
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }







    /**
     *  Firebase Bind functions
     *
     */ 

    // var onAddTypes = function(snapshot) {
    //   console.log("onAddTypes", snapshot.key, snapshot.val());
    //   if($scope.types[snapshot.key] !== undefined) {
    //     return;
    //   }

    //   $scope.types[snapshot.key] = {
    //     name : snapshot.val().name,
    //     exercises : {},
    //   };

    //   console.log($scope.types);

    //   $timeout(function() { $scope.$digest(); });
    // };

    // var onChangeTypes = function(snapshot) {
    //   console.log("onChangeTypes", snapshot.key, snapshot.val());
    //   $scope.types[snapshot.key].name = snapshot.val().name;
    // };

    var onRemoveTypes = function(snapshot) {
      console.log("onRemoveTypes", snapshot.key, snapshot.val());
      delete $scope.types[snapshot.key];
    };

    var unBindTypes = function() {

    }

    var onAddExercises = function(snapshot) {
      console.log("onAddExercises", snapshot.key, snapshot.val());
      if($scope.exercises[snapshot.key] !== undefined) {
        return;
      }

      $scope.exercises[snapshot.key] = {
        name : snapshot.val().name,
      };

      refreshUI();
    };

    var onChangeExercises = function(snapshot) {
      console.log("onChangeExercises", snapshot.key, snapshot.val());
      $scope.exercises[snapshot.key].name = snapshot.val().name;
    };

    var onRemoveExercises = function(snapshot) {
      console.log("onRemoveExercises", snapshot.key, snapshot.val());
      delete $scope.exercises[snapshot.key];
    };

    var onAddTypeExercise = function(snapshot) {
      console.log("onAddTypeExercise", snapshot.key, snapshot.val());
      
      var res = snapshot.val();
      for(var key in res) {
        var exerciseKey = res[key];

        if($scope.types[snapshot.key].exercises[exerciseKey] === undefined) {
          $scope.types[snapshot.key].exercises[exerciseKey] = $scope.exercises[exerciseKey];
        }
      }

      console.log($scope.types);

      refreshUI();
    }

    Date.prototype.yyyymmdd = function() {
      var mm = this.getMonth() + 1; // getMonth() is zero-based
      var dd = this.getDate();

      return [this.getFullYear() + '/',
              (mm>9 ? '' : '0') + mm + '/',
              (dd>9 ? '' : '0') + dd
             ].join('');
    };

    Ctrl.getToday = function() {
      var today = new Date();

      return today.yyyymmdd();
    }
  	

    // ------------------------------------  Database 작업 ---------------------------- //
    var DATABASE = firebase.database();
    var callbackType = {
      onAdd : function(snapshot) {
        // console.log("callbackType::onAdd", snapshot.key, snapshot.val());
        if($scope.types[snapshot.key] !== undefined) {
          return;
        }

        $scope.types[snapshot.key] = {
          name : snapshot.val().name,
          exercises : {},
        };

        // console.log("$scope.types", callbackType.storage);
        refreshUI();
      },
      onChanged : function(snapshot) {
        console.log("callbackType::onChanged", snapshot.key, snapshot.val());
        if($scope.types[snapshot.key] === undefined) {
          return;
        }

        $scope.types[snapshot.key].name = snapshot.val().name;

        refreshUI();
      },
      onRemove : function(snapshot) {
        console.log("callbackType::onRemove", snapshot.key, snapshot.val());
        if($scope.types[snapshot.key] === undefined) {
          return;
        }

        delete $scope.types[snapshot.key];
        refreshUI();
      },
    };

    var callbackExercise = {
      onAdd : function(snapshot) {
        // console.log("callbackExercise::onAdd", snapshot.key, snapshot.val());
        if(exercises[snapshot.key] !== undefined) {
          return;
        }

        exercises[snapshot.key] = {
          name : snapshot.val().name,
        };

        // console.log("exercises", exercises);
        refreshUI();
      },
      onChanged : function(snapshot) {
        console.log("callbackExercise::onChanged", snapshot.key, snapshot.val());
        if(exercises[snapshot.key] === undefined) {
          return;
        }

        exercises[snapshot.key].name = snapshot.val().name;
        console.log("exercises", exercises);
        refreshUI();
      },
      onRemove : function(snapshot) {
        console.log("callbackExercise::onRemove", snapshot.key, snapshot.val());
        if(exercises[snapshot.key] === undefined) {
          return;
        }

        delete exercises[snapshot.key];
        console.log("exercises", exercises);
        refreshUI();
      },
    };

    var callbackTypeExercise = {
      bindData : function(snapshotKey, snapshotValue) {
        for(var key in snapshotValue) {
          var value = snapshotValue[key];
          $scope.types[snapshotKey].exercises[value] = exercises[value];
        }
        // console.log("callbackTypeExercise $scope.types", $scope.types);
        refreshUI();
      },
      onAdd : function(snapshot) {
        // console.log("callbackTypeExercise::onAdd", snapshot.key, snapshot.val());
        if($scope.types[snapshot.key] === undefined) {
          console.log("callbackTypeExercise invalid mapping");
          return;
        }

        callbackTypeExercise.bindData(snapshot.key, snapshot.val());
      },
      onChanged : function(snapshot) {
        console.log("callbackTypeExercise::onChanged", snapshot.key, snapshot.val());
        if($scope.types[snapshot.key] === undefined) {
          return;
        }

        callbackTypeExercise.bindData(snapshot.key, snapshot.val());
      },
      onRemove : function(snapshot) {
        // console.log("callbackTypeExercise::onRemove", snapshot.key, snapshot.val());
        // if(callbackExercise.storage[snapshot.key] === undefined) {
        //   return;
        // }

        // delete $scope.types[snapshot.key];
        // console.log("$scope.exercises", callbackExercise.storage);
        // refreshUI();
      },
    };
    








		Ctrl.init = function() {
			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) {
			  	$scope.isLogined = true;
			    console.log("user :", user);
			    console.log("uid :", user.uid);

          $scope.userName = user.displayName;

          DATABASE.ref(TYPES_PATH).on('child_added', callbackType.onAdd);
          DATABASE.ref(TYPES_PATH).on('child_changed', callbackType.onChanged);
          DATABASE.ref(TYPES_PATH).on('child_removed', callbackType.onRemove);

          DATABASE.ref(EXERCISES_PATH).on('child_added', callbackExercise.onAdd);
          DATABASE.ref(EXERCISES_PATH).on('child_changed', callbackExercise.onChanged);
          DATABASE.ref(EXERCISES_PATH).on('child_removed', callbackExercise.onRemove);

          DATABASE.ref(TYPE_EXER_PATH).on('child_added', callbackTypeExercise.onAdd);
          DATABASE.ref(TYPE_EXER_PATH).on('child_changed', callbackTypeExercise.onChanged);
          DATABASE.ref(TYPE_EXER_PATH).on('child_removed', callbackTypeExercise.onRemove);

			  } else {
			  	$state.go('login');
			  }
			});
		}

    $scope.$on('$destroy', function() {
      console.log("###### DesignCtrl $destroy #####");
      

      Ctrl = {};
      Ctrl = null;
    });

		return Ctrl;
	}
]);

myApp.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close Left is done");
        });
    };
  });