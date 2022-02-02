sap.ui.define([
	"./BaseController"
], function(
	BaseController
) {
	"use strict";

	return BaseController.extend("my_cat_list.controller.Launchpad", {
		onInit: function () {
			this.aFlexItems = this.getView().byId('flexContainer').getItems();
			this.aButtons = this.getView().byId('btnContainer').getItems();
			this.oCartModel = this.getOwnerComponent().getModel('cartProducts');
			this.sBaseUrl = "http://localhost:8081";
			this.getView().setModel(this.oCartModel, 'cart');

			this._fetchData('orders', 'orders-tile-count', 3);
			this._fetchData('suppliers', 'suppliers-tile-count', 4.5);
		},

		/**
		 * Fetch data from express server
		 *  @param {string} route - route to request data from
		 *  @param {object} oControl - control which 'text' attr will get the fetched data
		 *  @param {integer} interval - interval between requests in seconds
		 */
		_fetchData(route, sControlId, interval) {
			let oControl = this.getView().byId(sControlId);
			let iValue = Number(oControl.getText());

			let timerID = setInterval(() => {
				$.ajax({
					type: "get",
					url: this.sBaseUrl + '/' + route,
					dataType: "json",
					success: function (resp) {
						iValue = iValue + resp.rand;
						oControl.setText(String(iValue));
					},
					error: function(e) {
						console.error('Ошибка при получении данных');
						console.error(e);
						clearInterval(timerID);
					}
				});
			}, interval * 1000);
		},

		onNavBtnClick(oEvent) {
			this.aButtons.forEach(el => el.setType(), this);
			oEvent.getSource().setType('Attention');
			let sTarget = oEvent.getSource().data("target");
            if (sTarget === 'main') {
				this.aFlexItems.forEach(el => el.setVisible(true), this);
			} else {
				this.aFlexItems.forEach(el => el.setVisible(false), this);
				this.getView().byId(sTarget).setVisible(true);
			}
		},

		onTilePress(oEvent) {
			this.getRouter().navTo(oEvent.getSource().data("target"));
		}
	});
});