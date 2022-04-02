sap.ui.define([
	'sap/ui/core/dnd/DragDropInfo',
	'myshop/control/LPTile',
	'sap/m/HBox'
], function (DragDropInfo, LPTile, HBox) {
	'use strict';

	return HBox.extend('myshop.control.TileContainer', {
		metadata: {
			dnd: { draggable: false, droppable: true },
			aggregations: {
				items: {
					type: 'sap.ui.core.Control',
					multiple: true,
					dnd: {
						draggable: true,
						droppable: true,
						layout: 'Horizontal'
					}
				}
			},
		},
		init: function() {
			HBox.prototype.init.apply(this, arguments);
			this.setWrap('Wrap');

			//TODO Настроить drag’n’drop
			this.addDragDropConfig(new DragDropInfo({
				dropPosition: "Between",
				drop: this._onDrop,
				sourceAggregation: "items",
				targetAggregation: "items"
			}));
		},
		_onDrop: function(oEvt) {
			let oTileContainer = oEvt.getSource().getParent(),
				oDragged = oEvt.getParameter("draggedControl"),
				oDropped = oEvt.getParameter("droppedControl"),
				sInsertPosition = oEvt.getParameter("dropPosition"),
				iDragPosition = oTileContainer.indexOfItem(oDragged),
				iDropPosition = oTileContainer.indexOfItem(oDropped);

			oTileContainer.removeItem(oDragged);

			if (iDragPosition < iDropPosition) {
				iDropPosition--;
			}

			if (sInsertPosition === "After") {
				iDropPosition++;
			}

			oTileContainer.insertItem(oDragged, iDropPosition);
		},
		renderer: {}
	});
});
