sap.ui.define(
	[
		'./BaseController',
		'../model/formatter',
		'sap/ui/model/json/JSONModel',
		'../model/cart',
	],
	function (BaseController, formatter, JSONModel, cart) {
		// TODO: When changing amount of product to 0 using counter the product remains in cart
		'use strict';

		return BaseController.extend('my_cat_list.controller.ProductDetails', {
			formatter: formatter,
			onInit() {
				this.getRouter()
					.getRoute('details')
					.attachPatternMatched(this._onPatternMatched, this);

				this.oDataModel = this.getOwnerComponent().getModel('category');
			},

			_onPatternMatched(oEvent) {
				this._setDeliveryTime();
				this.getView().setBusy(true);

				let productID = window.decodeURIComponent(
					oEvent.getParameter('arguments').productID,
				);
				let sProductPath = `/Products(${productID})`;

				// Bind the view to Product entity
				this.getView().bindElement({
					path: sProductPath,
					model: 'category',
				});

				// Bind supplier details block to current Product's Supplier entity
				this.getView()
					.byId('supplier-details')
					.bindElement({
						path: `/Products(${productID})/Supplier`,
						model: 'category',
					});

				// Bind header to curr product so "add" and "remove" buttons can see products quantity in cart model
				this.getView()
					.byId('page-header')
					.bindElement({
						path: `/cartEntries/${productID}`,
						model: 'cartProducts',
					});

				this.getView()
					.byId('add-favs')
					.bindElement({
						path: `/favorites/${productID}`,
						model: 'cartProducts',
					});
				this.getView()
					.byId('remove-favs')
					.bindElement({
						path: `/favorites/${productID}`,
						model: 'cartProducts',
					});

				this.oDataModel.attachEvent(
					'requestCompleted',
					function (oEvent) {
						try {
							let sURL = JSON.parse(
								oEvent.getParameter('response').responseText,
							).d.__metadata.uri;
							let paths = sURL.split(sProductPath);

							if (paths && paths[1] === '') {
								// Get model with product descriptions
								let sDescription = this.getOwnerComponent()
									.getModel('description')
									.getProperty(`/${productID}`);
								let oDescModel = new JSONModel({
									text: sDescription,
								});
								this.byId('prod-description')
									.setModel(oDescModel, 'prodDesc');

								// Add current product to lastViewed array if it's not already there
								let oEntry = this.getView()
									.getBindingContext('category')
									.getObject();
								let oCartModel = this.getModel('cartProducts');
								let isInLastViewed = oCartModel
									.getProperty('/lastViewed')
									.some(
										(el) =>
											el.ProductID === oEntry.ProductID,
									);
								if (!isInLastViewed) {
									cart.addLastViewed(oEntry, oCartModel);
								}
								this.getView().setBusy(false);
							}
						} catch (error) {
							console.error(error);
							sap.m.MessageBox.error(
								'Не удалось распознать ответ',
							);
							this.getView().setBusy(false);
						}
					},
					this,
				);
			},

			/**
			 * Sets random amount of days between min and max to simulate delivery time calculations
			 */
			_setDeliveryTime() {
				let term = this.getRandomNum(1, 10);
				let oModel = new JSONModel({ term });
				this.getView().setModel(oModel, 'delivery');
			},

			/**
			 * Removes current product's obj from '/favorites' obj of cartProducts model
			 */
			onRemoveFromFavs(oEvent) {
				let prodID = oEvent
					.getSource()
					.getBindingContext('cartProducts')
					.getObject().ProductID;
				let oCartModel = this.getModel('cartProducts');
				let oFavsItems = oCartModel.getProperty('/favorites');

				delete oFavsItems[prodID];
				oCartModel.refresh(true);
			},
		});
	},
);
