'use strict';

/* Controllers */

// Form controller
app.controller('FormDemoCtrl', ['$scope', 'GoogleDistanceAPI', function ($scope, GoogleDistanceAPI) {
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
        $scope.item = key;
        var subtotal = $scope.item.price * $scope.multiplier;
        $scope.subtotal = subtotal;
        $scope.tax = subtotal * 0.06;
        $scope.total = $scope.delivery + $scope.tax + $scope.item.price * $scope.multiplier;
    }

    $scope.change = function (key) {
        var subtotal = $scope.item.price * key;
        $scope.subtotal = subtotal;
        $scope.tax = subtotal * 0.06;
        $scope.total = $scope.delivery + $scope.tax + $scope.item.price * $scope.multiplier;
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
                $scope.total = $scope.delivery + $scope.tax + $scope.item.price * $scope.multiplier;

                return distanceMatrix;
            });
    }

    function getTotal() {
        setTimeout(function () {
            $scope.total = $scope.delivery + $scope.tax + $scope.item.price * $scope.multiplier;
        }, 500);
    }


}]);
