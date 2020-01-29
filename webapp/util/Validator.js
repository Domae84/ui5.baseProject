/**
 * Repräsentiert ein Validator-Modul.
 *
 * Dieses Modul  überprüft Formulare bzw. Formularfelder ob sie valide sind. Dabei wird zum Beispiel geprüft ob
 * obligatorische Felder gefüllt oder Voraussetzungen für Datentypen beachtet werden.
 *
 * @module util/Validator
 */
sap.ui.define(["sap/ui/core/message/Message", "sap/ui/core/MessageType", "sap/ui/core/ValueState"], function(
	Message,
	MessageType,
	ValueState
) {
	"use strict";

	/**
	 * @alias module:util/Validator
	 * @param {sap.ui.model.resource.ResourceModel} oi18nModel - Das i18n-Model
	 */
	let Validator = function(oi18nModel) {
		this._isValid = true;
		this._i18nBundle = oi18nModel.getResourceBundle();
		this._isValidationPerformed = false;
		this._aPossibleAggregations = [
			"items",
			"content",
			"form",
			"formContainers",
			"formElements",
			"fields",
			"sections",
			"subSections",
			"_grid",
			"cells",
			"_page"
		];
		this._aValidateProperties = ["value", "selectedKey", "text", "selectedKeys"]; // yes, I want to validate Select and Text controls too
	};

	/**
	 * Gibt nur true zurück, wenn die Formularvalidierung durchgeführt und diese keinen Fehler zurückgegeben hat.
	 *
	 * @returns {boolean} - Ist das Formular valide?
	 */
	Validator.prototype.isValid = function() {
		return this._isValidationPerformed && this._isValid;
	};

	/**
	 * Validiert rekursive das übergebene oControl und alle enthaltenen Aggregationen
	 *
	 * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - Das Control, welches validiert werden soll.
	 * @return {boolean} whether the oControl is valid or not.
	 */
	Validator.prototype.validate = function(oControl) {
		this._isValid = true;
		this._validate(oControl);
		return this.isValid();
	};

	/**
	 * Lösche den ValueState aller Controls
	 *
	 * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - Das Control, welches validiert werden soll.
	 */
	Validator.prototype.clearValueState = function(oControl) {
		if (!oControl) {
			return;
		}

		if (oControl.setValueState) {
			oControl.setValueState(ValueState.None);
		}

		this._recursiveCall(oControl, this.clearValueState);
	};

	/**
	 * Validiert rekursive das übergebene oControl und alle enthaltenen Aggregationen
	 *
	 * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - Das Control, welches validiert werden soll.
	 */
	Validator.prototype._validate = function(oControl) {
		let i,
			isValidatedControl = true,
			isValid = true;

		// only validate controls and elements which have a 'visible' property
		// and are visible controls (invisible controls make no sense checking)
		if (
			!(
				(oControl instanceof sap.ui.core.Control ||
					oControl instanceof sap.ui.layout.form.FormContainer ||
					oControl instanceof sap.ui.layout.form.FormElement ||
					oControl instanceof sap.m.IconTabFilter) &&
				oControl.getVisible()
			)
		) {
			return;
		}

		if (
			oControl.getRequired &&
			oControl.getRequired() === true &&
			oControl.getEnabled &&
			oControl.getEnabled() === true
		) {
			// Control required
			isValid = this._validateRequired(oControl);
		} else if ((i = this._hasType(oControl)) !== -1 && oControl.getEnabled && oControl.getEnabled() === true) {
			// Control constraints
			isValid = this._validateConstraint(oControl, i);
		} else if (oControl.getValueState && oControl.getValueState() === ValueState.Error) {
			// Control custom validation
			isValid = false;
			this._setValueState(oControl, ValueState.Error, "Wrong input");
		} else {
			isValidatedControl = false;
		}

		if (!isValid) {
			this._isValid = false;
			//this._addMessage(oControl);
		}

		// if the control could not be validated, it may have aggregations
		if (!isValidatedControl) {
			this._recursiveCall(oControl, this._validate);
		}
		this._isValidationPerformed = true;
	};

	/**
	 * Überprüfe ob das Control obligatorisch ist
	 *
	 * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - Das Control, welches validiert werden soll.
	 * @return {boolean} this._isValid - Ob das Control valide ist
	 */
	Validator.prototype._validateRequired = function(oControl) {
		// check control for any properties worth validating
		let isValid = true;

		for (let i = 0; i < this._aValidateProperties.length; i += 1) {
			try {
				oControl.getBinding(this._aValidateProperties[i]);
				let oExternalValue = oControl.getProperty(this._aValidateProperties[i]);

				if (
					(oControl.getAggregation("items") && oControl.getSelectedItem && !oControl.getSelectedItem()) ||
					(oControl.getAggregation("items") && oControl.getSelectedItems && !oControl.getSelectedItems().length > 0)
				) {
					// might be a select
					this._setValueState(oControl, ValueState.Error, this._i18nBundle.getText("valComboBox"));
					isValid = false;
				} else if (!oExternalValue || oExternalValue === "") {
					this._setValueState(oControl, ValueState.Error, this._i18nBundle.getText("valInput"));
					isValid = false;
				} else {
					oControl.setValueState(ValueState.None);
					isValid = true;
					break;
				}
			} catch (ex) {
				// Validation failed
			}
		}
		return isValid;
	};

	/**
	 * Überprüfe ob das Control obligatorisch ist
	 *
	 * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - Das Control, welches validiert werden soll.
	 * @param {int} i - Der Index der Eigenschaft
	 * @return {boolean} this._isValid - Ob die Eigenschaft valide ist
	 */
	Validator.prototype._validateConstraint = function(oControl, i) {
		let isValid = true;
		let editable;

		try {
			editable = oControl.getProperty("editable");
		} catch (ex) {
			editable = true;
		}

		if (editable) {
			try {
				// try validating the bound value
				let oControlBinding = oControl.getBinding(this._aValidateProperties[i]);
				let oExternalValue = oControl.getProperty(this._aValidateProperties[i]);
				let oInternalValue = oControlBinding.getType().parseValue(oExternalValue, oControlBinding.sInternalType);
				oControlBinding.getType().validateValue(oInternalValue);
				oControl.setValueState(ValueState.None);
			} catch (ex) {
				// catch any validation errors
				isValid = false;
				this._setValueState(oControl, ValueState.Error, ex.message);
			}
		}
		return isValid;
	};

	/**
	 * Füge eine Nachricht zum MessageManager hinzu
	 *
	 * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - Das Control, welches validiert werden soll.
	 * @param {string} [sMessage] - Eine eigene Nachricht
	 */
	Validator.prototype._addMessage = function(oControl, sMessage) {
		let sLabel,
			eMessageType = MessageType.Error;

		if (sMessage === undefined) {
			sMessage = "Wrong input";
		} // Default message

		switch (oControl.getMetadata().getName()) {
			case "sap.m.CheckBox":
			case "sap.m.Input":
			case "sap.m.Select":
			default:
				sLabel = oControl.getParent().getLabel();
				break;
		}

		if (oControl.getValueState) {
			eMessageType = this._convertValueStateToMessageType(oControl.getValueState());
		}

		sap.ui
			.getCore()
			.getMessageManager()
			.addMessages(
				new Message({
					message: oControl.getValueStateText ? oControl.getValueStateText() : sMessage, // Get Message from ValueStateText if available
					type: eMessageType,
					additionalText: sLabel // Get label from the form element
				})
			);
	};

	/**
	 * Überprüfe ob die Control-Eigenschaft einen Datentyp besitzt, und gebe den Index
	 * dieser Eigenschaft zum Validieren zurück
	 *
	 * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - Das Control, welches validiert werden soll.
	 * @return {int} i - Der Index der Eigenschaft zum Validieren
	 */
	Validator.prototype._hasType = function(oControl) {
		// check if a data type exists (which may have validation constraints)
		for (let i = 0; i < this._aValidateProperties.length; i += 1) {
			if (
				oControl.getBinding(this._aValidateProperties[i]) &&
				oControl.getBinding(this._aValidateProperties[i]).getType()
			) {
				return i;
			}
		}
		return -1;
	};

	/**
	 * Setze den ValueState und den ValueStateText des Controls
	 *
	 * @param {sap.ui.core.Control} oControl - Das zu validierende Control
	 * @param {sap.ui.core.ValueState} eValueState - Der ValueState
	 * @param {string} sText - Der ValueStateText
	 */
	Validator.prototype._setValueState = function(oControl, eValueState, sText) {
		oControl.setValueState(eValueState);
		if (oControl.getValueStateText && !oControl.getValueStateText()) {
			oControl.setValueStateText(sText);
		}
	};

	/**
	 * Führt die Funktion rekursiv für alle Kinder der der definierten Aggregationen aus
	 *
	 * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - Das Control, welches validiert werden soll.
	 * @param {function} fFunction - Die Funktion die rekursiv aufgerufen werden soll
	 */
	Validator.prototype._recursiveCall = function(oControl, fFunction) {
		for (let i = 0; i < this._aPossibleAggregations.length; i += 1) {
			let aControlAggregation = oControl.getAggregation(this._aPossibleAggregations[i]);

			if (!aControlAggregation) {
				continue;
			}

			if (aControlAggregation instanceof Array) {
				// generally, aggregations are of type Array
				for (let j = 0; j < aControlAggregation.length; j += 1) {
					fFunction.call(this, aControlAggregation[j]);
				}
			} else {
				// ...however, with sap.ui.layout.form.Form, it is a single object *sigh*
				fFunction.call(this, aControlAggregation);
			}
		}
	};

	/**
	 *
	 * Führt die Funktion rekursiv für alle Kinder der der definierten Aggregationen aus
	 *
	 * @param {sap.ui.core.ValueState} eValueState - Der ValueState
	 * @return {sap.ui.core.MessageType} eMessageType - Die Art der Nachricht
	 */
	Validator.prototype._convertValueStateToMessageType = function(eValueState) {
		let eMessageType;

		switch (eValueState) {
			case ValueState.Error:
				eMessageType = MessageType.Error;
				break;
			case ValueState.Information:
				eMessageType = MessageType.Information;
				break;
			case ValueState.None:
				eMessageType = MessageType.None;
				break;
			case ValueState.Success:
				eMessageType = MessageType.Success;
				break;
			case ValueState.Warning:
				eMessageType = MessageType.Warning;
				break;
			default:
				eMessageType = MessageType.Error;
		}
		return eMessageType;
	};

	return Validator;
});
