sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
	"sap/ui/core/Fragment"
], function(Controller, MessageToast, Fragment) {
	"use strict";

	return Controller.extend("sap.ui.demo.walkthrough.controller.HelloPanel", {
        onShowHello: function() {
			// read msg from i18n model
			let oBundle = this.getView().getModel('i18n').getResourceBundle();
			let sRecipient = this.getView().getModel().getProperty("/recipient/name");
			let sMsg = oBundle.getText("helloMsg", [sRecipient]);

			// show msg
            MessageToast.show(sMsg);
        },
		onOpenDialog: function() {
			if (!this.pDialog) {
				this.pDialog = this.loadFragment({
					name: 'sap.ui.demo.walkthrough.view.HelloDialog'
				});
			}
			this.pDialog.then(function(oDialog) {
				oDialog.open();
			});
		},
		onCloseDialog: function() {
			this.byId('helloDialog').close();
		}
	});
});