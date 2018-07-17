'use strict'


/**
 *  Abstract DB class for CRUD handler
 */
class DBHandler {

    /**
     * [constructor description]
     * @param  {Object} oModel [Model from the mongoDB]
     */
    constructor(oModel = {}) {
        this.DBModel = oModel
    }

    /**
     * [create creates new record in the DB]
     * @param  {Object} data [The Data which needs to be created for the Model in the DB]
     * @return {Object}      [returns a promise object for either error or data]
     */
    create(data = {}) {
        var self = this
        return new Promise((resolve, reject) => {

            if (JSON.stringify(data) == "") {
                var error = new Error("Empty data given for DB persistence")
                reject(error)
            } else {

                new self.DBModel(data).save((err, dboject) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(dboject)
                    }
                })
            }
        })
    }

    /**
     * [getAllData Fetch All records from the DB for the query]
     * @param  {Object} query [either empty object or db query filters]
     * @return {Object}       [promise object]
     */
    getAllData(query = {}) {
        var self = this
        return new Promise((resolve, reject) => {
                self.DBModel.find(query, (err, data) => {
                    if (data == null) {
                        reject(new Error("Nothind found for the query"))
                    } else {
                        resolve(data)
                    }
                }).catch((err) => {
                    throw new Error(err)
                })
        })
    }

    /**
     * [getData Fetch only one record from the DB]
     * @param  {Object} query [JSON Object with queriable params]
     * @return {Object}       [returns a promise object for either error or data]
     */
    getData(query = {}) {
        var self = this
        return new Promise((resolve, reject) => {
            self.DBModel.findOne(query).then((oDBData) => {
                if (JSON.stringify(oDBData) == "{}" || oDBData == null) {
                    reject(new Error("Nothing found for the query find."))
                } else {
                    resolve(oDBData)
                }
            })
            .catch((err) => {               
                reject(err)
            })
        })
    }

    /**
     * [updateData Update DB for the given values]
     * @param  {Object} query        [Mandatory for finding the record to update]
     * @param  {Object} updatevalues [Mandtory values which needs to be updated]
     * @return {Object}              [returns a promise object for either error or data]
     */
    updateData(query = {}, updatevalues = {}) {
        var self = this
        return new Promise((resolve, reject) => {
            if (JSON.stringify(query) == "" || JSON.stringify(updatevalues) == "") {
                reject(new Error("Invalid or Empty query or values"))
            } else {
                self.DBModel.findOneAndUpdate(query, {
                        $set: updatevalues
                    }, {
                        new: true
                    },
                    (err, data) => {
                        if ((data || err) == null) {
                            reject(new Error("Unable to update db " + JSON.stringify(query) + " " + err.message))
                        } else {
                            resolve(data)
                        }
                    })
            }
        })
    }

    /**
     * [deleteByQuery delete a record by query]
     * @param  {Object} query [Mandatory JSON object for finding a record to delete]
     * @return {Object}       [returns a promise object for either error or data]
     */
    deleteByQuery(query = {}) {
        var self = this
        return new Promise((resolve, reject) => {
            if (JSON.stringify(query) == "") {
                reject(new Error("Empty Query for Delete Operation"))
            } else  {
                self.DBModel.remove(query, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve({
                            "msg": "app deleted successfully " + JSON.stringify(query)
                        })
                    }
                })
            }
        })
    }
}

module.exports = DBHandler