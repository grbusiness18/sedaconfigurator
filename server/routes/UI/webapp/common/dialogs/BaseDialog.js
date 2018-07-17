/**
 * @module common/dialogs/BaseDialog
 * @author I343952
 * @file Base dialog class for all the dialogs.
 */

sap.ui.define([
  "sap/ui/base/Object",
  "sap/m/Dialog",
  "sap/ui/model/json/JSONModel"
], function(BaseObject, Dialog, JSONModel) {
  "use strict";

  var BaseDialog = BaseObject.extend("hdm.dialogs.BaseDialog", {

    //Common functions for dialogs which can be overridden in the implementation class.

    /**
     * Initialize the dialog.
     * @public
     * @param {Object} options - Initialization parameters for the dialog.
     * @param {string} [options.fragmentName] - Path to the fragment file.
     * @param {string} [options.setViewId] - 'true' if init fragment with view id parameter.
     * @param {boolean} [options.isValueHelpDialog] - Path to the fragment file.
     * @param {Object} [options.view] - View for adding dialog as a dependent.
     * @param {Object} [options.model] - Model for the dialog.
     * @param {string} [options.modelName] - Name for dialog's model.
     * @param {boolean} [options.isCompact] - 'true' if compact design is required.
     */
    init: function(options) {
      var args = options || {};
      if (args.fragmentName && args.setViewId) {
        if (args.view) {
          this.dialog = sap.ui.xmlfragment(args.view.getId(), args.fragmentName, this);
        }
      } else if (args.fragmentName) {
        this.dialog = sap.ui.xmlfragment(args.fragmentName, this);
      } else if (args.isValueHelpDialog) {
        this.dialog = this.getValueHelpDialog(args);
      } else {
        this.dialog = new Dialog(this.getDialogSettings(args));
      }
      if (args.view) {
        this.setView(args.view);
        args.view.addDependent(this.dialog);
      }
      if (args.model) {
        this.setModel(args.model, args.modelName);
      } else {
        this.setModel(new JSONModel(), args.modelName);
      }
      if (args.isCompact) {
        this.dialog.addStyleClass("sapUiSizeCompact");
      }
      this.dialog.setStretch(sap.ui.Device.system.phone);
      this.setCallback(args.callback);
    },

    /**
     * Set Model to the dialog.
     * @public
     * @param {Object} model - Model to be set to the dialog.
     * @param {String} [modelName] - Name of the model.
     */
    setModel: function(model, modelName) {
      if (this.dialog) {
        this.dialog.setModel(model, modelName);
      }
    },

    /**
     * Get Model of the dialog.
     * @public
     * @param {String} [modelName] - Name of the model.
     * @returns {Object} Dialog model
     */
    getModel: function(modelName) {
      if (this.dialog) {
        return this.dialog.getModel(modelName);
      }
    },

    /**
     * Set parent view of the dialog.
     * @public
     * @param {Object} view - Parent View.
     */
    setView: function(view) {
      this.oView = view;
    },

    /**
     * Get parent view of the dialog.
     * @public
     * @returns {Object} view - Parent View.
     */
    getView: function() {
      return this.oView;
    },

    /**
     * Set parent callback of the dialog.
     * It can be a controller or a dialog object
     * @public
     * @param {Object} callback - Parent object.
     */
    setCallback: function(callback) {
      this.oCallback = callback;
    },

    /**
     * Get parent callback of the dialog.
     * @public
     * @returns {Object} callback - Parent object.
     */
    getCallback: function() {
      return this.oCallback;
    },

    /**
     * Opens Dialog on UI.
     * @public
     */
    open: function() {
      if (this.dialog && !this.dialog.isOpen()) {
        this.dialog.open();
      }
    },

    /**
     * Closes Dialog on UI.
     * @public
     * @param {boolean} [bDestroy] - 'true' if the dialog is to be destroyed after close.
     */
    close: function(bDestroy) {
      if (this.dialog && this.dialog.isOpen()) {
        this.dialog.close();
      }
      if (bDestroy) {
        this.destroy();
      }
    },

    /**
     * Destroys the dialog..
     * @public
     */
    destroy: function() {
      if (this.dialog) {
        this.dialog.destroy();
      }
    },

    /**
     * Get Settings for non-fragmented dialog.
     * @public
     * @param {Object} options - Initialization parameters for non-fragmented dialog.
     * @param {String} options.title - Title of the dialog, has to be a i18n place holder.
     * @param {Object} [options.type] - Type of Dialog.
     * @returns {Object} Settings for the non-fragmented dialog.
     */
    getDialogSettings: function(options) {
      var settings = {};
      settings.title = options.title;
      settings.type = options.type || "Message";
      settings.content = this.getDialogContent();
      settings.beginButton = this.getButton("begin");
      settings.endButton = this.getButton("end");
      return settings;
    },

    /**
     * To be overridden in the implementation classes of non-fragment based dialogs.
     * @public
     */
    getButton: function() {
      throw "Please define getButton method in your implementation class: " +
        this.getMetadata().getName();
    },

    /**
     * To be overridden in the implementation classes of non-fragment based dialogs.
     * @public
     */
    getDialogContent: function() {
      throw "Please define getDialogContent method in your implementation class: " +
        this.getMetadata().getName();
    },

    /**
     * To be overridden in the implementation classes of value help dialogs.
     * @public
     */
    getValueHelpDialog: function() {
      throw "Please define getValueHelpDialog method in your implementation class: " +
        this.getMetadata().getName();
    }
  });

  return BaseDialog;
}, true);
