/*
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

const caseMap: {[str: string]: string} = {};
const DASH_TO_CAMEL = /-[a-z]/g;
const CAMEL_TO_DASH = /([A-Z])/g;

/**
 * Module with utilities for converting between "dash-case" and "camelCase"
 * identifiers.
 *
 * @namespace
 * @memberof Polymer
 * @summary Module that provides utilities for converting between "dash-case"
 *   and "camelCase".
 */
export const CaseMap = {

  /**
   * Converts "dash-case" identifier (e.g. `foo-bar-baz`) to "camelCase"
   * (e.g. `fooBarBaz`).
   *
   * @memberof Polymer.CaseMap
   * @param {string} dash Dash-case identifier
   * @return {string} Camel-case representation of the identifier
   */
  dashToCamelCase(dash: string): string {
    return caseMap[dash] || (
      caseMap[dash] = dash.indexOf('-') < 0 ? dash : dash.replace(DASH_TO_CAMEL,
        (m) => m[1].toUpperCase()
      )
    );
  },

  /**
   * Converts "camelCase" identifier (e.g. `fooBarBaz`) to "dash-case"
   * (e.g. `foo-bar-baz`).
   *
   * @memberof Polymer.CaseMap
   * @param {string} camel Camel-case identifier
   * @return {string} Dash-case representation of the identifier
   */
  camelToDashCase(camel:string): string {
    return caseMap[camel] || (
      caseMap[camel] = camel.replace(CAMEL_TO_DASH, '-$1').toLowerCase()
    );
  }

};

