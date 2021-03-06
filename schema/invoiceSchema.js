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
                         "invoice_date", "payment_terms", "project_description", "invoice_status", "item_list" 
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
                            bsonType: "string",
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
                            bsonType: "string",
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
                        invoice_status: {
                           bsonType: "string",
                           description: "must be a string and is required"
                        },
                         item_list: {
                             bsonType: ["array"],
                             items: {
                                bsonType: "object",
                                required: [ "id", "item_name", "quantity", "price", "total" ],
                                properties: {
                                    id: {
                                       bsonType: "string",
                                       description: "must be a string and is required"
                                    },
                                    item_name: {
                                       bsonType: "string",
                                       description: "must be a string and is required"
                                    },
                                    quantity: {
                                       bsonType: "string",
                                       description: "must be an integer and is required"
                                    },
                                    price: {
                                       bsonType: "string",
                                       description: "must be a string and is required"
                                    },
                                    total: {
                                       bsonType: "string",
                                       description: "must be a string and is required"
                                    }
                                 },
                                 description: "must be an array of objects"
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