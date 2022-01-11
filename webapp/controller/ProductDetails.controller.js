sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"../model/cart"
], function (BaseController, formatter, JSONModel, cart) {
		// TODO: When changing amount of product to 0 using counter the product remains in cart
		'use strict';
		
		return BaseController.extend('my_cat_list.controller.ProductDetails', {
			formatter: formatter,
			onInit() {
				this.getRouter().getRoute('details').attachPatternMatched(this._onPatternMatched, this);
			},

			_onPatternMatched(oEvent) {
				this._setDeliveryTime();

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

				this.getView().byId('page-header').bindElement({
					path: `/cartEntries/${productID}`,
					model: 'cartProducts'
				});

				this.byId('add-favs').bindElement({
					path: `/favorites/${productID}`,
					model: 'cartProducts'
				});
				this.byId('remove-favs').bindElement({
					path: `/favorites/${productID}`,
					model: 'cartProducts'
				});

				// Get model with product descriptions
				let sDescription = this.getOwnerComponent().getModel('description').getProperty(`/${productID}`);
				let oDescModel = new JSONModel({
					text: sDescription
				});
				this.getView().byId('prod-description').setModel(oDescModel, 'prodDesc');

				let oEntry = this.getView().getBindingContext('category').getObject();
				let oCartModel = this.getModel("cartProducts");
				cart.addLastViewed(oEntry, oCartModel);
			},

			/**
			 * Sets random amount of days between min and max to simulate delivery time calculations
			 */
			_setDeliveryTime() {
				let term = this.getRandomNum(1, 10);
				let oModel = new JSONModel({
					term: term,
				});
				this.getView().setModel(oModel, 'delivery');
			},

			onRemoveFromFavs(oEvent) {
				let prodID = oEvent.getSource().getBindingContext('cartProducts').getObject().ProductID;
				let oCartModel = this.getModel("cartProducts");
				let oFavsItems = oCartModel.getProperty("/favorites");

				delete oFavsItems[prodID];
				oCartModel.refresh(true);
			}
		});
	},
);
