sap.ui.define([
    "sap/ui/core/Control",
	"sap/m/GenericTile",
    "sap/m/TileContent",
    "sap/m/NumericContent"
], function(Control, GenericTile, TileContent, NumericContent) {
	return Control.extend('my_cat_list.control.NewTile', {
		metadata: {
			properties: {
                
            },
			aggregations: {},
		},
        init: function() {},
		renderer: function(oRm, oControl) {
			//to do: render the control
		},
		onAfterRendering: function() {
			//if I need to do any post render actions, it will happen here
			if (sap.ui.core.Control.prototype.onAfterRendering) {
				sap.ui.core.Control.prototype.onAfterRendering.apply(this, arguments); //run the super class's method first
			}
		},
	});
});
