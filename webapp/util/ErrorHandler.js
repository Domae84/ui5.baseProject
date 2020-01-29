/**
 * Repräsentiert ein ErrorHandler-Modul.
 *
 * Der ErrorHandler verarbeitet OData-Service-Fehler durch Referenzieren des OData-Models
 * und zeigt bei Bedarf Fehlermeldungen an.
 *
 * @module util/ErrorHandler
 */
sap.ui.define(["sap/ui/base/Object", "sap/m/MessageBox"], function(UI5Object, MessageBox) {
	"use strict";

	return UI5Object.extend("namespace.util.ErrorHandler", {
		//************* Öffentliche Funktionen *****************

		/**
		 * Konstruktor für einen ErrorHandler-Modul. </br>
		 * Benötigt die App-Komponente zum Referenzieren des OData-Models und i18n-Models.
		 *
		 * @memberOf module:util/ErrorHandler
		 * @instance
		 * @param {sap.ui.core.UIComponent} oComponent - oComponent Das Component-Objekt der App
		 */
		constructor: function(oComponent) {
			this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			this._oComponent = oComponent;
			this._oModel = oComponent.getModel();
			this._bMessageOpen = false;
			this._sErrorText = this._oResourceBundle.getText("oerTitle");

			this._oModel.attachMetadataFailed(function(oEvent) {
				const oParams = oEvent.getParameters();
				this._showServiceError(oParams.response);
			}, this);

			this._oModel.attachRequestFailed(function(oEvent) {
				const oParams = oEvent.getParameters();
				if (
					oParams.response.statusCode !== "404" ||
					(oParams.response.statusCode === 404 && oParams.response.responseText.indexOf("Cannot POST") === 0)
				) {
					this._showServiceError(oParams.response);
				}
			}, this);
		},

		//************* Private Funktionen *****************

		/**
		 * Zeigt eine {sap.m.MessageBox} an wenn ein Serviceaufruf fehlgeschlagen ist.
		 * Nur der erste Fehler wird angezeigt.
		 *
		 * @memberOf module:util/ErrorHandler
		 * @instance
		 * @param {Object} oDetails - Die Fehlerdetails
		 */
		_showServiceError: function(oDetails) {
			let sDescription = this._oResourceBundle.getText("oerGeneric");
			let oConfig = {
				id: "serviceErrorMessageBox",
				title: this._sErrorText,
				styleClass: this._oComponent.getContentDensityClass(),
				actions: [MessageBox.Action.CLOSE],
				onClose: function() {
					this._bMessageOpen = false;
				}.bind(this)
			};
			try {
				sDescription = JSON.parse(oDetails.responseText).error.message.value;
			} catch (e) {
				oConfig.details = oDetails;
			}
			if (this._bMessageOpen) {
				return;
			}
			this._bMessageOpen = true;

			MessageBox.error(sDescription, oConfig);
		}
	});
});
