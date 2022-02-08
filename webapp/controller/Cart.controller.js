sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/cart",
	"my_cat_list/model/formatter"
], function (BaseController, JSONModel, cart, formatter) {
		'use strict';

		return BaseController.extend('my_cat_list.controller.Cart', {
			formatter: formatter,
			onInit: function () {
				this.getRouter().getRoute('cart').attachPatternMatched(this._onPatternMatched, this);
				this.oViewModel = new JSONModel({
					cartItems: [],
					favsItems: [],
					total: 0
				});
				this._getTotal();

				this.getView().setModel(this.oViewModel, 'view');
			},

			_getTotal: function () {
				let oCartEntries = this.getOwnerComponent().getModel('cartProducts').getProperty('/cartEntries');
				let total = this.oViewModel.getProperty('total');
				for (const key in oCartEntries) {
					if (Object.hasOwnProperty.call(oCartEntries, key)) {
						const element = oCartEntries[key];

						total += +element.UnitPrice * element.Quantity;
					}
				}
				this.oViewModel.setProperty('/total', total);
			},

			_onPatternMatched: function () {
				let oCartModel = this.getModel('cartProducts');

				let oCartEntries = oCartModel.getProperty('/cartEntries');
				let oFiltered = {};
				
				for (let entry in oCartEntries) {
					if (Object.hasOwnProperty.call(oCartEntries, entry)) {
						let el = oCartEntries[entry];
						if (el.Quantity !== 0) {
							oFiltered[entry] = el;
						}
					}
				}

				oCartModel.setProperty('/cartEntries', oFiltered);
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
				this.oViewModel = this.getModel('view');
				// check what list the delete button belongs to
				this.bInFavs = oEvent.getSource().data('inFavs');
				this.sCurrList = this.bInFavs ? 'favsItems' : 'cartItems';
				this.aToDelete = this.oViewModel.getData()[this.sCurrList];

				this.loadFragment({type: "XML", name: "my_cat_list.fragments.ConfirmClear"})
					.then(oDialog => {
						let iLength = this.aToDelete.length;
						if (iLength) {
							let sMessage = "";
							if (iLength == 1) {
								sMessage = 'Delete this item?'
							} else {
								sMessage = `Delete ${iLength} items?`
							}
							oDialog.getContent()[0].setText(sMessage);
						}
						oDialog.open();
					});
			},

			onDialogBtnPress: function (oEvent) {
				let oCartModel = this.getModel('cartProducts');
				let oDialog = oEvent.getSource().getParent();

				if (oEvent.getSource().data('action') === 'accept') {
					cart.deleteItems(this.aToDelete, oCartModel, this.bInFavs);
					this.aToDelete = [];
					this.oViewModel.setProperty(`/${this.sCurrList}`, []);

					this._getTotal();
				}

				oDialog.close();
			},

			onChangeAmount() {
				this._getTotal();
				this.getModel('cartProducts').refresh(true);
			}
		});
	},
);
