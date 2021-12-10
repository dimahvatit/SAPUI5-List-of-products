sap.ui.define([
		'sap/ui/core/UIComponent',
		'sap/ui/Device'
	],
	function (UIComponent, Device) {
		'use strict';

		return UIComponent.extend('my_cat_list.Component', {
			metadata: {
				interfaces: ['sap.ui.core.IAsyncContentCreation'],
				manifest: 'json'
			},
			init: function() {
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
	},
);