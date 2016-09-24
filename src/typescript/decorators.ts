/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// This file requires the reflect-metadata package to be loaded.
/// <reference path="../../node_modules/reflect-metadata/Reflect.d.ts" />

/**
 * A TypeScript class decorator that defines a custom element with name
 * `tagname` and the decorated class.
 */
export function customElement(tagname: string) {
  return (clazz: any) => {
    clazz.is = tagname;
    window.customElements.define(tagname, clazz);
  }
}

export interface PropertyOptions {
  notify?: boolean;
};

/**
 * A TypeScript property decorator factory that defines this as a Polymer
 * property.
 *
 * This function must be invoked to return a decorator.
 */
export function property<T>(options?: PropertyOptions) {
  return (proto: any, propName: string) : any => {
    const notify : boolean = options && options.notify;
    const type = Reflect.getMetadata("design:type", proto, propName);
    const config = _ensureConfig(proto);
    config.properties[propName] = {
      type,
      notify,
    };
  }
}

/**
 * A TypeScript property decorator factory that causes the decorated method to
 * be called when a property changes. `targets` is either a single property
 * name, or a list of property names.
 *
 * This function must be invoked to return a decorator.
 */
export function observe(targets: string|string[]) {
  return (proto: any, propName: string) : any => {
    const targetString = typeof targets === 'string' ? targets : targets.join(',');
    const config = _ensureConfig(proto);
    config.observers.push(`${propName}(${targetString})`);
  }
}


/**
 * A TypeScript property decorator factory that converts a class property into a
 * getter that executes a querySelector on the element's shadow root.
 *
 * By annotating the property with the correct type, element's can have
 * type-checked access to internal elements.
 *
 * This function must be invoked to return a decorator.
 */
export const query = _query(
    (target: NodeSelector, selector: string) => target.querySelector(selector));

/**
 * A TypeScript property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's shadow root.
 *
 * By annotating the property with the correct type, element's can have
 * type-checked access to internal elements. The type should be NodeList
 * with the correct type argument.
 *
 * This function must be invoked to return a decorator.
 */
export const queryAll = _query(
    (target: NodeSelector, selector: string) => target.querySelectorAll(selector));


interface Config {
  properties: {[name: string]: PropertyDefinition};
  observers: string[];
}

interface PropertyDefinition {
  notify?: boolean;
  type: Function;
}

function _ensureConfig(proto: any): Config {
  const ctor = proto.constructor;
  if (ctor.hasOwnProperty('__polymer_ts_config')) {
    return ctor.__polymer_ts_config;
  }

  Object.defineProperty(ctor, 'config', {
    get() { return ctor.__polymer_ts_config; }
  });

  const config: Config = ctor.__polymer_ts_config = ctor.__polymer_ts_config || {};
  config.properties = config.properties || {};
  config.observers = config.observers || [];
  return config;
}

function _query(queryFn: (target: NodeSelector, selector: string) => Element|NodeList) {
  return (selector: string) => (proto: any, propName: string): any => {
    Object.defineProperty(proto, propName, {
      get() {
        return queryFn(this.shadowRoot, selector);
      },
      enumerable: true,
      configurable: true,
    });
  };
}
