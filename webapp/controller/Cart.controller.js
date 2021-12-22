sap.ui.define([
	'./BaseController',
	'sap/ui/model/json/JSONModel',
	"../model/cart",
	"my_cat_list/model/formatter"
], function (BaseController, JSONModel, cart, formatter) {
		'use strict';

		return BaseController.extend('my_cat_list.controller.Cart', {
			formatter: formatter,
			onInit: function () {
				let oRouter = this.getRouter();
				oRouter
					.getRoute('cart')
					.attachPatternMatched(this._onPatternMatched, this);
				this.getView().setModel(
					new JSONModel({
						selectedItems: [],
					}), 'view');
			},

			_onPatternMatched: function () {
				let oCartModel = this.getModel('cartProducts');
			},

			onItemPress(oEvent) {
				console.log(oEvent.getSource());

				let oList = this.getView().byId('cart-list');
				let aItems = oList.getSelectedItems();

				let aProductIDs = [];
				for (let item of aItems) {
					aProductIDs.push(item.getBindingContext('cartProducts').getObject().ProductID);
				}

				this.getModel('view').setData({selectedItems: aProductIDs});
			},
			onDeleteBtnPress(oEvent) {
				let bInFavs = oEvent.getSource().data().inFavs
				let oCartModel = this.getModel('cartProducts');
				let oViewModel = this.getModel('view');
				let aToDelete = oViewModel.getData().selectedItems;

				cart.deleteItems(aToDelete, oCartModel, bInFavs);
				aToDelete = [];
				oViewModel.setData({selectedItems: []});
			},

			onShowProductPress: function (oEvent) {
				let iProdID = oEvent.getSource().getBindingContext('cartProducts').getObject().ProductID;
				this.getRouter().navTo('details', {
					productID: window.encodeURIComponent(iProdID),
				});
			}
		});
	},
);
