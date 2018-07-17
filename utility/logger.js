'use strict'

const winston    = require('winston')
const path       = require('path')
const filePath   = path.resolve(__dirname).split('/utility')[0]

const logOptions = {
    file : {
        level            : process.env.LOG_LEVEL || 'debug',
        filename         : filePath + '/logs/app.log',
        handleExceptions : true,
        json             : true,
        maxsize          : 5242880, // 5MB
        maxFiles         : 1,
        colorize         : true
    },
    console : {
        level            : process.env.LOG_LEVEL || 'debug',
        handleExceptions : true,
        json             : false,
        colorize         : true
    }
}


const logger = new winston.Logger({
    transports : [
       // new winston.transports.File(logOptions.file),
        new winston.transports.Console(logOptions.console)
    ],
    exitOnError : false // dont exit on handled exceptions
})


logger.stream = {
    write: (message, encoding)=>{
        logger.debug(message)
    }
}

module.exports = logger