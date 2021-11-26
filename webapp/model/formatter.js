sap.ui.define([], function() {
	"use strict";

	return {
        statusText: function(bStatus) {
            let resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			if (bStatus) {
				return resourceBundle.getText('discont');
			}
			return resourceBundle.getText('cont');
        }
	};
});