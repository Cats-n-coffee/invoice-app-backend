const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

function generateToken(email) {
    return jwt.sign({ email }, config.TOKEN_SECRET, { expiresIn: 1800 })
}

function generateRefreshToken(email) {
    return jwt.sign({ email }, config.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

// function generateRefreshToken(email) {
//     return jwt.sign({ email }, config.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }, (err, result) => {
//         if (err) {
//             console.log('refresh token err', err);
//             throw new Error;
//         }
//         else {
//             console.log(result)
//             return result;
//         }    
//     })
// }

function verifyToken(token) {
    return jwt.verify(token, config.REFRESH_TOKEN_SECRET)
}

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken
}