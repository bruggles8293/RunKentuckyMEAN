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
            controller: 'RaceViewCtrl'
        })

        // race page (viewing one race)
        .when('/races/:raceId', {
            templateUrl: 'views/race.html',
            controller: 'RaceViewCtrl'        // different controller?
        })

        // race create page
        .when('/races/create', {
            templateUrl: 'views/race_create.html',
            controller: 'RaceCreateCtrl'        // different controller
            // can also use resolve: here, which allows you to
        })

        // race update page
        .when('/races/:raceId/update', {
            templateUrl: 'views/race_update.html',
            controller: 'RaceUpdateCtrl'        // different controller
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