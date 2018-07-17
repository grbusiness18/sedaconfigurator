'use strict'

const model = require('../../db/models/model.js')
const DBHandler = require('./db.js')
const PARSERLOGDB = model.parserlogdb

/**
 *  Parser Log DB Handler class extends DBHandler Class
 *  This class handles the logging logic for parser routes
 */
class ParserLogDBHandler extends DBHandler{
    /**
     * [constructor Pass the Log DB Model to parent constructor.]     
     */
    constructor(){
        super(PARSERLOGDB)
    }

    /**
     * [createNewParserLog Create New Log for the Parser Routes]
     * @param  {Object} oLog [oLog Objects]
     * @return {object}      [returns the created log]
     */
    createNewParserLog(oLog={}){
        var self = this
        return new Promise((resolve, reject) => {
            self.create(oLog).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * [getAllParserLogs description]
     * @param  {Object} query [Query with APP ID]
     * @return {Array}        [Returns a array of Objects based on the query]
     */
    getAllParserLogs(query={}){
        var self = this
        return new Promise((resolve, reject) => {
            self.getAllData(query).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * [deleteParserLogAll Deletes all logs for the given applications]
     * @param  {Object} query [Query with APP ID]
     * @return {Object}       [Returns a Object message on deletions]
     */
    deleteParserLogAll(query={}){
        var self = this
        var oQuery = {}
        return new Promise((resolve, reject) => {
            self.deleteByQuery(oQuery).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }
}


module.exports = ParserLogDBHandler