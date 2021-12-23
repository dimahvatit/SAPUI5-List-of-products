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
				this.getRouter().getRoute('details').attachPatternMatched(this._onPatternMatched, this);
			},

			_onPatternMatched(oEvent) {
				let productID = window.decodeURIComponent(
					oEvent.getParameter('arguments').productID,
				);
				
				// Bind the view to Product entity
				this.getView().bindElement({
					path: `/Products(${productID})`,
					model: 'category',
				});

				// Bind supplier details block to current Product's Supplier entity
				this.getView().byId('supplier-details').bindElement({
					path: `/Products(${productID})/Supplier`,
					model: 'category',
				});

				// Get model with product descriptions
				let sDescription = this.getOwnerComponent().getModel('description').getProperty(`/${productID}`);
				let oDescModel = new JSONModel({
					text: sDescription
				});
				this.getView().byId('prod-description').setModel(oDescModel, 'prodDesc');
				this._setDeliveryTime(1, 10);
			},

			/**
			 * Sets random amount of days between min and max to simulate delivery time calculations
			 */
			_setDeliveryTime(min, max) {
				let term = Math.floor(Math.random() * (max - min + 1)) + min;
				let oModel = new JSONModel({
					term: term,
				});
				this.getView().setModel(oModel, 'delivery');
			}
		});
	},
);
