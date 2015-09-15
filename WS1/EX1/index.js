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

function calculRentalPrice(res) {
    var rentalDays = getNumberOfDays(res.pickupDate, res.returnDate);
    var carRented = getCar(res.carId);  // return the object car

    // calcul
    return rentalDays * carRented.pricePerDay + res.distance * carRented.pricePerKm;
};

/*
  DISPLAY RESULT
  *
  */
  var result;
  for(var i = 0; i < rentals.length; i++) {
      result += calculRentalPrice(rentals[i]) +"  / ";
      console.log(calculRentalPrice(rentals[i]));
  }
 document.getElementById("result").innerHTML = result;
