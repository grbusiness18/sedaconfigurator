'use strict'

const IntentDBHandler = require('../db/api/intentdbhandler.js')
const ConvMemDBHandler = require('../db/api/convmemorydbhandler.js')
const RecastProcessor = require('./recastprocessor.js')
const RequestHandler = require('./requesthandler.js')

class RequestParser {
    constructor() {
        this.http = new Map()
        this.app = new Map()
        this.intents = new Map()
        this.recast = new Map()
        this.conversationdb = new Map()
        this.ignore_nlp = false
    }

    static process(req, res, next) {
        var rp = new RequestParser()
        rp.http.set('req', req)
        rp.http.set('res', res)
        rp.http.set('next', next)
        rp.ignore_nlp = rp.isIgnoreRecastProcessing()
        console.log("ignore Nlp", rp.ignore_nlp)
        rp.processRequest().then((data) => {
            var bConvFlag = rp.checkConversationInReqBody()
            console.log("Conversation Active", bConvFlag)
            new RequestHandler(rp, bConvFlag).processOutput()

        }).catch((err) => {
            console.log("Error ---", err)
            var oERROR = new Error(err)
            oERROR.status = 500
            rp.http.get('next')(oERROR)
        })
    }


    processRequest() {
        var self = this
        var oStates = new Set()
        return new Promise((resolve, reject) => {
            var aProcess = [self.processApptoMemory(),
                self.processIntentsToMemory(),
                self.processConversationDBtoMemory()
            ]

            if (this.isIgnoreRecastProcessing() == false) {
                aProcess.push(self.processRecastToMemory())
            }

            console.log(aProcess)

            try {
                Promise.all(aProcess).then((oValues) => {
                    oValues.map(oValue => {
                        if ('recast' in oValue) {
                            oStates.add('R')
                        }

                        if ('app' in oValue) {
                            oStates.add('A')
                        }

                        if ('intents' in oValue) {
                            oStates.add('I')
                        }

                        if ('conversation' in oValue) {
                            oStates.add('C')
                        }
                    })

                }).catch((err) => {
                    reject(err)
                }).finally(() => {
                    console.log("Method States", oStates)
                    if (oStates.size == aProcess.length) {
                        resolve()
                    } else {
                        reject(new Error("Error Occured..", oStates))
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    isIgnoreRecastProcessing() {
        var oBODY = this.http.get('req')['body']
        console.log("Obody", this.http.get('req')['body'])
        return ('conversation' in oBODY && 'ignore_nlp' in oBODY.conversation) ?
            oBODY.conversation.ignore_nlp : false
    }

    checkConversationInReqBody() {
        var oBODY = this.http.get('req')['body']
        return ('conversation' in oBODY && 'conversation_id' in oBODY.conversation) ? true : false
    }

    processApptoMemory() {
        var self = this
        return new Promise((resolve, reject) => {
            try {

                if ('user' in self.http.get('req')) {
                    var app = {
                        "_id": self.http.get('req')['user']['_id'],
                        'description': self.http.get('req')['user']['description'],
                        'name': self.http.get('req')['user']['name'],
                        'recast_token': self.http.get('req')['user']['recast']['token'],
                        'recast_threshold': self.http.get('req')['user']['recast']['threshhold']
                    }
                    self.app.set('app', app)
                    resolve({
                        'app': true
                    })

                } else {
                    reject(new Error('App details is missing after token parsed.'))
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    processIntentsToMemory() {
        var self = this
        var oQuery = {
            'app_id': this.http.get('req')['user']['_id']
        }
        return new Promise((resolve, reject) => {
            try {
                new IntentDBHandler().getAllIntents(oQuery).then((aIntentData) => {
                    if (aIntentData.length > 0) {
                        aIntentData.forEach((ele) => {
                            self.intents.set(ele.intent_name, ele)
                        })

                        resolve({
                            'intents': true
                        })
                    } else {
                        reject(new Error('No intents for the APP'))
                    }
                }).catch((err) => {
                    reject(err)
                })

            } catch (e) {
                reject(e)
            }
        })
    }

    processRecastToMemory() {
        var self = this
        return new Promise((resolve, reject) => {
            try {
                var RECAST_TOKEN = self.http.get('req')['user']['recast']['token']
                var INPUT_TEXT = self.http.get('req')['body']['text']

                if (INPUT_TEXT == "") {
                    throw new Error('empty text received for recast')
                } else {
                    console.log("RECAST-TOKEN:", RECAST_TOKEN)
                    new RecastProcessor(RECAST_TOKEN).doProcess(INPUT_TEXT)
                        .then((oNLP) => {
                            var oRecastData = oNLP
                            console.log("NLP", oRecastData)
                            var oRecastOP = {
                                'intent': (oRecastData.intent != "" ) ?
                                    oRecastData.intent : "",
                                'confidence': (oRecastData.confidence > 0.00) ?
                                    oRecastData.confidence : 0.00,
                                'entities': oRecastData.entities
                            }

                            self.recast.set('output', oRecastOP)
                            resolve({
                                'recast': true
                            })
                        }).catch((err) => {
                            console.log("Error in Recast", err.message)
                            reject(err)
                        })
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    processConversationDBtoMemory() {
        var self = this
        return new Promise((resolve, reject) => {
            try {
                if (self.checkConversationInReqBody()) {
                    var sConvID = self.http.get('req')['body']['conversation']['conversation_id']
                    new ConvMemDBHandler().getConvMemById(sConvID).then((oConvData) => {
                        // take only non finished conversation
                        if (oConvData.conv_end == false) {
                            self.conversationdb.set(sConvID, oConvData)
                        }
                        resolve({
                            conversation: true
                        })

                    }).catch((err) => {
                        reject(err)
                    })

                } else {
                    resolve({
                        "conversation": true
                    })
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    displayMemory() {
        console.log("HTTP", this.http)
        console.log("APP", this.app)
        console.log("INTENTS", this.intents)
        console.log("RECAST", this.recast)
        console.log("ConversationDB", this.conversationdb)
    }
}


module.exports = RequestParser