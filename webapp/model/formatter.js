sap.ui.define([], function() {
	"use strict";
	return {
        productPrice: function(sPrice) {
            return Number(sPrice).toFixed(2) + '\nEUR';
        }
    }
});