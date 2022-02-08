sap.ui.define([
	"sap/ui/core/Control",
    "sap/ui/core/HTML",
    "../thirdparty/qrcode"
], function (Control, HTML, qrcode) {
	"use strict";
	return Control.extend("my_cat_list.control.QRCode", {
        __qrcode: undefined,

		metadata: {
			properties: {
                text: { type: "string", group: "Appearance", defaultValue: null },
                width: { type: "int", group: "Appearance", defaultValue: 128 },
                height: { type: "int", group: "Appearance", defaultValue: 128 },
                colorDark: { type: "sap.ui.core.CSSColor", group: "Appearance", defaultValue: "#000000" },
                colorLight: { type: "sap.ui.core.CSSColor", group: "Appearance", defaultValue: "#ffffff" },
                correctLevel: { type: "int", group: "Appearance", defaultValue: QRCode.CorrectLevel.H },
            },
			aggregations: {
                __qrcodeHTML: { type: "sap.ui.core.HTML", multiple: false, visibility: "hidden"},
            },
			events: {}
		},
	
		renderer: function (rm, oControl) {
            rm.openStart("div", oControl);
			rm.class("my-qrcode-control");
			rm.openEnd();
			rm.renderControl(oControl.getAggregation("__qrcodeHTML"));
			rm.close("div");
        },

		init: function () {
            this.setAggregation("__qrcodeHTML", new HTML({
				content: `<div id='${this.getId()}-qrcode'></div>`
			}));
        },

		onAfterRendering: function() {
			var iCorrectLevel = this.getCorrectLevel() < 0 || this.getCorrectLevel() > 3 ? QRCode.CorrectLevel.H : this.getCorrectLevel();
			if( this.__qrcode ) {
				this.__qrcode._htOption.width = this.getWidth();
				this.__qrcode._htOption.height = this.getHeight();
				this.__qrcode._htOption.colorDark = this.getColorDark();
				this.__qrcode._htOption.colorLight = this.getColorLight();
				this.__qrcode._htOption.correctLevel = iCorrectLevel;

				if( this.getText() ) {
					this.__qrcode.makeCode( this.getText() );
				} else {
					this.__qrcode.clear();
				}
			} else {
				this.destroyQRCode();
				this.__qrcode = new QRCode( jQuery.sap.domById( this.getId() + "-qrcode" ), {
					text: this.getText(),
					width: this.getWidth(),
					height: this.getHeight(),
					colorDark: this.getColorDark(),
					colorLight: this.getColorLight(),
					correctLevel: iCorrectLevel
				});	
			}
		},

		/*
		* Set a new text of the QR Code
		* @public
		* @param {string} sText - Text of the QR Code
		* @param {boolean} bSkipDraw - skip the redraw
		*/
		setText: function(sText) {
			if (sText && this.__qrcode) {
				if (typeof sText == "string" && /\w+/.test(sText)) {
					// this.setProperty( "text", sText, true );
					this.__qrcode.makeCode(sText);
				}
			}
			return this;
		},

		/*
		* Clear the QR Code
		*/
		clearQRCode: function() {
			if( this.__qrcode ) {
				this.__qrcode.clear();
			}
			return this;
		},

		/*
		* Destroy the QR Code
		*/
		destroyQRCode: function() {
			this.clearQRCode();
			this.__qrcode = undefined;
			return this;
		}
	});
});