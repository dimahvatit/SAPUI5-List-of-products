sap.ui.define([
	'./BaseController',
	'../model/formatter',
	'sap/ui/model/json/JSONModel',
	'../model/cart',
	"sap/m/MessageBox",
],	function (BaseController, formatter, JSONModel, cart, MessageBox) {
		// TODO: When changing amount of product to 0 using counter the product remains in cart
		'use strict';

		return BaseController.extend('my_cat_list.controller.ProductDetails', {
			formatter: formatter,
			onInit() {
				this.getRouter().getRoute('details').attachPatternMatched(this._onPatternMatched, this);
				this.oDataModel = this.getOwnerComponent().getModel('category');
				this.oCartModel = this.getOwnerComponent().getModel('cartProducts');
			},

			_onPatternMatched(oEvent) {
				this._setDeliveryTime();
				this.getView().setBusy(true);
				
				this.productID = window.decodeURIComponent(
					oEvent.getParameter('arguments').productID,
					);
				this.sProductPath = `/Products(${this.productID})`;

				// Bind header to curr product so "add" and "remove" buttons can see products quantity in cart model
				this.getView()
					.byId('page-header')
					.bindElement({
						path: `/cartEntries/${this.productID}`,
						model: 'cartProducts',
					});

				// Bind supplier details block to current Product's Supplier entity
				this.getView()
					.byId('supplier-details')
					.bindElement({
						path: `${this.sProductPath}/Supplier`,
						model: 'category',
					});

				// Get model with product descriptions
				let sDescription = this.getOwnerComponent()
					.getModel('description')
					.getProperty(`/${this.productID}`);
				let oDescModel = new JSONModel({
					text: sDescription,
				});
				this.byId('prod-description').setModel(oDescModel, 'prodDesc');

				this.getView()
					.byId('add-favs')
					.bindElement({
						path: `/favorites/${this.productID}`,
						model: 'cartProducts',
					});
				this.getView()
					.byId('remove-favs')
					.bindElement({
						path: `/favorites/${this.productID}`,
						model: 'cartProducts',
					});

				let that = this;
				this.oDataModel.read(this.sProductPath, {
					success: function (oData) {
						// Bind the view to Product entity
						that.getView().bindElement({
							path: that.sProductPath,
							model: 'category',
						});

						let isInLastViewed = that.oCartModel
							.getProperty('/lastViewed')
							.some((el) => el.ProductID === oData.ProductID);
						if (!isInLastViewed) {
							cart.addLastViewed(oData, that.oCartModel);
						}
						that.getView().setBusy(false);
					},
					error: function (oError) {
						that.getView().setBusy(false);
						MessageBox.error('Не удалось распознать ответ');
						console.error(oError);
					}
				});

				/* this.oDataModel.attachEvent('requestCompleted',
					function _handler(oEvent) {
						try {
							debugger; //! DEBUGGER
							let sURL = JSON.parse(
								oEvent.getParameter('response').responseText
							).d.__metadata.uri;
							let paths = sURL.split(this.sProductPath);
		
							if (paths && paths[1] === '') {
								debugger; //! DEBUGGER

								// Add current product to lastViewed array if it's not already there
								let oEntry = this.getView()
									.getBindingContext('category')
									.getObject();
								let oCartModel = this.getModel('cartProducts');
								let isInLastViewed = oCartModel
									.getProperty('/lastViewed')
									.some((el) => el.ProductID === oEntry.ProductID);
								if (!isInLastViewed) {
									cart.addLastViewed(oEntry, oCartModel);
								}
							}
						} catch (error) {
							debugger; //! DEBUGGER
							console.error(error);
							MessageBox.error('Не удалось распознать ответ');
						} finally {
							this.getView().setBusy(false);
							// this.oDataModel.detachRequestCompleted(_handler, this);
						}
					}, this); */
			},

			/**
			 * Sets random amount of days between min and max to simulate delivery time calculations
			 */
			_setDeliveryTime() {
				let term = this.getRandomNum(1, 10);
				//this.byId('delivery-time-status').setText(term);
				let oModel = new JSONModel({ term });
				this.getView().setModel(oModel, 'delivery');
			},

			/**
			 * Removes current product's obj from '/favorites' obj of cartProducts model
			 */
			onRemoveFromFavs(oEvent) {
				let prodID = oEvent.getSource().getBindingContext('cartProducts').getObject().ProductID;
				let oFavsItems = this.oCartModel.getProperty('/favorites');

				delete oFavsItems[prodID];
				this.oCartModel.refresh(true);
			}
		});
	},
);
