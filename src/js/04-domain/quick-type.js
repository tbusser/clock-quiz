/* ========================================================================== *\
	IMPORTS
\* ========================================================================== */
import {
	addListenerByQuery
} from '../01-utilities/event-manager.js';
import { queryAncestor } from '../01-utilities/dom.js';



/* ========================================================================== *\
	PRIVATE METHODS
\* ========================================================================== */
const
	featureName = 'quick-type',
	baseSelector = `.js-${ featureName }`,

	dataKey = {
		value: 'value'
	},

	selector = {
		base: `${ baseSelector }`,
		input: `${ baseSelector }__input`,
		item: `${ baseSelector }__item`
	};

let
	restoreFocus = false;



/* ========================================================================== *\
	EVENT HANDLING
\* ========================================================================== */
/**
 *
 * @param {HTMLElement} baseElement
 */
function bindEvents(baseElement) {
	addListenerByQuery(selector.input, 'blur', onInputBlurred, baseElement);
	baseElement.addEventListener('click', onBaseElementClicked);
}

/**
 *
 * @param {Event} event
 */
function onBaseElementClicked(event) {
	const
		button = queryAncestor(event.target, selector.item);
	if (button === null) {
		return;
	}

	appendTextToInput(button.dataset[dataKey.value], event.currentTarget);
}

/**
 *
 * @param {FocusEvent} event
 */
function onInputBlurred(event) {
	// When the element which will receive the focus is one of the quick type
	// items, the focus should be restored to the input after appending text.
	restoreFocus = (queryAncestor(event.relatedTarget, selector.item) !== null);
}



/* ========================================================================== *\
	PRIVATE METHODS
\* ========================================================================== */
/**
 *
 * @param {string} text
 * @param {HTMLElement} baseElement
 */
function appendTextToInput(text, baseElement) {
	// Get the input to append the text to.
	const
		input = baseElement.querySelector(selector.input);
	if (input === null) {
		return;
	}

	// Append the text to the value already in the input
	input.value = `${input.value.trim()} ${text} `;

	// Check if focus to the input should be restored.
	if (restoreFocus) {
		restoreFocus = false;
		input.focus();
	}
}


/* ========================================================================== *\
	INITIALIZATION
\* ========================================================================== */
/**
 * Initializes the widget.
 */
function init() {
	const
		baseElement = document.querySelector(selector.base);
	if (baseElement === null) {
		return;
	}

	bindEvents(baseElement);
}

init();
