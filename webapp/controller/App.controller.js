sap.ui.define([
	"./BaseController"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("myshop.controller.App", {
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});
});