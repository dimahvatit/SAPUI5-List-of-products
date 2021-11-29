sap.ui.define([
	"sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
	// '../model/formatter',
], function(Controller, JSONModel/* , formatter, */) {
	"use strict";

	return Controller.extend("myCategoryList.controller.Products", {
		// formatter: formatter,
        onInit: function () {
            let oViewModel = new JSONModel({
                currency: 'EUR',
            });
            this.getView().setModel(oViewModel, 'view');
        
            let oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute('products').attachPatternMatched(this._onObjectMatched, this);
        },
		_onObjectMatched: function(oEvent) {
			this.getView().bindElement({
				path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").productPath),
				model: 'category'
			})
		}
	});
});