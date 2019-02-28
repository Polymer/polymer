/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import { PolymerElement } from '../../polymer-element.js';

import { dedupingMixin } from '../utils/mixin.js';
import { calculateSplices } from '../utils/array-splice.js';
import { ElementMixin } from '../mixins/element-mixin.js';

/**
 * Element mixin for recording dynamic associations between item paths in a
 * master `items` array and a `selected` array such that path changes to the
 * master array (at the host) element or elsewhere via data-binding) are
 * correctly propagated to items in the selected array and vice-versa.
 *
 * The `items` property accepts an array of user data, and via the
 * `select(item)` and `deselect(item)` API, updates the `selected` property
 * which may be bound to other parts of the application, and any changes to
 * sub-fields of `selected` item(s) will be kept in sync with items in the
 * `items` array.  When `multi` is false, `selected` is a property
 * representing the last selected item.  When `multi` is true, `selected`
 * is an array of multiply selected items.
 *
 * @polymer
 * @mixinFunction
 * @appliesMixin ElementMixin
 * @summary Element mixin for recording dynamic associations between item paths in a
 * master `items` array and a `selected` array
 */
let ArraySelectorMixin = dedupingMixin(superClass => {

  /**
   * @constructor
   * @implements {Polymer_ElementMixin}
   * @private
   */
  let elementBase = ElementMixin(superClass);

  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_ArraySelectorMixin}
   * @unrestricted
   */
  class ArraySelectorMixin extends elementBase {

    static get properties() {
      return {

        /**
         * An array containing items from which selection will be made.
         */
        items: {
          type: Array,
        },

        /**
         * When `true`, multiple items may be selected at once (in this case,
         * `selected` is an array of currently selected items).  When `false`,
         * only one item may be selected at a time.
         */
        multi: {
          type: Boolean,
          value: false,
        },

        /**
         * When `multi` is true, this is an array that contains any selected.
         * When `multi` is false, this is the currently selected item, or `null`
         * if no item is selected.
         * @type {?Object|?Array<!Object>}
         */
        selected: {type: Object, notify: true},

        /**
         * When `multi` is false, this is the currently selected item, or `null`
         * if no item is selected.
         * @type {?Object}
         */
        selectedItem: {type: Object, notify: true},

        /**
         * When `true`, calling `select` on an item that is already selected
         * will deselect the item.
         */
        toggle: {type: Boolean, value: false}

      };
    }

    static get observers() {
      return ['__updateSelection(multi, items.*)'];
    }

    constructor() {
      super();
      this.__lastItems = null;
      this.__lastMulti = null;
      this.__selectedMap = null;
    }

    __updateSelection(multi, itemsInfo) {
      let path = itemsInfo.path;
      if (path == 'items') {
        // Case 1 - items array changed, so diff against previous array and
        // deselect any removed items and adjust selected indices
        let newItems = itemsInfo.base || [];
        let lastItems = this.__lastItems;
        let lastMulti = this.__lastMulti;
        if (multi !== lastMulti) {
          this.clearSelection();
        }
        if (lastItems) {
          let splices = calculateSplices(newItems, lastItems);
          this.__applySplices(splices);
        }
        this.__lastItems = newItems;
        this.__lastMulti = multi;
      } else if (itemsInfo.path == 'items.splices') {
        // Case 2 - got specific splice information describing the array mutation:
        // deselect any removed items and adjust selected indices
        this.__applySplices(itemsInfo.value.indexSplices);
      } else {
        // Case 3 - an array element was changed, so deselect the previous
        // item for that index if it was previously selected
        let part = path.slice('items.'.length);
        let idx = parseInt(part, 10);
        if ((part.indexOf('.') < 0) && part == idx) {
          this.deselectIndex(idx);
        }
      }
    }

    __applySplices(splices) {
      let selected = this.__selectedMap;
      // Adjust selected indices and mark removals
      for (let i=0; i<splices.length; i++) {
        let s = splices[i];
        selected.forEach((idx, item) => {
          if (idx < s.index) {
            // no change
          } else if (idx >= s.index + s.removed.length) {
            // adjust index
            selected.set(item, idx + s.addedCount - s.removed.length);
          } else {
            // remove index
            selected.set(item, -1);
          }
        });
        for (let j=0; j<s.addedCount; j++) {
          let idx = s.index + j;
          if (selected.has(this.items[idx])) {
            selected.set(this.items[idx], idx);
          }
        }
      }
      // Update linked paths
      this.__updateLinks();
      // Remove selected items that were removed from the items array
      let sidx = 0;
      selected.forEach((idx, item) => {
        if (idx < 0) {
          if (this.multi) {
            this.splice('selected', sidx, 1);
          } else {
            this.selected = this.selectedItem = null;
          }
          selected.delete(item);
        } else {
          sidx++;
        }
      });
    }

    __updateLinks() {
      this.__dataLinkedPaths = {};
      if (this.multi) {
        let sidx = 0;
        this.__selectedMap.forEach(idx => {
          if (idx >= 0) {
            this.linkPaths('items.' + idx, 'selected.' + sidx++);
          }
        });
      } else {
        this.__selectedMap.forEach(idx => {
          this.linkPaths('selected', 'items.' + idx);
          this.linkPaths('selectedItem', 'items.' + idx);
        });
      }
    }

    /**
     * Clears the selection state.
     * @override
     * @return {void}
     */
    clearSelection() {
      // Unbind previous selection
      this.__dataLinkedPaths = {};
      // The selected map stores 3 pieces of information:
      // key: items array object
      // value: items array index
      // order: selected array index
      this.__selectedMap = new Map();
      // Initialize selection
      this.selected = this.multi ? [] : null;
      this.selectedItem = null;
    }

    /**
     * Returns whether the item is currently selected.
     *
     * @override
     * @param {*} item Item from `items` array to test
     * @return {boolean} Whether the item is selected
     */
    isSelected(item) {
      return this.__selectedMap.has(item);
    }

    /**
     * Returns whether the item is currently selected.
     *
     * @override
     * @param {number} idx Index from `items` array to test
     * @return {boolean} Whether the item is selected
     */
    isIndexSelected(idx) {
      return this.isSelected(this.items[idx]);
    }

    /**
     * Deselects the given item if it is already selected.
     *
     * @override
     * @param {*} item Item from `items` array to deselect
     * @return {void}
     */
    deselect(item) {
      this.deselectIndex(this.__selectedMap.get(item));
    }

    /**
     * Deselects the given index if it is already selected.
     *
     * @override
     * @param {number} idx Index from `items` array to deselect
     * @return {void}
     */
    deselectIndex(idx) {
      if (this.multi) {
        this.__deselectIndexes([idx]);
        return;
      }

      // Don't use this.items in this method. Keep in mind, that it can be
      // called for deselecting removed from this.items array item.
      // Use __dataLinkedPaths and this.selectedItem for getting item.
      const selectedMappedPath = this.__dataLinkedPaths['selectedItem'];
      if (!selectedMappedPath ||
          parseInt(selectedMappedPath.slice('items.'.length), 10) !== idx) {
        return;
      }

      const item = this.selectedItem;
      this.__selectedMap.delete(item);
      this.__updateLinks();
      this.selected = this.selectedItem = null;
    }

    /**
     * Deselects the given indexes if it is already selected.
     *
     * @param {Array<number>} indexes Indexes from `items` array to deselect
     * @return {void}
     */
    deselectIndexes(indexes) {
      if (!this.multi) {
        throw new Error('This method can be used only in multi = true mode');
      }

      this.__deselectIndexes(indexes);
    }

    /**
     * Selects the given item.  When `toggle` is true, this will automatically
     * deselect the item if already selected.
     *
     * @override
     * @param {*} item Item from `items` array to select
     * @return {void}
     */
    select(item) {
      this.selectIndex(this.items.indexOf(item));
    }

    /**
     * Selects the given index.  When `toggle` is true, this will automatically
     * deselect the item if already selected.
     *
     * @override
     * @param {number} idx Index from `items` array to select
     * @return {void}
     */
    selectIndex(idx) {
      if (this.multi) {
        this.__selectIndexes([idx]);
        return;
      }

      const item = this.items[idx];
      if (!this.isSelected(item)) {
        this.__selectedMap.clear();
        this.__selectedMap.set(item, idx);
        this.__updateLinks();
        this.selected = this.selectedItem = item;
      } else if (this.toggle) {
        this.deselectIndex(idx);
      }
    }

    /**
     * Selects the given indexes.  When `toggle` is true, this will automatically
     * deselect the items if already selected.
     *
     * @param {Array<number>} indexes Indexes from `items` array to select
     * @return {void}
     */
    selectIndexes(indexes) {
      if (!this.multi) {
        throw new Error('This method can be used only in multi = true mode');
      }

      this.__selectIndexes(indexes);
    }

    /**
     * @param {Array<number>} indexes Indexes from `items` array to deselect
     * @return {void}
     * @private
     */
    __deselectIndexes(indexes) {
      // Don't use this.items in this method. Keep in mind, that it can be
      // called for deselecting removed from this.items array item.
      // Use __dataLinkedPaths and then this.selected for getting
      // item.
      const selectedIndexes = indexes.map(idx => {
        const selectedMappedPath = this.__dataLinkedPaths['items.' + idx];
        return selectedMappedPath ?
            parseInt(selectedMappedPath.slice('selected.'.length), 10) : -1;
      });
      const haveToBeDeselectedSelectedIndexes =
          selectedIndexes.filter(sidx => sidx >= 0);

      if (haveToBeDeselectedSelectedIndexes.length === 0) {
        return;
      }

      const selectedIndexesToRemove = [];
      for (const sidx of haveToBeDeselectedSelectedIndexes) {
        this.__selectedMap.delete(this.selected[sidx]);
        selectedIndexesToRemove.push(sidx);
      }

      this.__updateLinks();

      // In case of deselecting one item just splice selected array with
      // polymer splice method to avoid calculateSplices method with
      // O(n * m) complexity for trivial case.
      // When we have to deselect more than one item do it in batch with
      // native splice method and then dispatch one event for whole array
      // mutation.
      if (selectedIndexesToRemove.length === 1) {
        this.splice('selected', selectedIndexesToRemove[0], 1);
      } else {
        const originalSelected =
            Array.from(/** @type {!Array<!Object>} */(this.selected));
        selectedIndexesToRemove.sort((a, b) => a - b);
        for (let i = selectedIndexesToRemove.length - 1; i >= 0; i--) {
          this.selected.splice(selectedIndexesToRemove[i], 1);
        }
        const selectedSplices = calculateSplices(
            this.selected, originalSelected);
        this.notifySplices('selected', selectedSplices);
      }
    }

    /**
     * @param {Array<number>} indexes Indexes from `items` array to select
     * @return {void}
     * @private
     */
    __selectIndexes(indexes) {
      const itemsCount = this.items.length;

      const alreadySelectedIndexes = [];
      const haveToBeSelectedIndexes = [];
      for (const idx of indexes) {
        if (idx < 0 && idx >= itemsCount) {
          continue;
        }
        if (this.isSelected(this.items[idx])) {
          alreadySelectedIndexes.push(idx);
        } else {
          haveToBeSelectedIndexes.push(idx);
        }
      }

      if (this.toggle) {
        this.deselectIndexes(alreadySelectedIndexes);
      }

      if (haveToBeSelectedIndexes.length === 0) {
        return;
      }

      for (const idx of haveToBeSelectedIndexes) {
        this.__selectedMap.set(this.items[idx], idx);
      }
      this.__updateLinks();
      this.push(
        'selected',
        ...haveToBeSelectedIndexes.map(idx => this.items[idx]));
    }

  }

  return ArraySelectorMixin;

});

