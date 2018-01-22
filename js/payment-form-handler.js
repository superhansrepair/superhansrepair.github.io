var paymentsApp = angular.module('paymentsApp',[]);
paymentsApp.controller('paymentsFormController',[$scope,$http,function($scope,$http){
  $scope.idem = Math.random() + Date.now();
}])
