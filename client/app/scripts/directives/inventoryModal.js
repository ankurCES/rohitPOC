;
(function(angular) {
    'use strict';

    var app = angular.module('directives.InventoryModal', ['ngModal']);

    app.config(['ngModalDefaultsProvider', function(ngModalDefaultsProvider) {
        ngModalDefaultsProvider.set('closeButtonHtml', '');
    }]);

    app.directive('inventoryModal', InventoryModal);
    InventoryModal.$inject = ['$timeout', 'eventHub'];

    function InventoryModal($timeout, eventHub) {
        return {
            restrict: 'E',
            template: '<modal-dialog show="vm.showModal" dialog-title=""> \
            <div class="ui top attached segment"> \
              <h3>Start Auction</h3> \
            </div> \
            <div class="ui large attached segment form"> \
                <div class="two fields"> \
                    <div class="field"> \
                        <label>Quantity</label> \
                        <input type="text" ng-model="vm.quantity"> \
                    </div> \
                </div> \
                <div ng-click="vm.startAuction()" class="ui submit primary button">Start Auction</div> \
                <div ng-click="vm.cleanAndCloseModal()" class="ui button">Cancel</div> \
                <div ng-show="vm.notAvailable" class="ui message info">There is an auction already in progress.</div> \
                <div ng-show="vm.error" class="ui message red">The quantity or minimum bid invalid.</div> \
            </div> \
            </modal-dialog>',
            scope: '&',
            link: function(scope, element, attrs) {
                var vm = scope.vm;
                vm.error = false;
                vm.cleanAndCloseModal = cleanAndCloseModal;

                cleanAndCloseModal();

                eventHub.scope.$on('inventory:open_auction', function(evt, item) {
                    vm.showModal = true;
                    vm.selectedItem = item;
                });

                vm.startAuction = function() {
                    vm.data.newAuction = {
                        item: vm.selectedItem,
                        quantity: vm.quantity,
                        minimumBid: 1
                    };

                    if (isValidAuction(vm.data.newAuction)) {
                        eventHub.emit('auction: user wish to start', { data: vm.data });
                    } else {
                        vm.error = true;
                    }
                };

                eventHub.on('auction: started', function(res) {
                    cleanAndCloseModal();
                });

                eventHub.on('auction: no auction in progress', function(res) {
                    vm.notAvailable = true;
                    $timeout(cleanAndCloseModal, 2000);
                });


                function cleanAndCloseModal() {
                    vm.showModal = false;
                    vm.quantity = 1;
                    vm.minimum = 1;
                    vm.notAvailable = null;
                    vm.error = false;
                }

                function isValidAuction(auction) {
                    return parseInt(auction.quantity) <= parseInt(auction.item.UserInventory.quantity) &&
                        parseInt(auction.minimumBid) > 0;
                }

            }
        };
    }

})(angular);