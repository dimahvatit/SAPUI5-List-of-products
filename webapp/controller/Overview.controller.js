sap.ui.define([
    './BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/core/routing/History'
],
function (BaseController, Filter, FilterOperator, History) {
    'use strict';

    return BaseController.extend('my_cat_list.controller.Overview', {
        
        // search by category name and description
        onFilterCategories: function (oEvent) {
            let aFilter = [];
            let sQuery = oEvent.getParameter('newValue');

            if (sQuery ?? sQuery.length > 0) {
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
            let oCatItem = oEvent.getSource().getBindingContext("category").getObject();
            let oRouter = this.getRouter();

            oRouter.navTo('products', {
                productPath: window.encodeURIComponent(oCatItem.CategoryID)
            });
        },

        onNavBack: function() {
            let oHistory = History.getInstance();
            let sPrevHash = oHistory.getPreviousHash();

            if (sPrevHash) {
                window.history.go(-1);
            } else {
                let oRouter = this.getRouter();
                oRouter.navTo('homepage', {}, true);
            }
        }
    });
},
);
