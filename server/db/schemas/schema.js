'use strict'

const mongoose          = require('mongoose')
const Email             = require('mongoose-type-mail')
const mongooseTypeUrl   = require('mongoose-type-url')

/**
 * module which has schema configurations for mongodb
 */



/* Name Value Pair Schema  */
const NameValuePair   = mongoose.Schema({
    "name"            : { type: String, required: true },
    "value"           : { type: String, required: true }
})


/* Source Target Schema  */
const SourceTarget    = mongoose.Schema({
    "source"          : { type: String, default: "text" },
    "target"          : { type: String, default: "text" },
    "_id"             : false
})

/* Only Text Schema */
const response        = mongoose.Schema({
    "text"            : { type: String }
})

/* Conditions Schema */
/* Operator values : 0 - empty and 1 - non empty */
const conditions      = mongoose.Schema({
    "entity"          : { type: String, required: true},
    "operator"        : { type: Number, required: true, default: 0 }   
})
/* Actions Schema */
const actions         = mongoose.Schema({
    "destination"     : { type: String, required: false },
    "path"            : { type: String, required: true },
    "method"          : { type: String, required: true, uppercase: true}
})


// follow up Action
const followup = mongoose.Schema({
  "entitiy_name"      : { type: String, required: true },
  "type"              : { type: String, enum : ['link','conversation', 'command'], required: true },
  "title"             : { type: String, required: true },
  "value"             : { type: String, required: true },
  "condition"         : { type: String, enum : ['when empty', 'when not empty'], required: true  }
})


/*  Entities Schema */
 const entities        = mongoose.Schema({
    "name"            : { type: String , required: true },
    "description"     : { type: String , required: true },
    "is_required"     : { type: Boolean, required: true, default: false }
})


/* Credentials Schema */
const credentials     = mongoose.Schema({
    "clientid"        : { type: mongoose.Schema.Types.Mixed, required: true, unique: true, index: true},
    "clientsecret"    : { type: mongoose.Schema.Types.Mixed, required: true, unique: true, index: true},
    "_id"             : false
})

/* NLP schema */
const recast          = mongoose.Schema({
    "token"           : { type: String, required: true},
    "threshold"       : { type: Number, required: true, default: 60},
    "_id"             : false
})


const conv_steps      = mongoose.Schema({
    "step_name"       : { type: String, required: true, maxlength: 30 },
    "ok_param"        : { type: String, required: true, maxlength: 30},
    "step_type"       : { type: Number, required: true, default: 1, enum:[1, 2, 3] },
    "belongstoentity" : { type: String, required: true },
    "execonnullentity": { type: Boolean, required: true, default: false}, 
    "step_complete"   : { type: Boolean, default: false}, 
    "actions"         : [actions],
    "dropdowns"       : [NameValuePair],
    "texts"           : [response]
})


/* conversation Memory */

const conversationmem = mongoose.Schema({
    "conversation_id" : { type: String, required: true, unique: true },
    "app_id"          : { type: String, required: true },
    "created_on"      : { type: Date,   required: false, default: Date.now},
    "changed_on"      : { type: Date,   required: false, default: Date.now},
    "conv_intent"     : { type: String, required: true },
    "current_step"    : { type: String, required: true },
    "conv_end"        : { type: Boolean, default: false },
    "conv_error"      : { type: Boolean, default: false }, 
    "conv_steps"      : [conv_steps]
})


const fallback       = mongoose.Schema({
    "fallback_text"   : { type: String, required: false, default: ""}
})  

/* Intent Schema for ID and Description. */
const intents         = mongoose.Schema({
    "intent_name"     : { type: String, required: true, lowercase: true},
    "description"     : { type: String, required: true},
    "is_conversation" : { type: Boolean, default: false},
    "entities"        : [entities],
    "actions"         : [actions],
    "responses"       : [response],
    "conversations"   : [conv_steps],
    "cross_intents"   : [String],
    "followup"        : [followup],
    "app_id"          : { type: mongoose.Schema.Types.ObjectId, required: true },
    "fallback"        : [fallback],
    "created_on"      : { type: Date,   required: false, default: Date.now},
    "changed_on"      : { type: Date,   required: false, default: Date.now}
})


// Rest object info- headers
const headers          = mongoose.Schema({
    "_id"             : false,
    "key"             : { type: String , required: false},
    "value"           : { type: String , required: false}
})

// Rest object info
const restobj = mongoose.Schema({
    "_id"             : false,
    "url"             : { type: String , required: true},
    "method"          : { type: String , required: true},
    "headers"         : [headers]
})


/* App Shecma */
const app             = mongoose.Schema({
    "name"            : { type: String, require: true},
    "description"     : { type: String, required: true},
    "credentials"     : credentials,
    "recast"          : recast,
    "is_active"       : { type: Boolean, default: true},  
    "created_on"      : { type: Date,   required: false, default: Date.now},
    "changed_on"      : { type: Date,   required: false, default: Date.now}

})


/* parselog */
const parserlog       = mongoose.Schema({
    "app_id"          : { type: mongoose.Schema.Types.ObjectId},
    "timestamp"       : { type: Date,   required: false, default: Date.now },
    "input"           : { type: String },
    "output"          : { type: String },
    "logtype"         : { type: String }
})



exports.appSchema               = app

exports.intentsSchema           = intents

exports.responsesSchema         = response

exports.entitiesSchema          = entities

exports.actionsSchema           = actions

exports.namevaluepairSchema     = NameValuePair

exports.parserlogSchema         = parserlog

exports.conversationmemschema   = conversationmem

exports.followupSchema          = followup

exports.fallbackSchema          = fallback

