/**
 * @file Component.
 * @module Component
 *
 * @author I343952
 */
sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/Device",
  "sedaconf/model/models"
], function(UIComponent, Device, models) {
  "use strict";

  return UIComponent.extend("sedaconf.Component", {

    metadata: {
      manifest: "json"
    },

    /**
     * The component is initialized by UI5 automatically during the startup of the
     * app and calls the init method once.
     *
     * @public
     */
    init: function() {
      // Call the base component's init function.
      UIComponent.prototype.init.apply(this, arguments);

      // Set the device model.
      this.setModel(models.createDeviceModel(), "device");

      // Initialize router and navigate to the first page.
      this.getRouter().initialize();
    }

  });

});
