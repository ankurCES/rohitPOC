;(function (angular) {
    'use strict';

    angular
        .module('services.Socket', [])
        .factory('socket', SocketService);

    SocketService.$inject = ['settings', 'socketFactory'];

    function SocketService (settings, socketFactory) {
        var myIoSocket = io.connect(settings.baseUrl, {reconnectionDelay: 3000});

        return socketFactory({
            ioSocket: myIoSocket
        });

    }

})(angular);
