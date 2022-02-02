sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/base/util/UriParameters"
], function(MockServer, UriParameters) {
	"use strict";

	return {
        init: function() {
            let oMockServer = new MockServer({
				rootUri: "/V2/Northwind/Northwind.svc/"
			});

			let oUriParameters = new UriParameters(window.location.href);

			// configure mock server with a delay
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: oUriParameters.get("serverDelay") || 500
			});

			// simulate
			let sPath = sap.ui.require.toUrl("my_cat_list/localService");
			oMockServer.simulate(sPath + "/metadata.xml", {
				sMockdataBaseUrl: sPath + "/mockdata",
				bGenerateMissingMockData: true
			});

			// start
			oMockServer.start();
        }
	}
});