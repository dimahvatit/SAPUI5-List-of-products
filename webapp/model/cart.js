sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
	'use strict';

	return {
        addToCart(oBundle, oProduct, oCartModel) {
            console.log(oBundle);
            if (oProduct) {
                this._updateItem(oBundle, oProduct, oCartModel)
            }
        },

        _updateItem(oBundle, oProdToAdd, oCartModel) {
            console.log(oBundle);
            let oAllEntries = {...oCartModel.getData()['cartEntries']};
            let oCartEntry = oAllEntries[oProdToAdd.ProductID];

            if (!oCartEntry) {
                oCartEntry = {...oProdToAdd};
                oCartEntry.Quantity = 1;
                oAllEntries[oProdToAdd.ProductID] = oCartEntry;
            } else {
                oCartEntry.Quantity += 1;
            }

            oCartModel.setProperty('/cartEntries', {...oAllEntries});
            oCartModel.refresh(true);

            MessageToast.show(oBundle.getText("CartMessageToast.ProductAdded", [oProdToAdd.ProductName]));
        }
    };
});
