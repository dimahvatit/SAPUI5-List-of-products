sap.ui.define([
    'sap/ui/layout/VerticalLayout',
	'sap/ui/core/dnd/DragDropInfo',
    'myshop/control/TileContainer',
	'myshop/control/LPTile',
    'sap/m/Title'
], function (VerticalLayout, DragDropInfo, TileContainer, LPTile, Title) {
		'use strict';

		return VerticalLayout.extend('myshop.control.TileGroup', {
			constructor: function(...args) {
				VerticalLayout.apply(this, arguments);

				//! There will be an error when group count is > 10
				//TODO: Refactor this shit!
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
			},
			onBeforeRendering() {
				VerticalLayout.prototype.onBeforeRendering.apply(this, arguments);
                this.getAggregation('_header')?.setText(this.getTileGroupHeader());
			},
            renderer: function (oRM, oControl) {
				let oHeader = oControl.getAggregation('_header');
				let oTileContainer = new TileContainer({});
				oControl.getTiles().forEach(oTile => {
					oTileContainer.addItem(oTile);
				})
				oControl.addContent(oHeader);
				oControl.addContent(oTileContainer);

				sap.ui.layout.VerticalLayoutRenderer.render(oRM, oControl);
			}
		});
	},
);
