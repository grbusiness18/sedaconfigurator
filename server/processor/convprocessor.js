'use strict'

const PayloadBuilder = require('./payloadbuilder.js')
const ConvMemDBHandler = require('../db/api/convmemorydbhandler.js')
const syncEach = require('sync-each')

class ConvProcessor {
    constructor(oInstance) {
        this.RP = oInstance
        this.convdb = {}
    }

    process() {
        console.log("In Conversation Processor - Process")
        var self = this
        try {

            if (this.isConvDBExists() == false) {
                console.log("No ConvDB exists")
                throw new Error("Invalid conversation: " + this.getConversationIDFromRequest())
            } else {
                this.convdb = this.getConversationDB()
            }

            if (this.isStepNameExistsInRequest() == false) {
                // well this should not happen but if happens raise error.
                console.log("No Steps exists")
                throw new Error("Empty step name")
            }

            if (this.isConvIntentExists() == false) {
                // well this should not happen but if happens raise error.
                console.log("No Intent exists")
            }

            // if (this.isCurRecastIntentDiffFromConvIntent()) {

            //     if (this.isCrossIntentAllowed()) {
            //         this.processConversation()

            //     } else {

            //         // what should we do when the intents not matched
            //         console.log("Different Intent")
            //         var oConversation = this.convdb
            //         oConversation.conv_end = true
            //         oConversation.conv_error = true
            //         oConversation.conv_steps = []
            //         oConversation.current_step = 'complete'
            //         console.log("oConversation", oConversation)
            //         this.RP["conversation"] = oConversation

            //         new PayloadBuilder(this.RP).buildConversationCombinationOutput()
            //     }

            // } else {                
            this.processConversation()
                // }
        } catch (e) {
            new PayloadBuilder(this.RP).buildConversationErrorOutput(e)
        }
    }

    processConversation() {
        var self = this
        var oConversation = this.getConversationDB()

        if (this.isOkParamMatched()) {
            // return the next step
            // 
            console.log("Next steps avail", self.isNextStepsAvailable())
            this.setCurrentStepComplete().then((data) => {

                if (self.isNextStepsAvailable()) {

                    var oNextStep = self.getNextStepsFromDB()
                    console.log("Current Step", oNextStep)
                    oConversation.current_step = oNextStep.step_name
                    oConversation.conv_steps = oConversation.conv_steps.filter((ele) => {
                        return ele.step_name == oNextStep.step_name
                    })
                    this.RP.conversation = oConversation

                    if (this.RP.ignore_nlp) {
                        new PayloadBuilder(this.RP).buildConversationOutput_Processed()
                    } else {
                        new PayloadBuilder(this.RP).buildConversationOutput()
                    }


                } else {

                    console.log("Conversation Complete")                    
                    self.setConversationComplete().then((data) => {
                        console.log("Conversation Complete true", data)
                        oConversation["conv_end"] = true
                        delete oConversation["current_step"] 
                        oConversation.conv_steps = []
                        if (self.RP.intents.get(oConversation.conv_intent)['actions'].length > 0){
                            oConversation.conv_steps.push({
                                "actions" :  self.RP.intents.get(oConversation.conv_intent)['actions']
                            })
                        }                       
                        if (self.RP.intents.get(oConversation.conv_intent)['responses'].length > 0){
                            oConversation.conv_steps.push({
                                "responses" : self.RP.intents.get(oConversation.conv_intent)['responses']
                            }) 
                        }
                        this.RP.conversation = oConversation
                        if (this.RP.ignore_nlp) {
                            new PayloadBuilder(this.RP).buildConversationOutput_Processed()
                        } else {
                            new PayloadBuilder(this.RP).buildConversationOutput()
                        }
                    }).catch((err) => {
                        // what 2 do
                        console.log("Conversation Complete Error", err)
                        new PayloadBuilder(this.RP).buildConversationErrorOutput(err)
                    })
                }
            }).catch((err) => {
                new PayloadBuilder(this.RP).buildConversationErrorOutput(err)
            })

        } else {
            // return the current step                
            var oCurrentStep = self.getCurrentStepFromDB()
            console.log("Current Step", oCurrentStep)
            oConversation.conv_steps = oConversation.conv_steps.filter((ele) => {
                return ele.step_name == oCurrentStep.step_name
            })
            oConversation.current_step = oCurrentStep.step_name
            this.RP.conversation = oConversation
            if (this.RP.ignore_nlp) {
                new PayloadBuilder(this.RP).buildConversationOutput_Processed()
            } else {
                new PayloadBuilder(this.RP).buildConversationOutput()
            }
        }
    }

