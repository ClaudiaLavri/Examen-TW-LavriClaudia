const Sequelize = require('sequelize');
const sequelize = require('../database/db.js');

const Spacecraft = sequelize.define('Spacecraft', {
    idSpace:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    numeSpace:{
        type: Sequelize.STRING,
        validate: {
            min: 3
        }
    },
    viteza:{
        type: Sequelize.INTEGER,
        validate: {
            min: 1000
        }
    },
    masa:{
        type: Sequelize.INTEGER,
        validate: {
            min: 3
        }
    }
});

module.exports = Spacecraft;
