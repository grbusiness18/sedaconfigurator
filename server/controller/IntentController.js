'use strict'
const logger = require('../../utility/logger')
const IntentDBHandler = require('../db/api/intentdbhandler.js')
const schemaItems = require('../db/schemas/schema.js')
const TokenGenerator = require('uuid-token-generator')
const template = require('../../utility/template.js')

/**
 * Intent controller class handles all the HTTP requests for Intent specific routes.
 */

/**
 * [Intent Controller : POST Method Handler for creating new Intents]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [Next Function]
 */
exports.POST = (req, res, next) => {
    var odata = req.body
    if (JSON.stringify(odata) == "") {
        var error = new Error("Empty Body for Intent Creation")
        error.status = 405
        next(error)
    } else {

        odata.created_on = Date.now()
        odata.changed_on = Date.now()
        odata["app_id"] = req.params.appid

        if (("intent_name" in odata) && ("description" in odata)) {

            odata["intent_name"] = odata.intent_name.toLowerCase().replace(/\s/g, '')
            odata["entities"] = ("entities" in odata && Array.isArray(odata.entities)) ? odata.entities : []

            if ("is_conversation" in odata) {
                odata["is_conversation"] = odata["is_conversation"] ? true : false
            } else {
                odata["is_conversation"] = false
            }

            odata["responses"] = ("responses" in odata && Array.isArray(odata.responses)) ? odata.responses : []
            odata["fallback"] = ("fallback" in odata && Array.isArray(odata.fallback)) ? odata.fallback : []
            odata["actions"] = ("actions" in odata && Array.isArray(odata.actions)) ? odata.actions : []
            odata["conversations"] = ("conversations" in odata && Array.isArray(odata.conversations)) ? odata.conversations : []
            odata["followup"] = ("followup" in odata && Array.isArray(odata.followup)) ? odata.followup : []
            odata["cross_intents"] = ("cross_intents" in odata && Array.isArray(odata.cross_intents)) ? odata.cross_intents : []


            new IntentDBHandler().createNewIntent(odata).then((data) => {
                res.status(201).send(data)
            }).catch((err) => {
                res.status(500).send(err)
            })
        } else {
            logger.error("empty body")
            var error = new Error("Empty Intent name or Description")
            error.status = 405
            next(error)
        }
    }
}

/**
 * [Intent Controller : Get Method handler for routes = all / name / intentid  to take care of READ operations]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [Next Function]
 */
exports.GET = (req, res, next) => {
    var obj = new template.conversation()
    console.log("template object", obj)
    logger.info("Get Method", req.path)
    var query = {}
    if (req.path == "/apps/" + req.params.appid + "/intents/all") {
        query["app_id"] = req.params.appid
        new IntentDBHandler().getAllIntents(query).then((data) => {
            res.status(200).send(data)
        }).catch((err) => {
            logger.error(err.message)
            res.status(405).send(err)
        })
    } else {


        if (req.path == "/apps/" + req.params.appid + "/intents/name/" + req.params.name) {
            query["intent_name"] = req.params.name
            query["app_id"] = req.params.appid
        }

        if (req.path == "/apps/" + req.params.appid + "/intents/" + req.params.intentid) {
            query["_id"] = req.params.intentid
            query["app_id"] = req.params.appid
        }
        logger.info(query)
        new IntentDBHandler().getIntent(query).then((data) => {
            res.status(200).send(data)
        }).catch((err) => {
            res.status(405).send(err.message)
        })
    }
}


/**
 * [Intent Controller : PUT Method handler deals with DB updates]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [Next Function]
 */
exports.PUT = (req, res, next) => {
    if (req.params.name == "") {
        res.status(405).send(new Error("Intent Name is Empty"))
    } else {
        var query = {}
        query["_id"] = req.params.intentid
        query["app_id"] = req.params.appid

        new IntentDBHandler().updateIntent(query, req.body).then((data) => {
            res.status(201).send(data)
        }).catch((err) => {
            res.status(500).send(err)
        })
    }
}

/**
 * [Intent Controller : DELETE method handler to take care of delete operation]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [Next Function]
 */
exports.DELETE = (req, res, next) => {
    if (req.params.name == "") {
        res.status(405).send(new Error("Intent Name is Empty"))
    } else {
        var query = {}
        query["_id"] = req.params.intentid
        query["app_id"] = req.params.appid

        new IntentDBHandler().deleteIntent(query).then((data) => {
            res.status(200).send(data)
        }).catch((err) => {
            res.status(500).send(err)
        })
    }
}