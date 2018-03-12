(function () {
  'use strict';

  var app = angular.module('ShortUploads', [])

  app.controller('AuthController', ['$scope', '$log', '$http', '$timeout',
    function($scope, $log, $http, $timeout) {
      $scope.getResults = function() {
        $log.log("test");

        var name = $scope.name;
        var email = $scope.email;
        var password = $scope.password;

	    $http.post('/signup', {"name": name,"email": email,"password": password}).
	      success(function(results) {
	        $log.log(results);
          $scope.result = results;
	      }).
	      error(function(error) {
	        $log.log(error);
          $scope.result = error;
	      });
      };
    }
  ]);

  app.controller('EditPlaylist', ['$scope', '$log', '$http', '$timeout', '$sce',
    function($scope, $log, $http, $timeout, $sce) {
      $scope.responseById = function() {
        $scope.result = "Fetching ID";
        var id = $scope.id;

        $scope.result = "Making API Call...";
        $http.get('/youtubeapi/'+id).
        success(function(results) {
          $scope.result = "Fetching Results..";
          $log.log(results);
          var videos = []
          for(var i=0; i<results.items.length; i++){
            var video = {}
            video.id = results.items[i].contentDetails.videoId;
            video.title = results.items[i].snippet.title
            video.start = '05'
            video.end = undefined;
            
            var videourl = "https://www.youtube.com/embed/"+video.id+"?rel=0&amp;showinfo=0&start="+video.start+"&end="+video.end
            var turl = $sce.trustAsResourceUrl(videourl)
            video.url = turl

            videos.push(video)
          }
          $scope.videos = videos;
          $scope.result = "";
        }).
        error(function(error) {
          $log.log(error);
          $scope.result = "Couldn't make API call at this moment. See browser console for more information.";
        });
      };
      $scope.videoUrl = function(video) {
        var videourl = "https://www.youtube.com/embed/"+video.id+"?rel=0&amp;showinfo=0&start="+video.start+"&end="+video.end;
        var turl = $sce.trustAsResourceUrl(videourl);
        video.url = turl;
      }
    }
  ]);
}());