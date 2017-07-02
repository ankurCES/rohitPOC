;(function (angular) {
    'use strict';

    var app = angular.module('directives.Inventory', []);

    app.directive('inventory', Inventory);
    Inventory.$inject = ['eventHub'];

    function Inventory (eventHub) {
        return {
            restrict: 'E',
            template: '<div class="ui secondary segments" style="height:430px"> \
                <div class="ui center aligned segment"> \
                    <h2 class="ui header">Inventory</h2> \
                </div> \
                <div class="ui segment" style="padding:0"> \
                    <div class="ui three column centered grid vertical segment" style="margin:0" ng-repeat="item in vm.data.items"> \
                        <div class="three column center aligned"> \
                            <img ng-src="images/{{ item.name | lowercase }}.png" width="64" height="64"> \
                            <div>{{ item.name }}</div> \
                        </div> \
                        <div class="three column middle center aligned" style="margin-top:20px"> \
                            <div class="ui mini statistic"> \
                                <div class="label">Quantity</div> \
                                <div class="value">{{ item.UserInventory.quantity }}</div> \
                            </div> \
                        </div> \
                        <div class="three column middle center aligned" style="margin-top:15px"> \
                            <button ng-click="vm.openAuction(item)" class="ui primary button"> \
                                <i class="announcement icon" style="font-size:1.5rem"></i> Auction \
                            </button> \
                        </div> \
                    </div> \
                </div> \
            </div>',
            scope: '=',
            link: function (scope, element, attrs) {
                var vm = scope.vm;

                eventHub.on('inventory: show updated inventory list', function (res) {
                    vm.data = res.data;
                });

                vm.openAuction = function (item) {
                    eventHub.scope.$emit('inventory:open_auction', item);
                };
            }
        };
    }

})(angular);
