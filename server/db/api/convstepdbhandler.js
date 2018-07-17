'use strict'

const model = require('../../db/models/model.js')
const DBHandler = require('./db.js')
const IntentDBHandler = require('./intentdbhandler.js')
const INTENTDB = model.intentdb


/**
 *  Intent DB Handler class extends DBHandler Class
 *  This class handles the logic for IntentDB specific CRUD operations
 */
class ConvStepDBHandler extends IntentDBHandler {

    /**
     * [constructor Pass the DB Model to parent constructor.]
     * @return {object} [instance]
     */

    constructor() {
        super(INTENTDB)
    }

    createNewConversationStep(oConvStep = {}, oIntent = {}) {
        var self = this
        var oBody = oIntent
        var idx = oBody["conversations"].push(oConvStep)
        console.log("Length", oBody["conversations"].length)
        try {
            //oBody["conversations"][idx - 1]["dropdowns"].push(...oConvStep.dropdowns)
            //oBody["conversations"][idx - 1]["texts"].push(...oConvStep.texts)
            //oBody["conversations"][idx - 1]["actions"] = oConvStep.actions
            var query = {
                "_id": oIntent._id,
                "app_id": oIntent.app_id
            }
            console.log("Before oBody", oBody)
            return new Promise((resolve, reject) => {
                self.updateIntent(query, oBody).then((data) => {
                    resolve(data)
                }).catch((err) => {
                    reject(err)
                })
            })
        } catch (e) {
            console.log(e)
            throw new Error(e)
        }

    }

    deleteConversationSteps(oConvStep = {}, oIntent = {}) {
        var self = this
        var oBody = oIntent

        if (JSON.stringify(oConvStep) == "{}") {
            oBody["conversations"] = []
        } else {
            var aConversations = oIntent["conversations"].filter((oConv) => {
                return oConv._id != oConvStep._id
            })
            oBody["conversations"] = aConversations || []
        }

        var query = {
            "_id": oIntent._id,
            "app_id": oIntent.app_id
        }

        return new Promise((resolve, reject) => {
            self.updateIntent(query, oBody).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    updateConversationSteps(oConvStep = {}, oIntent = {}, convid) {        
        var self = this
        var oBody = oIntent
        var aConversations = oIntent["conversations"].filter((oConv) => {
            return oConv._id != convid
        })

        oBody.conversations = []
        oBody.conversations.push(...aConversations)
        oBody.conversations.push(oConvStep)
        var query = {
            "_id": oIntent._id,
            "app_id": oIntent.app_id
        }
        console.log("ConvSTEP", oBody.conversations)
        return new Promise((resolve, reject) => {
            self.updateIntent(query, oBody).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }
}



function ConversationStep(oIntent={}, oConvStep = {}, id) {
    this.intent = oIntent
    var aConversations = oIntent["conversations"].filter((oConv) => {
            return oConv._id != oConvStep._id
    })

}

module.exports = ConvStepDBHandler