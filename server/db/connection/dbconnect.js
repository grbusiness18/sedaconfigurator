'use strict'

const mongoose = require('mongoose')
const logger = require('../../../utility/logger')
mongoose.Promise = global.Promise

/**
 * module used to connect with mongodb either locally or cf service
 */

module.exports = (oENV) => {

    var mongourl = ''
    if (oENV.isLocal === true) {
        mongourl = 'mongodb://localhost:27017/sedaconfig'
    } else {
        mongourl = oENV.services.mongodb[0].credentials.uri
    }
    var pMongo = mongoose.connect(mongourl, {
        socketTimeoutMS: 0,
        keepAlive: true,
        reconnectTries: 100,
        reconnectInterval: 1000
    })

    pMongo.then(() => {})
        .catch(err => {
            console.log("mongo error" , err)
            throw new Error(err.message)
        })
}