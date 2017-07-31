var config = {
  apiKey: "AIzaSyDalB_zWyltFngrlSwKhF-kDc_2RcAQ0lk",
  authDomain: "extend-9555e.firebaseapp.com",
  databaseURL: "https://extend-9555e.firebaseio.com",
  storageBucket: "extend-9555e.appspot.com",
  messagingSenderId: "250811251668"
};
firebase.initializeApp(config);
var database = firebase.database();
var auth     = firebase.auth();
var storage = firebase.storage();
var myApp = angular.module('myApp', ['ui.router', 'ngMaterial',]);

myApp.config(function($stateProvider, $urlRouterProvider) {

  var routers = [
    {
      name: 'login',
      url: '/',
      templateUrl: 'view/login.html',
      controller: 'LoginCtrl as LC',
    }, {
      name: 'design',
      url: '/design',
      templateUrl: 'view/design.html',
      controller: 'DesignCtrl as DC',
    }, {
      name: 'exercise',
      url: '/exercise',
      templateUrl: 'view/exercise.html',
      controller: 'ExerciseCtrl as EC',
    }, 
    // {
    //   name: 'home',
    //   url: '/',
    //   templateUrl: 'view/adhoc.html',
    //   controller: 'AdhocCtrl as AC',
    // }, {
    //   name: 'login',
    //   url: '/login',
    //   templateUrl: 'view/login.html',
    //   controller: 'LoginCtrl as LC',
    // }, {
    //   name: 'page',
    //   url: '/page/:appKey',
    //   templateUrl: 'view/page.html',
    //   controller: 'PageCtrl as PC',
    // }, {
    //   name: 'upload',
    //   url: '/upload/:appKey',
    //   templateUrl: 'view/upload.html',
    //   controller: 'UploadCtrl as UC',
    // }, {
    //   name: 'create',
    //   url: '/create',
    //   templateUrl: 'view/create.html',
    //   controller: 'CreateCtrl as CC',
    // }
  ];
  
  var length = routers.length;
  for(var i = 0; i < length; i++) {
    $stateProvider.state(routers[i].name, routers[i]);
  }

  $urlRouterProvider.otherwise('/');

});

myApp.config( [
    '$compileProvider',
    function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|itms-services):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
]);

var getObjInArr = function(arr, key, value) {
  return arr.filter(function(obj) { return obj[key] === value; });
};

var getIndexInArr = function(arr, key, value) {
  return arr.findIndex(function(obj) { return obj[key] === value; });
};

var getObjInRows = function(resultSet) {
  var length = resultSet.rows.length;
  var result = [];

  for(var i = 0; i < length; i++) {
    result[i] = resultSet.rows.item(i);
  }

  return result;
}