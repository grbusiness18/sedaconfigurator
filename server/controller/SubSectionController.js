'use strict'
const logger = require('../../utility/logger')
const IntentDBHandler = require('../db/api/intentdbhandler.js')
const SubController = require('./SubController.js')

/**
 * SUBSECTION controller class handles all the HTTP requests for segments in intents.
 */

/**
 * [SUB SECTION Controller : POST Method Handler for creating new subsegments]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [Next Function]
 * @param  {String}   sSection [Sub segment name]
 */
exports.POST = (req, res, next, sSection) => {
    var oData = req.body || {}
    if (JSON.stringify(oData) == "{}") {
        var error = new Error("Empty Body")
        error.status = 405
        next(error)
        return
    }

    var query = {
        "_id": req.params.intentid,
        "app_id": req.params.appid
    }
    new IntentDBHandler().getIntent(query).then((oIntentData) => {

        try {
            CallSubController(sSection, oIntentData, "", res, req.body, req.method)
        } catch (e) {
            logger.error("error occurred" + e.message)
            var error = new Error(e.message)
            error.status = 500
            next(error)
        }
    }).catch((err) => {
        logger.error("error occurred" + err.message)
        var error = new Error("Invalid App " + req.params.id)
        error.status = 500
        next(error)
    })
}

/**
 * [SUB SECTION Controller : Get Method handler for routes = all to take care of READ operations]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [Next Function]
 */
exports.GET = (req, res, next, sSection) => {
    var query = {
        "app_id": req.params.appid,
        "_id": req.params.intentid
    }
    new IntentDBHandler().getIntent(query).then((data) => {
        CallSubController(sSection, data, "", res, {}, req.method)
    }).catch((err) => {
        res.status(500).send(err)
    })
}

/**
 * [SUB SECTION Controller : DELETE method handler to take care of delete operation]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [Next Function] */
exports.DELETE = (req, res, next, sSection) => {

    var sid = ""
    if ("responseid" in req.params) {
        sid = req.params.responseid
    }
    if ("entityid" in req.params) {
        sid = req.params.entityid
    }

    if ("actionid" in req.params) {
        sid = req.params.actionid
    }

    if ("followupid" in req.params) {
        sid = req.params.followupid
    }

    if ("fallbackid" in req.params) {
        sid = req.params.fallbackid
    }

    var query = {
        "app_id": req.params.appid,
        "_id": req.params.intentid
    }
    new IntentDBHandler().getIntent(query).then((oAPP) => {
        try {
            CallSubController(sSection, oAPP, sid, res, req.body, req.method)
        } catch (e) {
            logger.error("error occurred" + e.message)
            var error = new Error(e.message)
            error.status = 500
            next(error)
        }
    }).catch((err) => {
        logger.error("error occurred" + err.message)
        var error = new Error("Invalid App " + req.params.id)
        error.status = 500
        next(error)
    })
}

/**
 * [SUB SECTION Controller : PUT Method handler deals with DB updates]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [Next Function]
 */
exports.PUT = (req, res, next, sSection) => {

    var sid = ""
    if ("responseid" in req.params) {
        sid = req.params.responseid
    }
    if ("entityid" in req.params) {
        sid = req.params.entityid
    }

    if ("actionid" in req.params) {
        sid = req.params.actionid
    }

    if ("followupid" in req.params) {
        sid = req.params.followupid
    }

    if ("fallbackid" in req.params) {
        sid = req.params.fallbackid
    }
    var query = {
        "app_id": req.params.appid,
        "_id": req.params.intentid
    }
    console.log("SuB ID", sid, query)
    new IntentDBHandler().getIntent(query).then((oAPP) => {
        try {
            CallSubController(sSection, oAPP, sid, res, req.body, req.method)
        } catch (e) {
            logger.error("error occurred" + e.message)
            var error = new Error(e.message)
            error.status = 500
            next(error)
        }
    }).catch((err) => {
        logger.error("error occurred" + err.message)
        var error = new Error("Invalid App " + req.params.id)
        error.status = 500
        next(error)
    })
}



// *
//  * [CallSubController Private Function which calls subcontroller which deals with subsegments DB processing.]
//  * @param  {string} sSection [sub section property name in the intent]
//  * @param  {object} oApp     [Intent configuration data]
//  * @param  {string} sID      [Identifier]
//  * @param  {object} oRes     [response object]
//  * @param  {object} oBody    [new values]
//  * @param  {string} sMethod  [HTTP request method name]

function CallSubController(sSection, oApp, sID, oRes, oBody, sMethod) {
    new SubController(sSection, oApp, sID, oRes)
        .callActionProcessor(oBody, sMethod)
}