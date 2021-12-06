sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";

	return Controller.extend("my_cat_list.controller.BaseController", {
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		onNavBack: function() {
			let oHistory = History.getInstance();
			let sPrevHash = oHistory.getPreviousHash();

			if (sPrevHash) {
				window.history.go(-1);
			} else {
				let oRouter = this.getRouter();
				oRouter.navTo("homepage", {}, true);
			}
		}
	});
});