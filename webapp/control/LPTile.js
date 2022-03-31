sap.ui.define([
	'sap/m/GenericTile',
	'sap/m/TileContent',
	'sap/m/NumericContent'
], function (GenericTile, TileContent, NumericContent) {
		'use strict';

		return GenericTile.extend('myshop.control.LPTile', {
			metadata: {
				properties: {
					footer: 'string',
					footerColor: { type: 'string', defaultValue: 'Neutral' },
					number: 'string',
					timer: { type: 'int', defaultValue: 1 },
					route: 'string',
					navTarget: 'string',
					dynamic: { type: 'boolean', defaultValue: false }
				},
				aggregations: {
					content: {
						type: 'sap.ui.core.Control',
						multiple: false,
					},
				},
				dnd: { draggable: true, droppable: true},
			},
			onBeforeRendering() {
				GenericTile.prototype.onBeforeRendering.apply(this, arguments);
				//TODO: Refactor this shit!

				let oTileContent = new TileContent({
					footer: this.getFooter(),
					footerColor: this.getFooterColor(),
				});
				let oNumContent = new NumericContent({
					value: this.getNumber(),
				});
				oTileContent.setContent(oNumContent);
				this.setAggregation('content', oTileContent);
				this.destroyTileContent();
				this.addTileContent(this.getAggregation('content'));
				this.addStyleClass('myLPTile');
			},
			renderer: function (oRM, oControl) {
				sap.m.GenericTileRenderer.render(oRM, oControl);
			},
		});
	},
);
