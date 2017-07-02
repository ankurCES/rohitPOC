;(function (angular) {
    'use strict';

    var app = angular.module('directives.adminAuction', []);

    app.directive('adminAuction', adminAuction);
    adminAuction.$inject = ['eventHub'];

    function adminAuction (eventHub) {
        return {
            restrict: 'E',
            template: '<div class="ui secondary segments" style="height:430px"> \
                <div class="ui center aligned segment"> \
                    <h2 class="ui header">Current Auctions</h2> \
                </div> \
                <div class="ui segment" ng-hide="vm.currentAuction"> \
                    <div class="ui info message">No auctions in progress</div> \
                </div> \
                <div class="ui segment" ng-show="vm.currentAuction"> \
                    <div><b>Seller:</b> {{ vm.currentAuction.user.name }}</div> \
                    <div class="ui horizontal basic segments" style="border:0;box-shadow:none"> \
                        <div class="ui basic segment center aligned"> \
                            <img src="images/{{ vm.currentAuction.item.name | lowercase }}.png" width="64" height="64"> \
                            <div>{{ vm.currentAuction.item.name }}</div> \
                        </div> \
                        <div class="ui basic segment center aligned"> \
                            <div class="ui mini statistic" style="margin-top:15px"> \
                                <div class="label">Quantity</div> \
                                <div class="value">{{ vm.currentAuction.quantity }}</div> \
                            </div> \
                        </div> \
                    </div> \
                    <div ng-hide="vm.isReport"><b>Time left:</b> {{ vm.timeRemaining }}s</div> \
                    <div ng-show="vm.currentAuction.winner.name && vm.isReport"><b>Winner:</b> {{ vm.currentAuction.winner.name }}</div> \
                    <div><b>Winning bid:</b> {{ vm.currentAuction.winningBid }}</div> \
                    <div><b>Maximum bid:</b> {{ vm.currentAuction.maxBid }}</div> \
                    <div ng-hide="vm.currentAuction.user.name == vm.data.user.name" class="ui basic segment center aligned"> \
                        <div class="ui form"><div class="inline fields"> \
                            <div class="field"><label>Your bid:</label></div> \
                            <div class="field" style="width:70%"><input ng-model="vm.currentAuction.bid"></div> \
                        </div></div \
                        <div style="margin-top:20px"> \
                            <button ng-click="vm.placeBid()" class="ui primary button">Place bid</button> \
                        </div> \
                    </div> \
                </div> \
            </div>',
            scope: '&',
            link: function (scope, element, attrs) {
                var vm = scope.vm;
                vm.timeRemaining = 90;

                vm.placeBid = function () {
                    var user = vm.data.user;
                    var auction = vm.currentAuction;

                    if (isEnoughMoney(user, auction)) {
                        user.coins -= auction.bid;
                        var data = {
                            user: user,
                            auction: auction
                        };
                        eventHub.emit('auction: someone place bid', {data: data});
                    }
                };

                eventHub.on('auction: started', function (res) {
                    vm.currentAuction = res.data;
                    if (res.data) {
                        vm.currentAuction.bid = calculateBidValue(vm.currentAuction);
                    }
                });

                eventHub.on('auction: show the countdown', function (res) {
                    vm.timeRemaining = res;
                });

                eventHub.on('auction: show who is the winner', function (res) {
                    var data = res.data;
                    vm.timeRemaining = data.timeRemaining;
                    vm.isReport = true;
                    vm.currentAuction.winner = data.winner;
                    vm.currentAuction.winningBid = data.winningBid;
                });

                eventHub.emit('auction: is there any auction in progress?');

                function calculateBidValue (auction) {
                    if (auction) {
                        var winningBid = parseInt(auction.winningBid);
                        var minimumBid = parseInt(auction.minimumBid);
                        if (winningBid > minimumBid) {
                            return winningBid + 1;
                        }
                        return minimumBid + 1;
                    }
                    return 1;
                }

                function isEnoughMoney (user, auction) {
                    return user.coins - auction.bid > auction.minimumBid;
                }
            }
        };
    }

})(angular);
