;(function (angular) {
    'use strict';

    angular
        .module('services.EventHub', [])
        .factory('eventHub', EventHub);

    EventHub.$inject = ['$rootScope', 'socket'];

    function EventHub ($rootScope, socket) {
        
        var self = this;
        self.scope = $rootScope.$new();

        self.socket = socket;

        self.emit = socket.emit;
        self.on = socket.on;

        return this;

    }

})(angular);
