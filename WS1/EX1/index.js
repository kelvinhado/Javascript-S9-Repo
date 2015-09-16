'use strict';

/* parameters */
const discountMoreThanOneDay = 10 / 100;
const discountMoreThanFourDay = 30 / 100;
const discountMoreThanTenDay = 50 / 100;
const deductibleOptionPriceADay = 4;
const commissionRate = 30 / 100;
const insuranceRate = 50 / 100;
/* end parameters */

var rental = {
  "cars": [
    {
      "id": "p306",
      "vehicule": "peugeot 306",
      "pricePerDay": 20,
      "pricePerKm": 0.10
    },
    {
      "id": "rr-sport",
      "pricePerDay": 60,
      "pricePerKm": 0.30
    },
    {
      "id": "p-boxster",
      "pricePerDay": 100,
      "pricePerKm": 0.45
    }
  ],
  "rentals": [
    {
      "id": "1-pb-92",
      "driver": {
        "firstName": "Paul",
        "lastName": "Bismuth"
      },
      "carId": "p306",
      "pickupDate": "2015-09-12",
      "returnDate": "2015-09-14",
      "distance": 150,
      "options":{
        "deductibleReduction": true
      }
    },
    {
      "id": "2-rs-92",
      "driver": {
        "firstName": "Rebecca",
        "lastName": "Solanas"
      },
      "carId": "rr-sport",
      "pickupDate": "2015-09-09",
      "returnDate": "2015-09-13",
      "distance": 550,
      "options":{
        "deductibleReduction": false
      }
    },
    {
      "id": "3-sa-92",
      "driver": {
        "firstName": " Sami",
        "lastName": "Ameziane"
      },
      "carId": "p-boxster",
      "pickupDate": "2015-09-12",
      "returnDate": "2015-09-14",
      "distance": 100,
      "options":{
        "deductibleReduction": true
      }
    }
  ]
};

var cars = rental.cars;
var rentals = rental.rentals;

var dataJsonResult = {};      //our JSon result
var reservations = [];
dataJsonResult.reservations = reservations;

var dataJsonDebitCredit = {}; // to store our Debit Credit result (cf ex5)
var resa = [];
dataJsonDebitCredit.resa = resa;

/*
 FUNCTIONS
 *
 */

function getCar(carId){
  for(var i = 0 ; i < cars.length; i++) {
    if(cars[i].id ===carId) {
      return cars[i];
    }
  }
};

function getNumberOfDays (from, to) {
    return (( Date.parse(to) - Date.parse(from) ) / (24 * 60 * 60 * 1000) ) + 1;
};

function calculDiscount(pricePerDay, numberOfDays) {
    if(numberOfDays > 10) {
      return pricePerDay - (pricePerDay * discountMoreThanTenDay);
    }
    else if(numberOfDays > 4) {
      return pricePerDay - (pricePerDay * discountMoreThanFourDay);
    }
    else if(numberOfDays > 1) {
      return pricePerDay - (pricePerDay * discountMoreThanOneDay);
    }
    else {
      return pricePerDay;
    }
}

function calculRentalPrice(rental) {
    var rentalDays = getNumberOfDays(rental.pickupDate, rental.returnDate);   // give us the number of days
    var carRented = getCar(rental.carId);                                  // give us the car object


    // calcul ex1
    // var total = rentalDays * carRented.pricePerDay + res.distance * carRented.pricePerKm;
    // calcul ex2 - Drive more, pay less
    var total =  rentalDays * calculDiscount(carRented.pricePerDay, rentalDays) + rental.distance * carRented.pricePerKm;


    return total;
};
// for ex 3
function generateCommission(rental) {
   var commission = calculRentalPrice(rental) * commissionRate;
   var insurance = commission * insuranceRate;
   var assistance = getNumberOfDays(rental.pickupDate, rental.returnDate);
   var drivy = commission - insurance - assistance + calculDeductibleReduction(rental); // the reduction goes directly to drivy
   var result = {
                  "insurance" : insurance ,
                  "assistance": assistance,
                  "drivy" : drivy
                 }
    return result;
}
// for ex 4
function calculDeductibleReduction(rental) {
    var deductibleReductionOptionIsSelected = rental.options.deductibleReduction;
    if(deductibleReductionOptionIsSelected) {
      return deductibleOptionPriceADay * getNumberOfDays(rental.pickupDate, rental.returnDate);
    }
    return 0;
}

function storeReservationsInJson() {
  for(var i = 0; i < rentals.length; i++) {
    var reservation = {
        "id" : rentals[i].driver.firstName + " " + rentals[i].driver.lastName,
        "price" : calculRentalPrice(rentals[i]) + calculDeductibleReduction(rentals[i]),
        "commission" : generateCommission(rentals[i]),
        "options" : {  "deductibleReduction" : calculDeductibleReduction(rentals[i]) }
    }
    dataJsonResult.reservations.push(reservation); // we store our result in a JSon Object.
  }
}
// ex 5 we will extract and display data using a new Json
function storeCreditDebitInJson() {
  for(var i = 0; i < rentals.length; i++) {


      var resa = {
          "id" : rentals[i].id,
          "action" : generateDebitCredit(rentals[i])
      }
      dataJsonDebitCredit.resa.push(resa);
  }
}

function generateDebitCredit(rental) {
      var rentalPrice = calculRentalPrice(rental);
      var commission = rentalPrice * commissionRate;

      var driverAmount = rentalPrice + calculDeductibleReduction(rental);
      var ownerAmount = rentalPrice - commission;
      var insuranceAmount = commission * insuranceRate;
      var assistanceAmount = getNumberOfDays(rental.pickupDate, rental.returnDate);
      var drivyAmount = commission - insuranceAmount - assistanceAmount + calculDeductibleReduction(rental);


      const entities =        ["driver"       , "owner"       , "insurance"       , "assistance"        , "drivy"];
      const entitiesAmount =  [driverAmount , ownerAmount , insuranceAmount , assistanceAmount  , drivyAmount];

      var resultDC = [];

      for(var i = 0; i < entities.length; i++)
      {
         resultDC[i] = {
                      "who" : entities[i],
                      "type" : "credit",
                      "amount" : entitiesAmount[i]
                    }
          if( entities[i] === entities[0]) {
              resultDC[i].type = "debit";
          }

      }
      return resultDC;

      //return [ { "who" : "me", "type" : "debit", "amount" : 456 } {}]
}










/*
  Display the result for each rentals and store result in Json
  *
  */
storeReservationsInJson();
storeCreditDebitInJson();

  var result = "";
  for(var i = 0; i < dataJsonResult.reservations.length; i++) {

    var reservation = dataJsonResult.reservations;
    var dataTable = [
                      reservation[i].id,
                      reservation[i].price,
                      reservation[i].commission.insurance,
                      reservation[i].commission.assistance,
                      reservation[i].commission.drivy,
                      reservation[i].options.deductibleReduction
                    ];

    // var tabBody = document.getElementsByTagName("tbody").item(i);
    // var row= document.createElement("tr");
    // for(var j = 0; j<6; j++) {
    //     var cell = document.createElement("td");
    //     var txtnode =document.createTextNode(dataTable[j]);
    //     cell.appendChild(txtnode);
    //     row.appendChild(cell);
    //     tabBody.appendChild(row);
    // }
      result += reservation[i].id
                + " = " + reservation[i].price +"€<br/> ";

} // end for all rentals
 document.getElementById("result").innerHTML = result;

console.log(JSON.stringify(dataJsonResult));
console.log(JSON.stringify(dataJsonDebitCredit));
