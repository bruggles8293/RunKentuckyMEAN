/**
 * Created by brian on 1/28/2015.
 */
// taken from part of https://github.com/johnpapa/ng-demos/blob/master/modular/src/client/app/core/config.js
// TODO: need to look at John Papa's recommendations on structuring apps.  He uses only a few modules (i.e. app.core)
//          https://github.com/johnpapa/angularjs-styleguide

(function() {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];     // note the different way to inject.
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-top-center';
        toastr.options.closeButton = true;
    }

    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Angular Modular Demo',
        version: '1.0.0'
    };

    core.value('config', config);

})();
