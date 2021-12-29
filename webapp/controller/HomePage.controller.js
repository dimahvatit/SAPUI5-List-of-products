sap.ui.define(
	['./BaseController', 'sap/ui/model/json/JSONModel'],
	function (BaseController, JSONModel) {
		'use strict';

		return BaseController.extend('my_cat_list.controller.HomePage', {
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

				this._getRandProducts();
			},

			_getRandProducts: function () {
				let oPopProductsModel = new JSONModel({
					popProducts: []
				});
				let aProductIDs = [];
				for (let i = 0; i < 8; i++) {
					let num = this.getRandomNum(1, 77);
					if (aProductIDs.indexOf(num) === -1) {
						aProductIDs.push(num);
					}
				}
				console.log(aProductIDs);

				for (let i = 0; i <= aProductIDs.length; i++) {
					this.getOwnerComponent()
					.getModel('category')
					.read(`/Products(${aProductIDs[i]})`, {
						sync: true,
						success: function (oData) {
							let aPrevVal = oPopProductsModel.getProperty('/popProducts');
							console.log(aPrevVal);

							oPopProductsModel.setProperty('/popProducts', [...aPrevVal, oData]);
						}
					})
				}
				
				this.getView().setModel(oPopProductsModel, 'promoted');
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
				let sTarget = oEvent.getParameter('item').data('to');
				let oRouter = this.getRouter();

				oRouter.navTo(sTarget);
			},
		});
	},
);
