const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

function generateToken(email) {
    return jwt.sign({ email }, config.TOKEN_SECRET, { expiresIn: 1800 })
}

function generateRefreshToken(email) {
    return jwt.sign({ email }, config.REFRESH_TOKEN_SECRET, { expiresIn: 18000 })
}

function verifyToken(token) {
    try {
        const isValid = jwt.verify(token, config.TOKEN_SECRET);
        console.log('verification', isValid)
        return true;
    }
    catch (err) {
        console.log('catch token verify', err)
        return err
    }
    
}

function verifyRefreshToken(refreshToken) {
    try {
        const isValid = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
        console.log('verification', isValid)
        return true;
    }
    catch (err) {
        console.log('catch token verify', err)
        return err
    }
}

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken
}