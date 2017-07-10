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
        $('.avatar')
            .popup({
                inline: true,
                hoverable: true,
                position: 'bottom left',
                on: 'click',
                delay: {
                    show: 300,
                    hide: 800
                }
            });
    }

})();