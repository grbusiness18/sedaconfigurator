/**
 * @file Model handler.
 * @module model/models
 *
 * @author I343952
 */
sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "sap/ui/Device"
], function(JSONModel, Device) {
  "use strict";

  return {

    /**
     * Creates the device model.
     *
     * @public
     * @returns {sap.ui.model.json.JSONModel} Device Model.
     */
    createDeviceModel: function() {
      var oModel = new JSONModel(Device);
      oModel.setDefaultBindingMode("OneWay");
      return oModel;
    }

  };
});
