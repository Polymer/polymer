/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '../utils/boot.js';

import { isPath } from '../utils/path.js';
import { dedupingMixin } from '../utils/mixin.js';
import { PropertyEffects } from './property-effects.js';

/**
 * The open and corresponding closing brackets for surrounding bindings.
 * @enum {string}
 */
const BINDINGS = {
  '{': '}',
  '[': ']'
};

/**
 * All states that the parser can be in. The states represent the state-machine as a whole.
 * @enum {number}
 */
const STATE = {
  INITIAL: 1,
  FIRSTOPENINGBINDING: 2,
  FIRSTCHARACTERBINDING: 3,
  BINDING: 4,
  FIRSTCOLON: 5,
  COLONNOTIFYEVENT: 6,
  COLONNOTIFYEVENTFIRSTCLOSINGBINDING: 7,
  FIRSTCLOSINGBINDING: 8,
  STRING: 9,
  METHOD: 10,
  STRINGARG: 11,
  NUMBERARG: 12,
  VARIABLEARG: 13,
  METHODCLOSED: 14,
  METHODCLOSEDBINDING: 15
};

function pushLiteral(text, i, parts, startChar) {
  const literal = text.substring(startChar || 0, i);
  if (literal) {
    parts.push({
      literal
    });
  }
}

function storeMethod(bindingData, templateInfo) {
  const methodName = bindingData.signature.methodName;
  const dynamicFns = templateInfo.dynamicFns;
  if (dynamicFns && dynamicFns[methodName] || bindingData.signature.static) {
    bindingData.dependencies.push(methodName);
    bindingData.signature.dynamicFn = true;
  }
}

function storeVariableBinding(parts, bindingData, prop, i) {
  bindingData.source = prop;
  bindingData.dependencies.push(prop);
  bindingData.startChar = i + 1;
  parts.push(bindingData);
}

function storeMethodVariable(bindingData, text, i) {
  const name = text.substring(bindingData.startChar, i).trim();
  if (name) {
    if (name === 'true' || name === 'false') {
      bindingData.signature.args.push({
        name,
        value: name == 'true',
        literal: true
      });
    } else {
      const arg = {
        name
      };
      arg.structured = isPath(name);
      if (arg.structured) {
        arg.wildcard = (name.slice(-2) == '.*');
        if (arg.wildcard) {
          arg.name = name.slice(0, -2);
        }
      }
      bindingData.signature.args.push(arg);
      bindingData.dependencies.push(name);
      bindingData.signature.static = false;
    }
  }
}

function storeMethodNumber(bindingData, text, i) {
  const value = text.substring(bindingData.startChar, i).trim();
  bindingData.signature.args.push({
    name: value,
    value: Number(value),
    literal: true
  });
}

/**
 * Mixin that parses binding expressions and generates corresponding metadata.
 * The implementation is different than in `property-effects`, as it uses a
 * state machine instead of a regex. As such, this implementation is able to
 * handle more cases, with the potential performance hit.
 *
 * @mixinFunction
 * @appliesMixin PropertyEffects
 * @polymer
 * @summary Mixin that parses binding expressions and generates corresponding metadata.
 */
