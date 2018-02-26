(function () {
  'use strict';

  angular.module('IndexPage', [])

  .controller('IndexController', ['$scope', '$log',
    function($scope, $log) {
      $scope.getResults = function() {
        $log.log("test");
      };
    }
  ]);

}());
