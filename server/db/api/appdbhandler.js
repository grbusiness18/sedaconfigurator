'use strict'

const model = require('../../db/models/model.js')
const DBHandler = require('./db.js')
const APPDB = model.appdb


/**
 *  App DB Handler class extends DBHandler Class
 *  This class handles the logic for AppDB specific CRUD operations
 */
class AppDBHandler extends DBHandler {

    /**
     * [constructor Pass the DB Model to parent constructor.]
     */
    constructor() {
        super(APPDB)
    }

    /**
     * [createNewApp Method to create New Application in db]
     * @param  {Object} oApp [object values to be persisted]
     * @return {promise}     [Returns promise object]
     */
    createNewApp(oAPP = {}) {
        var self = this

        return new Promise((resolve, reject) => {
            self.create(oAPP).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * [getAllApps method to get all apps]
     * @param  {Object} query [either empty or object with appid]
     * @return {Object}       [returns a promise]
     */
    getAllApps(query={}) {
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
     * [getApp Method to get single App by the param name]
     * @param  {object} query [query for App_name or id]
     * @return {Object}      [returns a promise object]
     */
    getApp(query) {
        var self = this
        return new Promise((resolve, reject) => {
            self.getData(query).then((oAppData) => {
                resolve(oAppData)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * [updateApp update the App by query and values]
     * @param  {object} query      [App name or id]
     * @param  {object} oNewValues [values as object which needs to updated]
     * @return {Object}           [returns a promise]
     */
    updateApp(query, oNewValues) {
        var self = this
        return new Promise((resolve, reject) => {
            self.getApp(query).then((oDBdata) => {
                var oUpdateData = oDBdata

                if ("is_active" in oNewValues) {
                    oUpdateData["is_active"] = oNewValues.is_active
                }

                if ("description" in oNewValues) {
                    oUpdateData["description"] = oNewValues.description
                }

                if ("name" in oNewValues) {
                    oUpdateData["name"] = oNewValues.name
                }

                if ("restobj" in oNewValues) {
                    oUpdateData["restobj"] = oNewValues.restobj
                }

                oUpdateData.changed_on = Date.now()

                self.updateData(query, oUpdateData).then((data) => {
                    resolve(data)
                }).catch((err) => {
                    console.log("Update Error", data)
                    reject(err)
                })

            }).catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * [deleteApp Delets the App]
     * @param  {object} query [query parameter by name or id]
     * @return {Object}         [description]
     */
    deleteApp(query = {}) {
        var self = this
        return new Promise((resolve, reject) => {
            self.deleteByQuery(query).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * [getAppByClientID method to get the app based on the clientID]
     * @param  {String} sClientID [clientid configured for the app]
     * @return {Object}           [returns a promise]
     */
    getAppByClientID(sClientID = "") {
        var self = this
        return new Promise((resolve, reject) => {
            self.getData({
                "credentials.clientid" : sClientID
            }).then((oAppData) => {
                resolve(oAppData)
            }).catch((err) => {
                reject(err)
            })
        })
    }
}

module.exports = AppDBHandler