const StrictBindingParser = dedupingMixin((base) => {

  /**
   * @constructor
   * @extends {base}
   * @implements {Polymer_PropertyEffects}
   */
  const elementBase = PropertyEffects(base);

  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_PropertyEffects}
   */
  return class extends elementBase {

    /**
     * Called to parse text in a template (either attribute values or
     * textContent) into binding metadata.
     *
     * Any overrides of this method should return an array of binding part
     * metadata  representing one or more bindings found in the provided text
     * and any "literal" text in between.  Any non-literal parts will be passed
     * to `_evaluateBinding` when any dependencies change.  The only required
     * fields of each "part" in the returned array are as follows:
     *
     * - `dependencies` - Array containing trigger metadata for each property
     *   that should trigger the binding to update
     * - `literal` - String containing text if the part represents a literal;
     *   in this case no `dependencies` are needed
     *
     * Additional metadata for use by `_evaluateBinding` may be provided in
     * each part object as needed.
     *
     * The default implementation handles the following types of bindings
     * (one or more may be intermixed with literal strings):
     * - Property binding: `[[prop]]`
     * - Path binding: `[[object.prop]]`
     * - Negated property or path bindings: `[[!prop]]` or `[[!object.prop]]`
     * - Two-way property or path bindings (supports negation):
     *   `{{prop}}`, `{{object.prop}}`, `{{!prop}}` or `{{!object.prop}}`
     * - Inline computed method (supports negation):
     *   `[[compute(a, 'literal', b)]]`, `[[!compute(a, 'literal', b)]]`
     *
     * @param {string} text Text to parse from attribute or textContent
     * @param {Object} templateInfo Current template metadata
     * @return {Array<!BindingPart>} Array of binding part metadata
     * @protected
     */
    static _parseBindings(text, templateInfo) {
      const parts = [];
      let bindingData = {};
      let escaped = false;
      /** @type {string} */
      let quote;
      /** @type {number} */
      let state = STATE.INITIAL;
      let i,l;

      for (i=0,l=text.length; i<l; i++) {
        const char = text.charAt(i);
        switch (state) {
          case STATE.INITIAL: {
            if ((char === '{' || char === '[')) {
              bindingData = {
                mode: char,
                dependencies: [],
                startChar: bindingData.startChar
              };
              state = STATE.FIRSTOPENINGBINDING;
            }
            break;
          }
          case STATE.FIRSTOPENINGBINDING: {
            if (char === bindingData.mode) {
              pushLiteral(text, i - 1, parts, bindingData.startChar);
              bindingData.startChar = i + 1;
              state = STATE.FIRSTCHARACTERBINDING;
            } else {
              bindingData = {};
              state = STATE.INITIAL;
            }
            break;
          }
          case STATE.FIRSTCHARACTERBINDING: {
            if (char !== ' ' && char !== '\t' && char !== '\n') {
              if (char === '!') {
                bindingData.negate = true;
                bindingData.startChar = i + 1;
              }
              state = STATE.BINDING;
            }
            break;
          }
          case STATE.BINDING: {
            switch (char) {
              case BINDINGS[bindingData.mode]: {
                state = STATE.FIRSTCLOSINGBINDING;
                break;
              }
              case '\'':
              case '"': {
                quote = char;
                state = STATE.STRING;
                break;
              }
              case '(': {
                bindingData.signature = {
                  methodName: text.substring(bindingData.startChar, i).trim(),
                  args: [],
                  static: true
                };
                bindingData.startChar = i + 1;
                state = STATE.METHOD;
                break;
              }
              case ':': {
                state = STATE.FIRSTCOLON;
              }
            }
            break;
          }
          case STATE.FIRSTCOLON: {
            if (char === ':') {
              bindingData.customEvent = true;
              bindingData.startCharAfterColon = i + 1;
              state = STATE.COLONNOTIFYEVENT;
            } else {
              state = STATE.BINDING;
            }
            break;
          }
          case STATE.COLONNOTIFYEVENT: {
            if (char === BINDINGS[bindingData.mode]) {
              state = STATE.COLONNOTIFYEVENTFIRSTCLOSINGBINDING;
            }
            break;
          }
          case STATE.COLONNOTIFYEVENTFIRSTCLOSINGBINDING: {
            if (char === BINDINGS[bindingData.mode]) {
              bindingData.event = text.substring(bindingData.startCharAfterColon, i - 1).trim();
              const prop = text.substring(bindingData.startChar, bindingData.startCharAfterColon - 2).trim();
              storeVariableBinding(parts, bindingData, prop, i);
              state = STATE.INITIAL;
            } else {
              state = STATE.BINDING;
            }
            break;
          }
          case STATE.FIRSTCLOSINGBINDING: {
            if (char === BINDINGS[bindingData.mode]) {
              const prop = text.substring(bindingData.startChar, i - 1).trim();
              storeVariableBinding(parts, bindingData, prop, i);
              state = STATE.INITIAL;
            } else {
              state = STATE.BINDING;
            }
            break;
          }
          case STATE.STRING: {
            if (char === '\\') {
              escaped = true;
            } else if (char === quote && !escaped) {
              state = STATE.BINDING;
            } else {
              escaped = false;
            }
            break;
          }
          case STATE.METHOD: {
            switch (char) {
              case ')': {
                storeMethodVariable(bindingData, text, i);
                storeMethod(bindingData, templateInfo);
                bindingData.startChar = i + 1;
                state = STATE.METHODCLOSED;
                break;
              }
              case ',': {
                storeMethodVariable(bindingData, text, i);
                bindingData.startChar = i + 1;
                break;
              }
              case '\'':
              case '"': {
                quote = char;
                state = STATE.STRINGARG;
                break;
              }
              default: {
                if (char >= '0' && char <= '9' || char === '-') {
                  state = STATE.NUMBERARG;
                } else if (char != ' ' && char != '\n') {
                  state = STATE.VARIABLEARG;
                }
              }
            }
            break;
          }
          case STATE.STRINGARG: {
            if (char === '\\') {
              escaped = true;
            } else if (char === quote && !escaped) {
              const value = text.substring(bindingData.startChar, i)
                  .replace(/^\s+/, '')
                  .substring(1)
                  // replace comma entity with comma
                  .replace(/&comma;/g, ',')
                  // repair extra escape sequences; note only commas strictly need
                  // escaping, but we allow any other char to be escaped since its
                  // likely users will do this
                  .replace(/\\(.)/g, '\$1');
              bindingData.signature.args.push({
                value,
                name: value,
                literal: true
              });
              bindingData.startChar = i + 1;
              state = STATE.METHOD;
            } else {
              escaped = false;
            }
            break;
          }
          case STATE.NUMBERARG: {
            switch (char) {
              case ',': {
                storeMethodNumber(bindingData, text, i);
                bindingData.startChar = i + 1;
                state = STATE.METHOD;
                break;
              }
              case ')': {
                storeMethodNumber(bindingData, text, i);
                storeMethod(bindingData, templateInfo);
                state = STATE.METHODCLOSED;
                break;
              }
              default: {
                if (char < '0' || char > '9') {
                  state = STATE.VARIABLEARG;
                }
              }
            }
            break;
          }
          case STATE.VARIABLEARG: {
            switch (char) {
              case ',': {
                storeMethodVariable(bindingData, text, i);
                bindingData.startChar = i + 1;
                state = STATE.METHOD;
                break;
              }
              case ')': {
                storeMethodVariable(bindingData, text, i);
                storeMethod(bindingData, templateInfo);
                state = STATE.METHODCLOSED;
                break;
              }
            }
            break;
          }
          case STATE.METHODCLOSED: {
            if (char === BINDINGS[bindingData.mode]) {
              state = STATE.METHODCLOSEDBINDING;
            } else if (char !== ' ' && char !== '\t' && char !== '\n') {
              console.warn(`Expected two closing "${BINDINGS[bindingData.mode]}" for binding "${text}"`);
            }
            break;
          }
          case STATE.METHODCLOSEDBINDING: {
            if (char === BINDINGS[bindingData.mode]) {
              bindingData.startChar = i + 1;
              parts.push(bindingData);
              state = STATE.INITIAL;
            } else if (char !== ' ' && char !== '\t' && char !== '\n') {
              console.warn(`Expected one closing "${BINDINGS[bindingData.mode]}" for binding "${text}"`);
            }
            break;
          }
        }
      }

      if (parts.length) {
        pushLiteral(text, i, parts, parts[parts.length - 1].startChar);
        return parts;
      }

      return null;
    }
  };
});

export { StrictBindingParser };
