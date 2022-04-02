//TODO Перенастроить механизм динамического обновления.
//TODO Окончательно разделить контрол и контроллер. Навигацию вынести в контроллер, нужные свойства убрать внутрь контрола.

sap.ui.define([
    'myshop/control/TileGroup',
    'sap/m/OverflowToolbar',
    'sap/m/FlexBox',
    'sap/m/Button'
], function (TileGroup, OverflowToolbar, FlexBox, Button) {
		'use strict';

		return FlexBox.extend('myshop.control.Launchpad', {
			metadata: {
				aggregations: {
                    _navbar: {
                        type: 'sap.m.OverflowToolbar',
                        multiple: false,
                        visibility: 'hidden'
                    },
					items: {
						type: 'myshop.control.TileGroup',
						multiple: true,
						singularName: 'item',
					},
				},
				defaultAggregation: 'items',
			},
            init() {
                FlexBox.prototype.init.apply(this, arguments);
                this._refreshStarted = false;
                this.setDirection('Column');
                this.addStyleClass('myLaunchpad');

                //create OverflowToolbar
                let oNavbar = new OverflowToolbar({ height: '3rem' });

                //create FlexBox for buttons
                let oBtnContainer = new FlexBox("btnContainer", {
                    height: '3rem',
                    alignItems: 'Center'
                });

                //create and add 'Main page' btn
                let oMainBtn = new Button ({
                    text: 'All groups',
                    type: 'Attention'
                });
                oMainBtn.data('targetGroup', 'main')
                    .addStyleClass('sapUiTinyMarginBegin')
                    .addStyleClass('sapUiSmallMarginEnd')
                    .attachPress(this.onNavBtnClick);
                oBtnContainer.addItem(oMainBtn);

                oNavbar.addContent(oBtnContainer);
                this.setAggregation('_navbar', oNavbar);
            },
            onBeforeRendering() {
                FlexBox.prototype.onBeforeRendering.apply(this, arguments);

                let oModelData = this.getModel('LPModel').getData();

                //Add other groups' buttons to navbar
                if (this.getAggregation('_navbar').getContent()[0].getItems().length === 1) {
                    if (oModelData.TileGroups && oModelData.TileGroups.length) {
                        oModelData.TileGroups.forEach((tileGroup, i) => {
                            let oBtn = new Button("navbar-btn-" + i, {
                                text: tileGroup.groupTitle
                            });
                            oBtn.attachPress(this.onNavBtnClick)
                                .data("targetGroup", "group" + i)
                                .addStyleClass('sapUiSmallMarginEnd');
                            this.getAggregation('_navbar').getContent()[0].addItem(oBtn);
                        });
                    }
                }
            },
			renderer: function (oRM, oControl) {
                oRM.openStart('div', oControl);
                oRM.openEnd();
                    if (oControl.getItems().length > 1) {
                        oRM.renderControl(oControl.getAggregation('_navbar'));
                    }
                    sap.m.FlexBoxRenderer.render(oRM, oControl);
                oRM.close('div');
			},
            onAfterRendering() {
                FlexBox.prototype.onAfterRendering.apply(this, arguments);

                if (this.getItems().length > 0) {
                    if (!this._refreshStarted) {
                        this._refreshTiles(this);
                        this._refreshStarted = true;
                    }
                }
            },
            _getDynamicTiles: function(oControl) {
                let aTiles = oControl.getItems().map(oTileGroup => {
                    return [...oTileGroup.getContent()[1].getItems()];
                }).flat(1);

                let aDynamicTiles = [];
                aTiles.forEach(oTile => {
                    if (oTile.getDynamic()) {
                        aDynamicTiles.push({
                            sId: oTile.sId,
                            route: oTile.getRoute(),
                            timer: oTile.getTimer()
                        });
                    }
                });

                return aDynamicTiles;
            },

            /**
             * Refreshes tile counters each second according to their individual timers
             * @param {object} oControl
             */
            _refreshTiles(oControl) {
                let tiles = this._getDynamicTiles(oControl);

                let timers = [],
                    aToUpdate = [],
                    counter = 1;

                /* for (let key in tiles) {
                    if (Object.hasOwnProperty.call(tiles, key)) {
                        let el = tiles[key];
                        timers.push(el.timer);
                    }
                } */
                tiles.forEach(tile => {
                    timers.push(tile.timer);
                });

                setInterval(() => {
                    /* for (let key in tiles) {
                        if (Object.hasOwnProperty.call(tiles, key)) {
                            let el = tiles[key];

                            // push id of the control that must be updated at current moment
                            if (counter % el.timer == 0) {
                                aToUpdate.push(key);
                            }
                        }
                    } */
                    tiles.forEach(tile => {
                        if (counter % tile.timer == 0) {
                            aToUpdate.push(tile);
                        }
                    });
                    // shuffle the array so the tiles are updated in random order
                    this._shuffle(aToUpdate);

                    aToUpdate.forEach((el, i) => {
                        setTimeout(() => {
                            this._updateData(el);
                        }, 100 * i);
                    })
                    aToUpdate.length = 0;

                    if (counter >= Math.max(...timers)) {
                        counter = 1;
                    } else {
                        counter++;
                    }
                }, 1000);
            },

            /**
             * Fetch data from backend
             *  @param {string} oTileInfo - tile which 'number' attr will get the fetched data
             */
            _updateData(oTileInfo) {
                let oControl = sap.ui.getCore().byId(oTileInfo.sId);
                let iValue = Number(oControl.getNumber());

                fetch('http://localhost:8081/' + oTileInfo.route)
                    .then(response => response.json())
                    .then(data => {
                        if (data.rand && +data.rand != 0) {
                            iValue = iValue + data.rand;
                            oControl.toggleStyleClass('tile-update');
                            setTimeout(() => {
                                oControl.toggleStyleClass('tile-update');
                            }, 200);
                            oControl.setProperty("number", iValue);
                        }
                    })
                    .catch((e) => {
                        console.error('Ошибка при получении данных');
                        console.error(e);
                    });
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
             * Navigation between tile groups
             */
            onNavBtnClick: function(oEvt) {
                let aButtons = this.getParent().getItems();
                let aTileGroups = this.getParent().getParent().getParent().getItems();

                aButtons.forEach((el) => el.setType());
                oEvt.getSource().setType('Attention');
                let sTarget = this.data('targetGroup');
                if (sTarget === 'main') {
                    aTileGroups.forEach((el) => el.setVisible(true));
                } else {
                    aTileGroups.forEach((el) => {
                        if (el.getGroupNavTarget() === sTarget) {
                            el.setVisible(true);
                        } else {
                            el.setVisible(false);
                        }
                    });
                }
            }
		});
	},
);
