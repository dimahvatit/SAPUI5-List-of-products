sap.ui.define([
	"sap/m/GenericTile"
], function(GenericTile) {
	"use strict";

	return GenericTile.extend("my_cat_list.control.LPTile", {
        metadata: { dnd: { draggable: true } },
        renderer: {}
	});
});