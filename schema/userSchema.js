const { config } = require('../config/config');

async function createUserSchema(client) {
    await client.db(config.DB_NAME).command( {
        collMod: "users",
        validator: { 
            $jsonSchema: {
               bsonType: "object",
               required: [ "username", "email",  "password"],
               properties: {
                  username: {
                     bsonType: "string",
                     description: "must be a string and is required"
                  },
                  email: {
                     bsonType: "string",
                     description: "must be a string and is required"
                  },
                  password: {
                     bsonType: "string",
                     description: "must be a string and is required"
                  }
               }
            } },
        validationLevel: "strict"
     } )
}

module.exports = { createUserSchema }