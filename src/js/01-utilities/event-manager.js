/*
 |------------------------------------------------------------------------------
 | EVENT
 |------------------------------------------------------------------------------
 |
 | This module provides methods to make it easier to deal with events and some
 | unexpected behaviors.
 |
 |*/


/* ========================================================================== *\
	IMPORTS
\* ========================================================================== */

import forEach from 'lodash/forEach';
import isElement from 'lodash/isElement';
import isFunction from 'lodash/isFunction';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import merge from 'lodash/merge';

import {
	performQueryAll
} from './dom.js';



/* ========================================================================== *\
	PRIVATE VARIABLES
\* ========================================================================== */

/**
 * @typedef {Object} EventConfig
 *
 * @property {boolean} bubbles Indicating whether the event bubbles.
 *           The default is false.
 * @property {boolean} cancelable Indicating whether the event can be cancelled
 *           and thus preventing its default behaviour. The default is false.
 * @property {any} detail Custom information to be send along with the event.
 *           The default is null.
 */

const
	originalPreventDefault = '__originalPreventDefault__',

	needsPatching = {
		preventDefault: false
	},

	supportedOptions = {
		capture: false,
		once: false,
		passive: false
	},

	registrationMethod = {
		add: 'addEventListener',
		remove: 'removeEventListener'
	};



/* ========================================================================== *\
	PRIVATE METHODS
\* ========================================================================== */

/**
 * Creates a custom event for the specified name and configuration. If needed
 * its prevent default mechanism will be altered so it works for custom events.
 *
 * @param {string} eventName The name of the event
 * @param {EventConfig} configuration The configuration for the event.
 *
 * @returns {CustomEvent}
 */
function createCustomEvent(eventName, configuration) {
	const
		customEvent = new CustomEvent(eventName, configuration);

	// Check if the event can be cancelled and if we have to patch the
	// prevent default mechanism.
	if (
		configuration.cancelable &&
		needsPatching.preventDefault
	) {
		overridePreventDefault(customEvent);
	}

	return customEvent;
}

/**
 * Adds or removes an event listener from an HTML element.
 *
 * @param {registrationMethod} method Indicates whether the event listener
 *        should be added or removed.
 * @param {HTMLElement} element The element to add or remove a listener to/from.
 * @param {string} eventName The name of the event to add or remove.
 * @param {Function} callback The listener to add or remove.
 * @param {boolean=false} capture The configuration for the listener.
 *
 * @returns {boolean} The method returns false when not all required parameters
 *          are provided; otherwise it returns true to indicate the change was
 *          made successfully.
 */
function eventRegistration(method, element, eventName, callback, capture = false) {
	if (
		(!isElement(element) && element !== document)||
		!isString(eventName) ||
		!isFunction(callback)
	) {
		return false;
	}

	element[method](eventName, callback, capture);

	return true;
}

/**
 * There is an issue with IE10/11 where it resets the defaultPrevented property
 * to false, even if the preventDefault method has been called in an event
 * handler. To fix this behaviour we will override the preventDefault method.
 * Our implementation will create a custom property to override the default
 * defaultPrevented property. In our implementation we will always return true.
 * Because the custom property only is defined when the preventDefault method is
 * called it still reports false when the default behaviour hasn't
 * been prevented.
 *
 * @param {CustomEvent} customEvent The event to patch.
 *
 * @see {@link https://stackoverflow.com/questions/23349191/event-preventdefault-is-not-working-in-ie-11-for-custom-events}
 */
function overridePreventDefault(customEvent) {
	// Store the original preventDefault method under a different name on
	// the event itself.
	customEvent[originalPreventDefault] = customEvent.preventDefault;

	// Override the preventDefault method of the event.
	customEvent.preventDefault = function preventDefaultExt () {
		this[originalPreventDefault]();

		Object.defineProperty(this, 'defaultPrevented', {
			get: () => true
		});
	}
}



