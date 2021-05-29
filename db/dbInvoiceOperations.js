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
        return { 
            error: err.code || 'db error', 
            message: err.message || 'Could not add new invoice' 
        }
    })
}

async function updateInvoice(data) {
    const accessCollection = await client
    .db(config.DB_NAME)
    .collection('invoices')
console.log('update', data)
    return accessCollection.findOneAndUpdate(
        { user_email: data.user_email , invoice_id: data.invoice_id },
        { $set: { invoice_data: data.invoice_data } },
        { returnDocument: 'after' }
    )
    .then(result => {
        console.log('update in db', result)
        if (result.value === null) {
            throw new Error('Cannot find invoice id')
        }
        else {
            return result.value;
        }
    })
    .catch(err => {
        console.log('update in db err', err)
        return { 
            error: err.code || 'db error', 
            message: err.message || 'Could not update invoice' 
        }
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
        return { 
            error: err.code || 'db error', 
            message: err.message || 'Could not delete invoice' 
        }
    })
}

module.exports = {
    findAllInvoices,
    insertInvoice,
    deleteInvoiceWithId,
    updateInvoice
}