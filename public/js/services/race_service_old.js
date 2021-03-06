/**
 * Created by brian on 12/18/2014.
 */
angular.module('raceService', [])

    // super simple service
    // each function returns a promise object
    .factory('svc_Races', ['$http',function($http) {
        return {
            get : function() {
                console.log('raceService.get');
                return $http.get('/api/races');
            },
            getById : function(id) {
                console.log('raceService.get');
                return $http.get('/api/races/' + id);
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

