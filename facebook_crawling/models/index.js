
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Facebook = require('./facebook')(sequelize,Sequelize);


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
