var stripeKeys = {
    live: "pk_live_5rRV2gicedvJNhurme4I8Gnd",
    test: "pk_test_mq2ehqe1tkcP71ZFwCQHjqng"
}
  
//Startup message
console.log("Found Stripe Mode:",GLOBAL.stripeMode)
  
//initialise stripe
var stripe = Stripe(stripeKeys[GLOBAL.stripeMode]);
var elements = stripe.elements();
var card = elements.create('card');
card.mount('#card-element');
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

//angular form controller
var paymentsApp = angular.module('paymentApp',[]);
paymentsApp.controller('paymentFormController',['$scope','$http',function($scope,$http){
  //stripe keys - choose which one we want in Jekyll _config.yaml
  
  
  //bind and idempotency key and description to the form
  $scope.idem = Math.random() + Date.now();
  $scope.description = GLOBAL.description;
  
  //define the form handler
  $scope.paymentFormSubmit = function(){
    console.log($scope);
  }
  
  window.scope = $scope
  
}])
