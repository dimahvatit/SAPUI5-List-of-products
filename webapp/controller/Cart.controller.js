sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController,
	JSONModel) {
	"use strict";

	return BaseController.extend("my_cat_list.controller.Cart", {
		onInit: function() {
			let oRouter = this.getRouter();
			oRouter.getRoute('cart').attachPatternMatched(this._onPatternMatched, this);
			this.getView().setModel(new JSONModel({
				currency: 'EUR',
			}), 'view');
		},

		_onPatternMatched: function() {
			let oCartModel = this.getModel('cartProducts');
		},

		onAfterRendering: function() {
		},

		onExit: function() {
			console.log('Cart view closed');
		},

		onCartEntriesDelete(oEvent) {
			
		}
	});
});