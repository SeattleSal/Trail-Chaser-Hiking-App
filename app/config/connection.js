const Sequelize = require('sequelize');

const sequelize = new Sequelize('trail_chasers', 'root', '2b.D_?rtwbjm', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        idle: 10000
    }
});

module.exports = sequelize;