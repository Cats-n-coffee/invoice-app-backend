const { client } = require('./dbConnection');
const { config } = require('../config/config');
const { passwordVerify } = require('../helpers/passwordEncrypt');

// Insert user in the database
async function insertUser(user) {
    const accessCollection = await client
    .db(config.DB_NAME)
    .collection('users')
 
    // First, check if the email is in the database
    return accessCollection.findOne({ email: user.email })
    .then(async (result) => {
        if (!result) {
            // If the email is not in the database, then we insert the new user
            const newUser = await accessCollection.insertOne(user)
            return { 
                _id: newUser.ops[0]._id, 
                username: newUser.ops[0].username, 
                email: newUser.ops[0].email 
            }
        }
        // If the user email is already in the database, then we return an error
        else if (result) {
            throw new Error('User already exists')
        }
    })
    .catch(err => {
        console.log('insert one err', err)
        return { error: err.code || 'db error', message: err.message }
    })
}

// Verify user login
async function verifyUser(user) {
    const accessCollection = await client
    .db(config.DB_NAME)
    .collection('users')

    // Look for user by email
    return accessCollection.findOne({ email: user.email })
    .then(async (result) => {
        if (result) {
            // Once email is found, then we check if the passwords match
            const pass = await passwordVerify(user.password, result.password)
            if (pass) {
                // If the passwords match, then we update the refresh token in the database 
                await accessCollection.updateOne({ email: result.email }, {
                    $set: {
                        refresh_token: user.refresh_token
                    }
                })
                .catch(err => err);

                return { 
                    _id: result._id, 
                    username: result.username, 
                    email: result.email 
                }
            }
            // If passwords don't match, we return an error
            else {
                throw new Error('Email or password incorrect');
            }
        }
        // If email is not found, we return an error
        else if (!result) {
            throw new Error('Cannot find user. Please use Signup form');
        }
    })
    .catch(err => {
        console.log('verify user in db err', err)
        return { 
            error: err.code || 'db error', 
            message: err.message || 'Could not login user'}
    })
}

// Checks the refresh token in the database
async function updateToken(token) {
    const accessCollection = await client
    .db(config.DB_NAME)
    .collection('users')

    // Looks for the refresh token in the database
    return accessCollection.findOne({ refresh_token: token })
    .then(record => {
        // If we find the refresh token, we return true
        if (record) {
            return true;
        }
        // Otherwise, we return an error
        else {
            throw new Error('Unauthenticated request. Please login');
        }
    })
    .catch(err => {
        return { 
            error: err.code || 'db error', 
            message: err.message || 'Unable to maintain user session' }
    })
}

module.exports = {
    insertUser,
    verifyUser, 
    updateToken
}
