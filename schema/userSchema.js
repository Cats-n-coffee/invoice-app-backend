const { config } = require('../config/config');

async function createUserSchema(client) {
    await client.db(config.DB_NAME).command( {
        collMod: "users",
        validator: { $jsonSchema: {
           bsonType: "object",
           required: [ "email" ],
           properties: {
              email: {
                 bsonType: "string",
                 description: "must be a string and is required"
              }
           }
        } },
        validationLevel: "moderate"
     } )
}

module.exports = { createUserSchema }