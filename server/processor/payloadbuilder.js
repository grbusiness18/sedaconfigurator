'use strict'

const syncEach = require('sync-each')

class PayloadBuilder {
    constructor(oInstance) {
        this.RP = oInstance
        this.payload = {}
        console.log("PayloadBuilder")
    }

    buildGeneralOutput() {
        try {
            var self = this
            var oRecastOP = this.RP.recast.get('output')
            var oIntentConfig = {}
            oIntentConfig = this.RP.intents.get(this.RP.recast.get('output').intent) || {}
            this.payload["intent"] = oRecastOP.intent
            this.payload["confidence"] = oRecastOP.confidence
            this.payload["source"] = oRecastOP.source
            this.payload["entities"] = oRecastOP["entities"]
            //this.payload["entities"] = []
            // Object.keys(oRecastOP.entities).forEach((oEntity) => {
            //     self.payload["entities"].push({
            //         "name": oEntity,
            //         "value": oRecastOP["entities"][oEntity][0]["raw"]
            //     })
            // })
            //

            this.payload["requiredParams"] = []
            this.payload["responses"] = ('responses' in oIntentConfig) ? oIntentConfig.responses : []
            this.payload["fallback"] = oIntentConfig.fallback || ""
            this.payload["actions"] = ("actions" in oIntentConfig && oIntentConfig.actions.length > 0) ?
                oIntentConfig.actions : []
            this.payload["followup"] = ("followup" in oIntentConfig && oIntentConfig.followup.length > 0) ?
                  oIntentConfig.followup : []

            if (this.payload.actions.length > 0) {
                var actions = []
                syncEach(this.payload.actions, (oAction, next) => {
                    var oaction = new mapPathValueToEntityValue(self.payload["entities"], oAction).action
                    actions.push(oAction)
                    next()
                }, () => {
                    this.payload.actions = actions
                })
            }

            //console.log("Intent Configu", oIntentConfig)

            if (oIntentConfig.entities.length > 0) {
                syncEach(oIntentConfig.entities, (oEntity, next) => {
                    if (oEntity["is_required"] == true) {
                        self.payload["requiredParams"].push(oEntity.name)
                    }
                    next()
                }, () => {
                    self.RP.http.get('res').status(201).send(self.payload)
                })
            } else {
                self.RP.http.get('res').status(201).send(self.payload)
            }
        } catch (e) {
            //throw e
            console.log("General Errror :", e)
            self.RP.http.get('next')(e)
        }
    }


    buildConversationOutput() {
        var aEntities = []
        var oRecastOP = this.RP.recast.get('output')
        // Object.keys(oRecastOP.entities).forEach((oEntity) => {
        //     aEntities.push({
        //         "name": oEntity,
        //         "value": oRecastOP["entities"][oEntity][0]["raw"]
        //     })
        // })
        var oIntentConfig = (this.RP.intents.has(this.RP.recast.get('output').intent)) ?
            this.RP.intents.get(this.RP.recast.get('output').intent) : {}


        aEntities = oRecastOP["entities"]
        try {
            delete this.RP.conversation.created_on
            delete this.RP.conversation.changed_on

            if (this.RP.conversation.conv_steps.length > 0 &&
                this.RP.conversation.conv_steps[0].actions.length > 0) {
                var actions = []
                syncEach(this.RP.conversation.conv_steps[0].actions, (oAction, next) => {
                    var oaction = new mapPathValueToEntityValue(aEntities, oAction).action
                    actions.push(oAction)
                    next()
                }, () => {
                    this.RP.conversation.conv_steps[0].actions = actions
                })
            }

            this.payload['conversation'] = this.RP.conversation
            this.payload['conversation']['entities'] = aEntities
            this.payload["followup"] = ("followup" in oIntentConfig && oIntentConfig.followup.length > 0) ?
                  oIntentConfig.followup : []
            this.RP.http.get('res').status(201).send(this.payload)
        } catch (e) {
            //throw e
            console.log("Error -capture ", e)
            this.RP.http.get('next')(e)
        }
    }

