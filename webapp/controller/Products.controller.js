sap.ui.define(
	[
		'./BaseController',
		'sap/m/MessageToast',
		'../model/formatter',
		'sap/ui/model/Filter',
		'sap/ui/model/FilterOperator',
		'sap/ui/model/json/JSONModel',
	],
	function (
		BaseController,
		MessageToast,
		formatter,
		Filter,
		FilterOperator,
		JSONModel,
	) {
		'use strict';

		return BaseController.extend('my_cat_list.controller.Products', {
			formatter: formatter,

			onInit: function () {
				let oRouter = this.getRouter();
				oRouter
					.getRoute('products')
					.attachPatternMatched(this._onObjectMatched, this);
			},

			/**
			 * creates different aggregation bindings depending on the presence of the "catID" URI parameter
			 */
			_onObjectMatched: function (oEvent) {
				let sParam = oEvent.getParameter('arguments').catID;
				let oGridItemFrag = new sap.ui.xmlfragment('grid-list-item', 'my_cat_list.fragments.ProductItem', this);

				if (sParam && sParam.length > 0) {
					this.byId('gridList').bindAggregation('items', {
						path: `/Categories(${sParam})/Products`,
						template: oGridItemFrag,
						model: 'category',
					});
					this.byId('tableList').bindElement({
						path: `/Categories(${sParam})`,
						model: 'category',
					});
					this.byId('prods-toolbar').bindElement({
						path: `/Categories(${sParam})`,
						model: 'category',
					});
				} else {
					this.byId('prods-toolbar').unbindElement('category');
					this.byId('gridList').unbindAggregation('items');
					this.byId('tableList').unbindElement('category');
					
					this.byId('gridList').bindAggregation('items', {
						path: '/Products',
						template: oGridItemFrag,
						model: 'category',
					});
				}
			},

			/**
			 * Navigates to details page of the clicked item
			 */
			onItemClick: function (oEvent) {
				let ID = oEvent
					.getSource()
					.getBindingContext('category')
					.getObject().ProductID;
				let sMessage = `Clicked Item with ProductID: ${ID}`;
				MessageToast.show(sMessage);

				this.getRouter().navTo('details', {
					productID: window.encodeURIComponent(ID),
				});
			},

			/**
			 * SearchFiled filtering
			 */
			onFilterProducts: function (oEvent) {
				let aFilter = [];
				let sQuery = oEvent.getParameter('newValue');

				if (sQuery ?? sQuery.length > 0) {
					aFilter.push(
						new Filter({
							path: 'ProductName',
							operator: FilterOperator.Contains,
							value1: sQuery,
						}),
					);
				}
				let oList = this.byId('gridList');
				oList.getBinding('items').filter(aFilter);
			},
		});
	},
);
