const Sequelize = require('sequelize');
const sequelize = require('../database/db.js');
const DataTypes = require('sequelize');

const Astronaut = sequelize.define('Astronaut', {
    idAstronaut:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    numeAstronaut:{
        type: Sequelize.STRING,
        validate: {
            min: 5
        }
    },
    rol:{
        type: DataTypes.ENUM("COMMANDER", "PILOT", "CREW")
    }
});

module.exports = Astronaut;