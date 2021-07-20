const dbInvoiceOperations = require('../db/dbInvoiceOperations');
const generateId = require('../helpers/invoiceIdGenerator');

async function getAllInvoices(req, res) {
    const email = { user_email: req.query.email };
    console.log(req.headers)

    return dbInvoiceOperations.findAllInvoices(email)
    .then(data => {
        if (data.error) {
            throw new Error(data.message)
        }
        else {
            res.status(200).json(data)
        }
    })
    .catch(err => {
        console.log('find invoices err', err)
        res.status(500)
           .json({ 
               error: err.code || 'server error', 
               message: err.message || 'Could not retrieve invoices' 
            })
    })
}

async function postNewInvoice(req, res) {
    const invoiceId = generateId();
    const newInvoice = { invoice_id: invoiceId, ...req.body }

    return dbInvoiceOperations.insertInvoice(newInvoice)
    .then(data => {
        if (data.error) {
            throw new Error(data.message)
        }
        else {
            console.log('post invoice controller', data)
            res.status(201).json(data)
        }
    })
    .catch(err => {
        console.log('post controller err', err)
        res.status(500)
           .json({ 
               error: err.code || 'server error', 
               message: err.message || 'Could not add invoice' 
            })
    })
}

async function putEditInvoice(req, res) {
    return dbInvoiceOperations.updateInvoice(req.body)
    .then(data => {
        if (data.error) {
            throw new Error(data.message)
        }
        else {
            console.log('in controllers', data)
            res.status(200).json(data);
        }
    })
    .catch(err => {
        console.log('controller err', err)
        res.status(500).json({ 
            error: err.code || 'server error', 
            message: err.message || 'Cannot edit invoice' 
        })
    })
}

async function deleteInvoice(req, res) {
    const invoiceId = req.body; 

    return dbInvoiceOperations.deleteInvoiceWithId(invoiceId)
    .then(data => {
        if (data.error) {
            throw new Error(data.message)
        }
        else {
            console.log('in controllers', data)
            res.status(200).json({ message: 'Invoice deleted' });
        }
    })
    .catch(err => {
        console.log('controller err', err)
        res.status(500).json({ 
            error: err.code || 'server error', 
            message: err.message || 'Could not delete invoice' 
        })
    })
}

module.exports = {
    getAllInvoices,
    postNewInvoice,
    putEditInvoice,
    deleteInvoice
}