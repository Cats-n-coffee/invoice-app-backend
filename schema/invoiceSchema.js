const { config } = require('../config/config');

// Invoice schema
async function createInvoiceSchema(client) {
    await client.db(config.DB_NAME).command( {
        collMod: "invoices",
        validator: { 
            $jsonSchema: {
               bsonType: "object",
               required: [  "user_email",  "invoice_data"],
               properties: {
                  user_email: {
                     bsonType: "string",
                     description: "must be a string and is required"
                  },
                  invoice_data: {
                     bsonType: "object",
                     required: [ 
                         "biller_street", "biller_city", "biller_zipcode", "biller_country", 
                         "client_name", "client_email", "client_street", "client_city", "client_zipcode", "client_country",
                         "invoice_date", "payment_terms", "project_description", "invoice_amount", "invoice_status", "item_list" 
                        ],
                     properties: {
                         biller_street : {
                             bsonType: "string",
                             description: "must be a string and is required"
                         },
                         biller_city : {
                             bsonType: "string",
                             description: "must be a string and is required"
                         },
                         biller_zipcode: {
                            bsonType: "int",
                            description: "must be an integer and is required"
                        },
                         biller_country: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                         client_name: {
                             bsonType: "string",
                             description: "must be a string and is required"
                         },
                         client_email: {
                             bsonType: "string",
                             description: "must be a string and is required"
                         },
                         client_street: {
                            bsonType: "string",
                            description: "must be a string and is required"
                         },
                         client_city: {
                            bsonType: "string",
                            description: "must be a string and is required"
                         },
                         client_zipcode: {
                            bsonType: "int",
                            description: "must be an integer and is required"
                         },
                         client_country: {
                            bsonType: "string",
                            description: "must be a string and is required"
                         },
                         invoice_date: {
                            bsonType: "string",
                            description: "must be a string and is required"
                         },
                         payment_terms: {
                            bsonType: "string",
                            description: "must be a string and is required"
                         },
                         project_description: {
                            bsonType: "string",
                            description: "must be a string and is required"
                         },
                         invoice_amount: {
                           bsonType: "string",
                           description: "must be a string and is required"
                        },
                        invoice_status: {
                           bsonType: "string",
                           description: "must be a string and is required"
                        },
                         item_list: {
                             bsonType: "object",
                             required: [ "item_name", "quantity", "price" ],
                             properties: {
                                 item_name: {
                                     bsonType: "string",
                                     description: "must be a string and is required"
                                 },
                                 quantity: {
                                     bsonType: "int",
                                     description: "must be an integer and is required"
                                 },
                                 price: {
                                    bsonType: "string",
                                    description: "must be a string and is required"
                                 }
                             }
                         }
                     }
                  }
               }
            } },
        validationLevel: "moderate"
     } )
}

module.exports = { createInvoiceSchema }