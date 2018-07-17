/**
 * @file Backend calls specifically for Conversations.
 * @module model/servicecalls/conversation
 *
 * @author I343952
 */

sap.ui.define([
  "sedaconf/common/util/common"
], function(commonJs) {
  "use strict";

  return {

    /**
     * Calls backend and creates an conversation.
     *
     * @public
     * @param {string} applicationId - Application Id.
     * @param {string} intentId - Intent Id.
     * @param {Object} data - Data to be sent to backend to create an conversation.
     * @returns {Promise} Promise object.
     */
    createConversation: function(applicationId, intentId, data) {
      return commonJs.ajaxPostRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, intentId, "convsteps", true) + "create",
        data: data
      });
    },

    /**
     * Calls backend and gets all conversations.
     *
     * @public
     * @param {string} applicationId - Application Id.
     * @param {string} intentId - Intent Id.
     * @returns {Promise} Promise object.
     */
    getAllConversations: function(applicationId, intentId) {
      return commonJs.ajaxGetRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, intentId, "convsteps", true) + "all"
      });
    },

    /**
     * Calls backend and updates conversation data.
     *
     * @public
     * @param {string} conversationId - Conversation Id.
     * @param {string} applicationId - Application Id.
     * @param {string} intentId - Intent Id.
     * @param {Object} data - Data to be sent to backend to update an conversation.
     * @returns {Promise} Promise object.
     */
    updateConversationData: function(conversationId, applicationId, intentId, data) {
      return commonJs.ajaxPutRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, intentId, "convsteps", conversationId),
        data: data
      });
    },

    /**
     * Calls backend and deletes an conversation.
     *
     * @public
     * @param {string} conversationId - Conversation Id.
     * @param {string} applicationId - Application Id.
     * @param {string} intentId - Intent Id.
     * @returns {Promise} Promise object.
     */
    deleteConversation: function(conversationId, applicationId, intentId) {
      return commonJs.ajaxDeleteRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, intentId, "convsteps", conversationId)
      });
    },

    /**
     * Calls backend and deletes an conversation.
     *
     * @public
     * @param {string} applicationId - Application Id.
     * @param {string} intentId - Intent Id.
     * @returns {Promise} Promise object.
     */
    deleteAllConversation: function(applicationId, intentId) {
      return commonJs.ajaxDeleteRequest({
        url: commonJs.getBaseRelativeUrl(applicationId, intentId, "convsteps", true) + "all"
      });
    }

  };

});
