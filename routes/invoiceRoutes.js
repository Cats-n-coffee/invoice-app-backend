const express = require('express');
const router = express.Router();
const controllers = require('../controllers/invoiceControllers');
const { authenticateUser } = require('../middleware/authenticate');

router.get('/invoices', authenticateUser, controllers.getAllInvoices);

// router.get('/invoice', controllers.getOneInvoice); // look up how to add params with :id

router.post('/newinvoice', authenticateUser, controllers.postNewInvoice);

router.put('/editinvoice', authenticateUser, controllers.putEditInvoice);

router.delete('/deleteinvoice', authenticateUser, controllers.deleteInvoice);

module.exports = router;