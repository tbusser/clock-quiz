/* ========================================================================== *\
	TYPE DEFINITIONS
\* ========================================================================== */
/**
 * @typedef {Object} Time
 *
 * @property {number} hour
 * @property {number} minute
 */

/* ========================================================================== *\
	PRIVATE VARIABLES
\* ========================================================================== */
const
	partText = {
		half: 'half',
		quart: 'kwart'
	},

	relationText = {
		before: 'voor',
		beforeHalf: 'voor half',
		beforeHalfAbbreviated: 'vh',
		hour: 'uur',
		past: 'over',
		pastHalf: 'over half',
		pastHalfAbbreviated: 'oh'
	},

	regexTime = /(?<fullHour>\w+)\suur|(?<minute>\w+)\s(?:(?<relation>over half|voor half|half|over|voor|oh|vh)\s)?(?<hour>\w+)/i,

	numbersAsText = ['een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf', 'dertien', 'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien', 'twintig', 'eenentwintig'];



/* ========================================================================== *\
	PRIVATE METHODS
\* ========================================================================== */
/**
 * Converts a part from the input to its numeric equivalent.
 *
 * @param {string} part The part to convert
 *
 * @returns {number} Returns the numeric equivalent of the part. In case the
 *          part is unknown it will default to 0.
 */
function partToNumber(part) {
	const
		numericValue = parseInt(part, 10);
	if (!isNaN(numericValue)) {
		return numericValue;
	}

	switch (part) {
	case partText.half:
		return 30;

	case partText.quart:
		return 15;

	default:
		return (numbersAsText.indexOf(part) + 1);
	}
}

/**
 *
 * @param {string} hour
 * @param {string} relation
 *
 * @returns {number}
 */
function relativeHourPartToAbsoluteHour(hour, relation) {
	const
		numericHour = partToNumber(hour);

	switch (relation) {
	case relationText.hour:
	case relationText.past:
		return numericHour;

	default:
		return (numericHour - 1) || 12;
	}
}

/**
 *
 * @param {string} hour
 * @param {string} relation
 *
 * @returns {number}
 */
function relativeMinutePartToAbsoluteMinute(minute, relation) {
	const
		numericValue = partToNumber(minute);

	switch (relation) {
	case relationText.before:
		return 60 - numericValue;

	case relationText.beforeHalf:
	case relationText.beforeHalfAbbreviated:
		return 30 - numericValue;

	case relationText.pastHalf:
	case relationText.pastHalfAbbreviated:
		return 30 + numericValue;
	}

	return numericValue;
}



/* ========================================================================== *\
	PUBLIC API
\* ========================================================================== */
/**
 * @property {string} text
 *
 * @returns {Time} Returns an object with the hour and minute as derived from
 *          the provided text.
 */
function convertTextToTime(text) {
	const
		lowercaseText = text.toLowerCase(),
		{ groups: { fullHour, minute, relation, hour} } = regexTime.exec(lowercaseText),
		backupRelation = (fullHour) ? relationText.hour : minute;

	return {
		hour: relativeHourPartToAbsoluteHour(fullHour || hour, relation || backupRelation),
		minute: relativeMinutePartToAbsoluteMinute(minute, relation)
	};
}



/* ========================================================================== *\
	EXPORTS
\* ========================================================================== */
export {
	convertTextToTime
};
