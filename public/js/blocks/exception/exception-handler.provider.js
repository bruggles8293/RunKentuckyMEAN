/**
 * Created by brian on 1/28/2015.
 */
/** from John Papa example - https://github.com/johnpapa/angularjs-styleguide#exception-handling
 *  much more detailed version here - https://github.com/johnpapa/ng-demos/tree/master/modular/src/client/app/blocks/exception
 * */

 angular
    .module('blocks.exception')
    .config(exceptionConfig);

exceptionConfig.$inject = ['$provide'];     // note the different way to inject.

function exceptionConfig($provide) {
    $provide.decorator('$exceptionHandler', extendExceptionHandler);
}

extendExceptionHandler.$inject = ['$delegate', 'toastr'];

function extendExceptionHandler($delegate, toastr) {
    return function(exception, cause) {
        $delegate(exception, cause);        // allow error to fall through to default implementation ($exceptionHandler)
        console.log('exception', exception);
        var errorData = {
            exception: exception,
            cause: cause
        };
        /**
         * Could add the error to a service's collection,
         * add errors to $rootScope, log errors to remote web server,
         * or log locally. Or throw hard. It is entirely up to you.
         * throw exception;
         */
        toastr.error(exception.message, errorData);
    };
}
