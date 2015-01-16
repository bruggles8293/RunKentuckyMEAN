angular.module('bearController', [])

	// inject the Bear service factory into our controller
	.controller('mainBearController', ['$scope','$http','svc_BearsCRUD', function($scope, $http, svc_BearsCRUD) {
		$scope.formData = {};
		$scope.loading = true;

		init();

		function init() {
			// GET =====================================================================
			// when landing on the page, get all bears and show them
			// use the service to get all the bears
			svc_BearsCRUD.get()
				.success(function(data) {
					console.log('Bears.get called');
					//$scope.$log = $log;
					//$scope.message = 'Bears.get() called';
					$scope.bears = data;
					$scope.loading = false;
				});

			// also, load the BearTypes
			$scope.bearTypes = svc_BearsCRUD.getBearTypes();
		}

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createBear = function() {
			console.log('createBear called');
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.name != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				svc_BearsCRUD.create($scope.formData)

					// if successful creation, call our get function to get all the new bears
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.bears = data; // assign our new list of bears
					});
			}
			else {
				console.log('form is empty');
			}
		};

		// DELETE ==================================================================
		// delete a bear after checking it
		$scope.deleteBear = function(id) {
			$scope.loading = true;
			console.log('deleteBear called');
			svc_BearsCRUD.delete(id)
				// if successful creation, call our get function to get all the new bears
				.success(function(data) {
					$scope.loading = false;
					$scope.bears = data; // assign our new list of bears
				});
		};
		// MISC ====================================================================


	}]);