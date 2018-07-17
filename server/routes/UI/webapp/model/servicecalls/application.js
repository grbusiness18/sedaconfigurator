/**
 * @file Backend calls specifically for Applications.
 * @module model/servicecalls/application
 *
 * @author I343952
 */

sap.ui.define([
  "sedaconf/common/util/common"
], function(commonJs) {
  "use strict";

  return {

    /**
     * Calls backend and creates an application.
     * @public
     * @param {Object} data - Data to be sent to backend to create an application.
     * @returns {Promise} Promise object.
     */
    createApplication: function(data) {
      return commonJs.ajaxPostRequest({
        url: commonJs.getBaseRelativeUrl() + "create",
        data: data
      });
    },

    /**
     * Calls backend and gets all applications.
     * @public
     * @returns {Promise} Promise object.
     */
    getAllApplications: function() {
      return commonJs.ajaxGetRequest({
        url: commonJs.getBaseRelativeUrl() + "all"
      });
    },

    /**
     * Calls backend and gets application data by application id.
     * @public
     * @param {string} applicationId - Application Id.
     * @returns {Promise} Promise object.
     */
    getApplicationData: function(applicationId) {
      return commonJs.ajaxGetRequest({
        url: commonJs.getBaseRelativeUrl(applicationId)
      });
    },

    /**
     * Calls backend and updates application data.
     * @public
     * @param {string} applicationId - Application Id.
     * @param {Object} data - Data to be sent to backend to update an application.
     * @returns {Promise} Promise object.
     */
    updateApplicationData: function(applicationId, data) {
      return commonJs.ajaxPutRequest({
        url: commonJs.getBaseRelativeUrl(applicationId),
        data: data
      });
    },

    /**
     * Calls backend and deletes an application.
     * @public
     * @param {string} applicationId - Application Id.
     * @returns {Promise} Promise object.
     */
    deleteApplication: function(applicationId) {
      return commonJs.ajaxDeleteRequest({
        url: commonJs.getBaseRelativeUrl(applicationId)
      });
    }

  };

});
