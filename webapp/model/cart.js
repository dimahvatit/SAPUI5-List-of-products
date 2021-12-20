sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
	'use strict';

	return {
        addToCart: async function(oBundle, oProduct, oCartModel, sButtonId) {
            if (oProduct) {
                switch (sButtonId) {
                    case 'addToCart':
                        this._updateItem(await oBundle.then(bundle => bundle), oProduct, oCartModel);
                        break;
                    case 'addToFavs':
                        this._addToFavs(await oBundle.then(bundle => bundle), oProduct, oCartModel);
                        break;
                }
            }
        },

        _updateItem: function(oBundle, oProdToAdd, oCartModel) {
            // get all entries from cart model and look for the item being added...
            let oAllCartEntries = {...oCartModel.getData()['cartEntries']};

            let oCartEntry = oAllCartEntries[oProdToAdd.ProductID];

            // ...if that item is not in the cart model, create it
            // and set it's quantity equal to 1... 
            if (!oCartEntry) {
                oCartEntry = {...oProdToAdd};
                oCartEntry.Quantity = 1;
                oAllCartEntries[oProdToAdd.ProductID] = oCartEntry;
            } else {
                // ...else increase it's quantity
                oCartEntry.Quantity += 1;
            }

            oCartModel.setProperty('/cartEntries', {...oAllCartEntries});
            oCartModel.refresh(true);

            MessageToast.show(oBundle.getText("CartMessageToast.ProductAdded", [oProdToAdd.ProductName]));
        },

        _addToFavs: function(oBundle, oProdToAdd, oCartModel) {
            let oAllFavsEntries = {...oCartModel.getData()['favorites']};

            let oFavEntry = oAllFavsEntries[oProdToAdd.ProductID];

            if (!oFavEntry) {
                oFavEntry = {...oProdToAdd};
                oAllFavsEntries[oProdToAdd.ProductID] = oFavEntry;
            } else {
                MessageToast.show(oBundle.getText("CartMessageToast.ProductInFavs", [oProdToAdd.ProductName]));
            }

            oCartModel.setProperty('/favorites', {...oAllFavsEntries});
            oCartModel.refresh(true);
        }
    };
});