    buildConversationCombinationOutput() {
        try {

            var self = this
            var oRecastOP = this.RP.recast.get('output')
            var oIntentConfig = (this.RP.intents.has(this.RP.recast.get('output').intent)) ?
                this.RP.intents.get(this.RP.recast.get('output').intent) : {}
            this.payload["intent"] = oRecastOP.intent
            this.payload["confidence"] = oRecastOP.confidence
            this.payload["source"] = oRecastOP.source
            // this.payload["entities"] = []
            // Object.keys(oRecastOP.entities).forEach((oEntity) => {
            //     self.payload["entities"].push({
            //         "name": oEntity,
            //         "value": oRecastOP["entities"][oEntity][0]["raw"]
            //     })
            // })
            //
            this.payload["entities"] = oRecastOP["entities"]

            if (this.RP.conversation.conv_steps.length > 0 &&
                this.RP.conversation.conv_steps[0].actions.length > 0) {
                var actions = []
                syncEach(this.RP.conversation.conv_steps[0].actions, (oAction, next) => {
                    var oaction = new mapPathValueToEntityValue(aEntities, oAction).action
                    actions.push(oAction)
                    next()
                }, () => {
                    this.RP.conversation.conv_steps[0].actions = actions
                })
            }
            console.log()
            this.payload['conversation'] = this.RP.conversation
            this.payload['conversation']['entities'] = this.payload["entities"]
            this.payload["requiredParams"] = []
            this.payload["responses"] = ('responses' in oIntentConfig) ?
                oIntentConfig.responses : []
            this.payload["fallback"] = ('fallback' in oIntentConfig) ? oIntentConfig.fallback : ""
            this.payload["actions"] = ("actions" in oIntentConfig && oIntentConfig.actions.length > 0) ?
                oIntentConfig.actions : []
            this.payload["followup"] = ("followup" in oIntentConfig && oIntentConfig.followup.length > 0) ?
                      oIntentConfig.followup : []
            if ("actions" in oIntentConfig && this.payload.actions.length > 0) {
                var actions = []
                syncEach(this.payload.actions, (oAction, next) => {
                    var oaction = new mapPathValueToEntityValue(self.payload["entities"], oAction).action
                    actions.push(oAction)
                    next()
                }, () => {
                    this.payload.actions = actions
                })
            }

            if ("entities" in oIntentConfig && oIntentConfig.entities.length > 0) {
                syncEach(oIntentConfig.entities, (oEntity, next) => {
                    if (oEntity["is_required"] == true) {
                        self.payload["requiredParams"].push(oEntity.name)
                    }
                    next()
                }, () => {
                    self.RP.http.get('res').status(201).send(self.payload)
                })
            } else {
                self.RP.http.get('res').status(201).send(self.payload)
            }
        } catch (e) {
            //throw e
            console.log("Errror :", e)
            this.RP.http.get('next')(e)
        }
    }

    buildConversationErrorOutput(err) {
        console.log("ConvOUT:", err)
        this.RP.http.get('next')(err)
    }

    buildConversationOutput_Processed() {
        var aEntities = []
        var oIntentConfig = (this.RP.intents.has(this.RP.recast.get('output').intent)) ?
            this.RP.intents.get(this.RP.recast.get('output').intent) : {}

        try {
            delete this.RP.conversation.created_on
            delete this.RP.conversation.changed_on

            if (this.RP.conversation.conv_steps.length > 0 &&
                this.RP.conversation.conv_steps[0].actions.length > 0) {
                var actions = []
                syncEach(this.RP.conversation.conv_steps[0].actions, (oAction, next) => {
                    var oaction = new mapPathValueToEntityValue(aEntities, oAction).action
                    actions.push(oAction)
                    next()
                }, () => {
                    this.RP.conversation.conv_steps[0].actions = actions
                })
            }

            this.payload['conversation'] = this.RP.conversation
            this.payload['conversation']['entities'] = aEntities
            this.payload["followup"] = ("followup" in oIntentConfig && oIntentConfig.followup.length > 0) ?
                      oIntentConfig.followup : []
            
            this.RP.http.get('res').status(201).send(this.payload)
        } catch (e) {
            //throw e
            console.log("Error -capture ", e)
            this.RP.http.get('next')(e)
        }

    }
}

function mapPathValueToEntityValue(oEntities, oAction) {
    this.action = {}
    var aFS = ['{{$', '$}}']
    var spath = oAction.path
    syncEach(oEntities, (oEntity, next) => {
        var oEntityMap = aFS.join(oEntity.name)
        spath = spath.replace(oEntityMap, "'" + oEntity.values + "'")
        next()
    }, () => {
        this.action = oAction
        var re = /({{\$.*?\$}})/g
        spath = spath.replace(re, "''")
        console.log(spath)
        this.action.path = spath
    })
}

module.exports = PayloadBuilder
