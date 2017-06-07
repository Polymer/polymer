/*
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
 * Module with utilities for manipulating structured data path strings.
 *
 * @namespace
 * @memberof Polymer
 * @summary Module with utilities for manipulating structured data path strings.
 */
export namespace Path {

  /**
   * Returns true if the given string is a structured data path (has dots).
   *
   * Example:
   *
   * ```
   * Polymer.Path.isPath('foo.bar.baz') // true
   * Polymer.Path.isPath('foo')         // false
   * ```
   *
   * @memberof Polymer.Path
   * @param {string} path Path string
   * @return {boolean} True if the string contained one or more dots
   */
  export function isPath(path: string): boolean {
    return path.indexOf('.') >= 0;
  }

  /**
   * Returns the root property name for the given path.
   *
   * Example:
   *
   * ```
   * Polymer.Path.root('foo.bar.baz') // 'foo'
   * Polymer.Path.root('foo')         // 'foo'
   * ```
   *
   * @memberof Polymer.Path
   * @param {string} path Path string
   * @return {string} Root property name
   */
  export function root(path: string): string {
    let dotIndex = path.indexOf('.');
    if (dotIndex === -1) {
      return path;
    }
    return path.slice(0, dotIndex);
  }

  /**
   * Given `base` is `foo.bar`, `foo` is an ancestor, `foo.bar` is not
   * Returns true if the given path is an ancestor of the base path.
   *
   * Example:
   *
   * ```
   * Polymer.Path.isAncestor('foo.bar', 'foo')         // true
   * Polymer.Path.isAncestor('foo.bar', 'foo.bar')     // false
   * Polymer.Path.isAncestor('foo.bar', 'foo.bar.baz') // false
   * ```
   *
   * @memberof Polymer.Path
   * @param {string} base Path string to test against.
   * @param {string} path Path string to test.
   * @return {boolean} True if `path` is an ancestor of `base`.
   */
  export function isAncestor(base: string, path: string): boolean {
    //     base.startsWith(path + '.');
    return base.indexOf(path + '.') === 0;
  }

  /**
   * Given `base` is `foo.bar`, `foo.bar.baz` is an descendant
   *
   * Example:
   *
   * ```
   * Polymer.Path.isDescendant('foo.bar', 'foo.bar.baz') // true
   * Polymer.Path.isDescendant('foo.bar', 'foo.bar')     // false
   * Polymer.Path.isDescendant('foo.bar', 'foo')         // false
   * ```
   *
   * @memberof Polymer.Path
   * @param {string} base Path string to test against.
   * @param {string} path Path string to test.
   * @return {boolean} True if `path` is a descendant of `base`.
   */
  export function isDescendant(base: string, path: string): boolean {
    //     path.startsWith(base + '.');
    return path.indexOf(base + '.') === 0;
  }

  /**
   * Replaces a previous base path with a new base path, preserving the
   * remainder of the path.
   *
   * User must ensure `path` has a prefix of `base`.
   *
   * Example:
   *
   * ```
   * Polymer.Path.translate('foo.bar', 'zot' 'foo.bar.baz') // 'zot.baz'
   * ```
   *
   * @memberof Polymer.Path
   * @param {string} base Current base string to remove
   * @param {string} newBase New base string to replace with
   * @param {string} path Path to translate
   * @return {string} Translated string
   */
  export function translate(base: string, newBase: string, path: string): string {
    return newBase + path.slice(base.length);
  }

  export function matches(base: string, path: string): boolean {
    return (base === path) ||
            Path.isAncestor(base, path) ||
            Path.isDescendant(base, path);
  }

