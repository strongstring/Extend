'use strict';

myApp
.controller('ExcuteCtrl', ['$scope', '$state', '$mdDialog', '$timeout', 'DatabaseService', '$mdSidenav', '$log',
	function($scope, $state, $mdDialog, $timeout, DatabaseService, $mdSidenav, $log) {

		var Ctrl = this;

    var TYPES_PATH     = 'types';
    var EXERCISES_PATH = 'exercises';
    var TYPE_EXER_PATH = 'type-exercise';

    
		Ctrl.init = function() {

		}

    $scope.$on('$destroy', function() {
      console.log("###### ExcuteCtrl $destroy #####");

      Ctrl = {};
      Ctrl = null;
    });

		return Ctrl;
	}
]);