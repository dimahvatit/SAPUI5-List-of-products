sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
],
function (Controller, Filter, FilterOperator) {
    'use strict';

    return Controller.extend('myCategoryList.controller.Overview', {

        // search by category name and description
        onFilterCategories: function (oEvent) {
            let aFilter = [];
            let sQuery = oEvent.getParameter('newValue');

            if (sQuery) {
                aFilter.push(
                    new Filter({
                        filters: [
                            new Filter({
                                path: 'CategoryName',
                                operator: FilterOperator.Contains,
                                value1: sQuery,
                            }),
                            new Filter({
                                path: 'Description',
                                operator: FilterOperator.Contains,
                                value1: sQuery,
                            }),
                        ],
                        and: false,
                    }),
                );
            }

            let oList = this.byId('catList');
            let oBinding = oList.getBinding('items');
            oBinding.filter(aFilter);
        },

        onPress: function (oEvent) {

            // let sPath = oEvent.getSource().getBindingContext("category").getPath().substr(1);
            let oInst = oEvent.getSource().getBindingContext("category").getObject();

            let oRouter = this.getOwnerComponent().getRouter();

            oRouter.navTo('products', {
                productPath: window.encodeURIComponent(`Categories(${oInst.CategoryID})`)
            });
        },
    });
},
);
