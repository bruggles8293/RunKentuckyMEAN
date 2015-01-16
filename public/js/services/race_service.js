/**
 * Created by brian on 12/18/2014.
 */
angular.module('raceService', [])

    // super simple service
    // each function returns a promise object
    //  - because $http functions return promises.  Looks like you don't need $q.defer here
    .factory('svc_Races', ['$http', function($http) {
        return {
            get : function() {
                console.log('raceService.get');
                return $http.get('/api/races');
            },
            getById : function(id) {
                console.log('raceService.get');
                return $http.get('/api/races/' + id);
                /*
                // can also do this, so you don't have to do something like data.data in the controller
                 return $http.get('/api/races/' + id).then(function(result) {
                    return result.data;
                 }
                */

                /*
                // looks like the below code is not necessary for deferreds to work
                var deferred = q$.defer();
                $http.get('/api/races/' + id)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function() {
                        deferred.reject("Failed to get race with id of " + id);
                    });
                return deferred.promise;
                */

            },
            create : function(raceData) {
                console.log('raceService.create');
                return $http.post('/api/races', raceData);
            },
            update : function(id, raceData) {
                console.log('raceService.update ' + 'id = ' + id);
                console.log(raceData);
                return $http.put('/api/races/' + id, raceData);
            },
            delete : function(id) {
                console.log('raceService.delete');
                return $http.delete('/api/races/' + id);
            },
            getRaceDistanceUnits : function() {
                console.log('raceService.getRaceDistanceUnits');
                var units = ['kilometers', 'miles'];
                return units;
            }
        }
    }])

