(function () {

    function F (config) {
        var db = config.db;
        var Sequelize = config.Sequelize;
        var models = config.models;

        var User = db.define('User', {
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            coins: Sequelize.DECIMAL
        });

        User.createAndAddInitialInventory = function (name) {
            var inventory1 = db.query('insert or ignore into Inventories (name) values ("Bread")');
            var inventory2 = db.query('insert or ignore into Inventories (name) values ("Carrot")');
            var inventory3 = db.query('insert or ignore into Inventories (name) values ("Diamond")');
            
            return User.create({name: name, coins: 1000}).then(function (user) {
                // return user.createInventory({quantity:30, name: 'Bread'});
                var userInventory1 = db.query('insert or ignore into UserInventories (quantity, InventoryId, UserId) values (30, 1, $1)', {bind: [user.id]});
                var userInventory2 = db.query('insert or ignore into UserInventories (quantity, InventoryId, UserId) values (18, 2, $1)', {bind: [user.id]});
                var userInventory3 = db.query('insert or ignore into UserInventories (quantity, InventoryId, UserId) values (1, 3, $1)', {bind: [user.id]});
                inventory1.then([inventory2, inventory3, userInventory1, userInventory2, userInventory3]);
                return user;
            });
        };

        User.getOrCreateUser = function (name) {
            return User.findOne({where: {name: name}}, {include: [models.Inventory]})
            .then(function (user) {
                if (! user) {
                    return User.createAndAddInitialInventory(name)
                    .then(function (user) {
                        return User.findOne({where: {id: user.id}}, {include: [models.Inventory]});
                    });
                }
                else {
                    return user;
                }
            })
            .then(function (user) {
                return user;
            });
        };

        User.getInventories = function (user) {
            return user.getInventory().then(function (inventories) {
                return inventories;
            });
        };

        User.updateCoinsAndInventory = function (auction) {
            return db.transaction(function (t) {
                var sellerId = auction.user.id;
                var sellerCoins = auction.user.coins + auction.winningBid;

                var winnerId = auction.winner.id;
                var winnerCoins = auction.winner.coins - auction.winningBid;

                var inventoryId = auction.item.UserInventory.InventoryId;

                var updateSellerCoins = User.update({coins: sellerCoins}, {
                    where: {id: sellerId}, transaction: t
                });

                var updateSellerInventory = db.query('update UserInventories set quantity = quantity - $1 where UserId = $2 and InventoryId = $3', {
                    bind: [auction.quantity, sellerId, inventoryId],
                    transaction: t
                });

                var updateWinnerCoins = User.update({coins: winnerCoins}, {
                    where: {id: winnerId}, transaction: t
                });

                var updateWinnerInventory = db.query('update UserInventories set quantity = quantity + $1 where UserId = $2 and InventoryId = $3', {
                    bind: [auction.quantity, winnerId, inventoryId],
                    transaction: t
                });

                return updateSellerCoins.then([updateSellerInventory, updateWinnerCoins, updateWinnerInventory]);

            });
        };

        return User;
    }

    module.exports = F;

})();
