'use strict'

const RP = require('./requestparser.js')

class RequestProcessor {
    constructor(req, res, next) {
        this.req = req
        this.res = res
        this.next = next
    }

    process() {

        RP.process(this.req, this.res, this.next)
    }
}


module.exports = RequestProcessor