sap.ui.define([
	"./BaseController"
], function(
	BaseController
) {
	"use strict";

	return BaseController.extend("myshop.controller.SmartTable", {
		/**
		 * @override
		 */
		onInit: function() {
			this._oDataModel = this.getOwnerComponent().getModel('backend');
			this.getView().setModel(this._oDataModel);
		}
	});
});