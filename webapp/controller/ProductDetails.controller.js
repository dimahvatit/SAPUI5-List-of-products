sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"../model/cart"
], function (BaseController, formatter, JSONModel, cart) {
		'use strict';

		return BaseController.extend('my_cat_list.controller.ProductDetails', {
			formatter: formatter,
			onInit() {
				this.getRouter().getRoute('details').attachPatternMatched(this._onProductMatched, this);
			},

			_onProductMatched(oEvent) {
				let productID = window.decodeURIComponent(
					oEvent.getParameter('arguments').productID,
				);

				this.getView().bindElement({
					path: `/Products(${productID})`,
					model: 'category',
				});

				this.getView().byId('supplier-details').bindElement({
					path: `/Products(${productID})/Supplier`,
					model: 'category',
				});

				let sDescription = this.getOwnerComponent().getModel('description').getProperty(`/${productID}`);
				let oDescModel = new JSONModel({
					text: sDescription
				});
				this.getView().byId('prod-description').setModel(oDescModel, 'prodDesc');
				this._setDeliveryTime();
			},

			/**
			 * Sets random amount of days between 1 and 10 to simulate delivery time calculations
			 */
			_setDeliveryTime() {
				let term = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
				let oModel = new JSONModel({
					term: term,
				});
				this.getView().setModel(oModel, 'delivery');
			},

			onAddItem(oEvent) {
				let oResourceBundle = this.getResourceBundle();
				let oEntry = this.getView().getBindingContext('category').getObject();
				let oCartModel = this.getModel("cartProducts");
				let sButtonId = oEvent.getSource().data().id;

				cart.addToCart(oResourceBundle, oEntry, oCartModel, sButtonId);
			}
		});
	},
);
