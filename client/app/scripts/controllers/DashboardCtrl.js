(function () {
    'use strict';

    angular
        .module('controllers.Dashboard', [])
        .controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = ['eventHub'];

    function DashboardCtrl (eventHub) {
    	var vm = this;

    	eventHub.scope.$on('user:authenticated', function (evt, data) {
    		vm.data = data;
    	});
    }

})();