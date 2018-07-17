/**
 * @module model/servicecalls/log
 * @author I343952
 * @file Backend calls specifically for Logs.
 */

sap.ui.define([
  "sedaconf/common/util/common"
], function(commonJs) {
  "use strict";

  return {

    /**
     * Calls backend and creates an log.
     * @public
     * @param {string} applicationId - Application Id.
     * @param {Object} data - Data to be sent to backend to create an log.
     * @returns {Promise} Promise object.
     */
    createLog: function(applicationId, data) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          type: "POST",
          data: data,
          url: commonJs.getBackendBaseURL() + "/api/v1/apps/" + applicationId + "/logs/create",
          success: resolve,
          error: reject
        });
      });
    },

    /**
     * Calls backend and gets all logs.
     * @public
     * @param {string} applicationId - Application Id.
     * @returns {Promise} Promise object.
     */
    getAllLogs: function(applicationId) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          type: "GET",
          url: commonJs.getBackendBaseURL() + "/api/v1/apps/" + applicationId + "/logs/all",
          success: resolve,
          error: reject
        });
      });
    }

  };

});
