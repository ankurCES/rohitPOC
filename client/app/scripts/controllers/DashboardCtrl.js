(function() {
    'use strict';

    angular
        .module('controllers.Dashboard', [])
        .controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = ['eventHub'];

    function DashboardCtrl(eventHub) {
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