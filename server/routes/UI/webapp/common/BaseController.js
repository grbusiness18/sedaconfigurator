/**
 * @module controller/Base
 * @author I343952
 * @file Base Controller
 */

sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History"
], function(Controller, History) {
  "use strict";

  return Controller.extend("apm.controller.Base", {

    /**
     * Convenience method for accessing the router in every controller of the application.
     *
     * @public
     * @returns {sap.ui.core.routing.Router} the router for this component.
     */
    getRouter: function() {
      return this.getOwnerComponent().getRouter();
    },

    /**
     * Convenience method for navigating back.
     *
     * @public
     * @param {string} fallback - Route Name.
     * @param {Object} fallbackParameters - The URL parameters to be passed.
     */
    goBack: function(fallback, fallbackParameters) {
      var sPreviousHash = History.getInstance().getPreviousHash();
      if (typeof sPreviousHash !== "undefined") {
        // The history contains a previous entry
        history.go(-1);
      } else {
        this.getRouter().navTo(fallback, fallbackParameters);
      }
    },

    /**
     * Convenience method for getting the view model by name in every controller of the application.
     *
     * @public
     * @param {string} sName the model name.
     * @returns {sap.ui.model.Model} the model instance.
     */
    getModel: function(sName) {
      return this.getView().getModel(sName);
    },

    /**
     * Convenience method for setting the view model in every controller of the application.
     *
     * @public
     * @param {sap.ui.model.Model} oModel the model instance.
     * @param {string} sName the model name.
     * @returns {sap.ui.mvc.View} the view instance.
     */
    setModel: function(oModel, sName) {
      return this.getView().setModel(oModel, sName);
    },

    /**
     * Convenience method for getting the resource bundle from view controller and Dialog Controller.
     *
     * @public
     * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component.
     */
    getResourceBundle: function() {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle();
    },

    /**
     * Convenience method for getting the text from resource bundle.
     *
     * @public
     * @param {string} key - i18n Key.
     * @param {string[]} placeHolderArray - Array of placeholders
     * @returns {String} value in i18n file.
     */
    getI18nText: function(key, placeHolderArray) {
      return this.getResourceBundle().getText(key, placeHolderArray);
    },

    /**
     * Convenience method for getting the global model.
     *
     * @public
     * @returns {sap.ui.model.Model} 'Global' model.
     */
    getGlobalModel: function() {
      return this.getOwnerComponent().getModel("Global");
    }

  });

});
