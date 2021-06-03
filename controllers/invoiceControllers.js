const dbInvoiceOperations = require('../db/dbInvoiceOperations');
const generateId = require('../helpers/invoiceIdGenerator');

async function getAllInvoices(req, res) {
    // find many with user email/id

    // get user email, assuming it is on the body
    const email = { user_email: req.query.email };
    // display all invoices for that user
    console.log(req.headers)

    // response send all invoice with their details on json
    // single invoice display handled by f-e
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
        res.status(400)
           .json({ 
               error: err.code || 'server error', 
               message: err.message || 'Could not retrieve invoices' 
            })
    })
}

async function postNewInvoice(req, res) { // does it need to await for anything?
    // insert one with user email/id
    // const invoice = req.body.invoice;
    // console.log('body', invoice)
    const invoiceId = generateId();
    // DATA TO ADD UPON POST: creation_date, status

    return dbInvoiceOperations.insertInvoice({ invoice_id: invoiceId, ...req.body })
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
    // update one with user email/id and invoice id
    // edit done in f-e from the invoice itself

    // f-e sends user email and invoice id and invoice itself(data)
    // need to serialize the req body with the db operation params
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
    // delete one with user email/id and invoice id
    // delete done in f-e from the invoice itself

    // f-e send user email and invoice id to delete
    const invoiceId = req.body; // add the user email if possible?

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