/**
 * Created by brian on 1/28/2015.
 */
// borrowed from https://github.com/johnpapa/ng-demos/blob/master/modular/src/client/app/core/constants.js

/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        //.constant('moment', moment)
        .constant('toastr', toastr);
})();
