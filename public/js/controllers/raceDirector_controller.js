/**
 * Created by brian on 1/4/2015.
 */
angular.module('raceDirectorController', [])

    // inject the RaceDirector service factory into our controller
    .controller('raceDirectorController', ['$scope','$http','svc_RaceDirectors', function($scope, $http, svc_RaceDirectors) {
        $scope.raceDirectorFormData = {};
        $scope.loadingRaceDirectors = true;

        // TODO: do I need all of these variables to manage editing RaceDirectors?
        $scope.editingRaceDirectors = [];
        $scope.editingRaceDirectorsIndex = 0;
        $scope.isEditingRaceDirectorsIndex = false;

        init();     // call our init() function to kick things off

        function init() {
            // TODO:  do these methods need to be declared separately (so we can call them outside of init())?
            // GET =====================================================================
            // when landing on the page, get all data
            // use the services to get all the data

            svc_RaceDirectors.get()
                .success(function(data) {
                    console.log('svc_RaceDirectors.get called');
                    $scope.raceDirectors = data;
                    $scope.loadingRaceDirectors = data;
                    //$scope.loading = false;
                });
        }

        // TODO:  *** Need to clean all of this stuff up and add error handling ***
        $scope.callUpdateRaceDirector = function(){
            var index = $scope.editingRaceDirectorsIndex;
            //alert(index);
            //alert($scope.raceDirectors);
            var raceDirector = $scope.editingRaceDirectors[index];
            //Todos.update({id: todo._id}, todo);
            updateRaceDirector(raceDirector._id, raceDirector);
            $scope.raceDirectors[index] = angular.copy($scope.editingRaceDirectors[index]);
            $scope.editingRaceDirectors[index] = false;
            $scope.isEditingRaceDirectorsIndex = false;
            $scope.editingRaceDirectors = [];
        }
        $scope.editRaceDirector = function(index){
            $scope.editingRaceDirectors[$scope.editingRaceDirectorsIndex] = false;  // cancel the current edit
            $scope.editingRaceDirectors[index] = angular.copy($scope.raceDirectors[index]);
            $scope.editingRaceDirectorsIndex = index;
            $scope.isEditingRaceDirectorsIndex = true;
        }
        $scope.cancelEditRaceDirector = function(index){
            $scope.raceDirectors[index] = angular.copy($scope.editingRaceDirectors[index]);
            $scope.editingRaceDirectors[index] = false;
            $scope.isEditingRaceDirectorsIndex = false;
            $scope.editingRaceDirectors = [];
        }

        // UPDATE ==================================================================
        function updateRaceDirector(id, raceDirector) {
            console.log('updateRaceDirector called');
            // validate the raceDirectorFormData to make sure that something is there
            // if form is empty, nothing will happen
            $scope.loadingRaceDirectors = true;

            // call the create function from our service (returns a promise object)
            svc_RaceDirectors.update(id, raceDirector)

                // if successful creation, call our get function to get all the new races
                .success(function(data) {
                    $scope.loadingRaceDirectors = false;
                });

        };
        // CREATE ==================================================================
        // when submitting the add form, send the text to the node API

        $scope.createRaceDirector = function() {
            console.log('createRaceDirector called');
            // validate the raceDirectorFormData to make sure that something is there
            // if form is empty, nothing will happen
            if ($scope.raceDirectorFormData.firstName != undefined) {
                $scope.loadingRaceDirectors = true;

                // call the create function from our service (returns a promise object)
                svc_RaceDirectors.create($scope.raceDirectorFormData)

                    // if successful creation, call our get function to get all the new races
                    .success(function(data) {
                        $scope.loadingRaceDirectors = false;
                        $scope.raceDirectorFormData = {}; // clear the form so our user is ready to enter another
                        $scope.raceDirectors = data; // assign our new list of races
                    });
            }
            else {
                console.log('Race director form is empty');
            }
        };

        // DELETE ==================================================================
        // delete a raceDirector after checking it

    }]);