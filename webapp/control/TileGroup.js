sap.ui.define([
    'sap/ui/layout/VerticalLayout',
    'sap/m/Title',
    'myshop/control/TileContainer',
	'myshop/control/LPTile',
	'sap/ui/core/dnd/DragDropInfo',
], function (VerticalLayout, Title,	TileContainer, LPTile, DragDropInfo) {
		'use strict';

		return VerticalLayout.extend('myshop.control.TileGroup', {
			constructor: function(...args) {
				VerticalLayout.apply(this, arguments);

				if (args.length > 1) {
					this.setGroupNavTarget('group' + args[0].at(-1));
				}

				let oTitle = new Title({
                    titleStyle: 'H2',
                    width: 'auto',
                });
				oTitle.addStyleClass('sapUiSmallMarginBottom');
                this.setAggregation('_header', oTitle);
			},
			metadata: {
				properties: {
					tileGroupHeader: 'string',
					groupNavTarget: 'string'
				},
				aggregations: {
                    _header: {
                        type: 'sap.m.Title',
                        multiple: false,
						visibility: 'hidden'
                    },
					tiles: {
						type: 'myshop.control.LPTile',
						multiple: true,
						singularName: 'tile'
					}
				},
				defaultAggregation: 'tiles',
				// dnd: { draggable: false, droppable: true }
			},
			onBeforeRendering() {
				VerticalLayout.prototype.onBeforeRendering.apply(this, arguments);
                this.getAggregation('_header')?.setText(this.getTileGroupHeader());
			},
            renderer: function (oRM, oControl) {
				let oHeader = oControl.getAggregation('_header');
				let oTileContainer = new TileContainer({});
				oControl.getTiles().forEach(oTile => {
					oTileContainer.addContent(oTile);
				})
				oControl.addContent(oHeader);
				oControl.addContent(oTileContainer);

				sap.ui.layout.VerticalLayoutRenderer.render(oRM, oControl);
			}
		});
	},
);
