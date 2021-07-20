const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/authRoutes');
const invoiceRouter = require('./routes/invoiceRoutes')
const { dbConnection } = require('./db/dbConnection');
const { config } = require('./config/config');
const colors = require('colors');

async function bootstrap() {
    await dbConnection();

    app.use(cors({ 
        credentials: true, 
        origin: true 
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use('/api', authRouter);
    app.use('/api', invoiceRouter);

    app.listen(config.PORT, config.HOST, (req, res) => {
        console.log('listening on 8080'.magenta)
    })
}

bootstrap()