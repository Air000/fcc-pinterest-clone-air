
var app = angular.module('pinterestApp', []);

app.controller('pinterestCtrl', function($scope, $http) {
    $scope.init = function(pins) {
        $scope.pins = JSON.parse(pins);
    };
    
    $scope.deletePin = function(pinId) {
        $("#wait").show();
        $http({
            method: 'POST',
            url:    '/deletepin',
            data:   {pinId: pinId}
        }).then(function success(res) {
            console.log(res.data);
            $scope.pins = res.data;
        }, function error(err) {
            alert(err.responseText);
        }).finally(function() {
            $("#wait").hide();
        });
    }
});

app.directive('ngErr', function () {
  var ngErr = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr("src", iAttrs.ngErr);
      });
    }
   }
   return ngErr;
});