    getConversationFromRequest() {
        return this.RP.http.get('req')['body']['conversation']
    }


    getConversationIDFromRequest() {
        return this.RP.http.get('req')['body']['conversation']['conversation_id']
    }

    getCurrentStepFromRequest() {
        return this.RP.http.get('req')['body']['conversation']['current_step']
    }

    getCurrentIntentFromRequest() {
        return this.RP.http.get('req')['body']['conversation']['conv_intent']
    }


    isConvIntentExists() {
        return this.getCurrentIntentFromRequest() != "" ? true : false
    }

    isStepNameExistsInRequest() {
        return this.getCurrentStepFromRequest() != "" ? true : false
    }

    isCurRecastIntentDiffFromConvIntent() {
        return (this.getConversationFromRequest().conv_intent != this.RP.recast.get('output')['intent']) ? true : false
    }

    isConvDBExists() {
        return (this.RP.conversationdb.has(this.getConversationIDFromRequest()) &&
            JSON.stringify(this.RP.conversationdb.get(this.getConversationIDFromRequest())) != "{}") ? true : false
    }

    isCrossIntentAllowed() {
        var oCrossIntent = new Set(this.RP.intents.get(this.getConversationFromRequest().conv_intent).cross_intents)
        return oCrossIntent.has(this.RP.recast.get('output')['intent'])
    }

    isOkParamExists() {
        return this.getConversationFromRequest()['ok_param'] != "" ? true : false
    }

    getConversationDB() {
        return this.RP.conversationdb.get(this.getConversationIDFromRequest())
    }

    isOkParamMatched() {
        var ok_param = this.getConversationFromRequest()["ok_param"]
        var convdb = this.getConversationDB()
        var aCurrentStep = convdb.conv_steps.filter((ele) => {
            return ele.step_name == this.getCurrentStepFromRequest()
        })

        if (aCurrentStep.length > 0) {
            if (ok_param == aCurrentStep[0].ok_param) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    setCurrentStepComplete() {
        var convdb = this.getConversationDB()
        var oCurrentStep = this.getCurrentStepFromDB()
        var aOther_steps = convdb.conv_steps.filter((ele) => {
            return ele.step_name != this.getCurrentStepFromRequest()
        })

        oCurrentStep.step_complete = true
        aOther_steps.push(oCurrentStep)
        
        var oNewValues = {
            conv_steps: aOther_steps
        }        
        return new Promise((resolve, reject) => {
            new ConvMemDBHandler().updateConvMem(this.getConversationIDFromRequest(),
                oNewValues).then((data) => {
                resolve()
            }).catch((err) => {
                reject(err)
            })
        })
    }

    isNextStepsAvailable() {
        var convdb = this.getConversationDB()
        var aSteps = convdb.conv_steps.filter((ele) => {
            return ele.step_name != this.getCurrentStepFromRequest() && ele["step_complete"] == false
        })        
        return (aSteps.length > 0) ? true : false
    }

    getCurrentStepFromDB() {
        var convdb = this.getConversationDB()        
        var aCurrentStep = convdb.conv_steps.filter((ele) => {
            return ele.step_name == this.getCurrentStepFromRequest()
        })
        return aCurrentStep[0]
    }

    getNextStepsFromDB() {
        var convdb = this.getConversationDB()
        var aNextSteps = convdb.conv_steps.filter((ele) => {
            return ele.step_name != this.getCurrentStepFromRequest() && ele["step_complete"] == false
        })
        return aNextSteps[0]
    }

    setConversationComplete() {
        var oNewValues = {
            conv_end: true
        }
        return new Promise((resolve, reject) => {
            new ConvMemDBHandler().updateConvMem(this.getConversationIDFromRequest(),
                oNewValues).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }
}


module.exports = ConvProcessor