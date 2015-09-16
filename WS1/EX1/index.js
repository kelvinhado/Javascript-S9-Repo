'use strict';


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
      "distance": 150
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
      "distance": 550
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
      "distance": 100
    }
  ]
};

var cars = rental.cars;
var rentals = rental.rentals;

var dataJsonResult = {};      //our JSon result
var reservations = [];
dataJsonResult.reservations = reservations;
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
      return pricePerDay - (pricePerDay * 50 / 100);
    }
    else if(numberOfDays > 4) {
      return pricePerDay - (pricePerDay * 30 / 100);
    }
    else if(numberOfDays > 1) {
      return pricePerDay - (pricePerDay * 10 / 100);
    }
    else {
      return pricePerDay;
    }
}

function calculRentalPrice(rental) {
    var rentalDays = getNumberOfDays(rental.pickupDate, rental.returnDate);   // give us the number of days
    var carRented = getCar(rental.carId);                                  // give us the car object

    // calcul ex1
    // return rentalDays * carRented.pricePerDay + res.distance * carRented.pricePerKm;
    // calcul ex2 - Drive more, pay less
    return rentalDays * calculDiscount(carRented.pricePerDay, rentalDays) + rental.distance * carRented.pricePerKm;
};

function calculCommission(rental) {
   var commission = calculRentalPrice(rental) * 30/100;
   var insurance = commission / 2;
   var assistance = getNumberOfDays(rental.pickupDate, rental.returnDate);
   var drivy = commission - insurance - assistance;
   var result = {
                  "insurance" : insurance ,
                  "assistance": assistance,
                  "drivy" : drivy
                 }
    return result;
}


/*
  Display the result for each rentals and store result in Json
  *
  */
  var result = "";
  for(var i = 0; i < rentals.length; i++) {

    var reservation = {
        "id" : rentals[i].driver.firstName + " " + rentals[i].driver.lastName,
        "price" : calculRentalPrice(rentals[i]),
        "commission" : calculCommission(rentals[i])
    }
    dataJsonResult.reservations.push(reservation); // we store our result in a JSon Object.

      result += "(" + rentals[i].id  +") ~"
              +  getNumberOfDays(rentals[i].pickupDate, rentals[i].returnDate)+ "j~"
               + reservation.id
                + " = " + reservation.price +"€<br/> ";

  }
 document.getElementById("result").innerHTML = result;

console.log(JSON.stringify(dataJsonResult));







//  var sitePersonel = {};
// var employees = []
//
//
// sitePersonel.employees = employees;
//
// console.log(sitePersonel);
//
// var firstName = "John";
// var lastName = "Smith";
// var employee = {
//     "firstName": firstName,
//     "lastName": lastName
// }
//
// sitePersonel.employees.push(employee);
//
// console.log(sitePersonel);
//
// var manager = "Jane Doe";
// sitePersonel.employees[0].manager = manager;
//
// console.log(sitePersonel);
//
// console.log(JSON.stringify(sitePersonel));
