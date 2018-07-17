'use strict'

const recastai = require('recastai')
const request = require('request-promise')

class RecastProcessor {

    constructor(sToken = "") {

        if (sToken == "") {
            throw new Error("Empty Token or Text")
        }
        this.RECAST_TOKEN = sToken
    }


    doProcess(sText = "") {

        var self = this
        return new Promise((resolve, reject) => {
            try {

                var options = {
                    'url': 'http://localhost:4006/parse',
                    'method': 'POST',
                    'json': true,
                    'headers': {
                        'content-type': 'application/json',
                        'RECAST_TOKEN': self.RECAST_TOKEN
                    },
                    'body': {
                        'text': sText
                    }
                }

                request(options).then((oNLP) => {
                    console.log("RECAST", oNLP)
                    if (oNLP.entities.length > 0) {
                        for (var i = 0; i < oNLP.entities.length; i++) {
                            if (oNLP.entities[i]["values"].length > 1) {
                                for (var j = 1; j < oNLP.entities[i].values.length; j++) {
                                    oNLP.entities[i].values[0] = oNLP.entities[i].values[0] + " " +
                                        oNLP.entities[i].values[j]
                                }
                                oNLP.entities[i]["values"] = oNLP.entities[i].values[0]
                            }
                        }

                    }


                    resolve(oNLP)
                }).catch((err) => {
                    reject(err)
                })

            } catch (e) {
                reject(e)
            }
        })
    }

    // processRecastRequest(sText = "") {
    //     var self = this
    //     var sinput = sText.toLowerCase()
    //     return new Promise((resolve, reject) => {
    //         try {
    //             var client = new recastai.request(this.RECAST_TOKEN, 'en')
    //             client.analyseText(sinput).then((data) => {
    //                 resolve(data)
    //             }).catch((err) => {
    //                 reject(err)
    //             })
    //         } catch (e) {
    //             reject(e)
    //         }
    //     })
    // }
}


module.exports = RecastProcessor