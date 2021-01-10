const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

const User = sequelize.define('users', {
    username: Sequelize.STRING
})