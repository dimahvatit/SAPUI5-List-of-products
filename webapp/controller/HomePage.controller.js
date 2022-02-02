sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/EventBus",
	"../model/cart"
], function (BaseController, JSONModel, EventBus, cart) {
		'use strict';

		return BaseController.extend('my_cat_list.controller.HomePage', {
			onInit: function () {
				let oCategoryModel = this.getOwnerComponent().getModel('category');
				this.getRouter().getRoute('homepage').attachPatternMatched(this._onPatternMatched, this);

				//! The BUS is here!
				let oBus = this.getOwnerComponent().getEventBus();
				oBus.subscribe("HPchannel", "addLastViewed", onAddLastViewed, this);

				//! Event handler
				function onAddLastViewed(channelId, eventId, parametersMap) {
					let oCartModel = this.getOwnerComponent().getModel('cartProducts');
					let oCategoryModel = this.getOwnerComponent().getModel('category');
	
					let oProdToAdd = oCategoryModel.read(`/Products(${parametersMap.productID})`, {
						success: function (oData) {
							let bIsInLastViewed = oCartModel
								.getProperty('/lastViewed')
								.some((el) => el.ProductID === +parametersMap.productID);
							if (!bIsInLastViewed) {
								cart.addLastViewed(oData, oCartModel);
							}
						}
					})				
				}

				// Get count of Suppliers from 'category' model
				let oView = this.getView();
				oCategoryModel.read('/Suppliers/$count', {
						success: function (sData) {
							oView.byId('supplCount').setText(sData);
						}
					}
				);

				// Get count of Products from 'category' model
				oCategoryModel.read('/Products/$count', {
						success: function (sData) {
							oView.byId('prodCount').setText(sData);
						}
					}
				);
				
				let oCartModel = this.getOwnerComponent().getModel('cartProducts');
				
				let aLastViewedEntries = oCartModel.getData()['lastViewed'];
				if (!aLastViewedEntries.length) {					
					for (let i = 1; i <= 4; i++) {
						oCategoryModel.read(`/Products(${i})`, {
							success: function (oData) {
								let aPrevVal = oCartModel.getData()['lastViewed'];
								oCartModel.setProperty('/lastViewed', [...aPrevVal, oData]);
							}
						})
					}
				}
				
				let oPopProductsModel = new JSONModel({
					popProducts: []
				});
				this.getView().setModel(oPopProductsModel, 'promoted');

				this._getRandProducts(12);
			},

			_getRandProducts: function (count) {
				let oPopProductsModel = this.getModel('promoted');
				let aProductIDs = [];

				while (count > 0) {
					let num = this.getRandomNum(1, 77);
					if (aProductIDs.indexOf(num) === -1) {
						aProductIDs.push(num);
						count--;
					}
				}

				for (let i = 0; i < aProductIDs.length; i++) {
					this.getOwnerComponent()
					.getModel('category')
					.read(`/Products(${aProductIDs[i]})`, {
						sync: true,
						success: function (oData) {
							let aPrevVal = oPopProductsModel.getProperty('/popProducts');
							oPopProductsModel.setProperty('/popProducts', [...aPrevVal, oData]);
						}
					})
				}
			},

			_onPatternMatched: function () {
				let oCartModel = this.getModel('cartProducts');
				let aLastViewedEntries = oCartModel.getProperty('/lastViewed');

				for (let i = 0; i <= 3; i++) {
					let oElem = aLastViewedEntries[i];

					this.byId(`item${i}`).bindElement({
						path: `/lastViewed/${i}`,
						model: 'cartProducts'
					});
				}
			},

			onToggleButtonPress: function (oEvent) {
				var oToolPage = oEvent.getSource().getParent().getParent();
				var oSideNavigation = oToolPage.getAggregation('sideContent');
				var bExpanded = oSideNavigation.getExpanded();
				oSideNavigation.setExpanded(!bExpanded);
			},

			onMenuItemSelect: function (oEvent) {
				let oItem = oEvent.getParameter('item') ? oEvent.getParameter('item') : oEvent.getSource();
				let sTarget = oItem.data('to');

				this.getRouter().navTo(sTarget);
			},

			onLastViewedClick: function(oEvent) {
				let iProdID = oEvent.getSource().getBindingContext('cartProducts').getObject().ProductID;
				this.getRouter().navTo('details', {
					productID: window.encodeURIComponent(iProdID),
				});
			},

			onNavigateToSmartT() {
				this.getRouter().navTo('smart_table');
			},

			onNavigateToLaunchpad() {
				this.getRouter().navTo('launchpad');
			}
		});
	},
);
