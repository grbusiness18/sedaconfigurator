'use strict'

const PayloadBuilder = require('./payloadbuilder.js')
const ConvMemDBHandler = require('../db/api/convmemorydbhandler.js')
const uuidv1 = require('uuid/v1')
const syncEach = require('sync-each')

class NewConvProcessor {
    constructor(oInstance) {
        this.RP = oInstance
        this.intent = {}
    }

    process() {
        this.intent = this.RP.intents.get(this.RP.recast.get('output')['intent'])

        if ("conversations" in this.intent &&
            this.intent.conversations.length > 0) {
            this.triggerConversations()
        } else {
            new PayloadBuilder(this.RP).buildGeneralOutput()
        }
    }

    triggerConversations() {
        var self = this
        var oConversation = {
            "conversation_id": uuidv1(),
            "app_id": this.RP.app.get('app')['_id'],
            "conv_intent": this.RP.recast.get('output')['intent'],
            "current_step": "",
            "conv_end": false,
            "conv_error": false,
            "conv_steps": []
        }

        syncEach(this.intent.conversations, (oConv, next) => {
            var steps = {}
            if (oConv.execonnullentity && oConv.belongstoentity != "") {
                if (self.IsRecastEntityIsEmpty(oConv.belongstoentity)) {
                    steps['step_name'] = oConv.step_name
                    steps['step_type'] = oConv.step_type
                    steps['ok_param'] = oConv.ok_param
                    steps['belongstoentity'] = oConv.belongstoentity
                    steps['execonnullentity'] = oConv.execonnullentity
                    steps['actions'] = oConv.actions
                    steps['dropdowns'] = oConv.dropdowns
                    steps['texts'] = oConv.texts
                }
            } else {
                steps['step_name'] = oConv.step_name
                steps['step_type'] = oConv.step_type
                steps['belongstoentity'] = oConv.belongstoentity
                steps['execonnullentity'] = oConv.execonnullentity
                steps['ok_param'] = oConv.ok_param
                steps['actions'] = oConv.actions
                steps['dropdowns'] = oConv.dropdowns
                steps['texts'] = oConv.texts
            }

            if (JSON.stringify(steps) != "{}") {
                oConversation.conv_steps.push(steps)
            }
            next()
        }, () => {

            if (oConversation.conv_steps.length > 0 && "step_name" in oConversation.conv_steps[0]) {
                oConversation.current_step = oConversation.conv_steps[0].step_name
            } else {
                oConversation.current_step = 'complete'
                oConversation.conv_end = true
            }

            console.log("New Conversation", oConversation)

            new ConvMemDBHandler().createNewConvMem(oConversation)
                .then((data) => {
                    this.RP.conversation = oConversation
                    this.RP.conversation.conv_steps = (oConversation.conv_steps.length > 0) ?
                        [oConversation.conv_steps[0]] : []
                    new PayloadBuilder(this.RP).buildConversationOutput()
                }).catch((err) => {
                    console.log(err)
                    this.RP.http.get('next')(err)
                })

        })
    }

    IsRecastEntityIsEmpty(sEntity) {

        console.log("recast entities", this.RP.recast.get('output').entities)
        if (this.RP.recast.get('output').entities.length == 0) {
            return true
        }
        var aEntity = this.RP.recast.get('output').entities.filter((oEntity) => {
            return oEntity.name == sEntity
        })
        console.log("FOund Entity", aEntity)
        if (aEntity.length == 0){
            return true
        } else {
            if (aEntity[0].values.length == 0){
                return true
            } else{
                return false
            }
        }
    }
}

module.exports = NewConvProcessor