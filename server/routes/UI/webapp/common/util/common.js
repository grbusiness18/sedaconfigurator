/**
 * @module common/util/common
 * @author I343952
 * @file Common functions to be used accross application.
 */

sap.ui.define([], function() {
  "use strict";

  return {

    /**
     * Convert any string to Camel Case
     *
     * @public
     * @param {String} value - Any String Value
     * @returns {String} Modified string with CamelCase
     */
    toCamelCase: function(value) {
      return value[0].toUpperCase() + value.substr(1);
    },

    /**
     * Gets backend URL based on current system.
     *
     * @public
     * @returns {String} Base Backend URL.
     */
    getBackendBaseURL: function() {
      if (window.location.host.indexOf("fiori.dispatcher.cert.hana.ondemand.com") !== -1) {
        return "https://comconfigdev.cfapps.sap.hana.ondemand.com";
      } else {
        return window.location.origin;
      }
    },

    /**
     * Gets the base url based on the input ids.
     *
     * @public
     * @param {string} [applicationId] - Application Id.
     * @param {string} [intentId] - Intent Id.
     * @param {string} [entity] - Entity Name e.g. 'convsteps'.
     * @param {string} [entityId] - Entity Id.
     * @returns {string} Base relative Url.
     */
    getBaseRelativeUrl: function(applicationId, intentId, entity, entityId) {
      var url = "apps/";
      if (applicationId) {
        url = url + applicationId;
      }
      if (intentId) {
        url = url + "/intents/";
        if (typeof intentId === "string") {
          url = url + intentId;
        }
      }
      if (entity) {
        url = url + "/" + entity + "/";
        if (typeof entityId === "string") {
          url = url + entityId;
        }
      }
      return url;
    },


    /**
     * Makes a network call for a get request.
     *
     * @public
     * @param {Object} options - Options to be supplied.
     * @param {string} options.url - Relative url to be called.
     * @returns {Promise} Promise object.
     */
    ajaxGetRequest: function(options) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          type: "GET",
          url: this.getBackendBaseURL() + "/api/v1/" + options.url,
          success: resolve,
          error: reject
        });
      }.bind(this));
    },

    /**
     * Makes a network call for a post request.
     *
     * @public
     * @param {Object} options - Options to be supplied.
     * @param {string} options.url - Relative url to be called.
     * @returns {Promise} Promise object.
     */
    ajaxPostRequest: function(options) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          type: "POST",
          data: JSON.stringify(options.data),
          contentType: "application/json",
          url: this.getBackendBaseURL() + "/api/v1/" + options.url,
          success: resolve,
          error: reject
        });
      }.bind(this));
    },

    /**
     * Makes a network call for a put request.
     *
     * @public
     * @param {Object} options - Options to be supplied.
     * @param {string} options.url - Relative url to be called.
     * @returns {Promise} Promise object.
     */
    ajaxPutRequest: function(options) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          type: "PUT",
          data: JSON.stringify(options.data),
          contentType: "application/json",
          url: this.getBackendBaseURL() + "/api/v1/" + options.url,
          success: resolve,
          error: reject
        });
      }.bind(this));
    },

    /**
     * Makes a network call for a delete request.
     *
     * @public
     * @param {Object} options - Options to be supplied.
     * @param {string} options.url - Relative url to be called.
     * @returns {Promise} Promise object.
     */
    ajaxDeleteRequest: function(options) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          type: "DELETE",
          url: this.getBackendBaseURL() + "/api/v1/" + options.url,
          success: resolve,
          error: reject
        });
      }.bind(this));
    }

  };
});
