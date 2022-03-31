sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	'use strict';

	return BaseController.extend('myshop.controller.Launchpad', {
		onInit() {
			// tile groups
			let oLPModel = new JSONModel(sap.ui.require.toUrl('myshop/model/ArrayLaunchpadTiles.json'));
			this.getView().setModel(oLPModel, "LPModel");

			// cart items
			this._oCartModel = this.getOwnerComponent().getModel('cartProducts');
			this.getView().setModel(this._oCartModel, 'cart');
		},

		/**
		 * Navigation by the route from tile's navTarget attribute
		 */
		onTilePress(oEvt) {
			this.getRouter().navTo(oEvt.getSource().getNavTarget(), {}, {}, true);
		}
	});
});
