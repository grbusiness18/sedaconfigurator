/**
 * @module controller/dialogs/EditApplicationDialog
 * @author I343952
 * @file Edit application dialog.
 */

sap.ui.define([
  "sedaconf/common/dialogs/BaseDialog",
  "sedaconf/common/util/validator",
  "sedaconf/model/servicecalls/application"
], function(BaseDialog, validator, applicationService) {
  "use strict";

  var _errorMap = {};
  var EditApplicationDialog = BaseDialog.extend("sedaconf.controller.Applications.dialogs.EditApplicationDialog", {

    /**
     * Instantiates the edit application dialog, sets model to it.
     * @public
     * @param {Object} options - Initialization parameters for the edit application dialog.
     */
    constructor: function(options) {
      //Add the specific options for edit application dialog.
      var args = options || {};
      args.fragmentName = "sedaconf.view.Applications.dialogs.EditApplicationDialog";
      args.isCompact = true;
      //Call the super class init.
      BaseDialog.prototype.init.call(this, args);
    },

    /**
     * Event handler for 'liveChange' event of name field.
     *
     * @public
     * @param {Object} data - Data to be set to the model.
     */
    init: function(data) {
      this.getModel("dialogModel").setProperty("/id", data._id);
      this.getModel("dialogModel").setProperty("/name", data.name);
      this.getModel("dialogModel").setProperty("/description", data.description);
      this.getModel("dialogModel").setProperty("/recastToken", data.recast.token);
      this.getModel("dialogModel").setProperty("/recastThreshold", data.recast.threshold);
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
     * Edits a new application tile.
     * @public
     */
    onUpdate: function() {
      var dialogModel = this.getModel("dialogModel");
      var modelData = dialogModel.getData();
      var applicationId = modelData.id;
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
        applicationService.updateApplicationData(applicationId, data).then(function() {
          this.getCallback().setApplicationData();
        }.bind(this));
        this.close(true);
      }
    },

    /**
     * Edits a new application tile.
     * @private
     * @return {boolean} 'true' if all the values entered are valid.
     */
    _validate: function() {
      var bundle = this.getView().getModel("i18n").getResourceBundle();
      validator.validateEmptyField("name", this.getModel("dialogModel"),
        _errorMap, bundle.getText("MANDATORY_NAME"));
      validator.validateEmptyField("description", this.getModel("dialogModel"),
        _errorMap, bundle.getText("MANDATORY_DESCRIPTION"));
      validator.validateEmptyField("recastToken", this.getModel("dialogModel"),
        _errorMap, bundle.getText("MANDATORY_RECAST_TOKEN"));
      validator.validateEmptyField("recastThreshold", this.getModel("dialogModel"),
        _errorMap, bundle.getText("MANDATORY_RECAST_THRESHOLD"));
      //Check errors in any field.
      if (Object.keys(_errorMap).length === 0) {
        return true;
      }
      return false;
    }
  });

  return EditApplicationDialog;
}, true);
