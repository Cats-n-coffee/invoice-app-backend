const express = require('express');
const app = express();
const router = require('./routes/authRoutes');
const { dbConnection } = require('./db/dbConnection');
const { config } = require('./config/config');
const colors = require('colors');

async function bootstrap() {
    await dbConnection();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api', router);

    app.listen(config.PORT, config.HOST, (req, res) => {
        console.log('listening on 8080'.magenta)
    })
}

bootstrap()