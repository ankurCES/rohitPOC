(function () {

    var connections = {};

    function AuthEvent(config) {
        var User = config.models.User;
        var socket = config.socket;

        this.login = function (req, emit) {
            var name = req.data.name;

            if (connections.hasOwnProperty(name)) {
                return {
                    name: 'auth: access denied',
                    data: name
                };
            }

            retrieveUserData(name, emit);
        };

        this.retrieveUserData = retrieveUserData;

        this.isCurrentUserTheSellerOf = function (auctionInProgress) {
            var keys = Object.keys(connections);
            for (var i in keys) {
                var name = keys[i];
                var conn = connections[name];
                if (conn === socket.id) {
                    delete connections[name];
                    if (auctionInProgress && auctionInProgress.user.name === name) {
                        return true;
                    }
                }
            }
            return false;
        };


        function retrieveUserData (name, emit) {
            User.getOrCreateUser(name).then(function (user) {
                connections[name] = socket.id;
                User.getInventories(user).then(function (inventories) {
                    var data = {
                        user: {
                            id: user.id,
                            name: user.name,
                            coins: user.coins || 0
                        },
                        items: inventories,
                        currentAuction: null
                    };
                    
                    emit({
                        name: 'auth: user is authenticated',
                        data: data
                    });
                });
            });
        }
    }

    module.exports = AuthEvent;

})();