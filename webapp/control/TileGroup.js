sap.ui.define([
    'sap/ui/layout/VerticalLayout',
    'sap/m/Title',
    'myshop/control/TileContainer'
], function (VerticalLayout, Title, TileContainer) {
		'use strict';

		return VerticalLayout.extend('myshop.control.TileGroup', {
			metadata: {
				properties: {
					tileGroupHeader: { type: 'string', defaultValue: null },
				},
				aggregations: {
                    _tileGroupHeader: {
                        type: 'sap.m.Title',
                        multiple: false,
						visibility: 'hidden'
                    },
					_tileContainer: {
						type: 'myshop.control.TileContainer',
						multiple: false,
						visibility: 'hidden'
					}
				},
				dnd: { draggable: false, droppable: true },
			},
            init : function () {
				let oTitle = new Title({
                    text: this.getTileGroupHeader(),
                    titleStyle: "H2",
                    width: "auto",
                });
				oTitle.addStyleClass("sapUiSmallMarginBottom");
                this.setAggregation("_tileGroupHeader", oTitle);
            },
            setTileGroupHeader: function (sText) {
                this.setProperty("tileGroupHeader", sText, true);
                this.getAggregation("_tileGroupHeader").setText(sText);
            },
            renderer: function (oRM, oControl) {
				oRM.openStart('div', oControl);
				oRM.class('my-tile-group');
				oRM.openEnd();
				oRM.renderControl(oControl.getAggregation('_tileGroupHeader'));
                oRM.renderControl(oControl.getContent()[0]);
				oRM.close('div');
			}
		});
	},
);
