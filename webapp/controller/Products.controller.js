sap.ui.define([
		'./BaseController',
		'sap/m/MessageToast',
		'../model/formatter',
	],
	function (BaseController, MessageToast, formatter) {
		'use strict';

		return BaseController.extend('my_cat_list.controller.Products', {
			formatter: formatter,
			onInit: function() {
				let oRouter = this.getRouter();
				oRouter.getRoute('products').attachPatternMatched(this._onObjectMatched, this);
			},
			_onObjectMatched: function(oEvent) {
				console.log(oEvent.getParameter('arguments'));
				console.log(!!oEvent.getParameter('arguments').productPath);
				let oList = this.byId('gridList');
				let oModel = new sap.ui.model.json.JSONModel();
				let sPath;

				if (!!oEvent.getParameter('arguments').productPath) {
					let idParam = window.decodeURIComponent(oEvent.getParameter('arguments').productPath);
					this.getView().bindElement({
						path: `/Categories(${idParam})`,
						model: 'category',
					});
					sPath = 'category>Products';
				} else {
					this.getView().bindElement({
						path: '/',
						model: 'category',
					});
					sPath = 'category>Products_by_Categories';
				}

				oModel.setProperty('path', sPath);
				this.getView().setModel(oModel, 'itemsPath');
			},
			onItemClick: function(oEvent) {
				let ID = oEvent.getSource().getBindingContext('category').getObject().ProductID;
				let sMessage = `Clicked Item with ProductID: ${ID}`;
				MessageToast.show(sMessage);
			}
		});
	},
);
