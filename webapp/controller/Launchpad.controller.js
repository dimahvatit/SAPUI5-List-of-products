sap.ui.define([
	"./BaseController"
], function (BaseController) {
	'use strict';

	return BaseController.extend('my_cat_list.controller.Launchpad', {
		onInit() {
			this.aFlexItems = this.getView().byId('flexContainer').getItems();
			this.aButtons = this.getView().byId('btnContainer').getItems();
			this.oCartModel = this.getOwnerComponent().getModel('cartProducts');
			this.sBaseUrl = 'http://localhost:8081';
			this.getView().setModel(this.oCartModel, 'cart');

			let dynamicTilesCounters = {
				'orders-tile-count': {
					route: 'orders',
					timer: 2,
				},
				'suppliers-tile-count': {
					route: 'suppliers',
					timer: 6,
				},
			};

			this._refreshTiles(dynamicTilesCounters);
		},

		/**
		 * Refreshes tiles' counters each second according to their individual timers
		 * @param {object} tiles
		 */
		_refreshTiles(tiles) {
			let timers = [];
			let aToUpdate = [];
			let counter = 1;

			for (const key in tiles) {
				if (Object.hasOwnProperty.call(tiles, key)) {
					const element = tiles[key];
					timers.push(element.timer);
				}
			}

			setInterval(() => {
				for (const key in tiles) {
					if (Object.hasOwnProperty.call(tiles, key)) {
						const el = tiles[key];

						// push id of the control that must be updated at current moment
						if (counter % el.timer == 0) {
							aToUpdate.push(key);
						}
					}
				}

				getData();

				if (counter >= Math.max(...timers)) {
					counter = 1;
				} else {
					counter++;
				}
			}, 1000);

			let that = this;
			function getData() {
				// shuffle the array so the tiles are updated in random order
				that._shuffle(aToUpdate);
				aToUpdate.forEach((el, i) => {
					setTimeout(() => {
						that._updateData(tiles[el].route, el);
						console.log(el + ' update');
					}, 500 * i);
				})
				aToUpdate.length = 0;
			}
		},

		/**
		 * Fisher–Yates shuffle (changes the original array)
		 */
		_shuffle: function(arr) {
			let currentIndex = arr.length, randomIndex;

			// While there remain elements to shuffle...
			while (currentIndex != 0) {
				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;

			  // And swap it with the current element.
				[arr[currentIndex], arr[randomIndex]] = [
					arr[randomIndex], arr[currentIndex]];
			}

			return arr;
		},

		/**
		 * Fetch data from express server
		 *  @param {string} route - route to request data from
		 *  @param {object} oControl - control which 'text' attr will get the fetched data
		 */
		_updateData(route, sControlId) {
			let oControl = this.getView().byId(sControlId),
				iValue = Number(oControl.getValue());

			fetch(this.sBaseUrl + '/' + route)
				.then((response) => response.json())
				.then((data) => {
					iValue = iValue + data.rand;
					if (+data.rand != 0) {
						oControl.getParent().getParent().toggleStyleClass('tile-update');
						setTimeout(() => {
							oControl.getParent().getParent().toggleStyleClass('tile-update');
						}, 200);
					}
					oControl.setValue(iValue);
				})
				.catch((e) => {
					console.error('Ошибка при получении данных');
					console.error(e);
					clearInterval(timerID);
				});
		},

		/**
		 * Tiles' drag'n'drop logic
		 */
		onDrop(oEvent) {
			let oTileContainer = oEvent.getSource().getParent(),
				oDragged = oEvent.getParameter("draggedControl"),
				oDropped = oEvent.getParameter("droppedControl"),
				sInsertPosition = oEvent.getParameter("dropPosition"),
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

		/**
		 * Navigation between tile groups
		 */
		onNavBtnClick(oEvent) {
			this.aButtons.forEach((el) => el.setType(), this);
			oEvent.getSource().setType('Attention');
			let sTarget = oEvent.getSource().data('targetGroup');
			if (sTarget === 'main') {
				this.aFlexItems.forEach((el) => el.setVisible(true), this);
			} else {
				this.aFlexItems.forEach((el) => el.setVisible(false), this);
				this.getView().byId(sTarget).setVisible(true);
			}
		},

		onTilePress(oEvent) {
			this.getRouter().navTo(oEvent.getSource().data('navTarget'));
		}
	});
});
