'use strict'

/* Declaration of required modules and variables */
const express = require('express')
const oROUTER = express.Router()
const Controller = require('../controller/Controller')
const jwt = require('jsonwebtoken')
const passport = require('passport').Passport
const AppPassport = new passport()
const fs = require('fs')

require('../auth/authorize.js')(AppPassport)

oROUTER.use(AppPassport.initialize())


oROUTER.use(express.static(__dirname + '/UI/webapp'))

oROUTER.get('/', (req, res, next) => {
    res.sendFile(path.resolve(__dirname + '/UI/webapp/index.html'))
})

// General Routes
oROUTER.post('/oauth/token',Controller.Core)
oROUTER.post('/parse',
AppPassport.authenticate('jwt', { session: false }),  Controller.Core)

// App Routes
oROUTER.get('/apps/:appid',   Controller.App)
oROUTER.get('/apps/all',      Controller.App)
oROUTER.put('/apps/:appid',   Controller.App)
oROUTER.post('/apps/create',  Controller.App)
oROUTER.delete('/apps/:appid',Controller.App)

// Api Routes
oROUTER.get('/apps/:appid/intents/name/:name',  Controller.Intent)
oROUTER.get('/apps/:appid/intents/:intentid',   Controller.Intent)
oROUTER.get('/apps/:appid/intents/all',         Controller.Intent)
oROUTER.put('/apps/:appid/intents/:intentid',   Controller.Intent)
oROUTER.post('/apps/:appid/intents/create',     Controller.Intent)
oROUTER.delete('/apps/:appid/intents/:intentid',Controller.Intent)

// Api Intent / Responses
oROUTER.get('/apps/:appid/intents/:intentid/responses/all',           Controller.IntentResponses)
oROUTER.post('/apps/:appid/intents/:intentid/responses/create',       Controller.IntentResponses)
oROUTER.put('/apps/:appid/intents/:intentid/responses/:responseid',   Controller.IntentResponses)
oROUTER.delete('/apps/:appid/intents/:intentid/responses/:responseid',Controller.IntentResponses)
oROUTER.delete('/apps/:appid/intents/:intentid/responses/all',        Controller.IntentResponses)

// Api Intent / entities
oROUTER.get('/apps/:appid/intents/:intentid/entities/all',            Controller.IntentEntities)
oROUTER.post('/apps/:appid/intents/:intentid/entities/create',        Controller.IntentEntities)
oROUTER.put('/apps/:appid/intents/:intentid/entities/:entityid',      Controller.IntentEntities)
oROUTER.delete('/apps/:appid/intents/:intentid/entities/:entityid',   Controller.IntentEntities)
oROUTER.delete('/apps/:appid/intents/:intentid/entities/all',         Controller.IntentEntities)

// Api Intent / actions
oROUTER.get('/apps/:appid/intents/:intentid/actions/all',             Controller.IntentActions)
oROUTER.post('/apps/:appid/intents/:intentid/actions/create',         Controller.IntentActions)
oROUTER.put('/apps/:appid/intents/:intentid/actions/:actionid',       Controller.IntentActions)
oROUTER.delete('/apps/:appid/intents/:intentid/actions/:actionid',    Controller.IntentActions)
oROUTER.delete('/apps/:appid/intents/:intentid/actions/all',          Controller.IntentActions)


// Api Intent / followup
oROUTER.get('/apps/:appid/intents/:intentid/followup/all',             Controller.IntentFollowUp)
oROUTER.post('/apps/:appid/intents/:intentid/followup/create',         Controller.IntentFollowUp)
oROUTER.put('/apps/:appid/intents/:intentid/followup/:followupid',     Controller.IntentFollowUp)
oROUTER.delete('/apps/:appid/intents/:intentid/followup/:followupid',  Controller.IntentFollowUp)
oROUTER.delete('/apps/:appid/intents/:intentid/followup/all',          Controller.IntentFollowUp)


// Api Intent / fallback
oROUTER.get('/apps/:appid/intents/:intentid/fallback/all',             Controller.IntentFallback)
oROUTER.post('/apps/:appid/intents/:intentid/fallback/create',         Controller.IntentFallback)
oROUTER.put('/apps/:appid/intents/:intentid/fallback/:fallbackid',     Controller.IntentFallback)
oROUTER.delete('/apps/:appid/intents/:intentid/fallback/:fallbackid',  Controller.IntentFallback)
oROUTER.delete('/apps/:appid/intents/:intentid/fallback/all',          Controller.IntentFallback)

// Api Intent / conversations
oROUTER.get('/apps/:appid/intents/:intentid/convsteps/all',       Controller.IntentConversation)
oROUTER.post('/apps/:appid/intents/:intentid/convsteps/create',   Controller.IntentConversation)
oROUTER.put('/apps/:appid/intents/:intentid/convsteps/:convid',   Controller.IntentConversation)
oROUTER.delete('/apps/:appid/intents/:intentid/convsteps/:convid',Controller.IntentConversation)
oROUTER.delete('/apps/:appid/intents/:intentid/convsteps/all',    Controller.IntentConversation)


oROUTER.get('/apps/:appid/convmem/all')
oROUTER.delete('/apps/:appid/convmem/:convmemid')
oROUTER.delete('/apps/:appid/convmem/all')

// Api app / logs
oROUTER.get('/apps/:appid/logs/all',           Controller.ParserLogs)
oROUTER.post('/apps/:appid/logs/create',       Controller.ParserLogs)
oROUTER.delete('/apps/:appid/logs/all',        Controller.ParserLogs)

module.exports = oROUTER
