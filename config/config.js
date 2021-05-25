require('dotenv').config();

module.exports.config = {
    PORT: process.env.PORT || 8080,
    HOST: process.env.HOST || '127.0.0.1',
    DB_URL: process.env.DB_URL,
    DB_NAME: process.env.DB_NAME
}