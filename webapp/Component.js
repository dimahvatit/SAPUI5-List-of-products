sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/Device',
	'my_cat_list/model/LocalStorageModel',
	"sap/ui/model/json/JSONModel"
], function (UIComponent,
	Device,
	LocalStorageModel,
	JSONModel) {
	'use strict';

	return UIComponent.extend('my_cat_list.Component', {
		metadata: {
			interfaces: ['sap.ui.core.IAsyncContentCreation'],
			manifest: 'json'
		},
		init() {
			let oCartModel = new LocalStorageModel("BEST_SHOP_STORAGE", {
				cartEntries: {},
				favorites: {}
			});
			this.setModel(oCartModel, "cartProducts");

			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			this.getRouter().initialize();
		},
		getContentDensityClass() {
			if (!this._sContentDensityClass) {
				if (!Device.support.touch) {
					this._sContentDensityClass = 'sapUiSizeCompact';
				} else {
					this._sContentDensityClass = 'sapUiSizeCozy';
				}
			}
			return this._sContentDensityClass;
		}
	});
});