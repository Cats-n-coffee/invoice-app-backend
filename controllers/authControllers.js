const express = require('express');
const dbAuthOperations = require('../db/dbAuthOperations');
const { passwordHash } = require('../helpers/passwordEncrypt');
const { generateToken, generateRefreshToken, verifyToken } = require('../helpers/accessTokens');

async function signupPost(req, res) {
    console.log('input singup', req.body)
    // Hash password
    const hashedPassword = await passwordHash(req.body.password)

    // Create tokens here
    const token = await generateToken(req.body.email);
    const refreshToken = await generateRefreshToken(req.body.email);

    // Insert user in the database with hashed password and refresh token
    return dbAuthOperations.insertUser({ ...req.body, password: hashedPassword, refresh_token: refreshToken })
    .then(data => {
        console.log('in controlllers', data)
        // Response: cookies with both tokens, data in JSON object
        res
            .status(201)
            .header({
                'Set-Cookie': [
                    'token=' + token + '; maxAge=1801; HttpOnly=true; SameSite=None; Secure=true;',
                    'refresh_token=' + refreshToken + '; maxAge=604800; HttpOnly=true; SameSite=None; Secure=true;'
                ],
                'Access-Control-Allow-Credentials': true
            })
            .json(data)
    }) // missing response headers for 200 or 400
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
}
//http://expressjs.com/en/resources/middleware/cookie-session.html
//https://stackoverflow.com/questions/46288437/set-cookies-for-cross-origin-requests/63978697#63978697
//https://stackoverflow.com/questions/36824106/express-doesnt-set-a-cookie

async function loginPost(req, res) {
    console.log('login', req.body)
    // Create new set of tokens
    const token = await generateToken(req.body.email);
    const refreshToken = await generateRefreshToken(req.body.email);

    // Verify user in the database and change refresh token
    return dbAuthOperations.verifyUser({ ...req.body, refresh_token: refreshToken })
    .then(data => {
        console.log('login controller', data, refreshToken)
        // Response: cookies with both tokens, user data in JSON object
        if (data.error) {
            throw new Error(data.message)
        }
        else {
            res
            .cookie('token', token, { maxAge: 18000, httpOnly: true, secure: true, sameSite: 'none' })
            .cookie('refresh_token', refreshToken, { maxAge: 168000, httpOnly: true, secure: true, sameSite: 'none' })
            .status(200)
            .header({
                // 'Set-Cookie': [
                //     'token=' + token + '; maxAge=18001; HttpOnly=true; Secure=true; SameSite=None;', // Secure cookies not being set in Postman cookies
                //     'refresh_token=' + refreshToken + '; maxAge=604800; HttpOnly=true; Secure=true; SameSite=None;'
                // ],
                'Access-Control-Allow-Credentials': true,
                //'Access-Control-Allow-Origin': 'http://127.0.0.1:3000'
            })
            .json(data)
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
}

function logoutPost(req, res) {
    // Remove cookies from user's browser
    try {
        res
        .status(200)
        .cookie("token", "", { maxAge: 0 })
        .cookie("refresh_token", "", { maxAge: 0 })
        .end();
    }
    catch (err ){
        console.log('logout controller err', err)
        res.status(500).json({ message: err.message || 'Logout route error' })
    }
}

async function refreshTokenPost(req, res) {
    // Get the refresh token from cookies
    const refreshToken = req.body.refresh_token;

    // If there is no refresh token return 403
    if (!refreshToken) {
        return res.status(403).json({ message: "Unauthenticated request" });
    }

    // Make sure the refresh token is valid
    const checkToken = await verifyToken(refreshToken)

    // Check if the refresh token in the database matches/ check if the refresh token is in the database
    return dbAuthOperations.updateToken(refreshToken)
    .then(async (data) => {
        // check data.error ?
        console.log('refresh token', data);
        console.log('veirfy', checkToken)
        // If the refresh token is verified/valid, then generate a new regular token
        if (checkToken) {
            const newToken = await generateToken(checkToken.email)
            // Send the response with the new regular token and refresh token in cookies
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