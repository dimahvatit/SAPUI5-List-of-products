sap.ui.define(
	['sap/ui/core/library', 'sap/ui/core/format/NumberFormat'],
	function (coreLibrary, NumberFormat) {
		'use strict';

		let ValueState = coreLibrary.ValueState;

		return {
			productPrice: function (sPrice, sCode) {
				let formatPrice = NumberFormat.getCurrencyInstance({
					currencyCode: false,
					customCurrencies: {
						MyDollar: {
							isoCode: 'USD' && sCode,
							decimals: 2
						}
					},
					pattern: '¤ #,##0.00'
				});
				return formatPrice.format(+sPrice, "MyDollar");
			},

			productQuantity: function (sQuant, sUnit) {
				return sQuant + '\n' + sUnit;
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
				switch(true) {
					case iDays > 7:
						return ValueState.Error;
					case iDays > 5:
						return ValueState.Warning;
					default: 
						return ValueState.Success;
				}
			},

			/**
			 * Defines a value state based on the stock level
			 * @param {number} iValue - the stock level of a product
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
			},

			deleteBtnText: async function (aItems) {
				let oBundle = await this.getResourceBundle().then((res) => res);
				let len = aItems.length;

				if (len > 0) {
					if (len === 1) {
						return oBundle.getText('CartView.DeleteOneItem', [len]);
					} else {
						return oBundle.getText('CartView.DeleteMultItems', [
							len,
						]);
					}
				} else {
					return oBundle.getText('CartView.ClearCart');
				}
			},

			orderBtnText: async function (aItems) {
				let oBundle = await this.getResourceBundle().then((res) => res);
				let len = aItems.length;

				if (len > 0) {
					return oBundle.getText('CartView.OrderSelected');
				} else {
					return oBundle.getText('CartView.OrderAll');
				}
			},

			/**
			 * returns true if cartEntries and favorites are both empty
			 * otherwise returns false
			 * @param {object} oCart
			 * @param {object} oFavs
			 * @returns {boolean}
			 */
			isCartEmpty: function (oCart, oFavs) {
				let iCartLen = Object.keys(oCart).length;
				let iFavLen = Object.keys(oFavs).length;

				return !iCartLen && !iFavLen;
			}
		};
	},
);
