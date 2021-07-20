const { config } = require('../config/config');
const { client } = require('../db/dbConnection');

// Retrieves all the invoices from the database for the user
async function findAllInvoices(data) {
    const accessCollection = await client
    .db(config.DB_NAME)
    .collection('invoices')
    return accessCollection
    .find(data)
    .toArray()
    .then(result => {
        // If the array is empty, return an error
        if (result.length === 0) {
            throw new Error('Could not find any invoice')
        }
        // Otherwise return all the invoices
        else {
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

// Insert a new invoice to the database
async function insertInvoice(data) {
    const accessCollection = await client
    .db(config.DB_NAME)
    .collection('invoices')

    return accessCollection.insertOne(data)
    .then(result => {
        // Returns the inserted invoice
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

// Update an invoice using user email and invoice id
async function updateInvoice(data) {
    const accessCollection = await client
    .db(config.DB_NAME)
    .collection('invoices')

    // Only the invoice_data gets modified
    return accessCollection.findOneAndUpdate(
        { user_email: data.user_email , invoice_id: data.invoice_id },
        { $set: { invoice_data: data.invoice_data } },
        { returnDocument: 'after' }
    )
    .then(result => {
        // If nothing gets returned, return an error
        if (result.value === null) {
            throw new Error('Cannot find invoice id')
        }
        // Otherwise return the updated invoice
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

// Deletes the invoice using the invoice id
async function deleteInvoiceWithId(data) {
    const accessCollection = await client
    .db(config.DB_NAME)
    .collection('invoices')

    return accessCollection.deleteOne(data)
    .then(result => {
        // Returns 1 if invoice was deleted, throws an error if nothing was deleted
        if (result.deletedCount === 1) return result.deletedCount;
        else {
            throw new Error('No invoice to delete')
        }
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