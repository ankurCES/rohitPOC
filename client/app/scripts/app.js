;(function (angular) {
    'use strict';

    var app = angular.module('MainApp', [
        'MainRouter',
        'btford.socket-io',

        'controllers.Auth',
        'controllers.Main',
        'controllers.Dashboard',
        'controllers.adminDashboard',

        'services.Socket',
        'services.EventHub',

        'directives.PlayerStats',
        'directives.Inventory',
        'directives.InventoryModal',
        'directives.Auction',
        'directives.adminAuction'
    ]);

    app.constant('settings', {
        baseUrl: 'http://localhost:3000/game'
    });

    app.config(['$httpProvider', function ($httpProvider) {
        // CORS
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};
    }]);

})(angular);
