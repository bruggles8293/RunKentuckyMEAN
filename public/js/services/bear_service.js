angular.module('bearService', [])

	// super simple service
	// Each of the $http functions returns a promise object, so we can deal with the success and error callbacks
	// in the controller.  Could we also do that here??
	.factory('svc_BearsCRUD', ['$http',function($http) {
		return {
			get : function() {
				console.log('bearService.get');
				return $http.get('/api/bears');
			},
			create : function(bearData) {
				console.log('bearService.create');
				return $http.post('/api/bears', bearData);
			},
			delete : function(id) {
				console.log('bearService.delete');
				return $http.delete('/api/bears/' + id);
			},
			getBearTypes : function() {
				var bearTypes = ['Grizzly', 'Brown', 'Teddy'];
				return bearTypes;
			}
		}
	}]);