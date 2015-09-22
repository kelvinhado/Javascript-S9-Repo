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

function calculRentalPrice(rental) {   // whitout deductibleReduction
    var rentalDays = getNumberOfDays(rental.pickupDate, rental.returnDate);
    var carRented = getCar(rental.carId);

    var total =  rentalDays * calculDiscount(carRented.pricePerDay, rentalDays) + rental.distance * carRented.pricePerKm;


    return total;
};

function calculDeductibleReduction(rental) {
    var deductibleReductionOptionIsSelected = rental.options.deductibleReduction;
    if(deductibleReductionOptionIsSelected) {
      return deductibleOptionPriceADay * getNumberOfDays(rental.pickupDate, rental.returnDate);
    }
    return 0;
}

function storeReservationsInJson() {
  for(var i = 0; i < rentals.length; i++) {

addRowToRentalsTable(rentals[i]);

    /* calcul of the differentes commissions */
    var rentalPrice = calculRentalPrice(rentals[i]);
    var deductibleReduction = calculDeductibleReduction(rentals[i]);
    var commissionAmount = rentalPrice * commissionRate;
    var insuranceAmount = commissionAmount * insuranceRate;
    var assistanceAmount = getNumberOfDays(rentals[i].pickupDate, rentals[i].returnDate);
    var drivyAmount = commissionAmount - insuranceAmount - assistanceAmount + deductibleReduction; // the reduction goes directly to drivy
    var displayCommission = {
                             "insurance" : insuranceAmount ,
                             "assistance": assistanceAmount,
                             "drivy" : drivyAmount
                            }
    var driverAmount = rentalPrice + deductibleReduction;
    var ownerAmount = rentalPrice - commissionAmount;
    /* End calcul of the differente commissions */


    /* generating Reservation JSON Object */
    var reservation = {
        "id" : rentals[i].driver.firstName + " " + rentals[i].driver.lastName,
        "price" : driverAmount,
        "commission" : displayCommission,
        "options" : {  "deductibleReduction" : deductibleReduction }
    }
    dataJsonResult.reservations.push(reservation);


    /* generating Resa JSON Object */
    var resa = {
        "id" : rentals[i].id,
    }
    const actors =        ["driver"       , "owner"       , "insurance"       , "assistance"        , "drivy"];
    const actorsAmount =  [driverAmount , ownerAmount , insuranceAmount , assistanceAmount  , drivyAmount];

    var actions = [];

    for(var j = 0; j < actors.length; j++)
    {
       actions[j] = {
                    "who" : actors[j],
                    "type" : "credit",
                    "amount" : actorsAmount[j]
                  }
        if( actors[j] === actors[0]) {
            actions[j].type = "debit";
        }
    } // end for each actors
    resa.actions = actions;
    dataJsonDebitCredit.resa.push(resa);


  } //end for each rentals

 // Displaying JSON in logcat
  console.log(JSON.stringify(dataJsonResult));
  console.log(JSON.stringify(dataJsonDebitCredit));
}


/*
  Running Process
  *
  */
  for(var i = 0 ; i < cars.length; i++) {
      addRowToVehiculesTable(cars[i]);
  }

storeReservationsInJson();



/*
  UI Section that display result on HTML page
  *
  */

  function addRowToRentalsTable(rental) {
      var table = document.getElementById("rentalsTable");
      var row = table.insertRow(1);
      var cell1 = row.insertCell(0);  //id
      var cell2 = row.insertCell(1);  //driver
      var cell3 = row.insertCell(2);  //CarId
      var cell4 = row.insertCell(3);  //pickupDate
      var cell5 = row.insertCell(4);  //returnDate
      var cell6 = row.insertCell(5);  //Distance
      var cell7 = row.insertCell(6);  //reduction
      cell1.innerHTML = rental.id;
      cell2.innerHTML = rental.driver.lastName + " " + rental.driver.firstName;
      cell3.innerHTML = rental.carId;
      cell4.innerHTML = rental.pickupDate;
      cell5.innerHTML = rental.returnDate;
      cell6.innerHTML = rental.distance;
      cell7.innerHTML = rental.options.deductibleReduction;
  }

  function addRowToVehiculesTable(car) {
      var table = document.getElementById("vehiculesTable");
      var row = table.insertRow(1);
      var cell1 = row.insertCell(0);  //id
      var cell2 = row.insertCell(1);  //vehicule
      var cell3 = row.insertCell(2);  //pricePerDay
      var cell4 = row.insertCell(3);  //pricePerKm
      cell1.innerHTML = car.id;
      cell2.innerHTML = car.vehicule;
      cell3.innerHTML = car.pricePerDay + "€";
      cell4.innerHTML = car.pricePerKm + "€";
  }

  function addRowToBillsTable(rentalBill) {
      var table = document.getElementById("billsTable");
      var row = table.insertRow(1);
      var cell1 = row.insertCell(0);  //id
      var cell2 = row.insertCell(1);  //Price
      var cell3 = row.insertCell(2);  //insurance
      var cell4 = row.insertCell(3);  //assistance
      var cell5 = row.insertCell(4);  //drivy
      var cell6 = row.insertCell(5);  //reduction
      cell1.innerHTML = rentalBill.id;
      cell2.innerHTML = rentalBill.price + "€";
      cell3.innerHTML = rentalBill.insurance + "€";
      cell4.innerHTML = rentalBill.assistance + "€";
      cell5.innerHTML = rentalBill.drivy + "€";
      cell6.innerHTML = rentalBill.deductibleReduction + "€";
  }

  var result = "";
  for(var i = 0; i < dataJsonResult.reservations.length; i++) {


    var reservation = dataJsonResult.reservations;
    var rentalBill = {
                      "id" : reservation[i].id,
                      "price" : reservation[i].price,
                      "insurance" : reservation[i].commission.insurance,
                      "assistance" : reservation[i].commission.assistance,
                      "drivy" : reservation[i].commission.drivy,
                      "deductibleReduction" : reservation[i].options.deductibleReduction
                    };

      addRowToBillsTable(rentalBill);
      result += reservation[i].id
                + " = " + reservation[i].price +"€<br/> ";

} // end for all rentals
document.getElementById("result").innerHTML = result;
