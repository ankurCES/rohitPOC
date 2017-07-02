;(function (angular) {
    'use strict';

    angular
        .module('MainRouter', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.
                when('/pagination/edit/:name', {
                    templateUrl: 'partials/pagination-edit.html',
                    controller: 'PaginationCtrl',
                    controllerAs: 'vm'
                }).
                when('/login', {
                    templateUrl: 'partials/auth.html',
                    controller: 'AuthCtrl',
                    controllerAs: 'vm'
                }).
                when('/admin', {
                    templateUrl: 'partials/adminDashboard.html',
                    controller: 'AdminDashboardCtrl',
                    controllerAs: 'vm'
                }).
                when('/dashboard', {
                    templateUrl: 'partials/dashboard.html',
                    controller: 'DashboardCtrl',
                    controllerAs: 'vm'
                }).
                when('/403', {
                    templateUrl: 'partials/403.html'
                }).
                when('/404', {
                    templateUrl: 'partials/404.html'
                }).
                otherwise({
                    redirectTo: '/login'
                });
            }
        ]);
})(angular);
