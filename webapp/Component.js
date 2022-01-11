sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/Device',
	'my_cat_list/model/LocalStorageModel',
	"sap/ui/model/json/JSONModel"
], function (UIComponent, Device, LocalStorageModel, JSONModel) {
	'use strict';

	return UIComponent.extend('my_cat_list.Component', {
		metadata: {
			manifest: 'json'
		},
		init: function() {
			// create and set cart model
			let oCartModel = new LocalStorageModel("BEST_SHOP_STORAGE", {
				cartEntries: {},
				favorites: {},
				lastViewed: []
			});
			this.setModel(oCartModel, "cartProducts");
			this.setModel(new JSONModel({
				currency: "USD",
				quantity: "in stock"
			}), 'measures');

			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			this.getRouter().initialize();
		},
		getContentDensityClass: function() {
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