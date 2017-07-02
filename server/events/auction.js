(function () {

    var auctionInProgress = null;
    var timeRemaining = 0;
    var timer = null;

    function AuctionEvent(config) {
        var User = config.models.User;

        this.hasAuctionInProgress = function () {
            if (auctionInProgress) {
                return true;
            }
            return false;
        };

        this.start = function (auction) {
            auctionInProgress = auction;
        };

        this.getAuctionInProgress = function () {
            return auctionInProgress;
        };

        this.startTimer = function (emit, done) {
            timeRemaining = 90;
            timer = setInterval(function () {
                emit(timeRemaining);
                timeRemaining--;
                if (timeRemaining < 0) {
                    clearInterval(timer);
                    done();
                }
            }, 1000);
        };

        this.stop = function (auction) {
            clearInterval(timer);
            resetActionInProgressAndTimeRemaining();
        };

        this.clearTimer = function () {
            clearInterval(timer);
        };

        this.placeBid = function (req, done) {
            if (timeRemaining > 0) {
                var auction = req.data.auction;
                var bid = parseFloat(auction.bid);
                var winningBid = parseFloat(auctionInProgress.winningBid);

                if(auctionInProgress.bidList.length == 0){
                    auctionInProgress.bidList.push(bid);
                    auctionInProgress.bidData.push({
                        bid: bid,
                        user: req.data.user
                    });
                    auctionInProgress.winningBid = bid;
                    auctionInProgress.winner = req.data.user;
                    auctionInProgress.maxBid = Math.max.apply(null, auctionInProgress.bidList);
                    done();
                    if (timeRemaining < 10) {
                        timeRemaining += 10;
                    }
                }else{
                    var minBid = Math.min.apply(null, auctionInProgress.bidList);
                    if(bid < minBid){
                        auctionInProgress.bidList.push(bid);
                        auctionInProgress.bidData.push({
                            bid: bid,
                            user: req.data.user
                        });
                        auctionInProgress.maxBid = Math.max.apply(null, auctionInProgress.bidList);
                        auctionInProgress.winningBid = bid;
                        auctionInProgress.winner = req.data.user;
                        done();
                        if (timeRemaining < 10) {
                            timeRemaining += 10;
                        }
                    }else{
                        auctionInProgress.bidData.push({
                            bid: bid,
                            user: req.data.user
                        });
                        auctionInProgress.bidList.push(bid);
                        auctionInProgress.maxBid = Math.max.apply(null, auctionInProgress.bidList);
                        done();
                    }
                }
                
            }
        };

        this.finish = function (emit, done, doneWithoutPersist) {
            if (auctionInProgress && auctionInProgress.winningBid > 0) {
                var remaining = 10;
                var timer = setInterval(function () {
                    var data = {
                        remaining: remaining,
                        winner: auctionInProgress.winner,
                        winningBid: auctionInProgress.winningBid
                    };

                    emit({data: data});

                    remaining--;
                    if (remaining < 0) {
                        clearInterval(timer);
                        done();
                    }
                }, 1000);
            }
            else {
                resetActionInProgressAndTimeRemaining();
                doneWithoutPersist();
            }
        };

        this.save = function (auction) {
            return User.updateCoinsAndInventory(auction);
        };

        this.resetActionInProgressAndTimeRemaining = resetActionInProgressAndTimeRemaining;

        function resetActionInProgressAndTimeRemaining () {
            auctionInProgress = null;
            timeRemaining = 90;
        }
    }

    module.exports = AuctionEvent;

})();