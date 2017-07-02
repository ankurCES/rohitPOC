;
(function(angular) {
    'use strict';

    var app = angular.module('directives.Inventory', []);

    app.directive('inventory', Inventory);
    Inventory.$inject = ['eventHub'];

    function Inventory(eventHub) {
        return {
            restrict: 'E',
            template: '<h1 class="ui header">Inventory</h1>\
            <h1 class="ui divider"></h1>\
            <div class="ui relaxed divided items"> \
    <div class="item" ng-repeat="item in vm.data.items"> \
        <div class="ui tiny image"> \
            <img ng-src="images/{{ item.name | lowercase }}.png"> \
        </div>\
        <div class="content">\
            <a class="header">{{ item.name }}</a>\
            <div class="meta">\
                <a>Date</a>\
                <a>Category</a>\
            </div>\
            <div class="description">\
                A description which may flow for several lines and give context to the content.\
            </div>\
            <div class="extra"> \
                <div class="ui right floated">\
                    <button ng-click="vm.openAuction(item)" class="ui primary button"> \
                        <i class="announcement icon" style="font-size:1.5rem"></i> Auction \
                    </button> \
                </div>\
                <div class="ui label"> \
                    Quantity: {{item.UserInventory.quantity}}\
                </div> \
            </div> \
        </div>\
    </div>\
</div>',
            scope: '=',
            link: function(scope, element, attrs) {
                var vm = scope.vm;

                eventHub.on('inventory: show updated inventory list', function(res) {
                    vm.data = res.data;
                });

                vm.openAuction = function(item) {
                    eventHub.scope.$emit('inventory:open_auction', item);
                };
            }
        };
    }

})(angular);