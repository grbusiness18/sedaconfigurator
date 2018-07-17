sap.ui.define([
  "sedaconf/common/BaseController",
  "sap/ui/model/json/JSONModel",
  "sedaconf/controller/Applications/dialogs/CreateApplicationDialog",
  "sedaconf/controller/Applications/dialogs/EditApplicationDialog",
  "sedaconf/common/dialogs/ConfirmationDialog",
  "sedaconf/model/servicecalls/application"
], function(BaseController, JSONModel, CreateApplicationDialog, EditApplicationDialog, ConfirmationDialog, applicationService) {
  "use strict";

  return BaseController.extend("sedaconf.controller.Applications.Applications", {

    /**
     * Instantiates the model and sets it to the view.
     *
     * @public
     */
    onInit: function() {
      //Subscribe to route match event.
      this.getRouter().attachRoutePatternMatched(this._onRoutePatternMatched, this);
      var model = new JSONModel();
      var viewModel = new JSONModel({
        editMode: false
      });
      this.setModel(viewModel, "view");
      this.setModel(model);
    },

    /**
     * Event handler for 'RoutePatternMatched' event.
     *
     * @private
     * @param {sap.ui.base.Event} oEvent - Event object for 'RoutePatternMatched' event.
     */
    _onRoutePatternMatched: function(oEvent) {
      if (oEvent.getParameter("name") !== "Applications") {
        return;
      }
      this.setApplicationData();
    },

    /**
     * Loads the list of applications and sets it to the model.
     *
     * @public
     */
    setApplicationData: function() {
      applicationService.getAllApplications().then(function(data) {
        this.getModel().setProperty("/applications", data);
      }.bind(this));
    },

    /**
     * Event handler for create tile 'press' event.
     *
     * @public
     */
    onCreate: function() {
      var createApplicationDialog = new CreateApplicationDialog({
        view: this.getView(),
        modelName: "dialogModel",
        callback: this
      });
      createApplicationDialog.init();
    },

    /**
     * Event handler for application tile 'press' event.
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - event object for 'press' event of tile.
     */
    onOpenApplication: function(oEvent) {
      var data = oEvent.getSource().getBindingContext().getObject();
      var id = data._id;
      var scope = oEvent.getParameter("scope");
      var action = oEvent.getParameter("action");
      if (scope === "Actions" && action === "Remove") {
        var confirmationDialog = new ConfirmationDialog({
          view: this.getView(),
          callback: this
        });
        confirmationDialog.init(this.getI18nText("CONFIRMATION"),
          this.getI18nText("CONFIRM_APPLICATION_DELETE", [data.name]),
          function() {
            confirmationDialog.close(true);
            this.deleteApplication(id);
          }.bind(this));
      } else if (scope === "Actions" && action === "Press") {
        this.editApplication(data);
      } else {
        this.getRouter().navTo("ApplicationDetails", {
          applicationId: id
        });
      }
    },

    /**
     * Opens the edit application dialog.
     *
     * @public
     * @param {Object} data - Application data.
     * @param {string} applicationId - Application Id
     */
    editApplication: function(data, applicationId) {
      var editApplicationDialog = new EditApplicationDialog({
        view: this.getView(),
        modelName: "dialogModel",
        callback: this
      });
      editApplicationDialog.init(data, applicationId);
    },

    /**
     * Deletes the application from backend.
     *
     * @public
     * @param {string} applicationId - Application Id
     */
    deleteApplication: function(applicationId) {
      applicationService.deleteApplication(applicationId).then(this.setApplicationData.bind(this));
    },

    /**
     * Event handler for 'press' event of the edit button.
     *
     * @public
     */
    onEdit: function() {
      this.getModel("view").setProperty("/editMode", true);
    },

    /**
     * Event handler for 'press' event of the done button.
     *
     * @public
     */
    onDone: function() {
      this.getModel("view").setProperty("/editMode", false);
    }

  });
});
