/**
 * @module controller/dialogs/CreateIntentDialog
 * @author I343952
 * @file Create intent dialog.
 */

sap.ui.define([
  "sedaconf/common/dialogs/BaseDialog",
  "sedaconf/common/util/validator",
  "sedaconf/model/servicecalls/intent"
], function(BaseDialog, validator, intentService) {
  "use strict";

  var _errorMap = {};
  var CreateIntentDialog = BaseDialog.extend("sedaconf.controller.ApplicationDetails.dialogs.CreateIntentDialog", {

    /**
     * Instantiates the create intent dialog, sets model to it.
     * @public
     * @param {Object} options - Initialization parameters for the create intent dialog.
     */
    constructor: function(options) {
      //Add the specific options for create intent dialog.
      var args = options || {};
      args.fragmentName = "sedaconf.view.ApplicationDetails.dialogs.CreateIntentDialog";
      args.isCompact = true;
      //Call the super class init.
      BaseDialog.prototype.init.call(this, args);
    },

    init: function(applicationId) {
      this.getModel("dialogModel").setProperty("/applicationId", applicationId);
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
     * Creates a new intent tile.
     * @public
     */
    onCreate: function() {
      var dialogModel = this.getModel("dialogModel");
      var modelData = dialogModel.getData();
      var applicationId = this.getModel("dialogModel").getProperty("/applicationId");
      if (this._validate()) {
        var data = {
          "intent_name": modelData.name,
          "description": modelData.description
        };
        intentService.createIntent(applicationId, data).then(function() {
          this.getCallback().loadIntents(applicationId);
        }.bind(this));
        this.close(true);
      }
    },

    /**
     * Creates a new intent tile.
     * @private
     * @return {boolean} 'true' if all the values entered are valid.
     */
    _validate: function() {
      var bundle = this.getView().getModel("i18n").getResourceBundle();
      validator.validateEmptyField("name", this.getModel("dialogModel"), _errorMap, bundle.getText("MANDATORY_NAME"));
      validator.validateEmptyField("description", this.getModel("dialogModel"), _errorMap,
        bundle.getText("MANDATORY_DESCRIPTION"));
      //Check errors in any field.
      if (Object.keys(_errorMap).length === 0) {
        return true;
      }
      return false;
    }
  });

  return CreateIntentDialog;
}, true);
