sap.ui.define(
	['./BaseController', '../model/formatter', 'sap/ui/model/json/JSONModel'],
	function (BaseController, formatter, JSONModel) {
		'use strict';

		return BaseController.extend('my_cat_list.controller.ProductDetails', {
			formatter: formatter,
			onInit() {
				this.getRouter().getRoute('details').attachPatternMatched(this._onProductMatched, this);
				this._setDeliveryTime();

				let sHash = this.getRouter().getHashChanger().getHash();
				let sPath = this.getRouter().getRouteInfoByHash(sHash).arguments.productID;

				
				let oUnitsModel = new JSONModel({
					currency: 'EUR'
				});

				this.getView().setModel(oUnitsModel, 'units');
			},

			_onProductMatched(oEvent) {
				let productID = window.decodeURIComponent(
					oEvent.getParameter('arguments').productID,
				);

				this.getView().bindElement({
					path: `/Products(${productID})`,
					model: 'category',
				});

				this.getView().byId('supplier-details').bindElement({
						path: `/Products(${productID})/Supplier`,
						model: 'category',
				});

				let sDescription = this.getOwnerComponent().getModel('description').getProperty(`/${productID}`);
				let oDescModel = new JSONModel({
					text: sDescription
				});
				this.getView().byId('prod-description').setModel(oDescModel, 'prodDesc');

			},

			_setDeliveryTime() {
				let term = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
				let oModel = new JSONModel({
					term: term,
				});

				this.getView().setModel(oModel, 'delivery');
			},
		});
	},
);
