sap.ui.define([
	'./BaseController',
	'../model/formatter',
	'sap/ui/model/json/JSONModel',
	'../model/cart',
	"sap/m/MessageBox",
],	function (BaseController, formatter, JSONModel, cart, MessageBox) {
		'use strict';

		return BaseController.extend('my_cat_list.controller.ProductDetails', {
			formatter: formatter,
			onInit: function() {
				this.getRouter().getRoute('details').attachPatternMatched(this._onPatternMatched, this);
				this.oDataModel = this.getOwnerComponent().getModel('category');
				this.oCartModel = this.getOwnerComponent().getModel('cartProducts');

				//! The BUS is here!
				this.oBus = this.getOwnerComponent().getEventBus();
			},

			_onPatternMatched: function(oEvent) {
				this._setDeliveryTime();
				// this.getView().setBusy(true);

				this.productID = window.decodeURIComponent(oEvent.getParameter('arguments').productID);
				this.sProductPath = `/Products(${this.productID})`;

				// Bind the view to Product entity
				this.getView().bindElement({
					path: this.sProductPath,
					model: 'category',
				});

				// Bind header to curr product so "addToCart" button and counter can see current product's quantity in cart
				this.getView().byId('page-header').bindElement({
					path: `/cartEntries/${this.productID}`,
					model: 'cartProducts',
				});

				// Bind supplier details block to current Product's Supplier entity
				this.getView().byId('supplier-details').bindElement({
					path: `${this.sProductPath}/Supplier`,
					model: 'category',
				});

				// Get text from model with products' descriptions
				this.getModel('description').dataLoaded().then(() => {
					let sDescription = this.getModel('description').getProperty(`/${this.productID}`);
					this.getView().byId('prod-description-text').setText(sDescription);
				});

				// Bind "add" and "remove" buttons to current Product entity in '/favorites' obj of cartProducts model
				this.getView().byId('add-favs').bindElement({
					path: `/favorites/${this.productID}`,
					model: 'cartProducts',
				});
				this.getView().byId('remove-favs').bindElement({
					path: `/favorites/${this.productID}`,
					model: 'cartProducts',
				});

				//! Broadcasting the event
				this.oBus.publish("HPchannel", "addLastViewed", { productID: this.productID });
				// Request current Product entity from category model
				// and add it to lastViewed if it's not already there
				/* let that = this;
				this.oDataModel.read(this.sProductPath, {
					success: function (oData) {
						that.getView().setBusy(false);
						let bIsInLastViewed = that.oCartModel
							.getProperty('/lastViewed')
							.some((el) => el.ProductID === oData.ProductID);
						if (!bIsInLastViewed) {
							cart.addLastViewed(oData, that.oCartModel);
						}
					},
					error: function (oError) {
						that.getView().setBusy(false);
						MessageBox.error('Не удалось распознать ответ');
						console.error(oError);
					}
				}); */
			},

			/**
			 * Sets random amount of days between min and max to simulate delivery time calculations
			 */
			_setDeliveryTime: function() {
				let term = this.getRandomNum(1, 10);
				this.byId('delivery-time-status').setText(formatter.deliveryTime(term));
				this.byId('delivery-time-status').setState(formatter.deliveryState(term));
			},

			/**
			 * Removes current product's obj from '/favorites' obj of cartProducts model
			 */
			onRemoveFromFavs: function(oEvent) {
				let oFavsItems = this.oCartModel.getProperty('/favorites');

				delete oFavsItems[this.productID];
				this.oCartModel.refresh(true);
			}
		});
	},
);
