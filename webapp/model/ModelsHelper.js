/**
 * Der ModelsHelper stellt Funktionen zum Erstellen von lokalen JSON-Models zur Verfügung.
 *
 * @module model/ModelsHelper
 */
sap.ui.define(
	[
		"sap/ui/base/Object",
		"sap/ui/model/json/JSONModel",
		"sap/ui/Device",
		"sap/ui/model/BindingMode"
	],
	function(BaseObject, JSONModel, Device, BindingMode) {
		"use strict";

		//************* Öffentliche Funktionen *****************

		/**
		 * Konstruktor für einen ein Modelshelper-Modul.
		 *
		 * Referenziert das OData-Model.
		 *
		 * @memberOf module:model/ModelsHelper
		 * @instance
		 * @param {sap.ui.core.Component} oComponent - Das Component-Objekt der App
		 */
		function constructor(oComponent) {
			this.oComponent = oComponent;
		}

		/**
		 * Erstellt ein Device-Model auf Basis des übergebenen Device-Objekts.
		 *
		 * @memberOf module:model/ModelsHelper
		 * @instance
		 * @returns {sap.ui.model.Model} - Das Device-Model
		 */
		function createDeviceModel() {
			const oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode(BindingMode.OneWay);
			return oModel;
		}

		/**
		 * Gibt das Message-Model zurück.
		 *
		 * @memberOf module:model/ModelsHelper
		 * @instance
		 * @returns {sap.ui.model.message.MessageModel} - Das MessageModel
		 */
		function getMessageModel() {
			return sap.ui
				.getCore()
				.getMessageManager()
				.getMessageModel();
		}


		//************* Private Funktionen *****************

		/**
		 * Hilfsfunktion zum Erstellen eines JSON-Models.
		 *
		 * @memberOf module:model/ModelsHelper
		 * @instance
		 * @param {(Object|string)} Data - Entweder JS-Objekt oder der Pfad zum JSON-Objekt.
		 * @returns {sap.ui.model.json.JSONModel} - Das JSON-Model
		 */
		function _createJsonModel(Data) {
			return new JSONModel(Data);
		}

		return BaseObject.extend("namespace.model.Models", {
			constructor: constructor,
			createDeviceModel: createDeviceModel,
			getMessageModel: getMessageModel
		});
	}
);
