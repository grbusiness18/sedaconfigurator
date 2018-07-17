'use strict'
const logger = require('../../utility/logger')
const IntentDBHandler = require('../db/api/intentdbhandler.js')
const schemas = require('../db/schemas/schema.js')
const syncEach = require('sync-each')


/**
 * SUBSECTION Controller class handles the DB processing 
 * of SUB Segments in the Intents dynamically.
 */
class SubSectionsController {

    /**
     * [constructor description]
     * @param  {String} sNodeName  [Property name of sub segment in the intent data]
     * @param  {Object} oIntent    [Intent Data]
     * @param  {String} sSubPathID [subPathID]
     * @param  {Object} res        [response object]
     */
    constructor(sNodeName = "", oIntent = {}, sSubPathID = "", res) {
        if (sNodeName == "" ||
            JSON.stringify(oIntent) == "{}") {
            throw new Error("Empty Node Name or Schema Name or Missing Intent Data")
        }
        this.nodename = sNodeName
        this.Intent = oIntent
        this.subPathID = sSubPathID
        this.res = res
        logger.info("Constructor SubController")
    }

    /**
     * [ProcessValues passes the incoming data to validations ]
     * @param {Object} records [new values]
     * @param {String} sAction [identifier for the action trigger after validation]
     */
    ProcessValues(records, sAction) {

        var aValues = []
        var aNewValues = {}

        if (typeof(records) == "object") {
            aValues.push(records)
        }

        if (Array.isArray(records)) {
            aValues = records
        }

        if (aValues.length == 0) {
            throw new Error("Empty Values")
        }

        this.ValidateProperties(aValues, sAction)
    }

    /**
     * [ValidateProperties Method which validates the incoming values with DB schema values]
     * @param {Array}  aNewValues [new values]
     * @param {String} sAction    [Trigger ID for after validation process]
     */
    ValidateProperties(aNewValues = [], sAction) {
        var self = this
        var aValues = aNewValues || []
        var schemaname = this.nodename + "Schema"

        if (!schemaname in schemas) {
            throw new Error("Invalid Schema Name : " + schemaname)
        }

        logger.info("Schema Name " + schemaname)
        var aProps = Object.keys(schemas[schemaname].obj).sort()
        var errText = ""

        logger.info("Incoming Values", aValues)
        syncEach(aValues, (oRecord, next) => {
            var aPropsNew = Object.keys(oRecord).sort()
            console.log("VAL Props", aPropsNew)
            console.log("SCHEMA Props", aProps)
            if (JSON.stringify(aProps) != JSON.stringify(aPropsNew)) {
                logger.error("Invalid Property in values " + JSON.stringify(oRecord))
                errText = "Invalid Property in values " + JSON.stringify(oRecord)
            }
            next()
        }, () => {
            console.log(errText)
            if (errText != "") {
                throw new Error(errText)
            }

            switch (sAction.toUpperCase()) {
                case 'POST':
                    self.InsertValues(aValues)
                    break

                case 'PUT':
                    self.UpdateValues(aValues)
                    break
            }
        })
    }

    /**
     * [callActionProcessor decides which process to call for incoming values]
     * @param  {Array} aValues [new values]
     * @param  {String} sAction [Trigger ID for after validation process]
     */
    callActionProcessor(aValues, sAction) {

        switch (sAction.toUpperCase()) {
            case 'POST':
                this.ProcessValues(aValues, sAction)
                break

            case 'PUT':
                console.log("Incoming Values", aValues)
                this.ProcessValues(aValues, sAction)
                break

            case 'DELETE':
                this.DeleteValues()
                break

            case 'GET':
                this.GetValues()
                break

            case 'default':
                break
        }
    }

    /**
     * [InsertValues Inserte new records to subsegments in the DB]
     * @param {Array} aValues [new values]
     */
    InsertValues(aValues) {
        var self = this
        var aNewValues = {}
        logger.info(aValues, this.nodename, this.Intent[this.nodename])
        aNewValues[this.nodename] = this.Intent[this.nodename]
        aNewValues[this.nodename].push(...aValues)
        new IntentDBHandler().updateIntent({
                "_id": this.Intent._id
            }, aNewValues)
            .then((data) => {
                self.res.status(201).send(data)
            }).catch((err) => {
                logger.error("Error in Add Method " + err.message)
                throw new Error(err.message)
            })
    }


    /**
     * [DeleteValues deles the subsegment values all or single]
     */
    DeleteValues() {
        var self = this
        var aDeleteValues = {}
        aDeleteValues[this.nodename] = this.Intent[this.nodename]
        logger.info("subpath" + this.subPathID)

        if (this.subPathID == "all") {
            aDeleteValues[this.nodename] = []
        } else {
            aDeleteValues[this.nodename] = this.Intent[this.nodename].filter((el) => {
                console.log("recod", el)
                return el._id != this.subPathID
            })
        }

        logger.info("delete values", aDeleteValues)

        if (aDeleteValues[this.nodename].length == 0 && this.subPathID != "all") {
            logger.error("Error in Delete Method ..Nothing found for DELETE")
            self.res.status(405).send("Nothing found for delete")
        } else {
            new IntentDBHandler().updateIntent({
                    "_id": this.Intent._id
                }, aDeleteValues)
                .then((data) => {
                    self.res.status(201).send(data)
                }).catch((err) => {
                    logger.error("Error in Delete Method " + err.message)
                    throw new Error(err.message)
                })
        }
    }

    /**
     * [GetValues retrives records for the subsegments based on the intents]
     */
    GetValues() {
        logger.info(this.nodename, this.Intent)
        this.res.status(200).send(this.Intent[this.nodename])
    }

    /**
     * [UpdateValues Updates the subsgements]
     * @param {Array} aValues [To be updated values]
     */
    UpdateValues(aValues) {
        console.log("SubController Udpate values", aValues)
        var self = this
        var aUpdateValues = {}

        if (aValues.length > 1) {
            throw new Error("Multi values posted for PUT operation..use single value. ")
        }

        logger.info(aValues, this.nodename, this.subPathID)
        var aExistingValues = this.Intent[this.nodename].filter((el) => {
            return el._id != this.subPathID
        }) || []

        var a2BeUpdatedValues = this.Intent[this.nodename].filter((el) => {
            return el._id == this.subPathID
        }) || []

        console.log("To be Updated", a2BeUpdatedValues)
        console.log("Existing", aExistingValues)

        var oUpdValue = aValues[0]
        syncEach(Object.keys(aValues[0]), (oKey, next) => {
            if (a2BeUpdatedValues.length == 0) {
                var oUpdObject = {}
                oUpdObject[oKey] = oUpdValue[oKey]
                a2BeUpdatedValues.push(oUpdObject)
            } else {
                a2BeUpdatedValues[0][oKey] = oUpdValue[oKey]
            }

            next()
        }, () => {
            a2BeUpdatedValues.push(...aExistingValues)
            aUpdateValues[self.nodename] = a2BeUpdatedValues
            console.log("Be4 DB Upd", aUpdateValues)
            new IntentDBHandler().updateIntent({
                    "_id": this.Intent._id
                }, aUpdateValues)
                .then((data) => {
                    self.res.status(201).send(data)
                }).catch((err) => {
                    logger.error("Error in Update Method " + err.message)
                    throw new Error(err.message)
                })
        })
    }
}

module.exports = SubSectionsController