// export mixin
export { ArraySelectorMixin };

/**
 * @constructor
 * @extends {PolymerElement}
 * @implements {Polymer_ArraySelectorMixin}
 * @private
 */
let baseArraySelector = ArraySelectorMixin(PolymerElement);

/**
 * Element implementing the `ArraySelector` mixin, which records
 * dynamic associations between item paths in a master `items` array and a
 * `selected` array such that path changes to the master array (at the host)
 * element or elsewhere via data-binding) are correctly propagated to items
 * in the selected array and vice-versa.
 *
 * The `items` property accepts an array of user data, and via the
 * `select(item)` and `deselect(item)` API, updates the `selected` property
 * which may be bound to other parts of the application, and any changes to
 * sub-fields of `selected` item(s) will be kept in sync with items in the
 * `items` array.  When `multi` is false, `selected` is a property
 * representing the last selected item.  When `multi` is true, `selected`
 * is an array of multiply selected items.
 *
 * Example:
 *
 * ```js
 * import {PolymerElement} from '@polymer/polymer';
 * import '@polymer/polymer/lib/elements/array-selector.js';
 *
 * class EmployeeList extends PolymerElement {
 *   static get _template() {
 *     return html`
 *         <div> Employee list: </div>
 *         <dom-repeat id="employeeList" items="{{employees}}">
 *           <template>
 *             <div>First name: <span>{{item.first}}</span></div>
 *               <div>Last name: <span>{{item.last}}</span></div>
 *               <button on-click="toggleSelection">Select</button>
 *           </template>
 *         </dom-repeat>
 *
 *         <array-selector id="selector"
 *                         items="{{employees}}"
 *                         selected="{{selected}}"
 *                         multi toggle></array-selector>
 *
 *         <div> Selected employees: </div>
 *         <dom-repeat items="{{selected}}">
 *           <template>
 *             <div>First name: <span>{{item.first}}</span></div>
 *             <div>Last name: <span>{{item.last}}</span></div>
 *           </template>
 *         </dom-repeat>`;
 *   }
 *   static get is() { return 'employee-list'; }
 *   static get properties() {
 *     return {
 *       employees: {
 *         value() {
 *           return [
 *             {first: 'Bob', last: 'Smith'},
 *             {first: 'Sally', last: 'Johnson'},
 *             ...
 *           ];
 *         }
 *       }
 *     };
 *   }
 *   toggleSelection(e) {
 *     const item = this.$.employeeList.itemForElement(e.target);
 *     this.$.selector.select(item);
 *   }
 * }
 * ```
 *
 * @polymer
 * @customElement
 * @extends {baseArraySelector}
 * @appliesMixin ArraySelectorMixin
 * @summary Custom element that links paths between an input `items` array and
 *   an output `selected` item or array based on calls to its selection API.
 */
class ArraySelector extends baseArraySelector {
  // Not needed to find template; can be removed once the analyzer
  // can find the tag name from customElements.define call
  static get is() { return 'array-selector'; }
  static get template() { return null; }
}
customElements.define(ArraySelector.is, ArraySelector);
export { ArraySelector };
