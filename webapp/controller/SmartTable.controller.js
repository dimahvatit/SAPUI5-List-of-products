sap.ui.define([
	"./BaseController"
], function(
	BaseController
) {
	"use strict";

	return BaseController.extend("my_cat_list.controller.SmartTable", {
		/**
		 * @override
		 */
		onInit: function() {
			this._oDataModel = this.getOwnerComponent().getModel('category');
			this.getView().setModel(this._oDataModel);
		}
	});
});