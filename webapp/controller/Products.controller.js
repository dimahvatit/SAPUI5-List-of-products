sap.ui.define([
	'./BaseController',
	'sap/m/MessageToast',
	'../model/formatter',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
	],
	function (
		BaseController,
		MessageToast,
		formatter,
		Filter,
		FilterOperator
	) {
		'use strict';

		return BaseController.extend('my_cat_list.controller.Products', {
			formatter: formatter,

			onInit: function () {
				let oRouter = this.getRouter();
				oRouter.getRoute('products').attachPatternMatched(this._onObjectMatched, this);
			},

			_onObjectMatched: function (oEvent) {

				let oModel = this.getModel('category');
				this.getView().setModel(oModel);

				//* different binding depending on the presence of the "productPath" parameter
				let sParam = oEvent.getParameter('arguments').productPath;
				if (sParam && sParam.length > 0) {
					let oGridItemFrag = new sap.ui.xmlfragment("my_cat_list.fragments.ProductItem", this);
					this.byId('gridList').bindAggregation('items', {
						path: `/Categories(${sParam})/Products`,
						template: oGridItemFrag,
						model: 'category'
					})
				} else {
					let oGridItemFrag = new sap.ui.xmlfragment("my_cat_list.fragments.ProductItem", this);
					this.byId('gridList').bindAggregation('items', {
						path: '/Products',
						template: oGridItemFrag,
						model: 'category'
					})
				}
			},
			
			onItemClick: function (oEvent) {
				let ID = oEvent.getSource().getBindingContext('category').getObject().ProductID;
				let sMessage = `Clicked Item with ProductID: ${ID}`;
				MessageToast.show(sMessage);
			},

			//* SearchFiled filtering
			onFilterProducts: function(oEvent) {
				let aFilter = [];
				let sQuery = oEvent.getParameter('newValue');

				if (sQuery ?? sQuery.length > 0) {
					aFilter.push(
						new Filter({
							path: 'ProductName',
							operator: FilterOperator.Contains,
							value1: sQuery,
						})
					)
				}
				let oList = this.byId('gridList');
				oList.getBinding('items').filter(aFilter);
			}
		});
	},
);
