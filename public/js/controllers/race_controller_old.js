/**
 * Created by brian on 12/18/2014.
 */
angular.module('raceController', ['ui.bootstrap'])
    .config(function (datepickerConfig, datepickerPopupConfig) {
        datepickerConfig.showWeeks = true;
        datepickerPopupConfig.toggleWeeksText = 'Week';
    })

    // TODOs:
    //      - form validation

    //Datepicker
    .directive("mydatepicker", function(){
        return {
            restrict: "E",
            // isolate scope - maps the directive's scope to the outer scope (in this case, the controller's scope)
            scope:{
                dt: "="
                //ngModel: "=",           // this seems like one that you'd always want, because you want a separate ngModel for each instance of the directive
                //dateOptions: "=",     // commenting this out because we will use the directive's dateOptions, not the controller's dateOptions
                //opened: "="             // this one seems like you'd want it to use the directive's scope, as you don't want all directive instances to share the value of 'opened'
            },
            link: function($scope, element, attrs) {
                $scope.open = function(event){
                    console.log("open datepicker");
                    event.preventDefault();
                    event.stopPropagation();
                    $scope.opened = true;
                };

                // default date to today (just for demo purposes)
                $scope.today = function() {
                    $scope.dt = new Date().toLocaleDateString("en-US");
                };
                $scope.today();

                $scope.dateOptions = {
                    'year-format': "'yy'",
                    'starting-day': 0,
                    'show-weeks' : false
                };

                $scope.clear = function () {
                    $scope.ngModel = null;
                };
            },
            templateUrl: '../../partials/datepicker.html'
        }
    })

    // inject the Race service factory into our controller
    .controller('RaceViewCtrl', ['$scope','$http','svc_Races', 'svc_RaceDirectors', 'svc_RaceDistances'
        , function($scope, $http, svc_Races, svc_RaceDirectors, svc_RaceDistances) {
        $scope.raceFormData = {};
        $scope.loadingRaces = true;
        //$scope.loadingRaceDirectors = true;       // might need this here

        $scope.opened = false;
        //Datepicker =================================================
        // this is the standard inline datepicker code, not the code for the myDatePicker directive
        /*
        $scope.today = function() {
            $scope.dt = new Date().toLocaleDateString("en-US");
        };
        $scope.today();

        $scope.showWeeks = true;
        $scope.toggleWeeks = function () {
            $scope.showWeeks = ! $scope.showWeeks;
        };

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = ( $scope.minDate ) ? null : new Date();
        };
        $scope.toggleMin();

        $scope.openDatePicker = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1,
            'show-weeks' : $scope.showWeeks
        };

        $scope.formats = ['M/d/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = $scope.formats[0];
        */
        // ======= END DATEPICKER ===============================

        // TODO: do I need all of these variables to manage editing Races?
        $scope.editingRaces = [];
        $scope.editingRacesIndex = 0;
        $scope.isEditingRacesIndex = false;

        init();     // call our init() function to kick things off

        function init() {
            // TODO:  do these methods need to be declared separately (so we can call them outside of init())?
            // GET =====================================================================
            // when landing on the page, get all data
            // use the services to get all the data
            svc_Races.get()
                .success(function(data) {
                    console.log('svc_Races.get called');
                    $scope.races = data;
                    $scope.loadingRaces = false;
                    //console.log('data = ' + data);
                });

            // need RaceDirectors for dropdown list when adding a race
            svc_RaceDirectors.get()
                .success(function(data) {
                    console.log('svc_RaceDirectors.get called');
                    $scope.raceDirectors = data;
                    $scope.loadingRaceDirectors = false;
                });

            // need RaceDistances for dropdown list when adding a race
            svc_RaceDistances.get()
                .success(function(data) {
                    console.log('svc_RaceDistances.get called');
                    $scope.raceDistances = data;
                    $scope.loadingRaceDistances = false;
                });
        }

        // TODO:  *** Need to clean all of this stuff up and add error handling ***
        $scope.callUpdateRace = function(){
            var index = $scope.editingRacesIndex;
            var race = $scope.editingRaces[index];
            console.log(race);
            updateRace(race._id, race, index);
            //$scope.races[index] = angular.copy($scope.editingRaces[index]);
            console.log('$scope.editingRaces[index] = ' + $scope.editingRaces[index]);
            $scope.editingRaces[index] = false;
            $scope.isEditingRacesIndex = false;
            $scope.editingRaces = [];
        };
        /*
        $scope.editRace = function(index){
            $scope.editingRaces[$scope.editingRacesIndex] = false;  // cancel the current edit
            $scope.editingRaces[index] = angular.copy($scope.races[index]);
            $scope.editingRacesIndex = index;
            $scope.isEditingRacesIndex = true;
        };
        $scope.cancelEditRace = function(index){
            $scope.races[index] = angular.copy($scope.editingRaces[index]);
            $scope.editingRaces[index] = false;
            $scope.isEditingRacesIndex = false;
            $scope.editingRaces = [];
        };
        */

        // UPDATE ==================================================================
        function updateRace(id, race, index) {
            console.log('updateRace called');
            // validate the raceFormData to make sure that something is there
            // if form is empty, nothing will happen
            $scope.loadingRaces = true;

            // call the create function from our service (returns a promise object)
            svc_Races.update(id, race)

                // if successful creation, call our get function to get all the new races
                .success(function(data) {
                    $scope.loadingRaces = false;
                    console.log('index = ' + index);
                    //$scope.races[index] = data;
                    svc_Races.getById(id)
                        .success(function(data) {
                            console.log('svc_Races.getById called');
                            $scope.races[index] = data;
                            $scope.lastEditedRace = data;
                            //console.log('data = ' + data);
                            console.log('lastEditedRace.name = ' + $scope.lastEditedRace.name);
                        });
                    //$scope.races = data;

                });

        };

        // CREATE ==================================================================
        // when submitting the add form, send the text to the node API
        $scope.createRace = function() {
            console.log('createRace called');
            // validate the raceFormData to make sure that something is there
            // if form is empty, nothing will happen
            if ($scope.raceFormData.name != undefined) {
                $scope.loadingRaces = true;

                // call the create function from our service (returns a promise object)
                svc_Races.create($scope.raceFormData)

                    // if successful creation, call our get function to get all the new races
                    .success(function(data) {
                        $scope.loadingRaces = false;
                        $scope.raceFormData = {}; // clear the form so our user is ready to enter another
                        $scope.races = data; // assign our new list of races
                    });
            }
            else {
                console.log('Race form is empty');
            }
        };

        // DELETE ==================================================================
        // delete a race after checking it
        $scope.deleteRace = function(id) {
            $scope.loadingRaces = true;
            console.log('deleteRace called');
            svc_Races.delete(id)
                // if successful creation, call our get function to get all the new races
                .success(function(data) {
                    $scope.loadingRaces = false;
                    $scope.races = data; // assign our new list of races
                });
        };
    }])

    // inject the Race service factory into our controller
    .controller('RaceCreateCtrl', ['$scope','$http','svc_Races', 'svc_RaceDirectors', 'svc_RaceDistances'
        , function($scope, $http, svc_Races, svc_RaceDirectors, svc_RaceDistances) {
            $scope.raceFormData = {};

            init();     // call our init() function to kick things off

            function init() {
                // TODO:  do these methods need to be declared separately (so we can call them outside of init())?
                // GET =====================================================================
                // when landing on the page, get all data
                // use the services to get all the data
                svc_Races.get()
                    .success(function(data) {
                        console.log('svc_Races.get called');
                        $scope.races = data;
                        $scope.loadingRaces = false;
                        //console.log('data = ' + data);
                    });

                // need RaceDirectors for dropdown list when adding a race
                svc_RaceDirectors.get()
                    .success(function(data) {
                        console.log('svc_RaceDirectors.get called');
                        $scope.raceDirectors = data;
                        $scope.loadingRaceDirectors = false;
                    });

                // need RaceDistances for dropdown list when adding a race
                svc_RaceDistances.get()
                    .success(function(data) {
                        console.log('svc_RaceDistances.get called');
                        $scope.raceDistances = data;
                        $scope.loadingRaceDistances = false;
                    });
            }

            // CREATE ==================================================================
            // when submitting the add form, send the text to the node API
            $scope.createRace = function() {
                console.log('createRace called');
                // validate the raceFormData to make sure that something is there
                // if form is empty, nothing will happen
                if ($scope.raceFormData.name != undefined) {
                    $scope.loadingRaces = true;

                    // call the create function from our service (returns a promise object)
                    svc_Races.create($scope.raceFormData)

                        // if successful creation, call our get function to get all the new races
                        .success(function(data) {
                            $scope.loadingRaces = false;
                            $scope.raceFormData = {}; // clear the form so our user is ready to enter another
                            $scope.races = data; // assign our new list of races
                        });
                }
                else {
                    console.log('Race form is empty');
                }
            };
        }])

    // inject the Race service factory into our controller
    .controller('RaceUpdateCtrl', ['$scope','$http','svc_Races', 'svc_RaceDirectors', 'svc_RaceDistances'
        , function($scope, $http, svc_Races, svc_RaceDirectors, svc_RaceDistances) {
            $scope.raceFormData = {};

            // TODO: do I need all of these variables to manage editing Races?
            $scope.editingRaces = [];
            $scope.editingRacesIndex = 0;
            $scope.isEditingRacesIndex = false;

            init();     // call our init() function to kick things off

            function init() {
                // TODO:  do these methods need to be declared separately (so we can call them outside of init())?
                // GET =====================================================================
                // when landing on the page, get all data
                // use the services to get all the data
                svc_Races.get()
                    .success(function(data) {
                        console.log('svc_Races.get called');
                        $scope.races = data;
                        $scope.loadingRaces = false;
                        //console.log('data = ' + data);
                    });

                // need RaceDirectors for dropdown list when adding a race
                svc_RaceDirectors.get()
                    .success(function(data) {
                        console.log('svc_RaceDirectors.get called');
                        $scope.raceDirectors = data;
                        $scope.loadingRaceDirectors = false;
                    });

                // need RaceDistances for dropdown list when adding a race
                svc_RaceDistances.get()
                    .success(function(data) {
                        console.log('svc_RaceDistances.get called');
                        $scope.raceDistances = data;
                        $scope.loadingRaceDistances = false;
                    });
            }

            // TODO:  *** Need to clean all of this stuff up and add error handling ***
            $scope.callUpdateRace = function(){
                var index = $scope.editingRacesIndex;
                var race = $scope.editingRaces[index];
                console.log(race);
                updateRace(race._id, race, index);
                //$scope.races[index] = angular.copy($scope.editingRaces[index]);
                console.log('$scope.editingRaces[index] = ' + $scope.editingRaces[index]);
                $scope.editingRaces[index] = false;
                $scope.isEditingRacesIndex = false;
                $scope.editingRaces = [];
            };
            $scope.editRace = function(index){
                $scope.editingRaces[$scope.editingRacesIndex] = false;  // cancel the current edit
                $scope.editingRaces[index] = angular.copy($scope.races[index]);
                $scope.editingRacesIndex = index;
                $scope.isEditingRacesIndex = true;
            };
            $scope.cancelEditRace = function(index){
                $scope.races[index] = angular.copy($scope.editingRaces[index]);
                $scope.editingRaces[index] = false;
                $scope.isEditingRacesIndex = false;
                $scope.editingRaces = [];
            };

            // UPDATE ==================================================================
            function updateRace(id, race, index) {
                console.log('updateRace called');
                // validate the raceFormData to make sure that something is there
                // if form is empty, nothing will happen
                $scope.loadingRaces = true;

                // call the create function from our service (returns a promise object)
                svc_Races.update(id, race)

                    // if successful creation, call our get function to get all the new races
                    .success(function(data) {
                        $scope.loadingRaces = false;
                        console.log('index = ' + index);
                        //$scope.races[index] = data;
                        svc_Races.getById(id)
                            .success(function(data) {
                                console.log('svc_Races.getById called');
                                $scope.races[index] = data;
                                $scope.lastEditedRace = data;
                                //console.log('data = ' + data);
                                console.log('lastEditedRace.name = ' + $scope.lastEditedRace.name);
                            });
                        //$scope.races = data;

                    });

            };

            // DELETE ==================================================================
            // delete a race after checking it
            $scope.deleteRace = function(id) {
                $scope.loadingRaces = true;
                console.log('deleteRace called');
                svc_Races.delete(id)
                    // if successful creation, call our get function to get all the new races
                    .success(function(data) {
                        $scope.loadingRaces = false;
                        $scope.races = data; // assign our new list of races
                    });
            };
        }]);

