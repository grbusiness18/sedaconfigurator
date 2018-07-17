sap.ui.define([
  "sedaconf/common/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/core/routing/History",
  "sap/ui/model/FilterOperator",
  "sedaconf/model/servicecalls/log"
], function(BaseController, JSONModel, Filter, History, FilterOperator, logService) {
  "use strict";

  return BaseController.extend("sedaconf.controller.ApplicationLogs.ApplicationLogs", {

    /**
     * Instantiates the model and sets it to the view.
     *
     * @public
     */
    onInit: function() {
      //Subscribe to route match event.
      this.getRouter().attachRoutePatternMatched(this._onRoutePatternMatched.bind(this), this);
      //Set data model.
      var dataModel = new JSONModel();
      var viewModel = new JSONModel();
      this.setModel(dataModel);
      this.setModel(viewModel, "view");
    },

    /**
     * Event handler for 'RoutePatternMatched' event.
     *
     * @private
     * @param {sap.ui.base.Event} oEvent - Event object for 'RoutePatternMatched' event.
     */
    _onRoutePatternMatched: function(oEvent) {
      if (oEvent.getParameter("name") !== "ApplicationLogs") {
        return;
      }
      var applicationId = oEvent.getParameter("arguments").applicationId;
      this.getModel("view").setProperty("/applicationId", applicationId);
      this._loadLogs(applicationId);
    },

    /**
     * Convenience method for navigating back.
     *
     * @public
     */
    onNavBack: function() {
      var sPreviousHash = History.getInstance().getPreviousHash();
      if (typeof sPreviousHash !== "undefined") {
        // The history contains a previous entry
        history.go(-1);
      } else {
        this.getRouter().navTo("ApplicationDetails", {
          applicationId: this.getModel("view").getProperty("/applicationId")
        });
      }
    },

    /**
     * Get application data from backend.
     *
     * @private
     * @param {string} applicationId - Application Id.
     */
    _loadLogs: function(applicationId) {
      logService.getAllLogs(applicationId).then(function(data) {
        var logs = data.map(function(log) {
          log.timestamp = new Date(log.timestamp).toUTCString();
          return log;
        });
        this.getModel().setProperty("/logs", logs);
      }.bind(this));
    },

    /**
     * Event handler for 'liveChange' event for log search.
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - Event object for 'livechange' event.
     */
    onLogsSearch: function(oEvent) {
      var searchText = oEvent.getParameter("newValue");
      var filter = new Filter({
        filters: [
          new Filter({
            path: "input",
            operator: FilterOperator.Contains,
            value1: searchText
          }),
          new Filter({
            path: "output",
            operator: FilterOperator.Contains,
            value1: searchText
          })
        ],
        and: false
      });
      this.getView().byId("logsTable").getBinding("items").filter(filter);
    }

  });

});
