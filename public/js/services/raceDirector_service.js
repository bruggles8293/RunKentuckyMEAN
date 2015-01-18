/**
 * Created by brian on 1/4/2015.
 */
angular.module('raceDirectorService', [])
    .factory('svc_RaceDirectors', ['$http', '$timeout', function($http, $timeout) {
        return {
            get : function() {
                //console.log('raceDirectorService.get');
                return $http.get('/api/raceDirectors');
                /*
                // here, just delaying the return of the promise so that we can more easily test $q.all in the controller
                return $timeout(function() {
                    return $http.get('/api/raceDirectors');
                }, 5000)
                */
            },
            create : function(raceDirectorData) {
                console.log('raceDirectorService.create');
                //return $http.post('/api/raceDirectors', raceDirectorData);
            },
            update : function(id, raceDirectorData) {
                //console.log('raceDirectorService.update ' + 'id = ' + id);
                //console.log(raceDirectorData);
                return $http.put('/api/raceDirectors/' + id, raceDirectorData);
            },
            delete : function(id) {
                //console.log('raceDirectorService.delete');
                return $http.delete('/api/raceDirectors/' + id);
            }
        }
    }]);