'use strict'
const jwt = require('jsonwebtoken')
const AppDBHandler = require('../db/api/appdbhandler.js')


/**
 * Token Processor class is responsible for generating JWT tokens
 * for the given APP credentials.
 */
class TokenProcessor {

    /**
     * [constructor description]
     * @param  {Object} credentials [credentials object with id and secret]     
     */
    constructor(credentials = {}) {
        if (JSON.stringify(credentials) == "{}") {
            var error = Error("Invalid or Empty credentials")
            error.status = 405
            throw error
        }
        this.credentials = credentials
    }

    /**
     * [generateToken Method generates JWT token based on the credentials]
     * @return {text} [Bearer token]
     */
    generateToken() {
        var self = this
        return new Promise((resolve, reject) => {
            new AppDBHandler().getAppByClientID(self.credentials.clientid).then((oApp) => {
                var token = jwt.sign(self.credentials, "secret", {
                    expiresIn: 60 * 60
                })
                resolve({ "token": "Bearer " + token})
            }).catch((err) => {
                console.log(err)
                reject(err)
            })
        })
    }
}


module.exports = TokenProcessor