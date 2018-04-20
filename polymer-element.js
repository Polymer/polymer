import { ElementMixin } from './lib/mixins/element-mixin.js';
import { html as html$0 } from './lib/utils/html-tag.js';

/**
 * Base class that provides the core API for Polymer's meta-programming
 * features including template stamping, data-binding, attribute deserialization,
 * and property change observation.
 *
 * @customElement
 * @polymer
 * @memberof Polymer
 * @constructor
 * @implements {Polymer_ElementMixin}
 * @extends HTMLElement
 * @appliesMixin Polymer.ElementMixin
 * @summary Custom element base class that provides the core API for Polymer's
 *   key meta-programming features including template stamping, data-binding,
 *   attribute deserialization, and property change observation
 */
const Element = ElementMixin(HTMLElement);

/**
 * @constructor
 * @implements {Polymer_ElementMixin}
 * @extends {HTMLElement}
 */
export { Element as PolymerElement };

// NOTE: this is here for modulizer to export `html` for the module version of this file
export { html$0 as html };
