const dbInvoiceOperations = require('../db/dbInvoiceOperations');
const generateId = require('../helpers/invoiceIdGenerator');

async function getAllInvoices(req, res) {
    // find many with user email/id

    // get user email, assuming it is on the body
    const email = req.body;
    // display all invoices for that user

    // response send all invoice with their details on json
    // single invoice display handled by f-e
    return dbInvoiceOperations.findAllInvoices(email)
    .then(data => {
        console.log('find all invoices', data)
        res.send('get all');
    })
    .catch(err => {
        console.log('find invoices err', err)
    })
}

// async function getOneInvoice(req, res) {
//     // find one with user email/id and invoice id/date?

//     // get user email
//     res.send('get one');
// }

async function postNewInvoice(req, res) { // does it need to await for anything?
    // insert one with user email/id
    // const invoice = req.body.invoice;
    // console.log('body', invoice)
    const invoiceId = generateId();

    return dbInvoiceOperations.insertInvoice({ invoice_id: invoiceId, ...req.body })
    .then(data => {
        if (data.error) {
            throw new Error('Could not create invoice')
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
               message: err.message || 'Could not add invoice' })
    })
}

async function putEditInvoice(req, res) {
    // update one with user email/id and invoice id
    // edit done in f-e from the invoice itself

    // f-e sends user email and invoice id and invoice itself(data)
    res.send('edit invoice');
}

async function deleteInvoice(req, res) {
    // delete one with user email/id and invoice id
    // delete done in f-e from the invoice itself

    // f-e send user email and invoice id to delete
    const invoiceId = req.body;

    return dbInvoiceOperations.deleteInvoiceWithId(invoiceId)
    .then(data => {
        if (data.error) {
            throw new Error('Could not delete invoice')
        }
        else {
            console.log('in controllers', data)
            res.status(200).json({ message: 'Invoice deleted' });
        }
    })
    .catch(err => {
        console.log('controller err', err)
        res.status(500).json({ error: err.code || 'server error', message: 'Cannot delete invoice' })
    })
}

module.exports = {
    getAllInvoices,
    postNewInvoice,
    putEditInvoice,
    deleteInvoice
}