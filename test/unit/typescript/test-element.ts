/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {customElement, property, query, queryAll, observe} from '../../../src/typescript/decorators.js';

@customElement('test-element')
export class TestElement extends Polymer.Element {

  @property({notify: true})
  aNum: number = 42;

  @property({notify: true})
  aString: string = 'yes';

  @property()
  aBool: boolean = true;

  lastNumChange: number;

  lastMultiChange: any[];

  @query('#num')
  numDiv: HTMLDivElement;

  @queryAll('div')
  divs: HTMLInputElement[];

  @observe('aNum')
  private _aNumChanged(newNum: number) {
    this.lastNumChange = newNum;
  }

  @observe(['aNum', 'aString'])
  private _numStringChanged(newNum: number, newString: string) {
    this.lastMultiChange = [newNum, newString];
  }

}
