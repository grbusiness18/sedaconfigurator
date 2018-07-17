'use strict'

const NonConvProcessor = require('./nonconvprocessor.js')
const ConvProcessor = require('./convprocessor.js')

class RequestHandler {
    constructor(oInstance, bflag = Boolean) {
        this.RP = oInstance
        this.conv_flag = bflag ? true: false
    }

    processOutput() {
        try {

            console.log("Flag", this.conv_flag)
            if (this.conv_flag) {                
                new ConvProcessor(this.RP).process()
            } else {

                new NonConvProcessor(this.RP).process()
            }
        } catch (e) {
            this.RP.http.get('next')(e)
        }
    }
}

module.exports = RequestHandler

// 1. when conv is not present, only text , 
//  recast intent is not conversation => NonConversationCaller.
// 2. when conv is not present, only text,
//  recast intent is conversation => TriggerNewConversation
//  
//  when conv is present., id is valid and conv_intent & step_name is present
//  
//  1.  when diff intent from recast and ok_param is empty => 
//      keep conv + respond recast intent if its part of config else 
//      throw error close conversation
//   2. when diff intent from recast and ok_param is flagged =>
//      keep conv + respond recast intent and get next steps.
//