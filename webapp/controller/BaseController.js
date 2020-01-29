/**
 * Generischer Controller mit diversen Grundfunktionen
 *
 * @module controller/BaseController
 */
sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/ui/core/Fragment",
		"namespace/util/Validator"
	],
	function(Controller, History, Fragment, Validator) {
		"use strict";

		//************* Öffentliche Funktionen *************

		/**
		 * Ruf den onInit Callback des BaseControllers auf.
		 *
		 * @memberOf module:controller/BaseController
		 * @instance
		 * @listens {init}
		 */
		function onInit() {
			const oI18nModel = this.getModel("i18n");
			this.oValidator = new Validator(oI18nModel);
		}

		/**
		 * Gibt das genutzte Router-Objekt zurück.
		 *
		 * @memberOf module:controller/BaseController
		 * @instance
		 * @returns {sap.ui.core.routing.Router} - Das SAPUI5-Router Objekt
		 */
		function getRouter() {
			return this.getOwnerComponent().getRouter();
		}

		/**
		 * Gibt das I18n-ResourceBundle zurück.
		 *
		 * @memberOf module:controller/BaseController
		 * @instance
		 * @returns {sap.base.i18n.ResourceBundle} - Das I18n-ResourceBundle
		 */
		function getI18nBundle(){
			return this.getModel("i18n").getResourceBundle();
		}

		/**
		 * Navigiert zur übergebenen Route.
		 *
		 * @memberOf module:controller/BaseController
		 * @instance
		 * @param {string} sRoute - Die Route, zu der navigiert werden soll
		 * @param {Object} [oParams] - Die optionalen URL-Parameter
		 */
		function navToView(sRoute, oParams) {
			this.getRouter().navTo(sRoute, oParams);
		}

		/**
		 * Zeigt das übergebene Target an.
		 *
		 * @memberOf module:controller/BaseController
		 * @instance
		 * @param {string} sTarget - Der name des Targets, welches angezeigt werden soll
		 */
		function displayTarget(sTarget) {
			this.getRouter()
				.getTargets()
				.display(sTarget);
		}

		/**
		 * Gibt das Model auf Basis des übergebenen Namen zurück.
		 *
		 * @memberOf module:controller/BaseController
		 * @instance
		 * @param {string} [sName] - Der Name des Models
		 * @returns {sap.ui.model.Model} - Das Model
		 */
		function getModel(sName) {
			return this.getOwnerComponent().getModel(sName);
		}

		/**
		 * Navigiert einen Schritt zurück.
		 *
		 * Falls es keinen gültigen Hash gibt, wird zur Produkt-Liste navigiert.
		 *
		 * @memberOf module:controller/BaseController
		 * @instance
		 * @listens {navButtonPress}
		 */
		function onNavBack() {
			const oHistory = History.getInstance();
			const sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				//TODO generisches Zurück-Navigieren zur ersten Route
			}
		}

		/**
		 * Referenziert ein neues View-Model im Controller.
		 *
		 * Das View-Model dient zum Zwischenspeichern von Informationen zur weiteren Verwendung im jeweiligen
		 * Controller.
		 *
		 * @memberOf module:controller/BaseController
		 * @instance
		 * @param {sap.ui.model.json.JSONModel} oViewModel - Das View-Model
		 */
		function setViewModel(oViewModel) {
			this.getView().setModel(oViewModel, "viewModel");
		}

		/**
		 * Gibt das View-Model zurück.
		 *
		 * @memberOf module:controller/BaseController
		 * @instance
		 *
		 * @param {string} [sName]	 - Der Modelname
		 * @returns {sap.ui.model.Model} - Das View-Model
		 */
		function getViewModel(sName) {
			if (sName) {
				return this.getView().getModel(sName);
			}
			return this.getView().getModel("viewModel");
		}

		/**
		 * Gibt das Dialog-Control abhängig von der Id zurück.
		 *
		 * Das Control wird nur einmal geladen (Singleton)
		 *
		 * @memberOf module:controller/BaseController
		 * @instance
		 * @async
		 * @param {string} sDialogName - Der Name des Dialogs
		 * @param {string} sPathToFragment - Der Pfad zum zugehörigen Fragment
		 * @returns {Promise<sap.m.Dialog>} - Das Dialog-Control
		 */
		async function getDialog(sDialogName, sPathToFragment) {
			if (!this[sDialogName]) {
				this[sDialogName] = await Fragment.load({
					name: sPathToFragment,
					controller: this,
					id: this.getView().getId()
				});
				this.getView().addDependent(this[sDialogName]);
				this[sDialogName].addStyleClass(
					this.getOwnerComponent().getContentDensityClass()
				);
				return this[sDialogName];
			}
			return this[sDialogName];
		}

		/**
		 * Einfacher Escape-Handler für das "escape-Pressed" Event.
		 *
		 * Funktion die verhindert, dass der Dialog geschlossen wird, sobald man Escape drückt.
		 *
		 * @memberOf module:controller/BaseController
		 * @instance
		 * @listens {escapePressed}
		 * @param {Promise} [oPromise] - Das implizite Promise-Objekt
		 */
		function escapePressed(oPromise) {
			oPromise.reject();
		}

		/**
		 * Validiert eine Form bzw. ein FormControl ob es gefüllt ist.
		 *
		 * Dies bezieht sich auf obligatorische Felder in einem Formular.
		 *
		 * @memberOf module:controller/BaseController
		 * @instance
		 * @param {sap.ui.base.Event} oEvent - Standard SAPUI5 Event-Objekt
		 */
		function onValidate(oEvent) {
			this.oValidator.validate(oEvent.getSource());
		}

		/**
		 * Kopiert einen Text in die Zwischenablage.
		 *
		 * @memberOf module:controller/BaseController
		 * @instance
		 * @param {string} sText - Der Text der kopiert werden soll
		 * @return {(string|boolean)} - Der kopierte Text oder im Fehlerfall: false.
		 */
		function copyToClipboard(sText) {
			if (
				document.queryCommandSupported &&
				document.queryCommandSupported("copy")
			) {
				const textarea = document.createElement("textarea");
				textarea.textContent = sText;
				textarea.style.position = "fixed";
				document.body.appendChild(textarea);
				textarea.select();
				try {
					return document.execCommand("copy");
				} catch (ex) {
					return false;
				} finally {
					document.body.removeChild(textarea);
				}
			}
			return "";
		}

		//************* Private Funktionen *****************

		return Controller.extend("namespace.controller.BaseController", {
			onInit: onInit,
			getRouter: getRouter,
			getI18nBundle:getI18nBundle,
			navToView: navToView,
			displayTarget: displayTarget,
			getModel: getModel,
			onNavBack: onNavBack,
			setViewModel: setViewModel,
			getViewModel: getViewModel,
			getDialog: getDialog,
			escapePressed: escapePressed,
			onValidate: onValidate,
			copyToClipboard: copyToClipboard
		});
	}
);
