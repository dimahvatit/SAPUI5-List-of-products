sap.ui.define([
	"./BaseController"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("my_cat_list.controller.App", {
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});
});