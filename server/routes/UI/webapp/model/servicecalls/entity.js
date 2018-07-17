/**
 * @file Backend calls specifically for Entities.
 * @module model/servicecalls/entity
 *
 * @author I343952
 */

sap.ui.define([
  "sedaconf/common/util/common"
], function(commonJs) {
  "use strict";

  return {

    /**
     * Calls backend and creates an entity.
     *
     * @public
     * @param {string} applicationId - Application Id.
     * @param {string} intentId - Intent Id.
     * @param {Object} data - Data to be sent to backend to create an entity.
     * @returns {Promise} Promise object.
     */
    createEntity: function(applicationId, intentId, data) {
      return commonJs.ajaxPostRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, intentId, "entity", true) + "create",
        data: data
      });
    },

    /**
     * Calls backend and gets all entities.
     *
     * @public
     * @param {string} applicationId - Application Id.
     * @param {string} intentId - Intent Id.
     * @returns {Promise} Promise object.
     */
    getAllEntities: function(applicationId, intentId) {
      return commonJs.ajaxGetRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, intentId, "entity", true) + "all"
      });
    },

    /**
     * Calls backend and updates entity data.
     *
     * @public
     * @param {string} entityId - entity Id.
     * @param {string} applicationId - Application Id.
     * @param {string} intentId - Intent Id.
     * @param {Object} data - Data to be sent to backend to update an entity.
     * @returns {Promise} Promise object.
     */
    updateEntityData: function(entityId, applicationId, intentId, data) {
      return commonJs.ajaxPutRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, intentId, "entity", entityId),
        data: data
      });
    },

    /**
     * Calls backend and deletes an entity.
     *
     * @public
     * @param {string} entityId - entity Id.
     * @param {string} applicationId - Application Id.
     * @param {string} intentId - Intent Id.
     * @returns {Promise} Promise object.
     */
    deleteEntity: function(entityId, applicationId, intentId) {
      return commonJs.ajaxDeleteRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, intentId, "entity", entityId)
      });
    },

    /**
     * Calls backend and deletes an entity.
     *
     * @public
     * @param {string} applicationId - Application Id.
     * @param {string} intentId - Intent Id.
     * @returns {Promise} Promise object.
     */
    deleteAllEntity: function(applicationId, intentId) {
      return commonJs.ajaxDeleteRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, intentId, "entity", true) + "all"
      });
    }

  };

});
