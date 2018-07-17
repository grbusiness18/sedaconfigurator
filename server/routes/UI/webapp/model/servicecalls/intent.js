/**
 * @module model/servicecalls/intent
 * @author I343952
 * @file Backend calls specifically for Intents.
 */

sap.ui.define([
  "sedaconf/common/util/common"
], function(commonJs) {
  "use strict";

  return {

    /**
     * Calls backend and creates an intent.
     * @public
     * @param {string} applicationId - Application Id.
     * @param {Object} data - Data to be sent to backend to create an intent.
     * @returns {Promise} Promise object.
     */
    createIntent: function(applicationId, data) {
      return commonJs.ajaxPostRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, true) + "create",
        data: data
      });
    },

    /**
     * Calls backend and gets all intents.
     * @public
     * @param {string} applicationId - Application Id.
     * @returns {Promise} Promise object.
     */
    getAllIntents: function(applicationId) {
      return commonJs.ajaxGetRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, true) + "all"
      });
    },

    /**
     * Calls backend and gets intent data by intent id.
     * @public
     * @param {string} intentId - Intent Id.
     * @param {string} applicationId - Application Id.
     * @returns {Promise} Promise object.
     */
    getIntentData: function(intentId, applicationId) {
      return commonJs.ajaxGetRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, intentId)
      });
    },

    /**
     * Calls backend and gets intent data by intent name.
     * @public
     * @param {string} intentName - Intent Name.
     * @param {string} applicationId - Application Id.
     * @returns {Promise} Promise object.
     */
    getIntentDataByName: function(intentName, applicationId) {
      return commonJs.ajaxGetRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, true) + "name/" + intentName
      });
    },

    /**
     * Calls backend and updates intent data.
     * @public
     * @param {string} intentId - Intent Id.
     * @param {string} applicationId - Application Id.
     * @param {Object} data - Data to be sent to backend to update an intent.
     * @returns {Promise} Promise object.
     */
    updateIntentData: function(intentId, applicationId, data) {
      return commonJs.ajaxPutRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, intentId),
        data: data
      });
    },

    /**
     * Calls backend and deletes an intent.
     * @public
     * @param {string} intentId - Intent Id.
     * @param {string} applicationId - Application Id.
     * @returns {Promise} Promise object.
     */
    deleteIntent: function(intentId, applicationId) {
      return commonJs.ajaxDeleteRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, intentId)
      });
    }

  };

});
