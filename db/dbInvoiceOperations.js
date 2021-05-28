const { config } = require('../config/config');
const { client } = require('../db/dbConnection');

async function findAllInvoices(data) {
    const accessCollection = await client
    .db(config.DB_NAME)
    .collection('invoices')

    return accessCollection
    .find(data)
    .toArray()
    .then(result => {
        if (result.length === 0) {
            throw new Error('Could not find any invoice')
        }
        else {
            console.log('find db ops', result)
            return result;
        }
    })
    .catch(err => {
        console.log(err)
        return { 
            error: err.code || 'db error', 
            message: err.message || 'Could not find any invoice' 
        }
    })
}

async function insertInvoice(data) {
    const accessCollection = await client
    .db(config.DB_NAME)
    .collection('invoices')

    return accessCollection.insertOne(data)
    .then(result => {
        console.log('insert invoice', result.insertedCount)
        return result.ops[0];
    })
    .catch(err => {
        console.log('error at insert', err)
    })
}

async function deleteInvoiceWithId(data) {
    const accessCollection = await client
    .db(config.DB_NAME)
    .collection('invoices')

    return accessCollection.deleteOne(data)
    .then(result => {
        console.log('deleted', result.deletedCount)
    })
    .catch(err => {
        console.log('delete db err', err)
    })
}

module.exports = {
    findAllInvoices,
    insertInvoice,
    deleteInvoiceWithId
}