sap.ui.define([], function() {
	"use strict";
	return {
        productPrice: function(sPrice) {
            return +sPrice.toFixed(2);
        }
    }
});