/* ========================================================================== *\
	PUBLIC API
\* ========================================================================== */

/**
 * Adds an event listener on an element.
 *
 * @param {HTMLElement} element The element to add the listener to.
 * @param {string} eventName The name of the event to listen for.
 * @param {Function} callback The method to be called when the event occurs.
 * @param {boolean=false} capture Configuration for the event listener.
 *
 * @returns {boolean} The method returns true when the listener was added;
 *          otherwise the method returns false.
 */
function addListener(element, eventName, callback, capture = false) {
	return eventRegistration(registrationMethod.add, element, eventName, callback, capture);
}

/**
 *
 *
 * @param {string} query
 * @param {HTMLElement} eventName
 * @param {Function} callback
 * @param {HTMLElement} [scope=document]
 */
function addListenerByQuery(query, eventName, callback, scope = document.body) {
	if (
		!isString(query) ||
		!isString(eventName) ||
		!isFunction(callback) ||
		!isElement(scope)
	) {
		return false;
	}

	const
		elements = performQueryAll(query, scope);

	forEach(elements, element => element.addEventListener(eventName, callback));
}

/**
 * Adds an event listener on an element which will only be called once. After
 * the listener is called it will be removed from the element.
 *
 * @param {HTMLElement} element The element to add the listener to.
 * @param {string} eventName The name of the event to listen for.
 * @param {Function} callback The method to be called when the event occurs.
 *
 * @returns {boolean|Function} When not all the parameters have been supplied
 *          the method will return false. When the result is true the listener
 *          has been added and the user agent has native support for adding a
 *          listener which triggers only once. In this case the listener can be
 *          removed through the removeListener method.
 *          When the method returns a method the listener was added but the user
 *          agent doesn't have native support. To remove the registered listener
 *          call the returned method. This will remove the listener from the
 *          element.
 */
function addOnce(element, eventName, callback) {
	if (
		!isElement(element) ||
		!isString(eventName) ||
		!isFunction(callback)
	) {
		return false;
	}

	if (supportedOptions.once) {
		element.addEventListener(eventName, callback, {
			once: true
		});

		return true;
	}

	/**
	 * Removes the intermediate event handler.
	 */
	function removeListener() {
		element.removeEventListener(eventName, handler);
	}

	/**
	 * Intermediate function to handle the event. It will call the original
	 * callback method and removes the intermediate event handler, creating in
	 * essence an event handler that will be called only once.
	 *
	 * @param {Event} event
	 */
	function handler(event) {
		callback(event);
		removeListener();
	}

	element.addEventListener(eventName, handler);

	return removeListener;
}

/**
 * Dispatches a custom event from the specified element.
 *
 * @param {HTMLElement} element The element to dispatch the event from.
 * @param {string} eventName The name of the event, this cannot be empty.
 * @param {Object} [details=null] This parameter can be used to pass custom data
 *        along with the event. It will override whatever detail might be set
 *        in the configuration object.
 * @param {EventConfig} [configuration={}] The configuration for the event, it
 *        can be used to alter the bubbling or cancelable nature of the event.
 *        Configuration options which are left out will fallback to the default
 *        configuration. Any details passed along in this object will be
 *        overriden when the detail param has a value other than null/undefined.
 *
 * @returns {null|CustomEvent} The method will return the instance of
 *          CustomEvent which was dispatched. When not all of the required
 *          parameters were supplied, the method will return null.
 */
function dispatchCustomEvent(element, eventName, detail = null, configuration = {}) {
	// We need an element and event name in order to be able to continue.
	if (
		element == null ||
		(eventName == null || eventName === '')
	) {
		return null;
	}

	if (isNil(configuration)) {
		configuration = {};
	}

	// When a detail object has been provided, add it to the configuration.
	if (!isNil(detail)) {
		// Use merge to ensure there is a configuration object to place the
		// details into.
		configuration = merge(
			configuration,
			{ detail }
		)
	}

	// Create the custom event which we will dispatch.
	const
		customEvent = createCustomEvent(eventName, configuration);
	element.dispatchEvent(customEvent);

	// Return the custom event.
	return customEvent;
}

