'use strict'

const request = require('request-promise')
const recastai = require('recastai')
const mongoose = require('mongoose')
const syncEach = require('sync-each')
const AppDBHandler = require('../db/api/appdbhandler.js')
const IntentDBHandler = require('../db/api/intentdbhandler.js')



/**
 * NLP Processor class
 * It takes the input text and check against configurations.
 * It does NLP parsing via recastai.
 * It translates the result as per the Intent configuration.
 */
class NLPProcessor {

    /**
     * [constructor description]
     * @param  {Object} oAPP  [Application Configuration]
     * @param  {String} sText [Input Text to be parsed by recastai]
     * @param  {Object} res   [Express Response Object]
     */
    constructor(oAPP = {}, sText = "", res = {}, req={}) {
        if (JSON.stringify(oAPP) == "{}") {
            throw new Error("Empty App Data for NLP processing")
        }

        if ("recast" in oAPP == false) {
            throw new Error("NLP config is missing in APP " + oAPP._id)
        }

        if (sText == "") {
            var error = new Error("Request Text is Missing to Parse")
            error.status = 405
            throw error
        }
        this.oAPP = oAPP
        this.sourceText = sText
        this.res = res
        this.req = req
    }

    /**
     * [processNLP Trigger the method to call recastai]
     * @return {object} [returns a promise object]
     */
    processNLP() {
        var self = this
        return new Promise((resolve, reject) => {
            self.recastNLPProcess().then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * [recastNLPProcess Actual method which calls the recastai]
     * @return {Object} [returns a promise object]
     */
    recastNLPProcess() {
        var self = this
        return new Promise((resolve, reject) => {
            var client = new recastai.request(self.oAPP.recast.token, 'en')
            client.analyseText(self.sourceText).then((data) => {
                resolve(data)
            }).catch((err) => {                
                reject(err)
            })
        })
    }

    /**
     * [translateNLPResponse Method which translates the recastai response to configurator response]
     * @param  {Object} oNLPResponse [Response from recastai]     
     */
    translateNLPResponse(oNLPResponse = {}) {
        var self = this
        var oPayload = {}
        oPayload["intent"] = oNLPResponse.intents[0].slug
        oPayload["confidence"] = oNLPResponse.intents[0].confidence
        oPayload["entities"] = []
        var appid = new mongoose.Types.ObjectId(this.oAPP._id)

        var query = {
            "app_id": appid,
            "intent_name": oPayload["intent"]
        }
        Object.keys(oNLPResponse.entities).forEach((oEntity, iIndex, oEntityArr) => {
            oPayload["entities"].push({
                "name": oEntity,
                "value": oNLPResponse["entities"][oEntity][0]["raw"]
            })
        })
        new IntentDBHandler().getIntent(query).then((oIntentData) => {
            oPayload["responses"] = oIntentData.responses
            oPayload["requiredParams"] = []
            oPayload["fallback"] = oIntentData.fallback
            oPayload["actions"] = oIntentData.actions.length > 0 ? oIntentData.actions[0] : {}

            if (oIntentData.entities.length > 0) {
                syncEach(oIntentData.entities, (oEntity, next) => {
                    if (oEntity["is_required"] == true) {
                        oPayload["requiredParams"].push(oEntity.name)
                    }
                    next()
                }, () => {
                    self.captureLog(oPayload)
                    self.res.status(200).send(oPayload)
                })

            } else {
                self.captureLog(oPayload)
                self.res.status(200).send(oPayload)
            }
            console.log("payload", oPayload)

        }).catch((err) => {
            self.captureLog(err)
            console.log(err)
            console.log("Error in get Intent.." + oPayload["intent"])
            self.res.status(500).send(err.message)
        })
    }


    /**
     * [captureLog method to capture the parse log]
     * @param  {Object} oOutput [Object response]
     */
    captureLog(oOutput = {}) {
        var self = this
        var sInput = this.sourceText
        var sOutput = JSON.stringify(oOutput)
        var sURL = self.req.headers.host + '/' + self.req.baseUrl + this.oAPP._id + '/logs/create'
        if (self.req.headers.host == 'localhost:3000') {
            sURL = 'http://' + sURL
        } else {
            sURL = 'https://' + sURL
        }
        request({
            url: sURL,
            method: "POST",
            json: true,
            body: {
                input: sInput,
                output: sOutput,
                logtype: 'c'
            }
        }).then((olog) => {
            console.log("log Posted")
        }).catch((err) => {
            console.log(err)
            console.log("log post error", err.message)
        })
    }
}


module.exports = NLPProcessor