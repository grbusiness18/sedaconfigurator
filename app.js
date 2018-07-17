'use strict'
/* Author Gokulraj Ramdass*/
/* App.js */
/* Declaration of required modules */
const express = require('express')
const bodyparser = require('body-parser')
const routes = require('./server/routes/router')
const cfenv = require('cfenv')
const oAPP = express()
const PORT = process.env.PORT || 3000
const oAppEnv = cfenv.getAppEnv() // cloud foundry environment variables.
const os = require('os')

// swagger setup middleware
const swaggerUI = require('swagger-ui-express')

var swaggerDoc = ""

if(os.hostname()=="WDFM33344641A"){
  swaggerDoc =  require('./docs/apidocs/localapidoc.json')
} else {
   swaggerDoc =  require('./docs/apidocs/serverapidoc.json') 
}

// Body parser middleware to handle URL params
oAPP.use(bodyparser.urlencoded({
    extended: true
}))
oAPP.use(bodyparser.json())
oAPP.use(bodyparser.text());                                    
oAPP.use(bodyparser.json({ type: 'application/json'}))


oAPP.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))

// Handover to Router 
oAPP.use('/', routes)
oAPP.use('/api/v1/', routes)

// DB Connect 
require('./server/db/connection/dbconnect.js')(oAppEnv)

// Catch 404 Error and forward to Error Handler
oAPP.use((req, res, next) => {
    var err = new Error('File Not Found')
    err.status = 404
    next(err)
})


// Error Handler
oAPP.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send(err.message)
})


// Express Server
oAPP.listen(PORT, () => {
    console.log('Server Listening at ' + PORT)
})

