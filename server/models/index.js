var User = require('./User');
var Auction = require('./Auction');
var Inventory = require('./Inventory');

(function () {

    function Models(db, Sequelize) {

        this.Inventory = new Inventory({
            db: db,
            Sequelize: Sequelize
        });
        
        this.User = new User({
            db: db,
            Sequelize: Sequelize,
            models: this
        });
        
        this.Auction = Auction;

        this.UserInventory = db.define('UserInventory', {
          quantity: Sequelize.INTEGER
        }, {
            timestamps: false
        });

        this.User.belongsToMany(this.Inventory, {constraints: false, through: this.UserInventory, as: 'Inventory' });
        this.Inventory.belongsToMany(this.User, {constraints: false, through: this.UserInventory });


        this.User.sync();
        this.Inventory.sync();
        this.UserInventory.sync();


        return this;

    }

    module.exports = Models;

})();

