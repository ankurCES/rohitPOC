;
(function(angular) {
    'use strict';

    var app = angular.module('directives.PlayerStats', []);

    app.directive('playerstats', PlayerStats);
    PlayerStats.$inject = ['$location', '$timeout', 'eventHub'];

    function PlayerStats($location, $timeout, eventHub) {
        return {
            restrict: 'E',
            template: ' <div class="column">\
                            <h4 class="ui header">{{ vm.data.user.name }}</h4>\
                            <div class="ui mini horizontal statistic"> \
                                <div class="value">\
                                {{ vm.data.user.coins }}\
                                </div>\
                                <div class="label">\
                                Coins\
                                </div>\
                            </div>\
                            <br>\
                            <div class="ui float-right button red tiny" ng-click="vm.logout()" >Logout</div>\
                        </div>',
            scope: '=',
            link: function(scope, element, attrs) {
                var vm = scope.vm;

                vm.logout = function() {
                    eventHub.socket.disconnect();
                };

                eventHub.on('disconnect', function() {
                    $location.path('auth');
                });

                eventHub.on('user: update seller and winner data', function(res) {
                    eventHub.scope.$emit('user:authenticated', res);
                });

                eventHub.on('auction: finished and have a winner', function(res) {
                    var name = vm.data.user.name;

                    if (name === res.winner) {
                        vm.showCongratulations = true;
                        $timeout(function() {
                            vm.showCongratulations = false;
                        }, 2000);
                    }
                    if (name === res.seller || name === res.winner) {
                        eventHub.emit('user: retrieve updated seller and winner data', name);
                    }
                });
            }
        };
    }

})(angular);