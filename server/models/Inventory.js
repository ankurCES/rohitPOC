(function () {

    function F (config) {
        var db = config.db;
        var Sequelize = config.Sequelize;

        var Inventory = db.define('Inventory', {
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            }
        }, {
            timestamps: false
        });
        
        Inventory.decreaseQuantity = function (list, auction) {
            for (var i in list) {
                if (list[i].id === auction.item.id && i >= 0) {
                    list[i].UserInventory.quantity -= auction.quantity;
                    return list;
                }
            }
            return null;
        };

        return Inventory;
    }

    module.exports = F;

})();