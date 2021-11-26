sap.ui.define(
	[
		'sap/ui/core/UIComponent',
		'sap/ui/model/json/JSONModel',
	],
	function (UIComponent, JSONModel) {
		'use strict';

		return UIComponent.extend('my.category.list.Component', {
			metadata: {
				interfaces: ['sap.ui.core.IAsyncContentCreation'],
				manifest: 'json'
			},
			init: function() {
				// call the init function of the parent
				UIComponent.prototype.init.apply(this, arguments);
				// set data model
				let oData = {
					recipient: {
						name: 'World'
					}
				};
				let oModel = new JSONModel(oData);
				this.setModel(oModel);

				this.getRouter().initialize();
			},
		});
	},
);
