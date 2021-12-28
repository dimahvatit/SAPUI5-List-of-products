sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, History) {
	"use strict";

	//TODO: *** setup the controller for table page
	return BaseController.extend("my_cat_list.controller.Table", {
		handleRouteMatched: function(oEvent) {
			let oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					let patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (let prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);
				}
			}

			let oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		_onToggleButtonPress: function(oEvent) {
			let oToolPage = oEvent.getSource().getParent().getParent();
			let oSideNavigation = oToolPage.getAggregation('sideContent');
			let bExpanded = oSideNavigation.getExpanded();
			oSideNavigation.setExpanded(!bExpanded);

		},
		onInit: function() {
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getTarget("Page2").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
		}
	});
}, /* bExport= */ true);
