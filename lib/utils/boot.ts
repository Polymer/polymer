/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

export interface UserPolymer {

}

const userPolymer: undefined | UserPolymer = (window as any).Polymer;

/**
 * @namespace Polymer
 * @summary Polymer is a lightweight library built on top of the web
 * standards-based Web Components API's, and makes it easy to build your
 * own custom HTML elements.
 */
export namespace Polymer {
  export var version = '2.0.1';
}

// support user settings on the Polymer object
if (userPolymer) {
  Object.assign(Polymer, userPolymer);
}

/*
When using Closure Compiler, JSCompiler_renameProperty(property, object) is replaced by the munged name for object[property]
We cannot alias this function, so we have to use a small shim that has the same behavior when not compiling.
*/
export var JSCompiler_renameProperty = function(prop: string, _obj: any) {
  return prop;
}
