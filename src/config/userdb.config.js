require('dotenv').config();

const {
  USER_DB_CONNECTION,
  USER_DB_HOST,
  USER_DB_NAME,
  USER_DB_USERNAME,
  USER_DB_PASSWORD,
} = process.env;

module.exports = {
  development: {
    username: USER_DB_USERNAME || 'root',
    password: USER_DB_PASSWORD || 'root',
    database: USER_DB_NAME || 'ecommerce_user',
    host: USER_DB_HOST || '127.0.0.1',
    dialect: USER_DB_CONNECTION || 'mysql',
    charset: 'utf8',
    collation: 'utf8_unicode_ci',
    timezone: '+06:30',
  },
  test: {
    username: USER_DB_USERNAME,
    password: USER_DB_PASSWORD,
    database: USER_DB_NAME,
    host: USER_DB_HOST,
    dialect: USER_DB_CONNECTION,
  },
  production: {
    username: USER_DB_USERNAME,
    password: USER_DB_PASSWORD,
    database: USER_DB_NAME,
    host: USER_DB_HOST,
    dialect: USER_DB_CONNECTION,
  },
};
