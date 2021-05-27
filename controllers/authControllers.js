const express = require('express');
const dbAuthOperations = require('../db/dbAuthOperations');
const { passwordHash, passwordVerify } = require('../helpers/passwordEncrypt');

async function signupPost(req, res) {
    console.log('input singup', req.body)
    const hashedPassword = await passwordHash(req.body.password)

    // create tokens here

    return dbAuthOperations.insertUser({ ...req.body, password: hashedPassword })
    .then(data => {
        console.log('in controlllers', data)
        res.status(201).json(data)
    }) // missing response headers for 200 or 400
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
}

function loginPost(req, res) {
   
    // generate 2 tokens
    return dbAuthOperations.verifyUser({ email: req.body.email, password: req.body.password })
    .then(data => {
        console.log('login controller', data)
        res.status(200).json(data)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
}

function logoutPost(req, res) {
    res.send('logoutPost')
}

function refreshtokenPost(req, res) {
    res.send('refresh token post')
}

module.exports = { signupPost, loginPost, logoutPost, refreshtokenPost }