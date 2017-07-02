;(function (angular) {
    'use strict';

    angular
        .module('controllers.Main', [])
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$location', 'socket'];

    function MainCtrl ($location, socket) {
        socket.on('connect_error', function () {
            $location.path('404');
        });

        socket.on('connect', function () {
            $location.path('login');
        });

    }

})(angular);
 