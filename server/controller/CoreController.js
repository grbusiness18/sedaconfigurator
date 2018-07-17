'use strict'

const logger = require('../../utility/logger')
const NLPProcessor = require('../processor/nlpprocessor.js')
const TokenProcessor = require('../processor/tokenprocessor.js')
const RequestProcessor = require('../processor/requestprocessor.js')

/**
 * CORE Controller takes care of OAUTH processing and Request Parsing Routes.
 */

/**
 * [CORE Controller : POST]
 * @param  {Object}   req [request]
 * @param  {Object}   res  [response]
 * @param  {Function} next [next]
 */
exports.POST = (req, res, next) => {

    /**
     * [if req.path is OAUTH/TOKEN then generates token
     * @return {String}          [BEARER TOKEN]
     */

    if (req.path == '/oauth/token') {

        var oBody = req.body
        new TokenProcessor(oBody).generateToken().then((otoken) => {
            res.status(201).send(otoken)
        }).catch((err) => {
            console.log(err)
            res.status(500).send(err.message)
        })
    }

    /**
     * [if req.path is PARSE then does the NLP and translastion based on APP config]
     * @return {Object}          [translated nlp and conifguration data]
     */
    if (req.path == '/parse') {

        if ("text" in req.body && req.body.text != "") {
            
            /* new code*/
            new RequestProcessor(req, res, next).process()
          
        } else {
            var error = new Error("Empty Text or Missing Text in request body")
            error.status = 405
            next(error)
        }
    }
}