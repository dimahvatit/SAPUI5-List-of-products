sap.ui.define([
	'sap/m/ScrollContainer',
	'sap/ui/core/dnd/DragDropInfo',
	'myshop/control/LPTile'
], function (ScrollContainer, DragDropInfo, LPTile) {
	'use strict';

	return ScrollContainer.extend('myshop.control.TileContainer', {
		constructor: function(sId, mSettings) {
			ScrollContainer.apply(this, arguments);
			
			//TODO Настроить drag’n’drop
			this.addDragDropConfig(new DragDropInfo({
				dropPosition: "Between",
				drop: this.onDrop,
				sourceAggregation: "items",
				targetAggregation: "items"
			}));
		},
		metadata: {
			dnd: { draggable: false, droppable: true },
			aggregations: {
				content: {
					type: 'sap.ui.core.Control',
					multiple: true,
					singularName: 'content',
					dnd: {
						draggable: true,
						droppable: true,
						layout: 'Horizontal'
					}
				}
			},
		},
		onDrop(oEvt) {
			debugger; //! DEBUGGER
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
