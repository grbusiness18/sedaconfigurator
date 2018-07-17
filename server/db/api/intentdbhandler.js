'use strict'

const model = require('../../db/models/model.js')
const DBHandler = require('./db.js')
const INTENTDB = model.intentdb

/**
 *  Intent DB Handler class extends DBHandler Class
 *  This class handles the logic for IntentDB specific CRUD operations
 */
class IntentDBHandler extends DBHandler {

	/**
	 * [constructor Pass the DB Model to parent constructor.]
	 * @return {object} [instance]
	 */
	constructor() {
		super(INTENTDB)
	}

	/**
	 * [createNewIntent Method to create New Intent]
	 * @param  {Object} oIntent [object values to be persisted]
	 * @return {object}         [Returns promise object]
	 */
	createNewIntent(oIntent = {}) {
		var self = this

		return new Promise((resolve, reject) => {
			self.create(oIntent).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	}

	/**
	 * [getAllIntents method to get all intents]
	 * @return {object} [returns a promise]
	 */
	getAllIntents(query) {
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
	 * [getIntent Method to get single intent by the param name]
	 * @param  {object} query [query for intent_name or id]
	 * @return {object}      [returns a promise object]
	 */
	getIntent(query) {
		var self = this
		console.log(query)
		return new Promise((resolve, reject) => {
			try {
				self.getData(query).then((oIntentData) => {
					resolve(oIntentData)
				}).catch((err) => {
					reject(err)
				})
			} catch (e) {
				reject(e)
			}
		})
	}

	/**
	 * [updateIntent update the Intent by query and values]
	 * @param  {object} query      [intent name or id]
	 * @param  {object} oNewValues [values as object which needs to updated]
	 * @return {object}           [returns a promise]
	 */
	updateIntent(query, oNewValues) {
		var self = this
		return new Promise((resolve, reject) => {
			self.getIntent(query).then((oDBdata) => {
				var oUpdateData = oDBdata

				if ("description" in oNewValues) {
					oUpdateData.description = oNewValues.description
				}

				if ("entities" in oNewValues) {
					oUpdateData.entities = oNewValues.entities
				}

				if ("actions" in oNewValues) {
					oUpdateData.actions = oNewValues.actions
				}

				if ("responses" in oNewValues) {
					oUpdateData.responses = oNewValues.responses
				}

				if ("fallback" in oNewValues) {
					oUpdateData.fallback = oNewValues.fallback
				}

				if ("conversations" in oNewValues) {
					oUpdateData.conversations = oNewValues.conversations
				}

				if ("followup" in oNewValues) {
					oUpdateData.followup = oNewValues.followup
				}

				if ("is_conversation" in oNewValues) {
					oUpdateData.is_conversation = oNewValues.is_conversation
				}

				if ("cross_intents" in oNewValues) {
					oUpdateData.cross_intents = oNewValues.cross_intents
				}

				console.log("OUPdateData", oUpdateData)

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
	 * [deleteIntent method to delete the intent]
	 * @param  {Object} query [query parameters]
	 * @return {object}       [retruns as promise]
	 */
	deleteIntent(query = {}) {
		var self = this
		return new Promise((resolve, reject) => {
			self.deleteByQuery(query).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	}
}

module.exports = IntentDBHandler