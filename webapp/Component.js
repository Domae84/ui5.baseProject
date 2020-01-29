/**
 * Repräsentiert die App-Komponente.
 *
 * Sie wird beim Starten der Anwendung automatisch initialisiert und ruft einmalig die init-Methode auf.
 * In ihr werden wichtige Funktionalitäten wie der Router,
 * der Error-Handler, das Device-Model und weitere Objekte initialisiert bzw. referenziert
 *
 * @module Component
 */
sap.ui.define(
	[
		"sap/ui/core/UIComponent",
		"sap/ui/Device",
		"namespace/util/ErrorHandler",
		"namespace/model/ModelsHelper",
	],
	function(UIComponent, Device, ErrorHandler, ModelsHelper) {
		"use strict";

		//************* Öffentliche Funktionen *****************

		/**
		 * Initialisiert den Router und referenziert alle benötigten Module wie z.B. den ModelsHelper oder die
		 * Service-Module.
		 *
		 * @memberOf module:Component
		 * @instance
		 * @override
		 */
		function init() {
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			this.oModelsHelper = new ModelsHelper(this);
			this.oMessageManager = sap.ui.getCore().getMessageManager();
			this.setModel(this.oModelsHelper.createDeviceModel(), "device");
			this.setModel(this.oModelsHelper.getMessageModel(), "message");
			this._ErrorHandler = new ErrorHandler(this);
		}

		/**
		 * Gibt die ContentDensity-Klasse auf Basis des aktuell verwendeten Geräts wieder.
		 *
		 * Auf dem Desktop wird "Compact" und auf mobilen Geräten wie Smartphones und Tablets wird "Cozy"
		 * zurückgegeben.
		 *
		 * @memberOf module:Component
		 * @instance
		 * @returns {string} Die ContentDensity-CSS-Klasse
		 */
		function getContentDensityClass() {
			if (!this._sContentDensityClass) {
				if (!Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}

		//************* Private Funktionen *****************


		return UIComponent.extend("namespace.Component", {
			metadata: {
				manifest: "json"
			},
			init: init,
			getContentDensityClass: getContentDensityClass
		});
	}
);
