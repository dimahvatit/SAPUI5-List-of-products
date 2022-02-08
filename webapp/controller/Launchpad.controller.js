sap.ui.define([
	"./BaseController"
], function (BaseController) {
	'use strict';

	return BaseController.extend('my_cat_list.controller.Launchpad', {
		onInit: function () {
			this.aFlexItems = this.getView().byId('flexContainer').getItems();
			this.aButtons = this.getView().byId('btnContainer').getItems();
			this.oCartModel = this.getOwnerComponent().getModel('cartProducts');
			this.sBaseUrl = 'http://localhost:8081';
			this.getView().setModel(this.oCartModel, 'cart');

			let dynamicTiles = [
				{
					id: 'orders-tile-count',
					timer: 5,
					route: 'orders',
				},
				{
					id: 'suppliers-tile-count',
					timer: 1,
					route: 'suppliers',
				},
			];

			this._refreshTiles(dynamicTiles);

			/* this._fetchData('orders', 'orders-tile-count', 3);
			this._fetchData('suppliers', 'suppliers-tile-count', 5); */
		},

		onDrop: function (oEvent) {
			let oTileContainer = oEvent.getSource().getParent();

			var oDragged = oEvent.getParameter("draggedControl"),
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

		_refreshTiles(arr) {
			let counter = 1;
			let timers = [];
			arr.forEach((el) => timers.push(el.timer));

			let index = 0;
			let timerID = setInterval(() => {
				if (!arr[index]) {
					index = 0;
				}
				if (counter && counter % arr[index].timer === 0) {
					this._fetchData(arr[index].route, arr[index].id);
					index++;
				}
				if (counter >= Math.max(...timers)) {
					counter = 1;
				} else {
					counter++;
				}
			}, 1000);
		},

		/**
		 * Fetch data from express server
		 *  @param {string} route - route to request data from
		 *  @param {object} oControl - control which 'text' attr will get the fetched data
		 *  @param {integer} interval - interval between requests in seconds
		 */
		_fetchData(route, sControlId) {
			let oControl = this.getView().byId(sControlId);
			let iValue = Number(oControl.getValue());

			fetch(this.sBaseUrl + '/' + route)
				.then((response) => response.json())
				.then((data) => {
					iValue = iValue + data.rand;
					oControl.setValue(iValue);
				})
				.catch((e) => {
					console.error('Ошибка при получении данных');
					console.error(e);
					clearInterval(timerID);
				});
		},
		/* _fetchData(route, sControlId, interval) {
			let oControl = this.getView().byId(sControlId);
			let iValue = Number(oControl.getValue());

			let timerID = setInterval(() => {
				fetch(this.sBaseUrl + '/' + route)
					.then(response => response.json())
					.then(data => {
						iValue = iValue + data.rand;
						oControl.setValue(iValue);
					})
					.catch(e => {
						console.error('Ошибка при получении данных');
						console.error(e);
						clearInterval(timerID);
					});
			}, interval * 1000);
		}, */

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