  /**
   * Converts array-based paths to flattened path.  String-based paths
   * are returned as-is.
   *
   * Example:
   *
   * ```
   * Polymer.Path.normalize(['foo.bar', 0, 'baz'])  // 'foo.bar.0.baz'
   * Polymer.Path.normalize('foo.bar.0.baz')        // 'foo.bar.0.baz'
   * ```
   *
   * @memberof Polymer.Path
   * @param {string | !Array<string|number>} path Input path
   * @return {string} Flattened path
   */
  export function normalize(path: string | Array<string|number>): string {
    if (Array.isArray(path)) {
      let parts = [];
      for (let i=0; i<path.length; i++) {
        let args = path[i].toString().split('.');
        for (let j=0; j<args.length; j++) {
          parts.push(args[j]);
        }
      }
      return parts.join('.');
    } else {
      return path;
    }
  }

  /**
   * Splits a path into an array of property names. Accepts either arrays
   * of path parts or strings.
   *
   * Example:
   *
   * ```
   * Polymer.Path.split(['foo.bar', 0, 'baz'])  // ['foo', 'bar', '0', 'baz']
   * Polymer.Path.split('foo.bar.0.baz')        // ['foo', 'bar', '0', 'baz']
   * ```
   *
   * @memberof Polymer.Path
   * @param {string | !Array<string|number>} path Input path
   * @return {!Array<string>} Array of path parts
   */
  export function split(path: string | Array<string|number>): string[] {
    if (Array.isArray(path)) {
      return Path.normalize(path).split('.');
    }
    return path.toString().split('.');
  }

  /**
   * Reads a value from a path.  If any sub-property in the path is `undefined`,
   * this method returns `undefined` (will never throw.
   *
   * @memberof Polymer.Path
   * @param {Object} root Object from which to dereference path from
   * @param {string | !Array<string|number>} path Path to read
   * @param {Object=} info If an object is provided to `info`, the normalized
   *  (flattened) path will be set to `info.path`.
   * @return {*} Value at path, or `undefined` if the path could not be
   *  fully dereferenced.
   */
  export function get<R, K extends keyof R>(root: R, path: K, info?: {path: string}): R[K];
  export function get(root: Object, path: Array<string|number>, info?: {path: string}): any;
  export function get(root: Object, path: string | Array<string|number>, info?: {path: string}) {
    let prop = root;
    let parts = Path.split(path);
    // Loop over path parts[0..n-1] and dereference
    for (let i=0; i<parts.length; i++) {
      if (!prop) {
        return;
      }
      let part = parts[i];
      prop = (prop as any)[part];
    }
    if (info) {
      info.path = parts.join('.');
    }
    return prop;
  }

  /**
   * Sets a value to a path.  If any sub-property in the path is `undefined`,
   * this method will no-op.
   *
   * @memberof Polymer.Path
   * @param {Object} root Object from which to dereference path from
   * @param {string | !Array<string|number>} path Path to set
   * @param {*} value Value to set to path
   * @return {string | undefined} The normalized version of the input path
   */
  export function set<R, K extends keyof R>(root: R, path: K, value: R[K]): void | string;
  export function set(root: Object, path: Array<string|number>, value: any): void | string;
  export function set(root: Object, path: string | Array<string|number>, value: any): void | string {
    let prop = root;
    let parts = Path.split(path);
    let last = parts[parts.length-1];
    if (parts.length > 1) {
      // Loop over path parts[0..n-2] and dereference
      for (let i=0; i<parts.length-1; i++) {
        let part = parts[i];
        prop = (prop as any)[part];
        if (!prop) {
          return;
        }
      }
      // Set value to object at end of path
      (prop as any)[last] = value;
    } else {
      // Simple property set
      (prop as any)[path as string] = value;
    }
    return parts.join('.');
  }

};

/**
 * Returns true if the given string is a structured data path (has dots).
 *
 * This function is deprecated.  Use `Polymer.Path.isPath` instead.
 *
 * Example:
 *
 * ```
 * Polymer.Path.isDeep('foo.bar.baz') // true
 * Polymer.Path.isDeep('foo')         // false
 * ```
 *
 * @deprecated
 * @memberof Polymer.Path
 * @param {string} path Path string
 * @return {boolean} True if the string contained one or more dots
 */
export const isDeep = Path.isPath;


