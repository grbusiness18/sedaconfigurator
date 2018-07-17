'use strict'
const logger = require('../../utility/logger')
const IntentDBHandler = require('../db/api/intentdbhandler.js')
const ConvStepDBHandler = require('../db/api/convstepdbhandler.js')
const schemas = require('../db/schemas/schema.js')
const syncEach = require('sync-each')


exports.POST = (req, res, next) => {
    var oBODY = req.body

    var query = {
        "_id": req.params.intentid,
        "app_id": req.params.appid
    }

    if (typeof(oBODY) != "object") {
        var error = new Error("Invalid Input- Input Body is not type of object")
        error.status = 405
        next(error)
    }

    if (("step_name" in oBODY) == false || ("ok_param" in oBODY) == false) {
        var error = new Error("missing step name or ok_params")
        error.status = 405
        next(error)
    }

    oBODY["step_type"] = ("step_type" in oBODY) ? oBODY["step_type"] : 1
    oBODY["exec_only_on_empty_entity"] = ("exec_only_on_empty_entity" in oBODY) ? (oBODY["exec_only_on_empty_entity"] == "") ? false : true : false
    oBODY["belongstoentity"] = ("belongstoentity" in oBODY) ? oBODY["belongstoentity"] : ""    
    oBODY["dropdowns"] = ("dropdowns" in oBODY) ? oBODY["dropdowns"] : []
    oBODY["actions"] = ("actions" in oBODY) ? oBODY["actions"] : []
    oBODY["texts"] = ("texts" in oBODY) ? oBODY["texts"] : []

    //console.log("validattion1", validateValuesWithSchemas(oBODY["associated_entities"], "String"))
    //console.log("validation 2", validateValuesWithSchemas(oBODY["cross_intents_during_conv"], "String"))
    //console.log("validation 3", validateValuesWithSchemas(oBODY["dropdowns"], "NameValuePair"))
    
    var oBodyAssocEntity = []
    oBodyAssocEntity.push(oBODY["belongstoentity"])

    if (validateValuesWithSchemas(oBodyAssocEntity, "String") &&
        validateValuesWithSchemas(oBODY["dropdowns"], "NameValuePair")) {

        console.log("oBODY", oBODY)

        new IntentDBHandler().getIntent(query).then((oIntent) => {
            console.log("Conv DB" , oBODY)
            new ConvStepDBHandler().createNewConversationStep(oBODY, oIntent).then((data) => {
                res.status(201).send(data)
            }).catch((err) => {
                res.status(500).send(err)
            })
        }).catch((err) => {
            res.status(500).send(err)
        })

    } else {
         var error = new Error("Error in Validation of schemas")
        error.status = 405
        next(error)
    }
}

exports.GET = (req, res, next) => {

    var query = {
        "_id": req.params.intentid,
        "app_id": req.params.appid
    }
    new IntentDBHandler().getIntent(query).then((oIntent) => {
        if ("conversations" in oIntent) {
            res.status(200).send(oIntent.conversations)
        } else {
            res.status(200).send([])
        }
    }).catch((err) => {
        res.status(500).send(err)
    })
}

exports.PUT = (req, res, next) => {

    var query = {
        "_id": req.params.intentid,
        "app_id": req.params.appid
    }
    new IntentDBHandler().getIntent(query).then((oIntent) => {
        if ("conversations" in oIntent && oIntent["conversations"].length > 0) {

            var aConvStep = oIntent["conversations"].filter((oConvStep) => {
                return oConvStep._id == req.params.convid
            })

            console.log("ConvID", req.params.convid)

            if (aConvStep.length > 0) {
                console.log("keys for updated", Object.keys(req.body))
                syncEach(Object.keys(req.body), (oKey, next) => {
                    if (oKey in req.body) {
                        aConvStep[0][oKey] = req.body[oKey]
                    }
                    next()
                }, () => {

                    console.log("Before Trigger", aConvStep[0])

                    new ConvStepDBHandler().updateConversationSteps(aConvStep[0], oIntent, req.params.convid).then((data) => {
                        res.status(201).send(data)
                    }).catch((err) => {
                        res.status(500).send(err)
                    })

                })
            } else {
                var error = new Error("Invalid conv step ID :" + req.params.convid)
                error.status = 405
                next(error)
            }

        } else {
            var error = new Error("Invalid conv step ID :" + req.params.convid)
            error.status = 405
            next(error)
        }
    }).catch((err) => {
        res.status(500).send(err)
    })

}

exports.DELETE = (req, res, next) => {

    var convid = ("convid" in req.params) ? req.params.convid : "all"
    var aConvStep = []
    var query = {
        "_id": req.params.intentid,
        "app_id": req.params.appid
    }
    new IntentDBHandler().getIntent(query).then((oIntent) => {
        if ("conversations" in oIntent && oIntent["conversations"].length > 0) {

            if (convid != "all") {
                aConvStep = oIntent["conversations"].filter((oConvStep) => {
                    return oConvStep._id == req.params.convid
                })
            } else {
                aConvStep = {}
            }

            new ConvStepDBHandler().deleteConversationSteps((aConvStep.length > 0) ? aConvStep[0] : {}, oIntent).then((data) => {
                res.status(201).send("deleted successfully")
            }).catch((err) => {
                res.status(500).send(err)
            })


        } else {

            if (convid != "all") {
                var error = new Error("Invalid conv step ID :" + req.params.convid)
                error.status = 405
                next(error)
            } else {
                res.status(200).send("nothing to delete..")
            }

        }
    }).catch((err) => {
        res.status(500).send(err)
    })
}


function validateValuesWithSchemas(aValue = [], sType = "") {
    console.log("In Validation..", sType, aValue)
    var errorText = ""
    var valid = false

    if (aValue.length == 0) {
        return true
    }

    switch (sType) {
        case 'String':
            syncEach(aValue, (sRecord, next) => {
                if (typeof(sRecord) != "string") {                    
                    errorText = "Invalid value type of String"
                } next()
            }, () => {
                if (errorText == "") {
                    valid = true
                } else {
                    valid = false
                }
                console.log(errorText)                
            })

            break

        case 'actions': 
            console.log(schemaname)
            var schemaname = sType + "Schema"
            if (schemaname in schemas) {                    
            var originalProps = Object.keys(schemas[schemaname].obj).sort()
            console.log("original prpops", originalProps)
            syncEach(aValue, (oRecord, next) => {
                var valProps = Object.keys(oRecord).sort()
                console.log("originalprops", JSON.stringify(originalProps))
                console.log("value props", JSON.stringify(valProps))
                if (JSON.stringify(originalProps) != JSON.stringify(valProps)) {
                    errorText = "Invalid Properties in " + sType
                }
                next()
            }, () => {
                if (errorText == "") {
                    valid = true
                } else {
                    valid = false
                }
                console.log(errorText)                
            })
        }
            break

       case 'NameValuePair': 
           
            var schemaname = sType.toLowerCase() + "Schema"            
            if (schemaname in schemas) {                    
            var originalProps = Object.keys(schemas[schemaname].obj).sort()
            console.log("original prpops", originalProps)
            syncEach(aValue, (oRecord, next) => {
                var valProps = Object.keys(oRecord).sort()
                console.log("originalprops", JSON.stringify(originalProps))
                console.log("value props", JSON.stringify(valProps))
                if (JSON.stringify(originalProps) != JSON.stringify(valProps)) {
                    errorText = "Invalid Properties in " + sType
                }
                next()
            }, () => {
                if (errorText == "") {
                    valid = true
                } else {
                    valid = false
                }
                console.log(errorText)                
            })
        }
            break     
    }

    return valid
}