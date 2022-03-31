sap.ui.define([
	'./BaseController',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
],	function (BaseController, Filter, FilterOperator) {
		'use strict';

		return BaseController.extend('myshop.controller.Categories', {

			onInit: function () {
			},
			/**
			 * Search by backend name and description
			 */
			onFilterCategories: function (oEvent) {
				let aFilter = [];
				let sQuery = oEvent.getParameter('newValue');

				if (sQuery ?? sQuery.length > 0) {
					aFilter.push(
						new Filter({
							filters: [
								new Filter({
									path: 'CategoryName',
									operator: FilterOperator.Contains,
									value1: sQuery,
								}),
								new Filter({
									path: 'Description',
									operator: FilterOperator.Contains,
									value1: sQuery,
								}),
							],
							and: false,
						}),
					);
				}

				let oList = this.byId('catList');
				oList.getBinding('items').filter(aFilter);
			},

			onPress: function (oEvent) {
				let oCatItem = oEvent
					.getSource()
					.getBindingContext('backend')
					.getObject();

				this.getRouter().navTo('products', {
					catID: window.encodeURIComponent(oCatItem.CategoryID),
				});
			}
		});
	}
);
