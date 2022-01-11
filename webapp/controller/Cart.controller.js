sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/cart",
	"my_cat_list/model/formatter",
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
						cartItems: [],
						favsItems: [],
					}), 'view');
			},

			_onPatternMatched: function () {
				let oCartModel = this.getModel('cartProducts');
			},

			/**
			 * Pushes selected items to the 'cartItems' or 'favsItems' array of the 'view' model
			 * depending on the parent list
			 */
			onItemPress(oEvent) {
				let oList = oEvent.getSource();
				let aItems = oList.getSelectedContexts();

				let aProductIDs = [];
				for (let item of aItems) {
					aProductIDs.push(item.getObject().ProductID);
				}

				if (oList.data().id === 'cart-list') {
					this.getModel('view').setProperty('/cartItems', aProductIDs);
				} else {
					this.getModel('view').setProperty('/favsItems', aProductIDs);
				}
			},

			/**
			 * Sets the array of items to be deleted depending on the delete button's parent list,
			 * then calls {deleteItems} method of the cart model
			 */
			onDeleteBtnPress(oEvent) {
				// check what list the delete button belongs to
				let bInFavs = oEvent.getSource().data().inFavs;
				let sCurrList = bInFavs ? 'favsItems' : 'cartItems';

				let oCartModel = this.getModel('cartProducts');
				let oViewModel = this.getModel('view');
				
				let aToDelete = oViewModel.getData()[sCurrList];

				cart.deleteItems(aToDelete, oCartModel, bInFavs);
				aToDelete = [];
				oViewModel.setProperty(`/${sCurrList}`, []);
			}
		});
	},
);
