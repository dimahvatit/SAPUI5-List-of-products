sap.ui.define(['sap/ui/core/library'], function (coreLibrary) {
	'use strict';

	let ValueState = coreLibrary.ValueState;

	return {
		productPrice: function (sPrice) {
			return Number(sPrice).toFixed(2) + '\nEUR';
		},

		deliveryTime: function (term) {
			let str;

			if (term === 1) {
				str = ' Day';
			} else {
				str = ' Days';
			}

			return term + str;
		},

		/**
		 * Defines a value state based on the stock level
		 *
		 * @public
		 * @param {number} iValue the stock level of a product
		 * @returns {string} sValue the state for the stock level
		 */
		quantityState: function (iValue) {
			if (iValue === 0) {
				return ValueState.Error;
			} else if (iValue <= 20) {
				return ValueState.Warning;
			} else {
				return ValueState.Success;
			}
		},

		deliveryState: function (iValue) {
			if (iValue < 5) {
				return ValueState.Success;
			} else {
				return ValueState.Warning;
			}
		}
	};
});
