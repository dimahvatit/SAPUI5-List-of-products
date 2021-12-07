sap.ui.define([
		'./BaseController'
	],
	function (BaseController) {
		'use strict';

		return BaseController.extend('my_cat_list.controller.HomePage', {
			_onToggleButtonPress: function (oEvent) {
				var oToolPage = oEvent.getSource().getParent().getParent();
				var oSideNavigation = oToolPage.getAggregation('sideContent');
				var bExpanded = oSideNavigation.getExpanded();
				oSideNavigation.setExpanded(!bExpanded);
			},

			onInit: function () {
			},

			onItemSelect: function(oEvent) {
				let sTarget = oEvent.getParameter('item').data('to');
				let oRouter = this.getRouter();

				oRouter.navTo(sTarget);
			},
		});
	},
);
