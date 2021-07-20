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

async function loginPost(req, res) {
    console.log('login', req.body)
    // Create new set of tokens
    const token = await generateToken(req.body.email);
    const refreshToken = await generateRefreshToken(req.body.email);

    // Verify user in the database and change refresh token
    return dbAuthOperations.verifyUser({ ...req.body, refresh_token: refreshToken })
    .then(data => {
        // Response: cookies with both tokens, user data in JSON object
        if (data.error) {
            throw new Error(data.message)
        }
        else {
            res
            .cookie('token', token, { maxAge: 1800000, httpOnly: true, secure: true, sameSite: 'none' })
            .cookie('refresh_token', refreshToken, { maxAge: 2000000, httpOnly: true, secure: true, sameSite: 'none' })
            .status(200)
            .header({
                'Access-Control-Allow-Credentials': true,
                //'Access-Control-Allow-Origin': 'http://127.0.0.1:3000'
            })
            .json(data)
        }
    })
    .catch(err => {
        console.log('login controller catch',err)
        res.status(500).json({
            error: err.code || "db error",
            message: err.message || "Email or password incorrect"
        })
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

module.exports = { 
    signupPost, 
    loginPost, 
    logoutPost, 
}

//http://expressjs.com/en/resources/middleware/cookie-session.html
//https://stackoverflow.com/questions/46288437/set-cookies-for-cross-origin-requests/63978697#63978697
//https://stackoverflow.com/questions/36824106/express-doesnt-set-a-cookie