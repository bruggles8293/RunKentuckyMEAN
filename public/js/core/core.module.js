/**
 * Created by brian on 1/28/2015.
 */
// borrowed from https://github.com/johnpapa/ng-demos/blob/master/modular/src/client/app/core/core.module.js

(function() {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        //'ngAnimate', 'ngRoute', 'ngSanitize',
        /*
         * Our reusable cross app code modules
         */
        'blocks.exception'      //, 'blocks.logger', 'blocks.router',
        /*
         * 3rd Party modules
         */
        //'ngplus'
    ]);
})();