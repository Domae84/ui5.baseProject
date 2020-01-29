/**
 * Der App-Controller enthält Funktionen für die Interaktion mit der App-View.
 *
 * @module controller/App
 */
sap.ui.define(["namespace/controller/BaseController"], function(BaseController) {
	"use strict";

	//************* Öffentliche Funktionen *************

	/**
	 * Setzt global die Content Density für die ganze Anwendung.
	 *
	 * @memberOf module:controller/App
	 * @instance
	 * @listens {init}
	 */
	function init() {
		this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
	}

	return BaseController.extend("namespace.controller.App", {
		onInit: init
	});
});
