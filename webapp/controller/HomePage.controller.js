sap.ui.define(
	['./BaseController', 'sap/ui/model/json/JSONModel'],
	function (BaseController, JSONModel) {
		'use strict';

		return BaseController.extend('my_cat_list.controller.HomePage', {
			onInit: function () {
				let oRouter = this.getRouter();
				oRouter
					.getRoute('homepage')
					.attachPatternMatched(this._onPatternMatched, this);

				// Get count of Suppliers from 'category' model
				let oView = this.getView();
				this.getOwnerComponent()
					.getModel('category')
					.read('/Suppliers/$count', {
						sync: true,
						success: function (sData) {
							oView.byId('supplCount').setText(sData);
						},
					});

				// Get count of Products from 'category' model
				this.getOwnerComponent()
					.getModel('category')
					.read('/Products/$count', {
						sync: false,
						success: function (sData) {
							oView.byId('prodCount').setText(sData);
						},
					});
			},

			_onPatternMatched: function () {},

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
