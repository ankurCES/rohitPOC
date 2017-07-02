;(function (angular) {
    'use strict';

    angular
        .module('controllers.Auth', [])
        .controller('AuthCtrl', AuthCtrl);

    AuthCtrl.$inject = ['$rootScope', '$location', 'eventHub'];

    function AuthCtrl ($rootScope, $location, eventHub) {
        var vm = this;

        vm.enter = function () {
            eventHub.socket.connect();
            eventHub.emit('auth: do login by name', {data: vm.user});
        };

        eventHub.on('auth: user is authenticated', function (res) {

            if(res.user.name === 'admin'){
                $location.path('admin');

                $rootScope.$on('$routeChangeSuccess', function () {
                    eventHub.scope.$emit('user:authenticated', res);
                });
            }else{
                $location.path('dashboard');

                $rootScope.$on('$routeChangeSuccess', function () {
                    eventHub.scope.$emit('user:authenticated', res);
                });
            }
        });

        eventHub.on('auth: access denied', function () {
            $location.path('403');
        });

    }

})(angular);
