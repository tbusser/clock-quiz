/* ========================================================================== *\
	IMPORTS
\* ========================================================================== */
import { getRandomItem } from '../01-utilities/array';
import { addListener } from '../01-utilities/event-manager';
import { dispatchCustomEvent } from '../01-utilities/event-manager';



/* ========================================================================== *\
	PRIVATE VARIABLES
\* ========================================================================== */
const
	featureName = 'result',
	baseSelector = `.js-${ featureName }`,

	cssClass = {
		active: 'is-active'
	},

	datasetKey = {
		feedbackType: 'feedbackType'
	},

	emoji = {
		correct: ['👍', '😻', '🤡', '🥳', '🦄'],
		incorrect: ['👎', '😢', '💩']
	},

	eventName = {
		feedbackShown: 'feedbackshown'
	},

	feedbackType = {
		negative: 'negative',
		positive: 'positive'
	},

	selector = {
		base: `${ baseSelector }`,
		label: `${ baseSelector }__label`
	};


/** @type {HTMLElement} */
let baseElement = null;
/** @type {HTMLElement} */
let labelElement = null;


/* ========================================================================== *\
	EVENT HANDLING
\* ========================================================================== */
/**
 *
 */
function bindEvents() {
	baseElement.addEventListener('animationend', event => {
		baseElement.classList.remove('is-active');
		dispatchCustomEvent(baseElement, eventName.feedbackShown, {
			isPositive: baseElement.dataset[datasetKey.feedbackType] === feedbackType.positive
		});
	});
}



/* ========================================================================== *\
	PRIVATE METHODS
\* ========================================================================== */
/**
 *
 * @param {string[]} possibleEmoji
 */
function showResult(possibleEmoji) {
	if (labelElement === null) {
		return;
	}

	labelElement.textContent = getRandomItem(possibleEmoji);
	baseElement.classList.add(cssClass.active);
}



/* ========================================================================== *\
	EXPORTS
\* ========================================================================== */
/**
 *
 * @param {Function} callback
 */
export function onFeedbackShown(callback) {
	if (baseElement === null) {
		return;
	}

	addListener(baseElement, eventName.feedbackShown, callback);
}

/**
 *
 */
export function showPositiveFeedback() {
	baseElement.dataset[datasetKey.feedbackType] = feedbackType.positive;
	showResult(emoji.correct);
}

/**
 *
 */
export function showNegativeFeedback() {
	baseElement.dataset[datasetKey.feedbackType] = feedbackType.negative;
	showResult(emoji.incorrect);
}


/* ========================================================================== *\
	INITIALIZATION
\* ========================================================================== */
/**
 * Initializes the module, assumes there is only 1 instance of the result widget
 * in the document.
 */
function init() {
	baseElement = document.querySelector(selector.base);

	if (baseElement !== null) {
		labelElement = baseElement.querySelector(selector.label);
	}

	bindEvents();
}

init();
