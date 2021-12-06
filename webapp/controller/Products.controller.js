sap.ui.define([
		'./BaseController',
		'sap/m/MessageToast',
		'../model/formatter',
	],
	function (BaseController, MessageToast, formatter) {
		'use strict';

		return BaseController.extend('my_cat_list.controller.Products', {
			formatter: formatter,
			onInit: function () {
				let oRouter = this.getRouter();
				oRouter.getRoute('products').attachPatternMatched(this._onObjectMatched, this);
			},
			_onObjectMatched: function (oEvent) {
				let idParam = window.decodeURIComponent(
					oEvent.getParameter('arguments').productPath,
				);

				if (idParam) {
					this.getView().bindElement({
						path: `/Categories(${idParam})`,
						model: 'category',
					});
				} else {
					this.getView().bindElement({
						path: `/Products`,
						model: 'category',
					});
				}

			},
			onItemClick: function (oEvent) {
				let ID = oEvent.getSource().getBindingContext('category').getObject().ProductID;
				let sMessage = `Clicked Item with ProductID: ${ID}`;
				MessageToast.show(sMessage);
			}
		});
	},
);
