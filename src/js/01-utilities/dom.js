/* ========================================================================== *\
	IMPORTS
\* ========================================================================== */
import isElement from 'lodash/isElement';
import isNil from 'lodash/isNil';



/* ========================================================================== *\
	PUBLIC API
\* ========================================================================== */

/**
 * Adds or removes one or more CSS classed based on the result of a
 * predicate method.
 *
 * @param {HTMLElement} element The element whose CSS class assignment should be
 *        updated.
 * @param {Function} predicate A method which returns a boolean. When the result
 *        is true the provided class(es) will be added to the element, otherwise
 *        the class(es) will be removed.
 * @param {...string} classes The CSS class(es) to add or remove.
 */
function classByPredicate(element, predicate, ...classes) {
	if (
		!isElement(element)
	) {
		return;
	}

	const
		methodName = (predicate())
			? 'add'
			: 'remove';

	element.classList[methodName](...classes);
}

/**
 *
 * @param {string} selector A valid CSS selector.
 * @param {HTMLElement} [scope=document] The element in the DOM to use as a
 *        scope for the selector. When no scope it specified it will use
 *        the document.
 *
 * @returns {HTMLElement} The result is the first element matching the query for
 *          the provided scope. When there is no matching element the result is
 *          null. In case the query was an invalid CSS selector the result
 *          is undefined.
 */
function performQuery(selector, scope = document) {
	try {
		return scope.querySelector(selector);
	} catch (exception) {
		return undefined;
	}
}

/**
 *
 * @param {string} selector A valid CSS selector.
 * @param {HTMLElement} [scope=document] The element in the DOM to use as a
 *        scope for the selector. When no scope it specified it will use
 *        the document.
 *
 * @returns {NodeList} The result is a NodeList with all the elements in the
 *          scope which match the provided selector. In case the selector was an
 *          invalid CSS selector result is an empty array.
 */
function performQueryAll(selector, scope = document) {
	try {
		return scope.querySelectorAll(selector);
	} catch (exception) {
		return [];
	}
}

/**
 * Returns the first ancestor of an element which matches a provided
 * CSS selector.
 *
 * @param {HTMLElement} startElement The element to start with.
 * @param {string} selector A valid CSS selector.
 * @param {HTMLElement} [scope=document.body] The last element in the
 *        descendant tree to check. This can be used to prevent the method from
 *        evaluating all the element all the way up to the body element.
 *
 * @returns {HTMLElement|null} Returns null when the start element is not
 *          contained in the scope or when no ancestor of the start element
 *          matches the selector. Otherwise the result is the first ancestor of
 *          the start element which matches the selector.
 */
function queryAncestor(startElement, selector, scope = document.body) {
	let element = startElement;

	// When the start element is not contained by the scope and it is not the
	// scope element itself, the result is always null.
	if (!scope.contains(element)) {
		return null;
	}

	// Keep going up one level in the ancestor tree until one of the
	// following is true:
	// - The current element matches the query.
	// - The current element is the end element.
	// - The top element in the document has been processed.
	do {
		// Check if the current element matches the query, if it does
		// the current element is the result of the method.
		if (element.matches(selector)) {
			return element;
		}

		// If the current element is the end element, all the relevant ancestors
		// have been checked and none matched. Set the current element to null
		// to exit the while loop. If the current element is not the end
		// element, travel up one level to the next ancestor.
		element = (element === scope)
			? null
			: element.parentElement;
	} while (!isNil(element));

	// None of the ancestors matched the query, return null.
	return null;
}


/* ========================================================================== *\
	EXPORTS
\* ========================================================================== */

export {
	classByPredicate,
	performQuery,
	performQueryAll,
	queryAncestor
};
