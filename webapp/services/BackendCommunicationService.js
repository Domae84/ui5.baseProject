/**
 * Service mit technischem Fokus für die Kommunikation mit den OData-Services
 *
 * @module services/BackendCommunicationService
 */
sap.ui.define(["sap/ui/base/Object"], function(BaseObject) {
	"use strict";

	//************* Öffentliche Funktionen *****************

	/**
	 * Konstruktor für einen BackendCommunicationService.
	 *
	 * Referenziert das OData-Model.
	 *
	 * @memberOf module:services/BackendCommunicationService
	 * @instance
	 * @param {sap.ui.core.Component} oComponent - Das Component-Objekt der App
	 */
	function constructor(oComponent) {
		this.oODataModel = oComponent.getModel();
	}

	/**
	 * Gibt einen OData-Bindingkontext auf Basis des übergebenen Pfades zurück.
	 *
	 * Gibt ein Promise-Objekt zurück, welches den eigentlichen Aufruf ins Backend realisiert.
	 *
	 * @memberOf module:services/BackendCommunicationService
	 * @instance
	 * @param {string} sContextPath - Der Pfad zur Entität
	 * @param {boolean} bReload - Ob die Daten aus dem backend nachgeladen werden sollen
	 * @param {Object} oUrlParameters - Optionale URL-Parameter
	 * @returns {Promise<sap.ui.model.Context>} - Der Binding-Kontext
	 */
	function getBindingContextPromise(sContextPath, bReload, oUrlParameters) {
		return new Promise(resolve => {
			this.oODataModel.createBindingContext(
				sContextPath,
				oUrlParameters,
				oContext => {
					resolve(oContext);
				},
				bReload
			);
		});
	}

	/**
	 * Liest einen bestimmten Pfad des OData-Models
	 *
	 * Gibt ein Promise-Objekt zurück, welches den eigentlichen Aufruf ins Backend realisiert
	 *
	 * @param {string} sPath - Der zu lesende Pfad
	 * @param {Object} [mParameters] - Optionale Url-Parameter
	 * @returns {Promise<sap.ui.base.Object>} - Das Ergebnis mit den angeforderten Daten
	 */
	function getReadEntityPromise(sPath, mParameters) {
		return new Promise((resolve, reject) => {
			this.oODataModel.read(sPath, {
				success: oResult => resolve(oResult),
				error: oError => reject(oError),
				urlParameters: mParameters
			});
		});
	}

	/**
	 * Gibt den Binding-Kontext eines neuen OData-Eintrags zurück
	 *
	 * @param {string} sPath - Pfad des EntitySets
	 * @param {string} [sGroupId]  - Die Group-ID (bei mehreren Einträgen)
	 * @returns {sap.ui.model.Context} - Der Binding-Kontext des neuen Eintrags
	 */
	function getCreateEntryBindingContext(sPath, sGroupId) {
		if (sGroupId) {
			const mParameters = { groupId: sGroupId };
			return this.oODataModel.createEntry(sPath, mParameters);
		}
		return this.oODataModel.createEntry(sPath);
	}

	/**
	 * Überträgt alle aktuellen OData-Changes ins Backend
	 * @returns {Promise<Object>} - Die Antwort des OData-Service
	 */
	function getSubmitChangesPromise() {
		return new Promise((resolve, reject) => {
			this.oODataModel.submitChanges({
				success: oData => resolve(oData),
				error: oError => reject(oError)
			});
		});
	}

	/**
	 * Erstellt eine neue Entität
	 *
	 * @param {string} sPath - Der Pfad des Entitysets
	 * @param {Object} oPayload - Die zu übergebenen Daten
	 * @param {boolean} bRefreshAfterChange - Sollen die betreffenden Entitysets nach erfolgreichem Speichern aktualisiert werden?
	 * @param {string} sGroupId - Die Group Id
	 * @returns {Promise<Object>} - Die Antwort des Odata-Services
	 */
	function getCreateEntityPromise(sPath, oPayload, bRefreshAfterChange, sGroupId) {
		return new Promise(resolve => {
			this.oODataModel.create(sPath, oPayload, {
				success: oResult => resolve(oResult),
				refreshAfterChange: bRefreshAfterChange,
				groupId: sGroupId
			});
		});
	}

	/**
	 * Setzt die übergebenen Eigenschaften für eine bestimmte Entität zurück
	 *
	 * @param {string} sContextPath - Der Pfad der Entität
	 * @param {string[]} aProperties - Die Eigenschaften
	 */
	function resetODataProperties(sContextPath, aProperties) {
		aProperties.forEach(sPropertyPath => {
			const sFinalPath = sContextPath + sPropertyPath;
			this.oODataModel.setProperty(sFinalPath, undefined, false);
		});
	}

	/**
	 * Registriert einmalig einen Event-Handler für das "dataReceived"-Event des aktuellen View-Bindings
	 * und gibt das resultierende Entity-Objekt zurück.
	 *
	 * @memberOf module:services/BackendCommunicationService
	 * @instance
	 * @param {sap.ui.model.ContextBinding} oObjectBinding - Das aktuelle Binding der View
	 * @returns {Promise<Object>} Das Entity-Objekt
	 */
	function getEntityObjectFromDataReceivedPromise(oObjectBinding) {
		return new Promise(resolve => {
			oObjectBinding.attachEventOnce("dataReceived", oEvent => {
				resolve(oEvent.getParameter("data"));
			});
		});
	}
	/**
	 * Speichert einen neuen Wert für eine bestimmte Eigenschaft einer Entität
	 *
	 * @memberOf module:services/BackendCommunicationService
	 * @instance
	 * @param {string} sPath - Der Pfad der Entität
	 * @param {string} sProperty - Die Eigenschaft der Entität, die geändert werden soll
	 * @param {string} sValue - Der neue Wert
	 * @returns {Promise<Object>} - Die Antwort des OData-Service
	 */
	function getSetPropertyPromise(sPath, sProperty, sValue) {
		const sStatusPath = `${sPath}/${sProperty}`;
		this.oODataModel.setProperty(sStatusPath, sValue);
		return getSubmitChangesPromise.call(this);
	}

	return BaseObject.extend("namespace.services.BackendCommunicationService", {
		constructor: constructor,
		getBindingContextPromise: getBindingContextPromise,
		getReadEntityPromise: getReadEntityPromise,
		getCreateEntryBindingContext: getCreateEntryBindingContext,
		getSubmitChangesPromise: getSubmitChangesPromise,
		getCreateEntityPromise: getCreateEntityPromise,
		resetODataProperties: resetODataProperties,
		getEntityObjectFromDataReceivedPromise: getEntityObjectFromDataReceivedPromise,
		getSetPropertyPromise: getSetPropertyPromise
	});
});
