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
		},
		onAddToCart(oEvent) {
			console.log(oEvent.getSource());
			console.log(arguments);
			let oResourceBundle = this.getResourceBundle();
			let oEntry = oEvent.getSource().getBindingContext().getObject();
			let oCartModel = this.getModel("cartProducts");
			cart.addToCart(oResourceBundle, oEntry, oCartModel);
		}
	});
});