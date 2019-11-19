/* ========================================================================== *\
	IMPORTS
\* ========================================================================== */
import isElement from 'lodash/isElement.js';



/* ========================================================================== *\
	PRIVATE VARIABLES
\* ========================================================================== */
const
	instanceMap = new WeakMap(),

	propertyKey = {
		baseElement: Symbol('baseElement')
	};



/* ========================================================================== *\
	PUBLIC API
\* ========================================================================== */
class VisualComponent {
	/* ====================================================================== *\
		CONSTRUCTOR
	\* ====================================================================== */
	constructor(baseElement) {
		if (!isElement(baseElement)) {
			throw 'Unable to create instance of visual component, no base element has been provided';
		}

		this[propertyKey.baseElement] = baseElement;
	}



	/* ====================================================================== *\
		STATIC METHODS
	\* ====================================================================== */

	/**
	 *
	 * @param {HTMLElement} element
	 *
	 * @static
	 */
	static getInstanceForElement(element) {
		if (!isElement(element)) {
			return null;
		}

		if (instanceMap.has(element)) {
			return instanceMap.get(element);
		}

		const instance = new this(element);
		if (instance === null) {
			return null;
		}

		instanceMap.set(element, instance);

		return instance;
	}



	/* ====================================================================== *\
		INSTANCE PROPERTIES
	\* ====================================================================== */

	/**
	 * @type {HTMLElement}
	 *
	 * @readonly
	 * @memberof VisualComponent
	 */
	get baseElement() {
		return this[propertyKey.baseElement];
	}
}



/* ========================================================================== *\
	EXPORTS
\* ========================================================================== */

export default VisualComponent;
