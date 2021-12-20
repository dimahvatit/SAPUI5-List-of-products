sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"../model/cart"
], function(Controller, History, cart) {
	"use strict";

	return Controller.extend("my_cat_list.controller.BaseController", {
		cart: cart,
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
			let sPrevHash = History.getInstance().getPreviousHash();

			if (sPrevHash) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("homepage", {}, true);
			}
		}
	});
});