(function () {
  'use strict';

  angular.module('WordcountApp', [])

  .controller('WordcountController', ['$scope', '$log', '$http', '$timeout',
    function($scope, $log, $http, $timeout) {
      $scope.getResults = function() {
        $log.log("test");

        var name = $scope.name;
        var email = $scope.email;
        var password = $scope.password;

	    // fire the API request
	    $http.post('/signup', {"name": name,"email": email,"password": password}).
	      success(function(results) {
	        $log.log(results);
	        getStatus(results);
	      }).
	      error(function(error) {
	        $log.log(error);
	      });
      };

    function getStatus(jobID) {
      var timeout = "";

      var poller = function() {
        // fire another request
        $http.get('/results/'+jobID).
          success(function(data, status, headers, config) {
            if(status === 202) {
              $log.log(data, status);
            } else if (status === 200){
              $log.log(data);
              $scope.result = data;
              $timeout.cancel(timeout);
              return false;
            }
            // continue to call the poller() function every 2 seconds
            // until the timeout is cancelled
            timeout = $timeout(poller, 2000);
          });
      };
      poller();
    }

    }
  ]);

}());