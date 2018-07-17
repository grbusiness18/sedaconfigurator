'use strict'

const PayloadBuilder = require('./payloadbuilder.js')
const NewConvProcessor = require('./newconvprocessor.js')

class NonConvProcessor {
    constructor(oInstance) {
        this.RP = oInstance
    }

    process() {
        try {
            if (this.checkIntentIsConversible()) {
                // trigger new conversation
                console.log("Trigger New Conversation")                
                new NewConvProcessor(this.RP).process()
                
            } else {
                new PayloadBuilder(this.RP).buildGeneralOutput()
            }
        } catch (e) {
            var err = e
            err.status = 500
            this.RP.http.get('next')(e)
        }
    }

    checkIntentIsConversible() {
        try {

            console.log('Check Intents', this.RP.intents.get(this.RP.recast.get('output')))
            var bFlag = this.RP.intents.get(this.RP.recast.get('output')['intent'])['is_conversation']
            return bFlag ? true : false
        } catch (e) {
            return false
        }
    }
}

module.exports = NonConvProcessor