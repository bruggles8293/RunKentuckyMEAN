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
        $scope.loadingRaces = true;
        //$scope.loadingRaceDirectors = true;       // might need this here

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
    }])

    // inject the Race service factory into our controller
    .controller('RaceCreateCtrl', ['$scope','$http', 'svc_Races', 'svc_RaceDirectors', 'svc_RaceDistances'
        , function($scope, $http, svc_Races, svc_RaceDirectors, svc_RaceDistances) {
            $scope.raceFormData = {};

            init();     // call our init() function to kick things off

            function init() {
                // TODO:  do these methods need to be declared separately (so we can call them outside of init())?
                // GET =====================================================================
                // when landing on the page, get all data
                // use the services to get all the data

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
    .controller('RaceUpdateCtrl', ['$scope','$http', '$q', '$routeParams'
                    , 'svc_Races', 'svc_RaceDirectors', 'svc_RaceDistances'
                    , 'race', 'raceDirectors', 'raceDistances', 'testValue'
        , function($scope, $http, $q, $routeParams
                    , svc_Races, svc_RaceDirectors, svc_RaceDistances
                    , race, raceDirectors, raceDistances, testValue) {
            $scope.raceFormData = {};
            $scope.raceId = $routeParams.raceId;
            $scope.loadingData = true;

            //console.log('testValue = ' + testValue);
            //console.log('race = ' + race.data);

            // ****************************************************************************************************
            // we're using this (injecting data into the controller from the route) instead of calling the
            // services once we enter the page.  This allows our controller to be in a ready state as soon
            // as the view is loaded.  See link below for info.
            // http://www.dwmkerr.com/promises-in-angularjs-the-definitive-guide/#advancedpromisesrouting
            // ****************************************************************************************************
            $scope.race = race.data;
            $scope.raceDirectors = raceDirectors.data;
            $scope.raceDistances = raceDistances.data;

            // THEREFORE, WE'RE NOT CALLING INIT() ANYMORE
            //init();     // call our init() function to kick things off

            function init() {
                // TODO:  do these methods need to be declared separately (so we can call them outside of init())?
                // GET =====================================================================
                // when landing on the page, get all data
                // use the services to get all the data

                // for the promises here, it looks like you don't need $q to create deferreds - seems like it's done for you,
                // because I can use then() and $q.all()
                // ****************************************************************************************************
                // even though we're injecting the data into the controller from the route now, keep this promise code
                // so I'll remember how to use it.  Will probably need to use it other places.
                // ****************************************************************************************************

                // get the details of the Race
                var getByIdPromise = svc_Races.getById($scope.raceId);
                getByIdPromise.then(function(httpData) {
                    console.log('svc_Races.getById called');
                    $scope.race = httpData.data;
                    //console.log(httpData);
                    //$scope.loadingRace = false;

                }, function(err) {
                    alert("Error: " + err.data);
                    console.log(err.data);
                    // we'll set loadingData to false, but we need to do something else, because we can't update a Race if this happens
                    //$scope.loadingData = false;
                });

                // need RaceDirectors for dropdown list when adding a race
                var raceDirectorsGetPromise = svc_RaceDirectors.get();
                raceDirectorsGetPromise.then(function(httpData) {
                    console.log('svc_RaceDirectors.get called');
                    //console.log(data);
                    $scope.raceDirectors = httpData.data;
                    $scope.loadingRaceDirectors = false;
                }, function(err) {
                    alert("Error: " + err.data);
                    console.log(err.data);
                    // we'll set loadingData to false, but we need to do something else, because we can't update a Race if this happens
                    //$scope.loadingData = false;
                });

                // need RaceDistances for dropdown list when adding a race
                var raceDistancesGetPromise = svc_RaceDistances.get();
                raceDistancesGetPromise.then(function(httpData) {
                    console.log('svc_RaceDistances.get called');
                    $scope.raceDistances = httpData.data;
                    $scope.loadingRaceDistances = false;
                }, function(err) {
                    alert("Error: " + err.data);
                    console.log(err.data);
                    // we'll set loadingData to false, but we need to do something else, because we can't update a Race if this happens
                    //$scope.loadingData = false;
                });

                $q.all([getByIdPromise, raceDirectorsGetPromise, raceDistancesGetPromise]).then(function(result) {
                    // ** do whatever we want done here when all of the data loads successfully
                    //alert('all done');
                    //console.log('all done');
                    $scope.loadingData = false;
                });
            }

            // TODO:  *** Need to clean all of this stuff up and add error handling ***
            $scope.callUpdateRace = function(){
                updateRace($scope.raceId, $scope.race);
            };

            // UPDATE ==================================================================
            function updateRace(id, race) {
                console.log('updateRace called');
                // validate the raceFormData to make sure that something is there
                // if form is empty, nothing will happen
                $scope.loadingRaces = true;

                // call the create function from our service (returns a promise object)
                svc_Races.update(id, race)

                    // if successful creation, call our get function to get all the new races
                    .success(function(data) {
                        $scope.loadingRaces = false;
                        //$scope.races[index] = data;
                        svc_Races.getById(id)
                            .success(function(data) {
                                console.log('svc_Races.getById called');
                                $scope.race = data;
                            });
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
