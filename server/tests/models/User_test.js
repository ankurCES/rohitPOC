var expect = require('chai').expect;
var  models = require('../../models');

var Sequelize = require('sequelize');
var db = new Sequelize('sqlite://');
var models = require('../../models')(db, Sequelize);

var sequelize_fixtures = require('sequelize-fixtures');

describe('User', function() {

    var fixtures = [
        {
            model: 'Inventory',
            data: {
                id: 1,
                name: 'Bread'
            }
        }, {
            model: 'Inventory',
            data: {
                id: 2,
                name: 'Carrot'
            }
        }, {
            model: 'Inventory',
            data: {
                id: 3,
                name: 'Diamond'
            }
        }, {
            model: 'UserInventory',
            data: {
                UserId: 1,
                InventoryId: 1,
                quantity: 30
            }
        }, {
            model: 'UserInventory',
            data: {
                UserId: 1,
                InventoryId: 2,
                quantity: 18
            }
        }, {
            model: 'UserInventory',
            data: {
                UserId: 1,
                InventoryId: 3,
                quantity: 1
            }
        }
    ];


    beforeEach(function (done) {
        var m = {
            'User': models.User,
            'Inventory': models.Inventory,
            'UserInventory': UserInventory
        };
        sequelize_fixtures.loadFixtures(fixtures, m).then(function () {
            done();
        });
    });

    describe('#getOrCreateUser', function() {

        it('Shoud return the user if the name exists', function(done) {
            User.getOrCreateUser('Gustavo').then(function (user) {
                expect(user.name).to.equal('Gustavo');
                expect(user.coins).to.equal(1000);
                done();
            })
        });

        it('Shoud create the user if the name does not exists', function(done) {
            User.getOrCreateUser('Carol').then(function (user) {
                expect(user.name).to.equal('Carol');
                expect(user.coins).to.equal(1000);
                done();
            })
        });
    });

});