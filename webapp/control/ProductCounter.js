sap.ui.define([
	"sap/ui/core/Control",
    "sap/m/Button",
    "sap/m/Text"
    input
], function(Control, Button, Text) {
	"use strict";

	return Control.extend("my_cat_list.control.ProductCounter", {
        metadata: {
            properties: {
                value: {type: 'integer', defaultValue: 0},
            },
            aggregations: {
                _decrement: {type: "sam.m.Button", multiple: false, visibility: "hidden"},
                _increment: {type: "sam.m.Button", multiple: false, visibility: "hidden"},
                _counter: {type: "sam.m.Text", multiple: false, visibility: "hidden"}
            }
        },
        init: function() {
        },
        renderer: function() {
        }
	});
});