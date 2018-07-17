'use strict'

const logger = require('../../utility/logger')
const AppDBHandler = require('../db/api/appdbhandler.js')
const ParserLogDBHandler = require('../db/api/parserlogdbhandler.js')

/**
 * ParserLog Controller handles the logs for parser routes.
 */

/**
 * [ParserLog Controller : POST method for new logs creations]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [Next Function]
 */
exports.POST = (req, res, next) => {
    var odata = req.body
    var query = {
        "_id": req.params.appid
    }

    if (JSON.stringify(odata) == "{}") {
        var error = new Error("Empty body for log creation")
        error.status = 405
        next(error)
    } else {
        new AppDBHandler().getApp(query).then((data) => {
            odata["app_id"] = req.params.appid
            new ParserLogDBHandler().createNewParserLog(odata).then((olog) => {
                res.status(201).send(olog)
            }).catch((err) => {
                res.status(500).send(err)
            })

        }).catch((err) => {            
            var error = new Error("Invalid App ID")
            error.status = 405
            next(error)
        })
    }
}

/**
 * [ParserLog Controller : Get all logs for the give app id]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [description]
 */
exports.GET = (req, res, next) => {
    var query = {
        "_id": req.params.appid
    }

    new AppDBHandler().getApp(query).then((data) => {
        new ParserLogDBHandler().getAllParserLogs({
            "app_id": req.params.appid
        }).then((ologs) => {
            res.status(200).send(ologs)
        }).catch((err) => {
            console.log("Get ALL Logs", err)
            res.status(500).send(err)
        })

    }).catch((err) => {
        var error = new Error("Invalid App ID")
        error.status = 405
        next(error)
    })
}

/**
 * [ParserLog Controller : Delete all logs for the give app id]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [description]
 */
exports.DELETE = (req, res, next) => {
    var query = {
        "_id": req.params.appid
    }

    new AppDBHandler().getApp(query).then((data) => {
        new ParserLogDBHandler().deleteParserLogAll({
            "app_id": req.params.appid
        }).then((ologs) => {
            res.status(201).send(ologs)
        }).catch((err) => {
            res.status(500).send(err)
        })

    }).catch((err) => {
        var error = new Error("Invalid App ID")
        error.status = 405
        next(error)
    })
}