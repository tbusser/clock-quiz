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



/* ========================================================================== *\
	PUBLIC API
\* ========================================================================== */
/**
 *
 * @param {*} array
 */
function getRandomItem(array) {
	if (
		!Array.isArray(array) ||
		array.length === 0
	) {
		return undefined;
	}

	const
		randomIndex = generateRandomInt(array.length - 1);

	return array[randomIndex];
}



/* ========================================================================== *\
	EXPORTS
\* ========================================================================== */
export {
	getRandomItem
}
