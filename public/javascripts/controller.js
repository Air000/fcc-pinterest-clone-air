
var app = angular.module('pinterestApp', []);

app.controller('pinterestCtrl', function($scope) {
    $scope.init = function(pins) {
        console.log("pins:",pins)
        $scope.pins = JSON.parse(pins);
    }
    
});