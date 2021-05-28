const express = require('express');
const dbAuthOperations = require('../db/dbAuthOperations');
const { passwordHash } = require('../helpers/passwordEncrypt');
const { generateToken, generateRefreshToken, verifyToken } = require('../helpers/accessTokens');

async function signupPost(req, res) {
    console.log('input singup', req.body)
    const hashedPassword = await passwordHash(req.body.password)

    // create tokens here
    const token = await generateToken(req.body.email);
    const refreshToken = await generateRefreshToken(req.body.email);

    return dbAuthOperations.insertUser({ ...req.body, password: hashedPassword, refresh_token: refreshToken })
    .then(data => {
        console.log('in controlllers', data)
        
        res
            .status(201)
            .header({
                'Set-Cookie': [
                    'token=' + token + '; maxAge=1801; httpOnly=true; SameSite=None; Secure=true;',
                    'refresh_token=' + refreshToken + '; maxAge=604800; httpOnly=true; SameSite=None; Secure=true;'
                ],
                'Access-Control-Allow-Credentials': true
            })
            // .cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true })
            // .cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true })
            .json(data)
    }) // missing response headers for 200 or 400
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
}
//http://expressjs.com/en/resources/middleware/cookie-session.html

async function loginPost(req, res) {
    
    const token = await generateToken(req.body.email);
    const refreshToken = await generateRefreshToken(req.body.email);

    return dbAuthOperations.verifyUser({ ...req.body, refresh_token: refreshToken })
    .then(data => {
        console.log('login controller', data)
        res
            .status(200)
            .header({
                'Set-Cookie': [
                    'token=' + token + '; maxAge=1801; httpOnly=true; SameSite=None; Secure=true;',
                    'refresh_token=' + refreshToken + '; maxAge=604800; httpOnly=true; SameSite=None; Secure=true;'
                ],
                'Access-Control-Allow-Credentials': true
            })
            .json(data)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
}

function logoutPost(req, res) {
    res.send('logoutPost')
}

async function refreshTokenPost(req, res) {
    const refreshToken = req.body.refresh_token;

    if (!refreshToken) {
        return res.status(403).json({ message: "Unauthenticated request" });
    }

    const checkToken = await verifyToken(refreshToken)

    return dbAuthOperations.updateToken(refreshToken)
    .then(async (data) => {
        // check data.error ?
        console.log('refresh token', data);
        console.log('veirfy', checkToken)
        if (checkToken) {
            const newToken = await generateToken(checkToken.email)
            res
            .status(200)
            .header({
                'Set-Cookie': [
                    'token=' + newToken + '; maxAge=1801; httpOnly=true; SameSite=None; Secure=true;',
                    'refresh_token=' + refreshToken + '; maxAge=604800; httpOnly=true; SameSite=None; Secure=true;'
                ],
                'Access-Control-Allow-Credentials': true
            }).json({ email: checkToken.email })
        }
        else {
            res.status(403).json({ error: 403, message: "Unauthorized request" })
        }
    })
    .catch(err => {
        console.log('token controller err', err)
        res.status(500).json({ err })
    })
    
}

module.exports = { 
    signupPost, 
    loginPost, 
    logoutPost, 
    refreshTokenPost 
}