/* ========================================================================== *\
	IMPORTS
\* ========================================================================== */
import {
	addListener,
	dispatchCustomEvent
} from '../01-utilities/event-manager';



/* ========================================================================== *\
	PRIVATE VARIABLES
\* ========================================================================== */
const
	featureName = 'answer-form',
	baseSelector = `.js-${ featureName }`,

	eventName = {
		answered: 'answered'
	},

	selector = {
		base: `${ baseSelector }`,
		input: `${ baseSelector }__input`
	};

let baseElement = null;



/* ========================================================================== *\
	EVENT HANDLING
\* ========================================================================== */
/**
 *
 * @param {HTMLElement} baseElement
 */
function bindEvents(baseElement) {
	baseElement.addEventListener('submit', onFormSubmitted);
}

/**
 * Handles the form submit event. When the user has entered a value it will be
 * published using the answered event.
 *
 * @param {Event} event
 */
function onFormSubmitted(event) {
	event.preventDefault();

	// Get the input element from the form.
	const
		input = event.target.querySelector(selector.input);
	if (input === null) {
		return;
	}

	// Make sure the input has a value, an empty input should NOT trigger the
	// answered event.
	const answer = input.value.trim();
	if (answer === '') {
		return;
	}

	dispatchCustomEvent(baseElement, eventName.answered, {
		answer: input.value
	});
}



/* ========================================================================== *\
	EXPORTS
\* ========================================================================== */
/**
 * Register a method to be called when the user has submitted an answer.
 *
 * @param {Function} callback
 */
export function onAnswerGiven(callback) {
	addListener(baseElement, eventName.answered, callback);
}

/**
 *
 */
export function resetInput() {
	if (baseElement === null) {
		return;
	}

	const
		input = baseElement.querySelector(selector.input);
	if (input === null) {
		return;
	}

	input.value = '';
}



/* ========================================================================== *\
	INITIALIZATION
\* ========================================================================== */
/**
 * Initializes the widget.
 */
function init() {
	baseElement = document.querySelector(selector.base);
	if (baseElement === null) {
		return;
	}

	bindEvents(baseElement);
}

init();
