/**
 * Created by brian on 12/19/2014.
 */
// public/js/appRoutes.js
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        // ----------------- bears -----------------------
        // bears page that will use the mainBearController
        .when('/bears', {
            templateUrl: 'views/bears.html',
            controller: 'mainBearController'
        })

        // ----------------- races -----------------------
        // races page that will use the RaceController
        .when('/races', {
            templateUrl: 'views/races.html',
            controller: 'RaceViewCtrl',
            resolve: {
                races: ['$route', 'RaceService', function($route, RaceService) {
                    return RaceService.GetRaces();
                }],
                raceDirectors: ['svc_RaceDirectors', function(svc_RaceDirectors) {
                    return svc_RaceDirectors.get();
                }],
                raceDistances: ['svc_RaceDistances', function(svc_RaceDistances) {
                    return svc_RaceDistances.get();
                }]
            }
        })

        // race page (viewing one race)
        .when('/races/:raceId', {
            templateUrl: 'views/race.html',
            controller: 'RaceViewCtrl'        // different controller?
        })

        // race create page
        .when('/races/create', {
            templateUrl: 'views/race_create.html',
            controller: 'RaceCreateCtrl'
        })

        // race update page
        .when('/races/:raceId/update', {
            templateUrl: 'views/race_update.html',
            controller: 'RaceUpdateCtrl',
            // can also use 'resolve:' here, which allows you to add promises that must resolve successfully before the route will change.
            // consider creating a controller that pulls back all data needed here and calling it, which will cut down on the code in resolve:
            // - http://odetocode.com/blogs/scott/archive/2014/05/20/using-resolve-in-angularjs-routes.aspx
            // we're going to inject the race, the raceDirectors, and the raceDistances.
            resolve: {
                race: ['$route', 'RaceService', function($route, RaceService) {
                    //console.log('$route.current.params.raceId is ' + $route.current.params.raceId);
                    return RaceService.GetRaceById($route.current.params.raceId, true);
                }],
                raceDirectors: ['svc_RaceDirectors', function(svc_RaceDirectors) {
                    return svc_RaceDirectors.get();
                }],
                raceDistances: ['svc_RaceDistances', function(svc_RaceDistances) {
                    return svc_RaceDistances.get();
                }],
                testValue: function() {
                    // this is just a test
                    return 'here is a value';
                }
            }
        })

        // ----------------- race directors -----------------------
        // raceDirectors page that will use the RaceController
        .when('/raceDirectors', {
            templateUrl: 'views/raceDirectors.html',
            controller: 'raceDirectorController'
        })

        // ----------------- otherwise -----------------------
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
}]);