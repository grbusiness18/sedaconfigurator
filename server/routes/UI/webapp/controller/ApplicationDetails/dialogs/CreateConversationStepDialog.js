/**
 * @module controller/dialogs/CreateConversationStepDialog
 * @author I343952
 * @file Create intent dialog.
 */

sap.ui.define([
  "sedaconf/common/dialogs/BaseDialog",
  "sedaconf/common/util/validator",
  "sap/ui/model/json/JSONModel",
], function(BaseDialog, validator, JSONModel) {
  "use strict";

  var _errorMap = {};
  var CreateConversationStepDialog = BaseDialog.extend("sedaconf.controller.ApplicationDetails.dialogs.CreateConversationStepDialog", {

    /**
     * Instantiates the create intent dialog, sets model to it.
     *
     * @public
     * @param {Object} options - Initialization parameters for the create intent dialog.
     */
    constructor: function(options) {
      //Add the specific options for create intent dialog.
      var args = options || {};
      args.fragmentName = "sedaconf.view.ApplicationDetails.dialogs.CreateConversationStepDialog";
      args.isCompact = true;
      //Call the super class init.
      BaseDialog.prototype.init.call(this, args);
    },

    /**
     * Initialize the dialog and set data in case of copy.
     *
     * @public
     * @param {Object} data - Data to be set to model.
     * @param {boolean} isEdit - 'true' if the dialog is opened from edit button click.
     * @param {string} path - Path to the model property.
     */
    init: function(data, isEdit, path) {
      data.actions = data.actions || [];
      data.dropdowns = data.dropdowns || [];
      data.texts = data.texts || [];
      this.getModel("dialogModel").setProperty("/", data);
      var viewModel = new JSONModel({
        isEdit: isEdit,
        path: path
      });
      this.setModel(viewModel, "viewModel");
      this.open();
    },

    /**
     * Event handler for 'liveChange' event of name field.
     *
     * @public
     */
    onStepNameChange: function() {
      this.getModel("dialogModel").setProperty("/vsStepName", "None");
    },

    /**
     * Event handler for 'liveChange' event of name field.
     *
     * @public
     */
    onStepTypeChange: function() {
      this.getModel("dialogModel").setProperty("/vsStepType", "None");
    },

    /**
     * Event handler for 'liveChange' event of name field.
     *
     * @public
     */
    onBelongsToEntityChange: function() {
      this.getModel("dialogModel").setProperty("/vsBelongsToEntity", "None");
    },

    /**
     * Event handler for 'liveChange' event of name field.
     *
     * @public
     */
    onOkParameterChange: function() {
      this.getModel("dialogModel").setProperty("/vsOkParameter", "None");
    },

    /**
     * Event handler for 'liveChange' event of description field.
     *
     * @public
     */
    onDescriptionChange: function() {
      this.getModel("dialogModel").setProperty("/vsDescription", "None");
    },

    /**
     * Event handler for 'press' event of add button above the text table.
     *
     * Adds a new object in the existing model.
     * @public
     */
    onAddText: function() {
      var texts = this.getModel("dialogModel").getProperty("/texts");
      this.getModel("dialogModel").setProperty("/texts/" + texts.length, {});
    },

    /**
     * Event handler for 'press' event of add button above the action table.
     * Adds a new object in the existing model.
     *
     * @public
     */
    onAddDropdownValue: function() {
      var dropdowns = this.getModel("dialogModel").getProperty("/dropdowns");
      this.getModel("dialogModel").setProperty("/dropdowns/" + dropdowns.length, {});
    },

    /**
     * Event handler for 'press' event of delete button.
     *
     * @param {sap.ui.base.Event} oEvent - Event object for delete button press.
     * @public
     */
    onDeleteAction: function(oEvent) {
      var path = oEvent.getSource().getBindingContext("dialogModel").getPath();
      var paths = path.split("/");
      var index = paths[paths.length - 1];
      var actions = this.getModel("dialogModel").getProperty("/actions");
      actions.splice(index, 1);
      this.getModel("dialogModel").setProperty("/actions", actions);
    },

    /**
     * Event handler for 'press' event of delete button.
     *
     * @param {sap.ui.base.Event} oEvent - Event object for delete button press.
     * @public
     */
    onDeleteText: function(oEvent) {
      var path = oEvent.getSource().getBindingContext("dialogModel").getPath();
      var paths = path.split("/");
      var index = paths[paths.length - 1];
      var texts = this.getModel("dialogModel").getProperty("/texts");
      texts.splice(index, 1);
      this.getModel("dialogModel").setProperty("/texts", texts);
    },

    /**
     * Event handler for 'press' event of delete button.
     *
     * @param {sap.ui.base.Event} oEvent - Event object for delete button press.
     * @public
     */
    onDeleteDropdownValue: function(oEvent) {
      var path = oEvent.getSource().getBindingContext("dialogModel").getPath();
      var paths = path.split("/");
      var index = paths[paths.length - 1];
      var dropdowns = this.getModel("dialogModel").getProperty("/dropdowns");
      dropdowns.splice(index, 1);
      this.getModel("dialogModel").setProperty("/dropdowns", dropdowns);
    },

    /**
     * Event handler for 'press' event of add button above the action table.
     * Adds a new object in the existing model.
     *
     * @public
     */
    onAddAction: function() {
      var actions = this.getModel("dialogModel").getProperty("/actions");
      this.getModel("dialogModel").setProperty("/actions/" + actions.length, {});
    },

    /**
     * Creates a new intent tile.
     *
     * @public
     */
    onCreate: function() {
      var dialogModel = this.getModel("dialogModel");
      var modelData = dialogModel.getData();
      if (this._validate()) {
        var data = {
          "step_name": modelData.stepName,
          "ok_param": modelData.okParameter,
          "step_type": modelData.stepType,
          "belongstoentity": modelData.belongsToEntity,
          "execonnullentity": modelData.executeOnNullEntity,
          "actions": modelData.actions,
          "dropdowns": modelData.dropdowns,
          "texts": modelData.texts
        };
        var path = this.getModel("viewModel").getProperty("/path");
        this.getCallback().updateConversationSteps(data, path);
        this.close(true);
      }
    },

    /**
     * Creates a new intent tile.
     *
     * @private
     * @return {boolean} 'true' if all the values entered are valid.
     */
    _validate: function() {
      var dialogModel = this.getModel("dialogModel");
      var bundle = this.getView().getModel("i18n").getResourceBundle();
      validator.validateEmptyField("stepName", dialogModel, _errorMap,
        bundle.getText("MANDATORY_STEP_NAME"));
      validator.validateEmptyField("stepType", dialogModel, _errorMap,
        bundle.getText("MANDATORY_STEP_TYPE"));
      validator.validateEmptyField("belongsToEntity", dialogModel, _errorMap,
        bundle.getText("MANDATORY_BELONGS_TO_ENTITY"));
      validator.validateEmptyField("okParameter", dialogModel, _errorMap,
        bundle.getText("MANDATORY_OK_PARAMETER"));
      // Check if there is no error in the dialog.
      if (Object.keys(_errorMap).length === 0) {
        return true;
      }
      return false;
    }
  });

  return CreateConversationStepDialog;
}, true);
