/* ========================================================================== *\
	IMPORTS
\* ========================================================================== */
import VisualComponent from '../utilities/visual-component.js';



/* ========================================================================== *\
	PRIVATE VARIABLES
\* ========================================================================== */
const
	featureName = 'clock',
	baseSelector = `.js-${ featureName }`,

	propertyKey = {
		time: Symbol('time')
	},

	selector = {
		base: `${ baseSelector }`,
		handHour: `${ baseSelector }__hour-hand`,
		handMinute: `${ baseSelector }__minute-hand`
	};



/* ========================================================================== *\
	PRIVATE METHODS
\* ========================================================================== */
/**
 * Generates a random int between a provided min and max number.
 *
 * @param {Number} max The greatest possible number to return.
 * @param {Number} [min=0] Optional param to specify the smallest number to
 *        return. By default this is 0.
 *
 * @returns {Number} A random number between the min and max value (inclusive).
 */
function generateRandomInt(max, min = 0) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @returns {Object}
 */
function generateRandomTime() {
	return {
		hour: generateRandomInt(11),
		minute: Math.floor(generateRandomInt(59) / 5) * 5
	}
}

/**
 * @this Clock
 */
function setMinuteHand(minute) {
	const
		rotation = (360 / 60) * minute,
		minuteHand = this.baseElement.querySelector(selector.handMinute);
	if (minuteHand === null) {
		return;
	}

	minuteHand.style.transform = `rotate(${ rotation }deg)`;
}

/**
 *
 * @param {*} time
 */
function setHourHand(time) {
	const
		rotationHour = (360 / 12) * time.hour,
		rotationHourFraction = (360 / 12) * (time.minute/ 60),
		rotation = rotationHour + rotationHourFraction,
		hourHand = this.baseElement.querySelector(selector.handHour);
	if (hourHand === null) {
		return;
	}

	hourHand.style.transform = `rotate(${ rotation }deg)`;
}



/* ========================================================================== *\
	PUBLIC API
\* ========================================================================== */
class Clock extends VisualComponent{
	/* ====================================================================== *\
		CONSTRUCTOR
	\* ====================================================================== */
	/**
	 * @param {HTMLElement} baseElement
	 */
	constructor(baseElement) {
		super(baseElement)
	}



	/* ====================================================================== *\
		INSTANCE PROPERTIES
	\* ====================================================================== */
	get currentTime() {
		return this[propertyKey.time];
	}
	set currentTime(time) {
		this[propertyKey.time] = time;

		setMinuteHand.call(this, time.minute);
		setHourHand.call(this, time);
	}



	/* ====================================================================== *\
		PUBLIC METHODS
	\* ====================================================================== */
	setRandomTime() {
		this.currentTime = generateRandomTime();
	}
}



/* ========================================================================== *\
	EXPORTS
\* ========================================================================== */

export const getClockForElement = (element) => Clock.getInstanceForElement(element);
