'use strict'
const logger = require('../../utility/logger')
const AppDBHandler = require('../db/api/appdbhandler.js')
const schemaItems = require('../db/schemas/schema.js')
const TokenGenerator = require('uuid-token-generator')

/**
 * APP controller class handles all the HTTP requests for apps specific routes
 */

/**
 * [APP Controller: POST Method Handler for creating new APPS]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [Next Function]
 */
exports.POST = (req, res, next) => {
    var odata = req.body
    if (JSON.stringify(odata) == "") {
        var error = new Error("Empty Body for App creation")
        error.status = 405
        next(error)
    } else {

        const clientsecret = new TokenGenerator(512, TokenGenerator.BASE62).generate()
        const clientid = new TokenGenerator(256, TokenGenerator.BASE62).generate()
        odata["credentials"] = {
            "clientid": clientid,
            "clientsecret": clientsecret
        }

        if (("description" in odata) && ("restobj" in odata) && ("name" in odata)) {

            if ("url" in odata.restobj == false) {
                console.log("no url")
                var error = new Error("No url in Rest Object")
                error.status = 405
                next(error)
            }

            if ("method" in odata.restobj == false) {
                console.log("no method")
                var error = new Error("No Method in Rest Object ")
                error.status = 405
                next(error)
            }

            if (odata.description == "" || odata.name == "") {
                var error = new Error("Empty APP Description or Name")
                error.status = 405
                next(error)

            } else {
                new AppDBHandler().createNewApp(odata).then((data) => {
                    res.status(201).send(data)
                }).catch((err) => {
                    res.status(500).send(err)
                })
            }

        } else {
            logger.error("Empty App Description or name or NLP configurations is missing")
            var error = new Error("Empty App Description or name or NLP configurations is missing")
            error.status = 405
            next(error)
        }
    }
}

/**
 * [APP Controller: GET Method handler for routes = all / name / appid  to take care of READ operations]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [Next Function]
 */
exports.GET = (req, res, next) => {
    logger.debug("Get Method", req.path)
    if (req.path == "/apps/all") {
        new AppDBHandler().getAllApps().then((data) => {
            res.status(200).send(data)
        }).catch((err) => {
            logger.error(err.message)
            res.status(500).send(err)
        })
    } else {

        var query = {}
        if (req.path == "/apps/name/" + req.params.name) {
            query["App_name"] = req.params.name
        }

        if (req.path == "/apps/" + req.params.appid) {
            query["_id"] = req.params.appid
        }
        logger.info(query)
        new AppDBHandler().getApp(query).then((data) => {
            res.status(200).send(data)
        }).catch((err) => {
            res.status(500).send(err.message)
        })
    }
}


/**
 * [APP Controller : PUT Method handler deals with DB updates]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [Next Function]
 */
exports.PUT = (req, res, next) => {
    if (req.params.name == "") {
        res.status(405).send(new Error("App Name is Empty"))
    } else {
        var query = {}
        query["_id"] = req.params.appid

        new AppDBHandler().updateApp(query, req.body).then((data) => {
            res.status(201).send(data)
        }).catch((err) => {
            res.status(500).send(err)
        })
    }
}


/**
 * [APP Controller : DELETE method handler to take care of delete operation]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [Next Function]
 */
exports.DELETE = (req, res, next) => {
    if (req.params.name == "") {
        res.status(500).send(new Error("App Name is Empty"))
    } else {
        var query = {}
        query["_id"] = req.params.appid

        new AppDBHandler().deleteApp(query).then((data) => {
            res.status(200).send(data)
        }).catch((err) => {
            res.status(500).send(err)
        })
    }
}