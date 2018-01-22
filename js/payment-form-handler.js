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
  
  //bind and idempotency key and description to the form
  $scope.idem = Math.random() + Date.now();
  $scope.description = GLOBAL.description;
  
  //define the form handler
  $scope.paymentFormSubmit = function(){
      $scope.disableSubmit = true;
      stripe.createToken(card).then(function(result) {
        if (result.error) {
          // Inform the customer that there was an error
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
          $scope.disableSubmit = false;
        } else {
          //build the submission
          var payment = {
            mode:GLOBAL.stripeMode,
            name:$scope.name,
            email:$scope.email,
            description:$scope.description,
            idem:$scope.idem,
            amount:100*$scope.amount,
            source:result.token.id
          }
          console.log(payment);
          // Attempt payment
          $http.post("https://pay.superhans.repair/makepayment",payment)
          .then(
              (success)=>{
                  $scope.outcome = "Thank you very much!"
                  $scope.showOutcome = true;
              },
              (failure)=>{
                  $scope.outcome = failure.data
                  $scope.showOutcome = true
                  $scope.disableSubmit = false;
                  //allow another go on failure
                  $scope.idem = Math.random()+Date.now()
              }
          )
        }
      });
  }
  
  window.scope = $scope
  
}])
