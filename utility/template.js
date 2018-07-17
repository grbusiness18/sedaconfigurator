'use strict'

const uuidv1 = require('uuid/v1')

function action() {
    this.action = {}
    this.action["method"] = "",
    this.action["path"] = "",
    this.action["destination"] = ""
    this.action["condition"] = {
        "entity": "",
        "operator": 0
    }
}

function listofactions() {
    this.loa = {}
    this.loa["step"] = 0
    this.loa["actions"] = new action().action
}

function last_conversation() {
    this.lc = {}    
    this.lc["step"] = 0
    this.lc["last_memory"] = {}
    this.lc["last_intent"] = ""
    this.lc["last_confidence"] = 0.00
}

function query() {
    this.query = {}
    this.query["text"] = ""
}

function user() {
    this.user = {}
    this.user["id"] = ""
    this.user["email"] = ""
    this.user["defined_conversation"] = []
    this.user["last_conversation"] = new last_conversation().lc
    this.user["last_query"] = new query().query
}


function conversation() {
    this.conversation_id = uuidv1()
    this.user = new user().user
    this.createdon = new Date().valueOf()
}

exports.conversation = conversation
exports.conversation = listofactions
exports.conversation = action

