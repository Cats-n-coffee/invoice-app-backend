const { client } = require('./dbConnection');
const { config } = require('../config/config');

async function insertUser(user) {
    const accessCollection = await client
    .db(config.DB_NAME)
    .collection('users')

    return accessCollection.findOne({ email: user.email })
    .then(async (result) => {
        if (!result) {
            const newUser = await accessCollection.insertOne(user)
            return newUser.ops[0]
        }
        else {
            throw new Error('User already exists')
        }
    })
    .catch(err => {
        console.log('insert one err', err)
        return { error: 'db error', message: err.message }
    })
}

module.exports = {
    insertUser,
}

// db.runCommand( {
//     collMod: "contacts",
//     validator: { $jsonSchema: {
//        bsonType: "object",
//        required: [ "phone", "name" ],
//        properties: {
//           phone: {
//              bsonType: "string",
//              description: "must be a string and is required"
//           },
//           name: {
//              bsonType: "string",
//              description: "must be a string and is required"
//           }
//        }
//     } },
//     validationLevel: "moderate"
//  } )
 
 