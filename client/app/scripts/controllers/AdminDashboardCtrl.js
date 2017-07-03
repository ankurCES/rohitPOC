(function() {
    'use strict';

    angular
        .module('controllers.adminDashboard', [])
        .controller('AdminDashboardCtrl', AdminDashboardCtrl);

    AdminDashboardCtrl.$inject = ['eventHub'];

    function AdminDashboardCtrl(eventHub) {
        var vm = this;

        eventHub.scope.$on('user:authenticated', function(evt, data) {
            vm.data = data;
        });
        $('.button')
            .popup({
                popup: '.special.popup'
            });
    }

})();