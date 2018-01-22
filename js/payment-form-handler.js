var paymentsApp = angular.module('paymentApp',[]);
paymentsApp.controller('paymentFormController',['$scope','$http',function($scope,$http){
  //start Stripe
  var stripe = Stripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');
  $scope.idem = Math.random() + Date.now();
  window.scope = $scope
}])
