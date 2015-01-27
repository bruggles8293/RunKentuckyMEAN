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
    .controller('RacesListCtrl', ['RaceService', 'svc_RaceDirectors', 'svc_RaceDistances'
        , 'races', 'raceDirectors', 'raceDistances', '$state'
        , function(RaceService, svc_RaceDirectors, svc_RaceDistances
            , races, raceDirectors, raceDistances, $state) {

            // using controllerAs, so I use 'this' instead of '$scope'
            // if I need to inject $scope (for $broadcast or watches, for example), I can
            // maybe do a 'var vm = this;', then use vm throughout?
            this.loadingRaces = true;
            //$scope.loadingRaceDirectors = true;       // might need this here

            // see this link to understand why we're creating a $scope reference to RaceService:
            // http://stsc3000.github.io/blog/2013/10/26/a-tale-of-frankenstein-and-binding-to-service-values-in-angular-dot-js/
            this.raceService = RaceService;
            console.log('this.raceService.Races', this.raceService.Races);

            // we really don't need to inject the 'races' data into the routes since by calling the service in the router we
            // populate RaceService.Races - except that ensures that our race data has been populated before the route fires

            // assign the '' and '' being injected into the controller (from services via routing) to the $scope variables
            // TODO:  we'll eventually structure those services like RaceService
            //console.log('raceDirectors', raceDirectors);
            this.raceDirectors = raceDirectors.data;
            this.raceDistances = raceDistances.data;

            //init();     // call our init() function to kick things off

            this.updateRace = function(raceId) {
                console.log('raceId', raceId);
                RaceService.ClearUpdatingRace();
                $state.go('app.races.raceUpdate', {"raceId": raceId});
            };

            //test function for our button
            this.getRaces = function() {
                RaceService.GetRaces()
                    .then(function(data) {
                        console.log('RaceService.getRaces called (and deferred returned) by RaceViewCtrl');
                        console.log('RaceService.testValues = ' + RaceService.TestValues);
                        console.log('RaceService.races = ' + RaceService.Races);
                        //console.log(RaceService.races);
                        // I want to reference the property of the service, NOT the return value of the function,
                        // because we want to maintain state in the service, not the controller
                        this.races = RaceService.Races;
                        // we can use '$scope.races = data.data' if needed, but we want to maintain state in the controller
                        //$scope.races = data.data;
                        this.loadingRaces = false;
                        //console.log(data);      // note that the races (data) is also coming back from the promise.
                    });
            }
            function init() {
                // TODO:  do these methods need to be declared separately (so we can call them outside of init())?
                // GET =====================================================================
                // when landing on the page, get all data
                // use the services to get all the data
                RaceService.GetRaces()
                    .then(function() {
                        console.log('RaceService.GetRaces called');
                        this.races = RaceService.Races;
                        this.loadingRaces = false;
                        //console.log('data = ' + data);
                    });

                // need RaceDirectors for dropdown list when adding a race
                svc_RaceDirectors.get()
                    .success(function(data) {
                        console.log('svc_RaceDirectors.get called');
                        this.raceDirectors = data;
                        this.loadingRaceDirectors = false;
                    });

                // need RaceDistances for dropdown list when adding a race
                svc_RaceDistances.get()
                    .success(function(data) {
                        console.log('svc_RaceDistances.get called');
                        this.raceDistances = data;
                        this.loadingRaceDistances = false;
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
    .controller('RaceUpdateCtrl', ['$scope', '$q', '$stateParams'
                    , 'RaceService', 'svc_RaceDirectors', 'svc_RaceDistances'
                    , 'race', 'raceDirectors', 'raceDistances', 'testValue'
        , function($scope, $q, $stateParams
                    , RaceService, svc_RaceDirectors, svc_RaceDistances
                    , race, raceDirectors, raceDistances, testValue) {

            // I AM injecting $scope here, because I'm using it for a watch below.  Remove $scope if/when I get rid of the watch
            this.raceFormData = {};
            this.raceId = $stateParams.raceId;
            console.log('$stateParams', $stateParams);
            this.validationErrors = [];

            //$scope.loadingData = false;

            //console.log('testValue = ' + testValue);
            console.log('race', race);
            //console.log('raceDirectors', raceDirectors);
            //console.log('raceDistances', raceDistances);

            // ****************************************************************************************************
            // we're using this (injecting data into the controller from the route) instead of calling the
            // services once we enter the page.  This allows our controller to be in a ready state as soon
            // as the view is loaded.  See link below for info.
            // http://www.dwmkerr.com/promises-in-angularjs-the-definitive-guide/#advancedpromisesrouting
            // ****************************************************************************************************
            this.race = race;
            this.raceDirectors = raceDirectors.data;
            this.raceDistances = raceDistances.data;

            // example of a single $watch
            /*
            $scope.$watch('race.raceDistance._id', function(newVal, oldVal) {
                if(newVal) {
                    // if there is some selected (other than the 'other' value), clear out other distance and units
                    $scope.race.otherRaceDistanceAmount = '';
                    $scope.race.otherRaceDistanceUnits = '';
                    $scope.validationErrors = [];
                }
                else {
                    $scope.validationErrors.push("Remember to add your non-standard distance");
                }
                $scope.showValidationErrors = $scope.validationErrors.length;

            })
            */

            // probably need to use $validate here.  Must be a better way to keep a list if form validations
            $scope.$watchGroup(['raceUpdateCtrl.race.raceDistance._id', 'raceUpdateCtrl.race.otherRaceDistanceAmount', 'raceUpdateCtrl.race.otherRaceDistanceUnits']
                , function (newValues, oldValues, scope) {
                    var ctrl = scope.raceUpdateCtrl;
                    //console.log('newValues', newValues);
                    //console.log('oldValues', oldValues);
                    if(newValues[0]) {
                        // if there is some race distance selected (other than the 'other' value), clear out other distance and units
                        ctrl.race.otherRaceDistanceAmount = '';
                        ctrl.race.otherRaceDistanceUnits = '';
                        ctrl.validationErrors = [];
                    }
                    else {
                        // they've selected 'Other' for race distance
                        if (newValues[1] && newValues[2]) {
                            // if both other distance and units have been entered
                            ctrl.validationErrors = [];
                        }
                        else {
                            if (ctrl.validationErrors.length == 0)
                                // only add a validation if there are none currently (can't add more than one of the same)
                                ctrl.validationErrors.push("Remember to add your non-standard distance");
                        }
                    }
                    ctrl.showValidationErrors = ctrl.validationErrors.length;
                    console.log('ctrl.validationErrors', ctrl.validationErrors)
            });
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
                var getByIdPromise = RaceService.GetById($scope.raceId);
                getByIdPromise.then(function(httpData) {
                    console.log('RaceService.GetById called');
                    this.race = httpData.data;
                    //console.log(httpData);
                    //$scope.loadingRace = false;

                }, function(err) {
                    alert("Error: " + err.data);
                    console.log(err.data);
                    // we'll set loadingData to false, but we need to do something else, because we can't update a Race if this happens
                    // note that if I throw an error in routes.js, that will get bubbled up to here, and this promise won't resolve.
                    //$scope.loadingData = false;
                });

                // need RaceDirectors for dropdown list when adding a race
                var raceDirectorsGetPromise = svc_RaceDirectors.get();
                raceDirectorsGetPromise.then(function(httpData) {
                    console.log('svc_RaceDirectors.get called');
                    //console.log(data);
                    this.raceDirectors = httpData.data;
                    this.loadingRaceDirectors = false;
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
                    this.raceDistances = httpData.data;
                    this.loadingRaceDistances = false;
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
                    //$scope.loadingData = false;
                });
            }

            // TODO:  *** Need to clean all of this stuff up and add error handling ***
            this.callUpdateRace = function(){
                updateRace(this.raceId, this.race);
            };

            // UPDATE ==================================================================
            function updateRace(id, race) {
                console.log('updateRace called');
                // validate the raceFormData to make sure that something is there
                // if form is empty, nothing will happen
                this.loadingRaces = true;

                // call the create function from our service (returns a promise object)
                RaceService.UpdateRace(id, race)

                    // if successful creation, clear cache
                    .success(function(data) {
                        this.loadingRaces = false;
                        RaceService.ClearAllRaceCache();
                        //$scope.races[index] = data;
                        /*
                        RaceService.GetRaceById(id)
                            .success(function(data) {
                                console.log('RaceService.GetRaceById called');
                                $scope.race = data;
                            });
                        */
                    })
                    .error(function() {
                        // update failed, so reload the race
                        RaceService.GetRaceById(id)
                            .success(function(data) {
                                console.log('RaceService.GetRaceById called');
                                this.race = data;
                            });
                });
            };

            // DELETE ==================================================================
            // delete a race after checking it
            this.deleteRace = function(id) {
                this.loadingRaces = true;
                console.log('deleteRace called');
                RaceService.Delete(id)
                    // if successful creation, call our get function to get all the new races
                    .success(function(data) {
                        this.loadingRaces = false;
                        this.races = data; // assign our new list of races
                    });
            };
        }]);

