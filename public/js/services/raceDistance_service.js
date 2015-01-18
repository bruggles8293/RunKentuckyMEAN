/**
 * Created by brian on 1/9/2015.
 */
angular.module('raceDistanceService', [])
    .factory('svc_RaceDistances', ['$http',function($http) {
        return {
            get : function() {
                //console.log('raceDistanceService.get');
                return $http.get('/api/raceDistances');
            },
            create : function(raceDistanceData) {
                //console.log('raceDistanceService.create');
                return $http.post('/api/raceDistances', raceDistanceData);
            },
            update : function(id, raceDistanceData) {
                //console.log('raceDistanceService.update ' + 'id = ' + id);
                //console.log(raceDistanceData);
                return $http.put('/api/raceDistances/' + id, raceDistanceData);
            },
            delete : function(id) {
                //console.log('raceDistanceService.delete');
                return $http.delete('/api/raceDistance/' + id);
            }
        }
    }]);
