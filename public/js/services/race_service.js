/**
 * Created by brian on 12/18/2014.
 */
// remember that Services are Singletons that maintains its own state

angular.module('raceService', [])

    // custom cache (versus using
    .factory("RacesCache", function ($cacheFactory) {
        return $cacheFactory("RacesCache");
    })

    // each function returns a promise object
    //  - because $http functions return promises.  Looks like you don't need $q.defer here
    .factory('RaceService', ['$http', '$q', 'RacesCache', function ($http, $q, RacesCache) {
        // interface
        var raceService = {
            Races: [],
            //TestValues: [],
            GetTestEditingRace: getTestEditingRace,
            GetRaces: getRaces,
            GetRaceById: getRaceById,
            CreateRace: createRace,
            UpdateRace: updateRace,
            DeleteRace: deleteRace,
            ClearAllRaceCache: clearAllRaceCache,
            GetRaceDistanceUnits: getRaceDistanceUnits
        };
        return raceService;

        var _testEditingRace;

        // implementation
        function getRaces() {
            var def = $q.defer();
            console.log('raceService.getRaces');
            //racesCache.removeAll();
            $http.get('/api/races', {
                cache: RacesCache
                , method: 'get'
            })
                .success(function (data) {
                    raceService.Races = data;
                    raceService.TestValues = ['test3', 'test4'];    // this will work even if not declared above
                    //console.log(raceService.Races);
                    def.resolve(data);
                })
                .error(function (err) {
                    console.log('err', err);
                    def.reject(err.message);
                });
            return def.promise;
        }

        function getTestEditingRace() {
            return _testEditingRace;
        }
        function getRaceById (id, editing) {
            // need to return a promise from this method
            var def = $q.defer();
            console.log('raceService.getRaceById');
            //console.log('editing = ' + editing);
            // TESTING ONLY - if raceService.TestEditingRace is undefined, then set it to the current race
            $http.get('/api/races/' + id)
                .success(function(data) {
                    //console.log('_testEditingRace', _testEditingRace);
                    if (_testEditingRace === undefined) {
                        //console.log(racePromise);
                        _testEditingRace = data;
                        //console.log('_testEditingRace is now ' + _testEditingRace);
                        //def.resolve(_testEditingRace);
                        //return _testEditingRace;
                    }
                    //else {
                    //    console.log('we are here');
                    //    //return _testEditingRace;
                    //}
                    //console.log(_testEditingRace);
                    def.resolve(_testEditingRace);
            });
            return def.promise;

            /*
            if (editing == true) {
                console.log('editing is true');
                var def = $q.defer();
                def.resolve(_testEditingRace);
                return def.promise;
            }
            else {
                console.log('editing is false');
                //var racePromise = $http.get('/api/races/' + id);
                //racePromise.then(function(httpData) {
                    return racePromise;
                //});
            }
            //return $http.get('/api/races/' + id);
            */
        }

        function createRace (raceData) {
            console.log('raceService.create');
            return $http.post('/api/races', raceData);
        }

        function updateRace (id, raceData) {
            console.log('raceService.update ' + 'id = ' + id);
            console.log(raceData);
            //var cache = $cacheFactory.get('$http');
            //var racesCache = cache.get('http://localhost:8080/races');
            //console.log(racesCache);
            //cache.removeAll();
            //racesCache = cache.get('http://localhost:8080/races');
            //console.log(racesCache);
            return $http.put('/api/races/' + id, raceData);
        }

        function deleteRace (id) {
            console.log('raceService.delete');
            return $http.delete('/api/races/' + id);
        }

        function clearAllRaceCache () {
            RacesCache.removeAll();
            //RacesCache.remove('/api/races/');   // TODO: why doesn't this work?
        }

        function getRaceDistanceUnits () {
            console.log('raceService.getRaceDistanceUnits');
            var units = ['kilometers', 'miles'];
            return units;
        }
    }]);

