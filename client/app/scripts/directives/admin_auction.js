;
(function(angular) {
    'use strict';

    var app = angular.module('directives.adminAuction', []);

    app.directive('adminAuction', adminAuction);
    adminAuction.$inject = ['eventHub'];

    function adminAuction(eventHub) {
        return {
            restrict: 'E',
            template: '<div class="ui card"  ng-if="!vm.currentAuction">\
                <div class="content">\
                    <div class="header">Current Auction</div>\
                </div>\
                <div class="content">\
                    <h4 class="ui teal sub header">No auction in progress</h4>\
                    <div class="ui small feed">\
                    </div>\
                </div>\
            </div>\
                <div class="ui card" ng-if="vm.currentAuction">\
                    <div class="content">\
                        <div class="right floated meta red">{{ vm.timeRemaining }}s Left</div>\
                        <strong>Current Auction</strong>\
                    </div>\
                    <div class="image">\
                        <img class="ui image" src="images/{{vm.currentAuction.item.name | lowercase}}.png">\
                    </div>\
                    <div class="content">\
                        <div class="header">{{vm.currentAuction.item.name}}</div>\
                        <div class="meta">\
                            <a>Quantity: {{vm.currentAuction.quantity}}</a>\
                        </div>\
                        <div class="description ui grid">\
                            <div class="ui statistic">\
                                <div class="value">\
                                    {{ vm.currentAuction.winningBid }}\
                                </div>\
                                <div class="label">\
                                    Winning Bid\
                                </div>\
                            </div>\
                             <div class="ui statistic">\
                                <div class="value">\
                                    {{ vm.currentAuction.maxBid }}\
                                </div>\
                                <div class="label">\
                                    Maximum Bid\
                                </div>\
                            </div>\
                        </div>\
                        </div>\
                        <div class="extra content">\
                        <span class="right floated">\
                            Seller: {{ vm.currentAuction.user.name }}\
                        </span>\
                        <span ng-show="vm.currentAuction.winner.name && vm.isReport">\
                            <i class="user icon"></i>\
                            Winner: {{ vm.currentAuction.winner.name }}\
                        </span>\
                        </div>\
                </div>',
            scope: '&',
            link: function(scope, element, attrs) {
                var vm = scope.vm;
                vm.timeRemaining = 90;

                vm.placeBid = function() {
                    var user = vm.data.user;
                    var auction = vm.currentAuction;

                    if (isEnoughMoney(user, auction)) {
                        user.coins -= auction.bid;
                        var data = {
                            user: user,
                            auction: auction
                        };
                        eventHub.emit('auction: someone place bid', { data: data });
                    }
                };

                eventHub.on('auction: started', function(res) {
                    vm.currentAuction = res.data;
                    if (res.data) {
                        vm.currentAuction.bid = calculateBidValue(vm.currentAuction);
                    }
                });

                eventHub.on('auction: show the countdown', function(res) {
                    vm.timeRemaining = res;
                });

                eventHub.on('auction: show who is the winner', function(res) {
                    var data = res.data;
                    vm.timeRemaining = data.timeRemaining;
                    vm.isReport = true;
                    vm.currentAuction.winner = data.winner;
                    vm.currentAuction.winningBid = data.winningBid;
                });

                eventHub.emit('auction: is there any auction in progress?');

                function calculateBidValue(auction) {
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

                function isEnoughMoney(user, auction) {
                    return user.coins - auction.bid > auction.minimumBid;
                }
            }
        };
    }

})(angular);