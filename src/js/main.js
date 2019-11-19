/* ========================================================================== *\
	IMPORTS
\* ========================================================================== */
import { convertTextToTime } from './01-utilities/text-to-time.js';
import { onAnswerGiven as subscribeOnAnswerGiven, resetInput } from './04-domain/answer-form.js';
import './04-domain/quick-type.js';
import { getClockForElement } from './04-domain/clock.js';
import {
	onFeedbackShown as subscribeFeedbackShown,
	showNegativeFeedback,
	showPositiveFeedback
} from './04-domain/result.js';



/* ========================================================================== *\
	PRIVATE VARIABLES
\* ========================================================================== */
const
	selector = {
		clock: '.js-clock'
	},

	clock = getClockForElement(document.querySelector(selector.clock));



/* ========================================================================== *\
	EVENT HANDLING
\* ========================================================================== */
/**
 *
 */
function bindEvents() {
	subscribeOnAnswerGiven(onAnswerGiven);
	subscribeFeedbackShown(onFeedbackShown);
}

/**
 *
 * @param {*} event
 */
function onAnswerGiven(event) {
	const
		givenAnswer = event.detail.answer,
		givenTime = convertTextToTime(givenAnswer),
		expectedTime = clock.currentTime;

	if (givenTime.hour === 12) {
		 givenTime.hour = 0;
	}
	if (expectedTime.hour === 12) {
		expectedTime.hour = 0;
	}

	if (givenTime.hour !== expectedTime.hour || givenTime.minute !== expectedTime.minute) {
		showNegativeFeedback();

		return;
	}

	showPositiveFeedback();
}

/**
 *
 * @param {CustomEvent} event
 */
function onFeedbackShown(event) {
	resetInput();

	if (!event.detail.isPositive) {
		return;
	}

	setRandomTime();
}



/* ========================================================================== *\
	PRIVATE METHODS
\* ========================================================================== */
/**
 *
 */
function setRandomTime() {
	if (clock === null) {
		return;
	}

	clock.setRandomTime();
}



/* ========================================================================== *\
	INITIALIZATION
\* ========================================================================== */
/**
 *
 */
function init() {
	bindEvents();
	setRandomTime();
}

if (clock !== null) {
	init();
}
