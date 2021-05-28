const express = require('express');
const router = express.Router();
const controllers = require('../controllers/invoiceControllers');

router.get('/invoices', controllers.getAllInvoices);

// router.get('/invoice', controllers.getOneInvoice); // look up how to add params with :id

router.post('/newinvoice', controllers.postNewInvoice);

router.put('/editinvoice', controllers.putEditInvoice);

router.delete('/deleteinvoice', controllers.deleteInvoice);

module.exports = router;