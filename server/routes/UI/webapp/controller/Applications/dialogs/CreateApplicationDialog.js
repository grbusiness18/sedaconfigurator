/**
 * @module controller/dialogs/CreateApplicationDialog
 * @author I343952
 * @file Create application dialog.
 */

sap.ui.define([
  "sedaconf/common/dialogs/BaseDialog",
  "sedaconf/common/util/validator",
  "sedaconf/model/servicecalls/application"
], function(BaseDialog, validator, applicationService) {
  "use strict";

  var _errorMap = {};
  var CreateApplicationDialog = BaseDialog.extend("sedaconf.controller.Applications.dialogs.CreateApplicationDialog", {

    /**
     * Instantiates the create application dialog, sets model to it.
     * @public
     * @param {Object} options - Initialization parameters for the create application dialog.
     */
    constructor: function(options) {
      //Add the specific options for create application dialog.
      var args = options || {};
      args.fragmentName = "sedaconf.view.Applications.dialogs.CreateApplicationDialog";
      args.isCompact = true;
      //Call the super class init.
      BaseDialog.prototype.init.call(this, args);
    },

    /**
     * Initialises create application dialog with default values
     * @public
     */
    init: function() {
      this.getModel("dialogModel").setProperty("/recastThreshold", "75");
      this.open();
    },

    /**
     * Event handler for 'liveChange' event of name field.
     * @public
     */
    onNameChange: function() {
      this.getModel("dialogModel").setProperty("/vsName", "None");
    },

    /**
     * Event handler for 'liveChange' event of description field.
     * @public
     */
    onDescriptionChange: function() {
      this.getModel("dialogModel").setProperty("/vsDescription", "None");
    },

    /**
     * Event handler for 'liveChange' event of name field.
     * @public
     */
    onTokenChange: function() {
      this.getModel("dialogModel").setProperty("/vsRecastToken", "None");
    },

    /**
     * Event handler for 'liveChange' event of description field.
     * @public
     */
    onThresholdChange: function() {
      this.getModel("dialogModel").setProperty("/vsRecastThreshold", "None");
    },

    /**
     * Creates a new application tile.
     * @public
     */
    onCreate: function() {
      var dialogModel = this.getModel("dialogModel");
      var modelData = dialogModel.getData();
      if (this._validate()) {
        var data = {
          "name": modelData.name,
          "description": modelData.description,
          "recast": {
            "token": modelData.recastToken,
            "threshold": modelData.recastThreshold
          },
          "is_active": false
        };
        applicationService.createApplication(data).then(function() {
          this.getCallback().setApplicationData();
        }.bind(this));
        this.close(true);
      }
    },

    /**
     * Creates a new application tile.
     * @private
     * @return {boolean} 'true' if all the values entered are valid.
     */
    _validate: function() {
      var bundle = this.getView().getModel("i18n").getResourceBundle();
      validator.validateEmptyField("name", this.getModel("dialogModel"), _errorMap, bundle.getText("MANDATORY_NAME"));
      validator.validateEmptyField("description", this.getModel("dialogModel"), _errorMap, bundle.getText("MANDATORY_DESCRIPTION"));
      validator.validateEmptyField("recastToken", this.getModel("dialogModel"), _errorMap, bundle.getText("MANDATORY_RECAST_TOKEN"));
      validator.validateEmptyField("recastThreshold", this.getModel("dialogModel"), _errorMap, bundle.getText("MANDATORY_RECAST_THRESHOLD"));
      //Check errors in any field.
      if (Object.keys(_errorMap).length === 0) {
        return true;
      }
      return false;
    }
  });

  return CreateApplicationDialog;
}, true);
