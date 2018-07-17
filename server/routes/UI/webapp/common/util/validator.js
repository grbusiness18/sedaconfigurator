/**
 * @module common/util/validator
 * @author I343952
 * @file Common validation functions to be used accross application.
 */

sap.ui.define([
  "sedaconf/common/util/common"
], function(commonJs) {
  "use strict";

  return {

    /**
     * Validates generically the mandatory fields.
     * @public
     * @param {string} fieldVariable - variable binding.
     * @param {sap.ui.model.json.JSONModel} model - view/dialog model
     * @param {Object} errorMap - Errors Hashmap.
     * @param {string} valueStateText - Value state text to be displayed
     */
    validateEmptyField: function(fieldVariable, model, errorMap, valueStateText) {
      var value = model.getProperty("/" + fieldVariable);
      if (!value || typeof value === "string" && value.trim() === "") {
        model.setProperty("/vs" + commonJs.toCamelCase(fieldVariable), "Error");
        model.setProperty("/vst" + commonJs.toCamelCase(fieldVariable), valueStateText);
        errorMap[fieldVariable] = true;
      } else {
        delete errorMap[fieldVariable];
        model.setProperty("/vs" + commonJs.toCamelCase(fieldVariable), "None");
      }
    }
  };

});
