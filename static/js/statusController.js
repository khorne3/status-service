(function () {

	'use strict';

	angular.module('app-status')
		.controller('statusController', statusController);

	function statusController($http) {
		var statusUrl = 'api/status';
		var vm = this;
		vm.services = [];

		$http.get(statusUrl).then(function (response) {
			angular.forEach(response.data.services, function (service) {
				this.push(service);
			}, vm.services);
		});

	}

})();
