'use strict';

/* Controllers */

// Form controller
app.controller('FormDemoCtrl', ['$http', '$scope', 'GoogleDistanceAPI', '$modal', '$log', function ($http, $scope, GoogleDistanceAPI, $modal, $log) {
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.open = function (size) {
        $scope.order = {
            product: $scope.thing.name,
            quantity: $scope.multiplier,
            address: $scope.details.formatted_address,
            distance: $scope.distances,
            subtotal: $scope.subtotal,
            tax: $scope.tax,
            delivery: $scope.delivery,
            total: $scope.total
        }
        console.info($scope.order);

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.submit = function () {
        var data = {
            customer: $scope.customer,
            order: $scope.order
        }
        $http.post('http://ibytedigital.com/sendorder.php', data)
            .success(function (data) {
                alert('Mail Sent');
            }).error(function (data) {
                alert('Mail Failed');
            });
        //        $scope.customer
        //        $scope.order
    }
    $scope.details = false;
    $scope.delivery = 0;
    $scope.total = 0;
    $scope.multiplier = 1;
    $scope.destinations = ['1818 S Young Cirle Hollywood Florida 33020', '26.010497', '-80.143617'];
    $scope.products = [{
        id: 0,
        name: '$16 Per Person',
        price: 16,
        includes: [
            'Ceasar Salad',
            'Baked Ziti',
            'Chicken Francese',
            'Meatballs',
            'Sausage w/Peppers & Onions',
            'Garlic Rolls',
            'Soda & Cups',
            'Dinnerware'
        ]
    }, {
        id: 1,
        name: '$19 Per Person',
        price: 19,
        includes: [
            'Mozzarella Caprese Salad',
            'Penne ala Vodka',
            'Chicken Marsala',
            'Shrimp Parmigiana',
            'Eggplant Rollatini',
            'Garlic Rolls',
            'Chocolate Chunk Cookies',
            'Soda & Cups',
            'Dinnerware'
        ]
    }];

    $scope.update = function (key) {
        $scope.details = true;
        $scope.thing = key;
        var subtotal = $scope.thing.price * $scope.multiplier;
        $scope.subtotal = subtotal;
        $scope.tax = subtotal * 0.06;
        $scope.total = $scope.delivery + $scope.tax + $scope.thing.price * $scope.multiplier;
    }

    $scope.change = function (key) {
        var subtotal = $scope.thing.price * key;
        $scope.subtotal = subtotal;
        $scope.tax = subtotal * 0.06;
        $scope.total = $scope.delivery + $scope.tax + $scope.thing.price * $scope.multiplier;
    }

    $scope.result = ''
    $scope.options = {};
    $scope.form = {
        type: 'geocode',
        bounds: {
            SWLat: 49,
            SWLng: -97,
            NELat: 50,
            NELng: -96
        },
        country: 'ca',
        typesEnabled: false,
        boundsEnabled: false,
        componentEnabled: false,
        watchEnter: true
    }

    $scope.watchForm = function () {
        if (!($scope.details.address_components)) {
            $scope.address = $scope.details;
            $scope.destinations = $scope.address.formatted_address;
        }
        return $scope.form
    };
    $scope.$watch($scope.watchForm, function () {
        $scope.checkForm()
    }, true);


    //set options from form selections
    $scope.checkForm = function () {

        $scope.options = {};

        $scope.options.watchEnter = $scope.form.watchEnter

        if ($scope.form.typesEnabled) {
            $scope.options.types = $scope.form.type
        }
        if ($scope.form.boundsEnabled) {

            var SW = new google.maps.LatLng($scope.form.bounds.SWLat, $scope.form.bounds.SWLng)
            var NE = new google.maps.LatLng($scope.form.bounds.NELat, $scope.form.bounds.NELng)
            var bounds = new google.maps.LatLngBounds(SW, NE);
            $scope.options.bounds = bounds

        }
        if ($scope.form.componentEnabled) {
            $scope.options.country = $scope.form.country
        }
    };

    $scope.getDestination = function () {
        setTimeout(function () {
            var address = $scope.details.formatted_address;
            console.log(address);
            getDistance(address);
        }, 1000);

    }


    function getDistance(address) {
        $scope.origins = ['1818 S Young Cirle Hollywood Florida 33020', '26.010497', '-80.143617'];
        var d = new Array();
        d.push(address);
        $scope.destinations = d;
        console.log($scope.destinations);
        console.log(d);


        var args = {
            origins: $scope.origins,
            destinations: $scope.destinations
        };


        $scope.data = GoogleDistanceAPI
            .getDistanceMatrix(args)
            .then(function (distanceMatrix) {
                $scope.distances = distanceMatrix.rows[0].elements[0].distance.text;
                var measureDist = $scope.distances.split(".");
                var temp = parseInt(measureDist[0], 10);

                if (temp < 3) {
                    $scope.delivery = 0;
                } else {
                    $scope.delivery = 3;
                }
                $scope.total = $scope.delivery + $scope.tax + $scope.thing.price * $scope.multiplier;

                return distanceMatrix;
            });
    }

    function getTotal() {
        setTimeout(function () {
            $scope.total = $scope.delivery + $scope.tax + $scope.thing.price * $scope.multiplier;
        }, 500);
    }

    $scope.consolidateFields = function () {
        $scope.order = {
            product: $scope.thing.name,
            quantity: $scope.multiplier,
            address: $scope.details.formatted_address,
            distance: $scope.distances,
            subtotal: $scope.subtotal,
            tax: $scope.tax,
            delivery: $scope.delivery,
            total: $scope.total
        }
        console.info($scope.order);
    }


}]);
app.controller('FormDemoCtrl2', ['$http', '$scope', 'GoogleDistanceAPI', '$modal', '$log', function ($http, $scope, GoogleDistanceAPI, $modal, $log) {
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.open = function (size) {
        $scope.order = {
            //            product: $scope.thing.name,
            quantity: $scope.multiplier,
            address: $scope.details.formatted_address,
            distance: $scope.distances,
            subtotal: $scope.subtotal,
            tax: $scope.tax,
            delivery: $scope.delivery,
            total: $scope.total
        }
        console.info($scope.order);

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.submit = function () {
        var data = {
            customer: $scope.customer,
            order: $scope.order
        }
        $http.post('http://ibytedigital.com/sendorder.php', data)
            .success(function (data) {
                alert('Mail Sent');
            }).error(function (data) {
                alert('Mail Failed');
            });
        //        $scope.customer
        //        $scope.order
    }
    $scope.details = false;
    $scope.delivery = 0;
    $scope.total = 0;
    $scope.multiplier = 0;
    $scope.destinations = ['1818 S Young Cirle Hollywood Florida 33020', '26.010497', '-80.143617'];
    $scope.products = [
        {
            "id": 0,
            "item": "Salads",
            "price": null,
            "quantity": 0
  },
        {
            "id": 1,
            "item": "House Salad W/ Dressing",
            "price": 21.95,
            "quantity": 0
  },
        {
            "id": 2,
            "item": "Caesar Salad",
            "price": 24.95,
            "quantity": 0
  },
        {
            "id": 3,
            "item": "Garlic Bread (3 Dozen)",
            "price": 21.95,
            "quantity": 0
  },
        {
            "id": 4,
            "item": "Pasta",
            "price": null,
            "quantity": 0
  },
        {
            "id": 5,
            "item": "Pasta W/ Meatballs",
            "price": 49.95,
            "quantity": 0
  },
        {
            "id": 6,
            "item": "Lasagna (12 Pcs.)",
            "price": 64.95,
            "quantity": 0
  },
        {
            "id": 7,
            "item": "Baked Ziti",
            "price": 59.95,
            "quantity": 0
  },
        {
            "id": 8,
            "item": "Rigatoni Bolognese",
            "price": 59.95,
            "quantity": 0
  },
        {
            "id": 9,
            "item": "Penne Ala Vodka",
            "price": 64.95,
            "quantity": 0
  },
        {
            "id": 10,
            "item": "Raviolis",
            "price": 49.95,
            "quantity": 0
  },
        {
            "id": 11,
            "item": "Chicken",
            "price": null,
            "quantity": 0
  },
        {
            "id": 12,
            "item": "Penne W/ Chicken Broccoli Creamy Garlic",
            "price": 64.95,
            "quantity": 0
  },
        {
            "id": 13,
            "item": "Chicken Scarpariello W/ Linguine",
            "price": 64.95,
            "quantity": 0
  },
        {
            "id": 14,
            "item": "Chicken Parmigiana",
            "price": 69.95,
            "quantity": 0
  },
        {
            "id": 15,
            "item": "Chicken Francese",
            "price": 74.95,
            "quantity": 0
  },
        {
            "id": 16,
            "item": "Chicken Marsala",
            "price": 74.95,
            "quantity": 0
  },
        {
            "id": 17,
            "item": "Chicken Picatta",
            "price": 69.95,
            "quantity": 0
  },
        {
            "id": 18,
            "item": "Chicken Cacciatore W/ Penne",
            "price": 69.95,
            "quantity": 0
  },
        {
            "id": 19,
            "item": "Vegetarian",
            "price": null,
            "quantity": 0
  },
        {
            "id": 20,
            "item": "Penne Primavera",
            "price": 49.95,
            "quantity": 0
  },
        {
            "id": 21,
            "item": "Vegetable Lasagna (12Pcs.)*",
            "price": 64.95,
            "quantity": 0,
            "tooltip": "24 Hours Notice Required"
  },
        {
            "id": 22,
            "item": "Broccoli, Garlic & Oil W/ Rigatoni",
            "price": 54.95,
            "quantity": 0
  },
        {
            "id": 23,
            "item": "Eggplant Rollatini",
            "price": 64.95,
            "quantity": 0
  },
        {
            "id": 24,
            "item": "Eggplant Parmigiana",
            "price": 64.95,
            "quantity": 0
  },
        {
            "id": 25,
            "item": "Seafood",
            "price": null,
            "quantity": 0
  },
        {
            "id": 26,
            "item": "Snapper Oreganato",
            "price": 95.95,
            "quantity": 0
  },
        {
            "id": 27,
            "item": "Tilapia Francese",
            "price": 79.95,
            "quantity": 0
  },
        {
            "id": 28,
            "item": "Shrimp Scampi W/ Linguini",
            "price": 84.95,
            "quantity": 0
  },
        {
            "id": 29,
            "item": "Shrimp Parmigiana*",
            "price": 84.95,
            "quantity": 0,
            "tooltip": "24 Hours Notice Required"
  },
        {
            "id": 30,
            "item": "Stuffed Shrimp*",
            "price": 94.95,
            "quantity": 0,
            "tooltip": "24 Hours Notice Required"
  },
        {
            "id": 31,
            "item": "Frutti Di Mare W/ Linguine",
            "price": 95.95,
            "quantity": 0
  },
        {
            "id": 32,
            "item": "Assorted Sushi (Chefs Choice)\nSushi Before 5Pm Please Call",
            "price": 1.25,
            "note": "50(minimum)",
            "quantity": 0
  },
        {
            "id": 33,
            "item": "Meats",
            "price": null,
            "quantity": 0
  },
        {
            "id": 34,
            "item": "Meaty Macaroni*",
            "price": 59.95,
            "quantity": 0,
            "tooltip": "24 Hours Notice Required"
  },
        {
            "id": 35,
            "item": "Meatballs (Half Tray â€“ 40 Pcs.)",
            "price": 49.95,
            "quantity": 0
  },
        {
            "id": 36,
            "item": "Sausage & Peppers",
            "price": 52.95,
            "quantity": 0
  },
        {
            "id": 37,
            "item": "Grilled Stuff Skirt Steak (12 Pcs.)",
            "price": 84.95,
            "quantity": 0
  },
        {
            "id": 38,
            "item": "Filet Mignon Courvoisier",
            "price": 195,
            "quantity": 0
  },
        {
            "id": 39,
            "item": "Sides",
            "price": null,
            "quantity": 0
  },
        {
            "id": 40,
            "item": "Cold Antipasto",
            "price": 59.95,
            "quantity": 0
  },
        {
            "id": 41,
            "item": "Roasted Potatoes",
            "price": 39.95,
            "quantity": 0
  },
        {
            "id": 42,
            "item": "Sauteed Vegetables",
            "price": 39.95,
            "quantity": 0
  },
        {
            "id": 43,
            "item": "Hors D'oeuvre/Appetizers",
            "price": null,
            "quantity": 0
  },
        {
            "id": 44,
            "item": "Meatballs",
            "price": 1.25,
            "quantity": 0
  },
        {
            "id": 45,
            "item": "Fried Mozzarella",
            "price": 1.25,
            "quantity": 0
  },
        {
            "id": 46,
            "item": "Fried Mozzarella & Tomato Skewers",
            "price": 1.75,
            "quantity": 0
  },
        {
            "id": 47,
            "item": "Stuffed Mushrooms",
            "price": 1.25,
            "quantity": 0
  },
        {
            "id": 48,
            "item": "Rice Balls",
            "price": 1.5,
            "quantity": 0
  },
        {
            "id": 49,
            "item": "Spinach Rolls",
            "price": 1.25,
            "quantity": 0
  },
        {
            "id": 50,
            "item": "Stromboli",
            "price": 1.25,
            "quantity": 0
  },
        {
            "id": 51,
            "item": "Rabe & Sausage Balls",
            "price": 1.5,
            "quantity": 0
  },
        {
            "id": 52,
            "item": "Sausage, Pepper & Onion Skewers",
            "price": 1.5,
            "quantity": 0
  },
        {
            "id": 53,
            "item": "Mini Ravioli & Mozzarella Skewers",
            "price": 1.75,
            "quantity": 0
  },
        {
            "id": 54,
            "item": "Potato Croquettes",
            "price": 1.25,
            "quantity": 0
  },
        {
            "id": 55,
            "item": "Beef Wellington",
            "price": 3.5,
            "quantity": 0
  },
        {
            "id": 56,
            "item": "Bacon Wrapped Scallops",
            "price": 3.5,
            "quantity": 0
  },
        {
            "id": 57,
            "item": "Shrimp Cocktail",
            "price": 2.5,
            "quantity": 0
  },
        {
            "id": 58,
            "item": "Jumbo Lump Crab Cake",
            "price": 2.95,
            "quantity": 0
  },
        {
            "id": 59,
            "item": "Assorted Sushi (Chefs Choice)",
            "price": 1.25,
            "quantity": 0
  },
        {
            "id": 60,
            "item": "Sesame Chicken Skewers",
            "price": 2,
            "quantity": 0
  },
        {
            "id": 61,
            "item": "Desserts",
            "price": null,
            "quantity": 0
  },
        {
            "id": 62,
            "item": "Assorted Dessert Platter\nChefs Choice (10Pcs.)",
            "price": 49.95,
            "quantity": 0
  },
        {
            "id": 63,
            "item": "Homemade Cookies (1 Tray)",
            "price": 18.95,
            "quantity": 0
  },
        {
            "id": 64,
            "item": "Setup Charges",
            "price": null,
            "quantity": 0
  },
        {
            "id": 65,
            "item": "Chaffer Dish Rental",
            "price": 10,
            "quantity": 0
  },
        {
            "id": 66,
            "item": "Delivery Charge",
            "price": 15,
            "quantity": 0
  },
        {
            "id": 67,
            "item": "Plastic Ware",
            "price": 0.5,
            "quantity": 0
  },
        {
            "id": 68,
            "item": "Setup & Pick-Up Fee",
            "price": 50,
            "quantity": 0
  }
];

    $scope.update = function (key) {
        $scope.details = true;
        $scope.thing = key;
        var subtotal = $scope.thing.price * $scope.multiplier;
        $scope.subtotal = subtotal;
        $scope.tax = subtotal * 0.06;
        $scope.total = $scope.delivery + $scope.tax + $scope.thing.price * $scope.multiplier;
    }

    $scope.change = function (key) {
        console.log(key);
        console.log($scope.products[key]);
        //console.log($scope.item.quantity);
        //$scope.products[key].
        //$scope.products[key].quantity = $scope.item.quantity;
        var subtotal = 0;
        for (var i = 0; i < $scope.products.length; i++) {
            if ($scope.products[i].price) {
                subtotal += $scope.products[i].price * $scope.products[i].quantity;
                console.log(i + ':- ' + $scope.products[i].item + subtotal);
            }
        }
        //var subtotal = $scope.products[key].price * $scope.products[key].quantity;
        //$scope.subtotal = subtotal;
        $scope.subtotal = subtotal;
        $scope.tax = subtotal * 0.06;
        $scope.total = $scope.delivery + $scope.tax + $scope.subtotal;
    }

    $scope.result = ''
    $scope.options = {};
    $scope.form = {
        type: 'geocode',
        bounds: {
            SWLat: 49,
            SWLng: -97,
            NELat: 50,
            NELng: -96
        },
        country: 'ca',
        typesEnabled: false,
        boundsEnabled: false,
        componentEnabled: false,
        watchEnter: true
    }

    $scope.watchForm = function () {
        if (!($scope.details.address_components)) {
            $scope.address = $scope.details;
            $scope.destinations = $scope.address.formatted_address;
        }
        return $scope.form
    };
    $scope.$watch($scope.watchForm, function () {
        $scope.checkForm()
    }, true);


    //set options from form selections
    $scope.checkForm = function () {

        $scope.options = {};

        $scope.options.watchEnter = $scope.form.watchEnter

        if ($scope.form.typesEnabled) {
            $scope.options.types = $scope.form.type
        }
        if ($scope.form.boundsEnabled) {

            var SW = new google.maps.LatLng($scope.form.bounds.SWLat, $scope.form.bounds.SWLng)
            var NE = new google.maps.LatLng($scope.form.bounds.NELat, $scope.form.bounds.NELng)
            var bounds = new google.maps.LatLngBounds(SW, NE);
            $scope.options.bounds = bounds

        }
        if ($scope.form.componentEnabled) {
            $scope.options.country = $scope.form.country
        }
    };

    $scope.getDestination = function () {
        setTimeout(function () {
            var address = $scope.details.formatted_address;
            console.log(address);
            getDistance(address);
        }, 1000);

    }


    function getDistance(address) {
        $scope.origins = ['1818 S Young Cirle Hollywood Florida 33020', '26.010497', '-80.143617'];
        var d = new Array();
        d.push(address);
        $scope.destinations = d;
        console.log($scope.destinations);
        console.log(d);


        var args = {
            origins: $scope.origins,
            destinations: $scope.destinations
        };


        $scope.data = GoogleDistanceAPI
            .getDistanceMatrix(args)
            .then(function (distanceMatrix) {
                $scope.distances = distanceMatrix.rows[0].elements[0].distance.text;
                var measureDist = $scope.distances.split(".");
                var temp = parseInt(measureDist[0], 10);

                if (temp < 3) {
                    $scope.delivery = 0;
                } else {
                    $scope.delivery = 3;
                }
                $scope.total = $scope.delivery + $scope.tax + $scope.thing.price * $scope.multiplier;

                return distanceMatrix;
            });
    }

    function getTotal() {
        setTimeout(function () {
            $scope.total = $scope.delivery + $scope.tax + $scope.thing.price * $scope.multiplier;
        }, 500);
    }

    $scope.consolidateFields = function () {
        $scope.order = {
            product: $scope.thing.name,
            quantity: $scope.multiplier,
            address: $scope.details.formatted_address,
            distance: $scope.distances,
            subtotal: $scope.subtotal,
            tax: $scope.tax,
            delivery: $scope.delivery,
            total: $scope.total
        }
        console.info($scope.order);
    }


}]);
