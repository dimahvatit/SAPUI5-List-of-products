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

		/**
		 * Just a utility function to get a random number
		 * @param {integer} min 
		 * @param {integer} max 
		 * @returns random integer between min and max including both
		 */
		getRandomNum(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},

		/**
		 * Passes chosen item to cart's addToCart()
		 */
		onAddItem(oEvent) {
			// set model name which context will be used depending on the current view name
			let sContextName = this.getView().getViewName() == 'my_cat_list.view.Cart' ? 'cartProducts' : 'category';
			let oEntry = oEvent.getSource().getBindingContext(sContextName).getObject();
			let oResourceBundle = this.getResourceBundle();
			let oCartModel = this.getModel("cartProducts");
			let sButtonId = oEvent.getSource().data().id;

			cart.addToCart(oResourceBundle, oEntry, oCartModel, sButtonId);
		}
	});
});