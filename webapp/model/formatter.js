sap.ui.define([
	'sap/ui/core/library',
	"sap/ui/core/format/NumberFormat"
], function (coreLibrary, NumberFormat) {
	'use strict';

	let ValueState = coreLibrary.ValueState;

	return {
		productPrice: function (sPrice) {
			/* let formatPrice = NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				minFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: '.',
				decimalSeparator: ','
			});
			return formatPrice.format(sPrice); */

			return Number(sPrice).toFixed(2) + '\nUSD';
		},

		deliveryTime: function (iTerm) {
			let str;
			if (iTerm === 1) {
				str = ' Day';
			} else {
				str = ' Days';
			}
			return iTerm + str;
		},

		deliveryState: function (iDays) {
			if (iDays < 5) {
				return ValueState.Success;
			} else {
				return ValueState.Warning;
			}
		},

		/**
		 * Defines a value state based on the stock level
		 *
		 * @public
		 * @param {number} iValue the stock level of a product
		 * @returns {string} sValue the state for the stock level
		 */
		quantityState: function (iQuant) {
			if (iQuant === 0) {
				return ValueState.Error;
			} else if (iQuant <= 20) {
				return ValueState.Warning;
			} else {
				return ValueState.Success;
			}
		}
	};
});
