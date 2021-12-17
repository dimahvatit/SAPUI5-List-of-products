sap.ui.define([
    'sap/ui/model/json/JSONModel',
    'sap/ui/util/Storage'
], function (JSONModel, Storage) {
    'use strict';

    return JSONModel.extend('my_cat_list.model.LocalStorageModel', {
        _STORAGE_KEY: 'BEST_SHOP_STORAGE',
        _storage: new Storage(Storage.Type.local),

        /**
         * Fetches favorites from local storage and sets up the JSON model.
         * @param {string} sStorageKey
         * @param {object} oSettings
         * @return {my_cat_list.model.LocalStorageModel} the local storage model instance
         */
        constructor: function(sStorageKey, oSettings) {
            JSONModel.call(this, oSettings);
            this.setSizeLimit(1000);

            if (sStorageKey) {
                this._STORAGE_KEY = sStorageKey;
            }

            this._loadData();

            return this;
        },

        /**
         * Loads the current state of the model from local storage.
         */
        _loadData() {
            let sJSON = this._storage.get(this._STORAGE_KEY);

            if (sJSON) {
                this.setData(JSON.parse(sJSON));
            }
            this._bDataLoaded = true;
        },

        /**
         * Saves the current state of the model to local storage.
         */
        _storeData() {
            let oData = this.getData();

            let sJSON = JSON.stringify(oData);
            this._storage.put(this._STORAGE_KEY, sJSON);
        },

        setProperty(...args) {
            JSONModel.prototype.setProperty.apply(this, args);
            this._storeData();
        },

        setData(...args) {
            JSONModel.prototype.setData.apply(this, args);

            if (this._bDataLoaded) {
                this._storeData();
            }
        },

        refresh(...args) {
            JSONModel.prototype.refresh.apply(this, args)
            this._storeData();
        }
    });
});
