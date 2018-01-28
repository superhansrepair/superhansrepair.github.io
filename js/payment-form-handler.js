var stripeKeys = {
    live: "pk_live_5rRV2gicedvJNhurme4I8Gnd",
    test: "pk_test_mq2ehqe1tkcP71ZFwCQHjqng"
}

//Startup message
console.log("Found Stripe Mode:",GLOBAL.stripeMode)

//initialise stripe
var stripe = Stripe(stripeKeys[GLOBAL.stripeMode]);
var elements = stripe.elements();
var card = elements.create('card', {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#8898AA',
      //color: 'white',
      lineHeight: '36px',
      fontWeight: 300,
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: '19px',
      padding-top: '10px',

      '::placeholder': {
        color: '#8898AA',
      },
    },
    invalid: {
      iconColor: '#ff0000',
      color: '#ff0000',
    }
  },
  classes: {
    focus: 'is-focused',
    empty: 'is-empty',
  },
});
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
paymentsApp.config([
  '$interpolateProvider', function($interpolateProvider) {
    return $interpolateProvider.startSymbol('{(').endSymbol(')}');
  }
]);

paymentsApp.controller('paymentFormController',['$scope','$http',function($scope,$http){

  //bind and idempotency key and description to the form
  $scope.idem = Math.random() + Date.now();
  $scope.description = GLOBAL.description;
  $scope.paid = false;

  function start(){
    $scope.disableSubmit = true;
    $scope.outcome = "";
    $scope.showOutcome = false;
  }
  function ok(message){
    $scope.disableSubmit = true;
    $scope.paid = true;
    $scope.outcome = message
    $scope.showOutcome = true;
  }
  function allowRetry(message){
    $scope.disableSubmit = false;
    $scope.payMessage = "Retry"
    $scope.outcome = message
    $scope.showOutcome = true;
  }

  //define the form handler
  $scope.paymentFormSubmit = function(){
      //try... to avoid double submit and hide previous errors
      if($scope.disableSubmit){return console.log("Double submit avoided")}
      start()

      stripe.createToken(card).then(function(result) {
        if (result.error) {
          // Stripe hates you
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
          $scope.$apply(allowRetry(""));
        } else {
          //build the submission
          var payment = {
            mode:GLOBAL.stripeMode,
            name:$scope.name,
            email:$scope.email,
            description:$scope.description,
            idem:$scope.idem,
            amount:parseInt(100*$scope.amount),
            message:$scope.message,
            source:result.token.id
          }
          // Attempt payment
          $http.post("https://pay.superhans.repair/makepayment",payment)
          .then(
              (success)=>{
                  ok(GLOBAL.successText)
              },
              (failure)=>{
                  allowRetry(failure.data || "Sorry - that didn't work")
                  //allow another go on failure
                  $scope.idem = Math.random()+Date.now()
              }
          )
        }
      });
  }
}])
