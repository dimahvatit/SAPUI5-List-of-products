sap.ui.define([
	'./BaseController',
	'sap/m/MessageToast',
	'../model/formatter',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/model/json/JSONModel',
], function (
		BaseController,
		MessageToast,
		formatter,
		Filter,
		FilterOperator,
		JSONModel,
	) {
		'use strict';

		return BaseController.extend('myshop.controller.Products', {			
			formatter: formatter,

			onInit: function () {
				let oRouter = this.getRouter();
				oRouter.getRoute('products').attachPatternMatched(this._onPatternMatched, this);
			},

			/**
			 * creates different aggregation bindings depending on the presence of the "catID" URI parameter
			 */
			_onPatternMatched: function (oEvent) {
				let sCatID = oEvent.getParameter('arguments').catID;
				let oGridItemFrag = new sap.ui.xmlfragment('grid-list-item', 'myshop.fragments.ProductItem', this);
				let sCatPath = `/Categories(${sCatID})`; 

				if (sCatID && sCatID.length > 0) {
					this.byId('gridList').bindAggregation('items', {
						path: `${sCatPath}/Products`,
						template: oGridItemFrag,
						model: 'backend',
					});
					
					let oFilterCategories = new Filter({
						path: 'CategoryID',
						operator: FilterOperator.EQ,
						value1: sCatID
					});
					this.byId('tableList').getBinding('items').filter([oFilterCategories]);

					this.byId('prods-toolbar').bindElement({
						path: sCatPath,
						model: 'backend',
					});
					this.byId('tableList').bindElement({
						path: sCatPath,
						model: 'backend',
					});
				} else {
					this.byId('tableList').getBinding('items').filter([]);
					this.byId('tableList').unbindElement('backend');
					this.byId('prods-toolbar').unbindElement('backend');
					this.byId('gridList').bindAggregation('items', {
						path: '/Products',
						template: oGridItemFrag,
						model: 'backend'
					});
				}

			},

			/**
			 * toggles grid/table layout
			 */
			onViewSwitch: function () {
				let oGrid = this.byId('gridList');
				let oTable = this.byId('tableList');
				
				if (oGrid.getVisible()) {
					oGrid.setVisible(false);
					oTable.setVisible(true);
				} else {
					oGrid.setVisible(true);
					oTable.setVisible(false);
				}
			},

			/**
			 * SearchField filtering
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
				let oTable = this.byId('tableList');
				oList.getBinding('items').filter(aFilter);
				oTable.getBinding('items').filter(aFilter);
			}
		});
	},
);
