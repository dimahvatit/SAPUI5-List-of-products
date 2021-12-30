sap.ui.define([
	'./BaseController',
	'sap/ui/model/json/JSONModel',
	'../model/formatter'
], function (BaseController, JSONModel, formatter) {
		'use strict';

		return BaseController.extend('my_cat_list.controller.HomePage', {
			formatter: formatter,
			onInit: function () {
				let oRouter = this.getRouter();
				oRouter.getRoute('homepage').attachPatternMatched(this._onPatternMatched, this);

				// Get count of Suppliers from 'category' model
				let oView = this.getView();
				this.getOwnerComponent()
					.getModel('category')
					.read('/Suppliers/$count', {
						sync: true,
						success: function (sData) {
							oView.byId('supplCount').setText(sData);
						}
					});

				// Get count of Products from 'category' model
				this.getOwnerComponent()
					.getModel('category')
					.read('/Products/$count', {
						sync: false,
						success: function (sData) {
							oView.byId('prodCount').setText(sData);
						}
					});
				
				let oPopProductsModel = new JSONModel({
					popProducts: []
				});
				this.getView().setModel(oPopProductsModel, 'promoted');

				this._getRandProducts(8);
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
			},

			_onToggleButtonPress: function (oEvent) {
				var oToolPage = oEvent.getSource().getParent().getParent();
				var oSideNavigation = oToolPage.getAggregation('sideContent');
				var bExpanded = oSideNavigation.getExpanded();
				oSideNavigation.setExpanded(!bExpanded);
			},

			onMenuItemSelect: function (oEvent) {
				let oItem = oEvent.getParameter('item') ? oEvent.getParameter('item') : oEvent.getSource();
				let sTarget = oItem.data('to');
				let oRouter = this.getRouter();

				oRouter.navTo(sTarget);
			},
		});
	},
);
