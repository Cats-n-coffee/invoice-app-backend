const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

function generateToken(email) {
    return jwt.sign(email, config.TOKEN_SECRET, { expiresIn: 1800 }, (err, result) => {
        if (err) {
            console.log('generate token err', err)
            throw new Error;
        }
        else {
            return result;
        }
    })
}

function generateRefreshToken(email) {
    return jwt.sign(email, config.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }, (err, result) => {
        if (err) {
            console.log('refresh token err', err);
            throw new Error;
        }
        else {
            return result;
        }    
    })
}

function verifyToken(req, res, next) {
    const authenticationHeader = req.headers['authorization'];
    const token = authenticationHeader && authenticationHeader.split(' ')[1];

    if (token === null) return res.sendStatus(401); // send json with error message

    return jwt.verify(token, config.TOKEN_SECRET, (err, result) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user;

        next()
    })
}

module.exports = {
    generateToken,
    generateRefreshToken
}