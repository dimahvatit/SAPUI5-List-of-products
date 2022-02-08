sap.ui.define(['sap/m/FlexBox'], function (FlexBox) {
	'use strict';

	return FlexBox.extend('my_cat_list.control.TileContainer', {
		metadata: {
			dnd: { draggable: false, droppable: true },
			aggregations: {
				items: {
					type: 'sap.ui.core.Control',
					multiple: true,
					selector: '#{id}-items',
					dnd: {
						draggable: true,
						droppable: true,
						layout: 'Horizontal',
					},
				},
			},
		},
		renderer: {},
	});
});
