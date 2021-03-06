const { MongoClient } = require('mongodb');
const { config } = require('../config/config');
const { createUserSchema } = require('../schema/userSchema');
const { createInvoiceSchema } = require('../schema/invoiceSchema');

const client = new MongoClient(config.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

async function dbConnection() {
    try {
        await client.connect()
        console.log('connected to db'.magenta)
        createUserSchema(client)
        createInvoiceSchema(client)
    }
    catch (err) {
        console.log('db connection err', err)
    }
}

module.exports = { dbConnection, client }