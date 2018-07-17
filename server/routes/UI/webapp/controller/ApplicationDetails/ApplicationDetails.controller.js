/**
 * @file Application Details controller.
 * @module controller/ApplicationDetails/ApplicationDetails.controller.js
 *
 * @author I343952
 */

sap.ui.define([
  "sedaconf/common/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sedaconf/controller/ApplicationDetails/dialogs/CreateIntentDialog",
  "sedaconf/controller/ApplicationDetails/dialogs/CreateConversationStepDialog",
  "sedaconf/common/dialogs/ConfirmationDialog",
  "sedaconf/model/servicecalls/application",
  "sedaconf/model/servicecalls/intent"
], function(BaseController, JSONModel, Filter, FilterOperator, CreateIntentDialog,
  CreateConversationStepDialog, ConfirmationDialog, applicationService, intentService) {
  "use strict";

  return BaseController.extend("sedaconf.controller.ApplicationDetails.ApplicationDetails", {

    /**
     * Instantiates the model and sets it to the view.
     *
     * @public
     */
    onInit: function() {
      //Subscribe to route match event.
      this.getRouter().attachRoutePatternMatched(this._onRoutePatternMatched.bind(this), this);
      // Create Models
      var viewModel = new JSONModel({
        editMode: false,
        showDetails: false
      });
      var dataModel = new JSONModel();
      var entityModel = new JSONModel();
      var intentModel = new JSONModel();
      this.setModel(dataModel);
      this.setModel(entityModel, "entityModel");
      this.setModel(intentModel, "intentModel");
      this.setModel(viewModel, "view");
    },

    /**
     * Convenience method for navigating back.
     *
     * @public
     */
    onNavBack: function() {
      var listControl = this.getView().byId("intentList");
      listControl.removeSelections();
      this.goBack();
    },

    /**
     * Event handler for 'RoutePatternMatched' event.
     *
     * @private
     * @param {sap.ui.base.Event} oEvent - Event object for 'RoutePatternMatched' event.
     */
    _onRoutePatternMatched: function(oEvent) {
      if (oEvent.getParameter("name") !== "ApplicationDetails") {
        return;
      }
      // Scroll the page to the top.
      var intentListPage = this.getView().byId("intentListPage");
      intentListPage.scrollTo(0, 0);
      // Get application id from the URL.
      var applicationId = oEvent.getParameter("arguments").applicationId;
      this._loadApplicationData(applicationId);
      this.loadIntents(applicationId);
      this.getModel("view").setProperty("/showDetails", false);
    },

    /**
     * Get application data from backend.
     *
     * @private
     * @param {string} applicationId - Application Id
     */
    _loadApplicationData: function(applicationId) {
      applicationService.getApplicationData(applicationId).then(function(data) {
        this.getModel().setProperty("/applicationDetails", data);
      }.bind(this));
    },

    /**
     * Gets the intents from backend based on application id.
     *
     * @public
     * @param {string} applicationId - Application Id.
     */
    loadIntents: function(applicationId) {
      intentService.getAllIntents(applicationId).then(function(data) {
        this.getModel().setProperty("/intents", data);
        this.getModel("intentModel").setProperty("/intents", data);
        var listControl = this.getView().byId("intentList");
        listControl.removeSelections();
        this.getModel("view").setProperty("/showDetails", false);
      }.bind(this));
    },

    /**
     * Sets the selected intent data to details page.
     *
     * @public
     * @param {Object} intentDetails - Intent data
     */
    setIntentDetails: function(intentDetails) {
      intentDetails.cross_intents = intentDetails.cross_intents.map(function(intentId) {
        var data = {};
        data.intent_id = intentId;
        return data;
      });
      this.getModel("view").setProperty("/showDetails", true);
      this.getModel("entityModel").setProperty("/", intentDetails.entities);
      this.getModel().setProperty("/intentDetails", intentDetails);
    },

    /**
     * Searches the intents by 'name' or 'description'.
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - Event object for liveChange event of search field.
     */
    onIntentSearch: function(oEvent) {
      var searchText = oEvent.getParameter("newValue");
      var filter = new Filter({
        filters: [
          new Filter({
            path: "intent_name",
            operator: FilterOperator.Contains,
            value1: searchText
          }),
          new Filter({
            path: "description",
            operator: FilterOperator.Contains,
            value1: searchText
          })
        ],
        and: false
      });
      this.getView().byId("intentList").getBinding("items").filter(filter);
    },

    /**
     * Event handler for create button 'press' event.
     *
     * @public
     */
    onCreateIntent: function() {
      var applicationId = this.getModel().getProperty("/applicationDetails/_id");
      var createIntentDialog = new CreateIntentDialog({
        view: this.getView(),
        modelName: "dialogModel",
        callback: this
      });
      createIntentDialog.init(applicationId);
    },

    /**
     * Event handler for edit button 'press' event.
     *
     * @public
     */
    onEdit: function() {
      this.getModel("view").setProperty("/editMode", true);
    },

    /**
     * Event handler for save button 'press' event.
     *
     * @public
     */
    onSave: function() {
      this._saveIntent();
      this.getModel("view").setProperty("/editMode", false);
    },

    /**
     * Event handler for cancel button 'press' event.
     *
     * @public
     */
    onCancel: function() {
      var applicationId = this.getModel().getProperty("/applicationDetails/_id");
      var intentId = this.getModel().getProperty("/intentDetails/_id");
      intentService.getIntentData(intentId, applicationId).then(function(data) {
        this.setIntentDetails(data);
      }.bind(this));
      this.getModel("view").setProperty("/editMode", false);
    },

    /**
     * Event handler for create button 'press' event.
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - Event object for liveChange event of search field.
     */
    onIntentPress: function(oEvent) {
      this.getModel("view").setProperty("/editMode", false);
      if (!this.intentDetailsObjectPage) {
        this.intentDetailsObjectPage = sap.ui.xmlfragment(
          "sedaconf.view.ApplicationDetails.fragments.IntentDetailsObjectPageLayout", this);
      }
      var entitySection = this.getView().byId("entity");
      this.intentDetailsObjectPage.setSelectedSection(entitySection.getId());
      var intentDetailsPage = this.getView().byId("intentDetails");
      intentDetailsPage.removeAllContent();
      intentDetailsPage.addContent(this.intentDetailsObjectPage);
      intentDetailsPage.rerender();
      var intentDetails = oEvent.getParameter("listItem").getBindingContext().getObject();
      var intentId = intentDetails._id;
      var applicationId = intentDetails.app_id;
      intentService.getIntentData(intentId, applicationId).then(function(data) {
        this.setIntentDetails(data);
      }.bind(this));
    },

    /**
     * Navigates to Logs view
     *
     * @public
     */
    onViewLogs: function() {
      var listControl = this.getView().byId("intentList");
      listControl.removeSelections();
      this.getRouter().navTo("ApplicationLogs", {
        applicationId: this.getModel().getProperty("/applicationDetails/_id")
      });
    },

    /**
     * Opens a popover to show client id and client secret
     *
     * @public
     * @param {sap.ui.base.Event} oEvent Event object for 'press' event of settings icon.
     */
    onShowClientDetails: function(oEvent) {
      if (!this._oPopover) {
        this._oPopover = sap.ui.xmlfragment(
          "sedaconf.view.ApplicationDetails.popovers.ClientDetailsPopover", this);
        this.getView().addDependent(this._oPopover);
      }
      this._oPopover.openBy(oEvent.getSource());
    },

    /**
     * Event handler for 'press' event for delete button in the footer
     *
     * @public
     */
    onDeleteIntent: function() {
      var intentName = this.getModel().getProperty("/intentDetails/intent_name");
      var confirmationDialog = new ConfirmationDialog({
        view: this.getView(),
        callback: this
      });
      confirmationDialog.init(this.getI18nText("CONFIRMATION"),
        this.getI18nText("CONFIRM_INTENT_DELETE", [intentName]),
        function() {
          confirmationDialog.close(true);
          this._deleteIntent();
        }.bind(this));
    },

    /**
     * Deletes the intent and reloads the list of intents
     *
     * @private
     */
    _deleteIntent: function() {
      var applicationId = this.getModel().getProperty("/applicationDetails/_id");
      var intentId = this.getModel().getProperty("/intentDetails/_id");
      intentService.deleteIntent(intentId, applicationId).then(function() {
        var listControl = this.getView().byId("intentList");
        listControl.removeSelections();
        this.loadIntents(applicationId);
        this.getModel("view").setProperty("/showDetails", false);
      }.bind(this));
    },

    /**
     * Adds an entry in the entity table
     *
     * @public
     */
    onAddEntity: function() {
      var entities = this.getModel().getProperty("/intentDetails/entities");
      this.getModel().setProperty("/intentDetails/entities/" + entities.length, {});
    },

    /**
     * Adds an entry in the cross intent table
     *
     * @public
     */
    onAddCrossIntent: function() {
      var crossIntents = this.getModel().getProperty("/intentDetails/cross_intents");
      this.getModel().setProperty("/intentDetails/cross_intents/" + crossIntents.length, {});
    },

    /**
     * Adds an entry in the action table
     *
     * @public
     */
    onAddAction: function() {
      var actions = this.getModel().getProperty("/intentDetails/actions");
      this.getModel().setProperty("/intentDetails/actions/" + actions.length, {});
    },

    /**
     * Event handler for press event on add button in response section
     *
     * @public
     */
    onAddResponse: function() {
      var responses = this.getModel().getProperty("/intentDetails/responses");
      this.getModel().setProperty("/intentDetails/responses/" + responses.length, {});
    },

    /**
     * Opens a dialog for conversation step creation
     *
     * @public
     */
    onAddConversationSteps: function() {
      var applicationId = this.getModel().getProperty("/applicationDetails/_id");
      var intentId = this.getModel().getProperty("/intentDetails/_id");
      var createConversationStepDialog = new CreateConversationStepDialog({
        view: this.getView(),
        modelName: "dialogModel",
        callback: this
      });
      createConversationStepDialog.setModel(this.getModel());
      createConversationStepDialog.init({
        "applicationId": applicationId,
        "intentId": intentId
      });
    },

    updateConversationSteps: function(data, path) {
      if (path) {
        this.getModel().setProperty(path, data);
      } else {
        var conversations = this.getModel().getProperty("/intentDetails/conversations");
        this.getModel().setProperty("/intentDetails/conversations/" + conversations.length, data);
      }
    },

    /**
     * Opens the create conversation step dialog with data populated
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - Event object for edit button press
     */
    onEditConversationStep: function(oEvent) {
      var data = oEvent.getSource().getBindingContext().getObject();
      var path = oEvent.getSource().getBindingContext().getPath();
      data.applicationId = this.getModel().getProperty("/applicationDetails/_id");
      data.intentId = this.getModel().getProperty("/intentDetails/_id");
      data.stepName = data.step_name;
      data.stepType = "" + data.step_type;
      data.okParameter = data.ok_param;
      data.executeOnNullEntity = data.execonnullentity;
      data.belongsToEntity = data.belongstoentity;
      var createConversationStepDialog = new CreateConversationStepDialog({
        view: this.getView(),
        modelName: "dialogModel",
        callback: this
      });
      createConversationStepDialog.setModel(this.getModel());
      createConversationStepDialog.init(data, true, path);

    },

    /**
     * Saves the intent data to backend.
     *
     * @private
     */
    _saveIntent: function() {
      var applicationId = this.getModel().getProperty("/applicationDetails/_id");
      var intentDetails = this.getModel().getProperty("/intentDetails");
      var intentId = intentDetails._id;
      this._removeEmptyObjects(intentDetails, "entities");
      this._removeEmptyObjects(intentDetails, "responses");
      this._removeEmptyObjects(intentDetails, "actions");
      this._removeEmptyObjects(intentDetails, "cross_intents");
      intentDetails.cross_intents = intentDetails.cross_intents.map(function(data) {
        return data.intent_id;
      });
      intentService.updateIntentData(intentId, applicationId, intentDetails).then(function(data) {
        this.setIntentDetails(data);
      }.bind(this));
    },

    /**
     * Remove empty object from backend data.
     *
     * @private
     * @param {Object} object - The object in which the input is from and output is to be saved.
     * @param {string} arrayProperty - Object's property whose value is an array.
     */
    _removeEmptyObjects: function(object, arrayProperty) {
      object[arrayProperty] = object[arrayProperty].filter(function(obj) {
        return Object.keys(obj).length !== 0;
      });
    },

    /**
     * Event handler for press event on delete icon in the entity section
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - Event object for detecting the line item
     */
    onDeleteEntitiy: function(oEvent) {
      var path = oEvent.getSource().getBindingContext().getPath();
      var paths = path.split("/");
      var index = paths[paths.length - 1];
      var entities = this.getModel().getProperty("/intentDetails/entities");
      entities.splice(index, 1);
      this.getModel().setProperty("/intentDetails/entities", entities);
    },

    /**
     * Deletes the conversation step
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - Event object for delete button press
     */
    onDeleteConversationStep: function(oEvent) {
      var path = oEvent.getSource().getBindingContext().getPath();
      var paths = path.split("/");
      var index = paths[paths.length - 1];
      var conversations = this.getModel().getProperty("/intentDetails/conversations");
      conversations.splice(index, 1);
      this.getModel().setProperty("/intentDetails/conversations", conversations);
    },

    /**
     * Deletes the action
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - Event object for delete button press
     */
    onDeleteAction: function(oEvent) {
      var path = oEvent.getSource().getBindingContext().getPath();
      var paths = path.split("/");
      var index = paths[paths.length - 1];
      var actions = this.getModel().getProperty("/intentDetails/actions");
      actions.splice(index, 1);
      this.getModel().setProperty("/intentDetails/actions", actions);
    },

    /**
     * Deletes the response
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - Event for delete button press
     */
    onDeleteResponse: function(oEvent) {
      var path = oEvent.getSource().getBindingContext().getPath();
      var paths = path.split("/");
      var index = paths[paths.length - 1];
      var responses = this.getModel().getProperty("/intentDetails/responses");
      responses.splice(index, 1);
      this.getModel().setProperty("/intentDetails/responses", responses);
    },

    /**
     * Deletes the cross intent
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - Event for delete button press
     */
    onDeleteCrossIntent: function(oEvent) {
      var path = oEvent.getSource().getBindingContext().getPath();
      var paths = path.split("/");
      var index = paths[paths.length - 1];
      var crossIntents = this.getModel().getProperty("/intentDetails/cross_intents");
      crossIntents.splice(index, 1);
      this.getModel().setProperty("/intentDetails/cross_intents", crossIntents);
    }

  });

});
