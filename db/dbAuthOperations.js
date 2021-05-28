const { client } = require('./dbConnection');
const { config } = require('../config/config');
const { passwordVerify } = require('../helpers/passwordEncrypt');

async function insertUser(user) {
    const accessCollection = await client
    .db(config.DB_NAME)
    .collection('users')
 
    return accessCollection.findOne({ email: user.email })
    .then(async (result) => {
        if (!result) {
            const newUser = await accessCollection.insertOne(user)
            return { 
                _id: newUser.ops[0]._id, 
                username: newUser.ops[0].username, 
                email: newUser.ops[0].email 
            }
        }
        else if (result) {
            throw new Error('User already exists')
        }
    })
    .catch(err => {
        console.log('insert one err', err)
        return { error: err.code || 'db error', message: err.message }
    })
}

async function verifyUser(user) {
    const accessCollection = await client
    .db(config.DB_NAME)
    .collection('users')
console.log('login user', user)
    return accessCollection.findOne({ email: user.email })
    .then(async (result) => {
        if (result) {
            const pass = await passwordVerify(user.password, result.password)
            if (pass) {
                // need to update the refresh token in the database upon login
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
            else {
                throw new Error('Username or password incorrect');
            }
        }
        else if (!result) {
            throw new Error('Cannot find user, please use signup form');
        }
    })
    .catch(err => {
        console.log('verify user in db err', err)
        return { error: err.code || 'db error', message: err.message }
    })
}

async function updateToken(token) {
    const accessCollection = await client
    .db(config.DB_NAME)
    .collection('users')

    return accessCollection.findOne({ refresh_token: token })
    .then(record => {
        if (record) {
            return true;
        }
        else {
            throw new Error('Unauthenticated request. Please login');
        }
    })
    .catch(err => {
        return { error: err.code || 'db error', message: err.message }
    })
}

module.exports = {
    insertUser,
    verifyUser, 
    updateToken
}
