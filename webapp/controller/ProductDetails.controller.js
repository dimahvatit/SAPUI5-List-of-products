sap.ui.define([
	"./BaseController"
    ], function(BaseController) {
	"use strict";

	return BaseController.extend("my_cat_list.controller.ProductDetails", {
        onInit() {
            this.getRouter().getRoute('details').attachPatternMatched(this._onProductMatched, this);
        },

		_onProductMatched() {
			
		},
	});
});