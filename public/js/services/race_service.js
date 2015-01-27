/**
 * Created by brian on 12/18/2014.
 */
// remember that Services are Singletons that maintains its own state

angular.module('raceService', [])

    // custom cache (versus using $cacheFactory.get('$http'))
    .factory("RacesCache", function ($cacheFactory) {
        return $cacheFactory("RacesCache");
    })

    .factory("UpdatingRaceCache", function ($cacheFactory) {
        return $cacheFactory("UpdatingRaceCache");
    })

    // each function returns a promise object
    //  - because $http functions return promises.  Looks like you don't need $q.defer here
    .factory('RaceService', ['$http', '$q', 'RacesCache', 'UpdatingRaceCache', function ($http, $q, RacesCache, UpdatingRaceCache) {
        // interface
        var raceService = {
            Races: [],
            //TestValues: [],
            //GetTestEditingRace: getTestEditingRace,
            GetRaces: getRaces,
            GetRaceById: getRaceById,
            CreateRace: createRace,
            UpdateRace: updateRace,
            DeleteRace: deleteRace,
            ClearRacesCache: clearRacesCache,
            ClearUpdatingRace: clearUpdatingRace,
            GetRaceDistanceUnits: getRaceDistanceUnits
        };
        return raceService;

        var _currentlyUpdatingRace;

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

        function getRaceById (id, editing) {
            // need to return a promise from this method
            var def = $q.defer();
            console.log('raceService.getRaceById');
            //console.log('editing = ' + editing);
            // TESTING ONLY - if raceService.TestEditingRace is undefined, then set it to the current race
            $http.get('/api/races/' + id)
                .success(function(data) {
                    //console.log('_testEditingRace', _testEditingRace);
                    if (_currentlyUpdatingRace === undefined) {
                        //console.log(racePromise);
                        _currentlyUpdatingRace = data;
                        //console.log('_testEditingRace is now ' + _testEditingRace);
                        //def.resolve(_testEditingRace);
                        //return _testEditingRace;
                    }
                    //else {
                    //    console.log('we are here');
                    //    //return _testEditingRace;
                    //}
                    //console.log(_testEditingRace);

                    // TODO: not sure _currentlyUpdatingRace is what we want to return here, but it may be OK as long as I clear it when necessary
                    def.resolve(_currentlyUpdatingRace);
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

        function clearRacesCache () {
            RacesCache.removeAll();
            //RacesCache.remove('/api/races/');   // TODO: why doesn't this work?
        }

        function clearUpdatingRace () {
            console.log('clearUpdatingRaceCache called');
            _currentlyUpdatingRace = undefined;
        }

        function getRaceDistanceUnits () {
            console.log('raceService.getRaceDistanceUnits');
            var units = ['kilometers', 'miles'];
            return units;
        }
    }]);

