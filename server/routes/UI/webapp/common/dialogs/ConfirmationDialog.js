/**
 * @file Confirmation dialog.
 * @module common/dialogs/ConfirmationDialog
 *
 * @author I343952
 */

sap.ui.define([
  "sedaconf/common/dialogs/BaseDialog",
  "sedaconf/common/util/validator",
  "sedaconf/model/servicecalls/application"
], function(BaseDialog) {
  "use strict";

  var _fnYes, _fnNo;
  var ConfirmationDialog = BaseDialog.extend("sedaconf.common.dialogs.ConfirmationDialog", {

    /**
     * Instantiates the confirmation dialog, sets model to it.
     * @public
     * @param {Object} options - Initialization parameters for the confirmation dialog.
     */
    constructor: function(options) {
      //Add the specific options for confirmation dialog.
      var args = options || {};
      args.fragmentName = "sedaconf.common.dialogviews.ConfirmationDialog";
      args.isCompact = true;
      //Call the super class init.
      BaseDialog.prototype.init.call(this, args);
    },

    /**
     * Initialises confirmation dialog with default values
     * @public
     * @param {string} title - Title of the dialog.
     * @param {string} message - Content of the dialog.
     * @param {Function} fnYes - Function to be executed if 'Yes' button is clicked.
     * @param {Function} fnNo - Function to be executed if 'No' button is clicked.
     */
    init: function(title, message, fnYes, fnNo) {
      this.getModel().setProperty("/title", title);
      this.getModel().setProperty("/message", message);
      _fnYes = fnYes;
      _fnNo = fnNo;
      this.open();
    },

    onYes: function() {
      if (typeof _fnYes === "function") {
        _fnYes.apply(this.getCallback(), arguments);
      }
    },

    onNo: function() {
      if (typeof _fnNo === "function") {
        _fnNo.apply(this.getCallback(), arguments);
      } else {
        this.close(true);
      }
    }

  });

  return ConfirmationDialog;
}, true);
