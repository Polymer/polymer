import { LegacyElementMixin } from './lib/legacy/legacy-element-mixin.js';
import './lib/legacy/polymer-fn.js';
import './lib/legacy/templatizer-behavior.js';
import './lib/elements/dom-bind.js';
import './lib/elements/dom-repeat.js';
import './lib/elements/dom-if.js';
import './lib/elements/array-selector.js';
import './lib/elements/custom-style.js';
import './lib/legacy/mutable-data-behavior.js';
import { html as html$0 } from './lib/utils/html-tag.js';

// bc
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/* template elements */
/* custom-style */
/* bc behaviors */
/* import html-tag to export html */
export const Base = LegacyElementMixin(HTMLElement).prototype;

// NOTE: this is here for modulizer to export `html` for the module version of this file
export { html$0 as html };