/**
 * Removes an event listener on an element.
 *
 * @param {HTMLElement} element The element to remove the listener from.
 * @param {string} eventName The name of the event to remove the listener for.
 * @param {Function} callback The method to be removed.
 * @param {boolean=false} capture Configuration which was used when the listener
 *        was added.
 *
 * @returns {boolean} The method returns true when the listener was removed;
 *          otherwise the method returns false.
 */
function removeListener(element, eventName, callback, capture = false) {
	return eventRegistration(registrationMethod.remove, element, eventName, callback, capture);
}



/* ========================================================================== *\
	FEATURE TESTING
\* ========================================================================== */

/**
 * Handles the event which is dispatched to detect which features are supported
 * in the user agent. It will call preventDefault on the event to test if
 * custom events will properly return their default prevented status.
 *
 * @param {CustomEvent} event
 *
 * @private
 */
function onTestEventReceived(event) {
	event.preventDefault();
}

/**
 *
 *
 */
function testListenerOptions() {
	const
		// Generate a random event name which is unlikely to conflict with any
		// other event.
		testEventName = `ev__test__${new Date().getTime()}`,
		config = {};

	// Create a property getter for each of the event listener options to test.
	// When the user agent access the property to configure the listener the
	// property will set the support flag to true. This way we can tell which
	// options are supported by the user agent.
	forEach(supportedOptions, (value, option) => {
		Object.defineProperty(config, option, {
			get: () => supportedOptions[option] = true
		});
	});

	try {
		// Add a listener for the test event, pass along the special config
		// object so we can detect which options are supported by the
		// user agent.
		document.body.addEventListener(testEventName, null, config);
		document.body.removeEventListener(testEventName, null, config);
	} catch (err) {
		// There is nothing we can do with the error, ignore it.
	}
}

/**
 * Runs tests to see if there any patchable problems with the way the user agent
 * handles custom events.
 *
 * @private
 */
function testPatchableFeatures() {
	const
		// Generate a random event name which is unlikely to conflict with any
		// other event.
		testEventName = `ev__test__${new Date().getTime()}`,
		config = {};

	if (supportedOptions.passive) {
		config.passive = false;
	}
	try {
		// Add a listener for the test event, make sure the listener is not
		// passive or else Chrome will throw an error.
		document.body.addEventListener(testEventName, onTestEventReceived, config);
		// Dispatch the test event, make sure it can be cancelled.
		const
			event = dispatchCustomEvent(document.body, testEventName, null, {
				cancelable: true
			});

		// Read the defaultPrevented property from the custom event. When it is
		// false it means we have to monkey patch the default prevented
		// mechanism for custom events.
		needsPatching.preventDefault = !event.defaultPrevented;
		document.body.removeEventListener(testEventName, onTestEventReceived, config);
	} catch (err) {
		// There is nothing we can do with the error, ignore it.
	}
}

/**
 * This method will perform feature tests to determine which features of the
 * event handling mechanism are supported by the user agent and if anything
 * needs to be monkey patched.
 *
 * @private
 */
function performFeatureTests() {
	// It is not possible to test listener support and patchable features in the
	// same method. The listener support test sets passive to true when it is
	// supported and Chrome throws an error when trying to call prevent default
	// for passively handled events.
	testListenerOptions();
	testPatchableFeatures();
}

// This method functions a bit like a static constructor. It will automatically
// be run when the module is included and tests which features are available in
// the user agent.
performFeatureTests();



/* ========================================================================== *\
	EXPORTS
\* ========================================================================== */

export {
	addListener,
	addListenerByQuery,
	addOnce,
	dispatchCustomEvent,
	removeListener
};
