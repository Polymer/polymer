# Change Log

## [v3.5.1](https://github.com/Polymer/polymer/tree/v3.5.1) (2022-06-03)
- [ci skip] bump to 3.5.1 ([commit](https://github.com/Polymer/polymer/commit/2cbb3d2b))

- `_valueToNodeAttribute` converts the empty string to `trustedTypes.emptyScript` before setting, if available. ([commit](https://github.com/Polymer/polymer/commit/d69041cc))

- Adds Trusted Types support for reflected boolean properties. ([commit](https://github.com/Polymer/polymer/commit/ce474db9))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/76e77b6d))

## [v3.5.0](https://github.com/Polymer/polymer/tree/v3.5.0) (2022-05-18)
- [ci skip] bump to 3.5.0 ([commit](https://github.com/Polymer/polymer/commit/a800a1a9))

- Add `CHANGELOG.md` to the packaged files. ([commit](https://github.com/Polymer/polymer/commit/6696976e))

- Upstream http://cl/374717449 ([commit](https://github.com/Polymer/polymer/commit/adc6d517))

- Upstream http://cl/362104095 ([commit](https://github.com/Polymer/polymer/commit/96897876))

- Upstream http://cl/368587394 ([commit](https://github.com/Polymer/polymer/commit/4036db44))

- Upstream http://cl/330613283 ([commit](https://github.com/Polymer/polymer/commit/178dfa5e))

- Upstream http://cl/397536696 ([commit](https://github.com/Polymer/polymer/commit/2445554f))

- Upstream http://cl/374930792 ([commit](https://github.com/Polymer/polymer/commit/4a85c7f9))

- Upstream http://cl/438642754 ([commit](https://github.com/Polymer/polymer/commit/8582dd64))

- Upstream http://cl/387624221 ([commit](https://github.com/Polymer/polymer/commit/067dd302))

- Upstream http://cl/420889188 ([commit](https://github.com/Polymer/polymer/commit/d0d39b8d))

- Upstream http://cl/416087593 ([commit](https://github.com/Polymer/polymer/commit/ec36597f))

- Fix typo in dom-repeat.js ([commit](https://github.com/Polymer/polymer/commit/7b37193e))

- Update polymer -> lit link to point at new lit repo instead of old lit-element repo ([commit](https://github.com/Polymer/polymer/commit/4586fed6))

- Add support for TrustedTypes (#5692) ([commit](https://github.com/Polymer/polymer/commit/10220c9a))

- Fix typo in disable-upgrade-mixin.js ([commit](https://github.com/Polymer/polymer/commit/5c06ae9b))

- Fix `Polymer.dom(el).attachShadow/shadowRoot` ([commit](https://github.com/Polymer/polymer/commit/2b0494a9))

- Fix typo in dom-module.js ([commit](https://github.com/Polymer/polymer/commit/69eb8a7a))

- Fix SyntaxError ([commit](https://github.com/Polymer/polymer/commit/1e9be28d))

- Upstream internal error suppression. ([commit](https://github.com/Polymer/polymer/commit/2515cd21))

- Updated Readme ([commit](https://github.com/Polymer/polymer/commit/78602fcc))

- Fix let back to const ([commit](https://github.com/Polymer/polymer/commit/04a4ded8))

- Cancel chunking when disconnected. Fixes #5667 ([commit](https://github.com/Polymer/polymer/commit/32d7d61d))

- Accept function in legacy _template field for template parsing. Fixes #5660 ([commit](https://github.com/Polymer/polymer/commit/22ac86a8))

- Upstream internal type differences. ([commit](https://github.com/Polymer/polymer/commit/9e8df682))

- Remove types from LegacyElementMixin's overridden setAttribute and removeAttribute. ([commit](https://github.com/Polymer/polymer/commit/00b36709))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/6acf6e3c))

## [v3.4.1](https://github.com/Polymer/polymer/tree/v3.4.1) (2020-04-29)
- [ci skip] bump to 3.4.1 ([commit](https://github.com/Polymer/polymer/commit/12fa1b50))

- Add type for DomApiNative's setAttribute method. ([commit](https://github.com/Polymer/polymer/commit/024ab01e))

- Remove gen-typescript-declarations; manually add LegacyElementMixin's setAttribute type. ([commit](https://github.com/Polymer/polymer/commit/e717f0f0))

- Remove "DO NOT EDIT" warning comments. ([commit](https://github.com/Polymer/polymer/commit/8b2ea7bc))

- Track TypeScript declarations. ([commit](https://github.com/Polymer/polymer/commit/ec7b7c55))

- Update Closure types for overridden setAttribute in LegacyElementMixin. ([commit](https://github.com/Polymer/polymer/commit/604856b2))

- Add method / parameter descriptions. ([commit](https://github.com/Polymer/polymer/commit/370ae5eb))

- Fix TypeScript breakages by specifying types for overridden `setAttribute` and `getAttribute`. ([commit](https://github.com/Polymer/polymer/commit/c8715b50))

- Add complete commit list for v3.4.0 ([commit](https://github.com/Polymer/polymer/commit/e47493b0))

- Fix a couple more compiler warnings ([commit](https://github.com/Polymer/polymer/commit/ad2bca18))

- Typos and other minor changes. ([commit](https://github.com/Polymer/polymer/commit/a55e248d))

- Add a note about a bug fix for <dom-repeat> chunking. ([commit](https://github.com/Polymer/polymer/commit/002c98a0))

- Add `useAdoptedStyleSheetsWithBuiltCSS` section. ([commit](https://github.com/Polymer/polymer/commit/d9fc4fbf))

- Add setters to settings titles. ([commit](https://github.com/Polymer/polymer/commit/9c78b481))

- Add a note about `orderedComputed` and cycles. ([commit](https://github.com/Polymer/polymer/commit/c181c3d8))

- Add example of overriding `suppressTemplateNotifications` via `notify-dom-change`. ([commit](https://github.com/Polymer/polymer/commit/1fa4948b))

- Add a section about automatic use of constructable stylesheets. ([commit](https://github.com/Polymer/polymer/commit/d9c18b47))

- Add "Other new features" section for `reuseChunkedInstances` and `LegacyElementMixin`'s built-in `disable-upgrade` support. ([commit](https://github.com/Polymer/polymer/commit/7a2e9f81))

- Added notes for `fastDomIf`, `removeNestedTemplates`, `suppressNestedTemplates`, and `suppressTemplateNotifications`. ([commit](https://github.com/Polymer/polymer/commit/3b6494bf))

- Started on release notes for `legacyUndefined`, `legacyWarnings`, `orderedComputed`. (...) ([commit](https://github.com/Polymer/polymer/commit/d80fdca0))

- Remove unused externs. ([commit](https://github.com/Polymer/polymer/commit/0da4e63f))

## [v3.4.0](https://github.com/Polymer/polymer/tree/v3.4.0) (2020-04-23)

### New global settings

This update to Polymer includes some new [global settings](https://polymer-library.polymer-project.org/3.0/docs/devguide/settings):

- `legacyUndefined` / `setLegacyUndefined`

  **What does it do?** This setting reverts how computed properties handle `undefined` values to the Polymer 1 behavior: when enabled, computed properties will only be recomputed if none of their dependencies are `undefined`.

  Components can override the global setting by setting their `_overrideLegacyUndefined` property to `true`. This is useful for reenabling the default behavior as you migrate individual components:

  ```js
  import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

  class MigratedElement extends PolymerElement { /* ... */ }

  // All MigratedElement instances will use the default behavior.
  MigratedElement.prototype._overrideLegacyUndefined = true;

  customElements.define('migrated-element', SomeElement);
  ```

  **Should I use it?** This setting should only be used for migrating legacy codebases that depend on this behavior and is otherwise **not recommended**.

- `legacyWarnings` / `setLegacyWarnings`

  **What does it do?** This setting causes Polymer to warn if a component's template contains bindings to properties that are not listed in that element's [`properties` block](https://polymer-library.polymer-project.org/3.0/docs/devguide/properties). For example:

  ```js
  import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

  class SomeElement extends PolymerElement {
    static get template() {
      return html`<span>[[someProperty]] is used here</span>`;
    }

    static get properties() {
      return { /* but `someProperty` is not declared here */ };
    }
  }

  customElements.define('some-element', SomeElement);
  ```

  Only properties explicitly declared in the `properties` block are [associated with an attribute](https://polymer-library.polymer-project.org/3.0/docs/devguide/properties#property-name-mapping) and [update when that attribute changes](https://polymer-library.polymer-project.org/3.0/docs/devguide/properties#attribute-deserialization). Enabling this setting will show you where you might have forgotten to declare properties.

  **Should I use it?** Consider using this feature during development but don't enable it in production.

- `orderedComputed` / `setOrderedComputed`

  **What does it do?** This setting causes Polymer to topologically sort each component's computed properties graph when the class is initialized and uses that order whenever computed properties are run.

  For example:

  ```js
  import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

  class SomeElement extends PolymerElement {
    static get properties() {
      return {
        a: {type: Number, value: 0},
        b: {type: Number, computed: 'computeB(a)'},
        c: {type: Number, computed: 'computeC(a, b)'},
      };
    }

    computeB(a) {
      console.log('Computing b...');
      return a + 1;
    }

    computeC(a, b) {
      console.log('Computing c...');
      return (a + b) * 2;
    }
  }

  customElements.define('some-element', SomeElement);
  ```

  When `a` changes, Polymer's default behavior does not specify the order in which its dependents will run. Given that both `b` and `c` depend directly on `a`, one of two possible orders could occur: [`computeB`, `computeC`] or [`computeC`, `computeB`].

  - In the first case - [`computeB`, `computeC`] - `computeB` is run with the new value of `a` and produces a new value for `b`. Then, `computeC` is run with both the new values of `a` and `b` to produce `c`.

  - In the second case - [`computeC`, `computeB`] - `computeC` is run first with the new value of `a` and the _current_ value of `b` to produce `c`. Then, `computeB` is run with the new value of `a` to produce `b`. If `computeB` changed the value of `b` then `computeC` will be run again, with the new values of both `a` and `b` to produce the final value of `c`.

  However, with `orderedComputed` enabled, the computed properties would have been previously sorted into [`computeB`, `computeC`], so updating `a` would cause them to run specifically in that order.

  If your component's computed property graph contains cycles, the order in which they are run when using `orderedComputed` is still undefined.

  **Should I use it?** The value of this setting depends on how your computed property functions are implemented. If they are pure and relatively inexpensive, you shouldn't need to enable this feature. If they have side effects that would make the order in which they are run important or are expensive enough that it would be a problem to run them multiple times for a property update, consider enabling it.

- `fastDomIf` / `setFastDomIf`

  **What does it do?** This setting enables a different implementation of `<dom-if>` that uses its host element's template stamping facilities (provided as part of `PolymerElement`) rather than including its own. This setting can help with performance but comes with a few caveats:

  - First, `fastDomIf` requires that every `<dom-if>` is in the shadow root of a Polymer element: you can't use a `<dom-if>` directly in the main document or inside a shadow root of an element that doesn't extend `PolymerElement`.

  - Second, because the `fastDomIf` implementation of `<dom-if>` doesn't include its own template stamping features, it doesn't create its own scope for property effects. This means that any properties you were previously setting on the `<dom-if>` will no longer be applied within its template, only properties of the host element are available.

  **Should I use it?** This setting is recommended as long as your app doesn't use `<dom-if>` as described in the section above.

- `removeNestedTemplates` / `setRemoveNestedTemplates`

  **What does it do?** This setting causes Polymer to remove the child `<template>` elements used by `<dom-if>` and `<dom-repeat>` from the their containing templates. This can improve the performance of cloning your component's template when new instances are created.

  **Should I use it?** This setting is generally recommended.

- `suppressTemplateNotifications` / `setSuppressTemplateNotifications`

  **What does it do?** This setting causes `<dom-if>` and `<dom-repeat>` not to dispatch `dom-change` events when their rendered content is updated. If you're using lots of `<dom-if>` and `<dom-repeat>` but not listening for these events, this setting lets you disable them and their associated dispatch work.

  You can override the global setting for an individual `<dom-if>` or `<dom-repeat>` by setting its `notify-dom-change` boolean attribute:

  ```js
  import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

  class SomeElement extends PolymerElement {
    static get properties() {
      return {
        visible: {type: Boolean, value: false},
      };
    }

    static get template() {
      return html`
        <button on-click="_toggle">Toggle</button>
        <!-- Set notify-dom-change to enable dom-change events for this particular <dom-if>. -->
        <dom-if if="[[visible]]" notify-dom-change on-dom-change="_onDomChange">
          <template>
            Hello!
          </template>
        </dom-if>
      `;
    }

    _toggle() {
      this.visible = !this.visible;
    }

    _onDomChange(e) {
      console.log("Received 'dom-change' event.");
    }
  }

  customElements.define('some-element', SomeElement);
  ```

  **Should I use it?** This setting is generally recommended.

- `legacyNoObservedAttributes` / `setLegacyNoObservedAttributes`

  **What does it do?** This setting causes `LegacyElementMixin` not to use the browser's built-in mechanism for informing elements of attribute changes (i.e. `observedAttributes` and `attributeChangedCallback`), which lets Polymer skip computing the list of attributes it tells the browser to observe. Instead, `LegacyElementMixin` simulates this behavior by overriding attribute APIs on the element and calling `attributeChangedCallback` itself.

  This setting has similar API restrictions to those of the [custom elements polyfill](https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements). You should only use the element's `setAttribute` and `removeAttribute` methods to modify attributes: using (e.g.) the element's `attributes` property to modify its attributes is not supported with `legacyNoObservedAttributes` and won't properly trigger `attributeChangedCallback` or any property effects.

  Components can override the global setting by setting their `_legacyForceObservedAttributes` property to `true`. This property's effects occur at startup; it won't have any effect if modified at runtime and should be set in the class definition.

  **Should I use it?** This setting should only be used if startup time is significantly affected by Polymer's class initialization work - for example, if you have a large number of components being loaded but are only instantiating a small subset of them. Otherwise, this setting is **not recommended**.

- `useAdoptedStyleSheetsWithBuiltCSS` / `setUseAdoptedStyleSheetsWithBuiltCSS`

  **What does it do?** If your application is uses [pre-built Shady CSS styles](https://github.com/polymer/polymer-css-build) and your browser supports [constructable stylesheet objects](https://wicg.github.io/construct-stylesheets/), this setting will cause Polymer to extract all `<style>` elements from your components' templates, join them into a single stylesheet, and share this stylesheet with all instances of the component using their shadow roots' [`adoptedStyleSheets`](https://wicg.github.io/construct-stylesheets/#dom-documentorshadowroot-adoptedstylesheets) array. This setting may improve your components' memory usage and performance depending on how many instances you create and how large their style sheets are.

  **Should I use it?** Consider using this setting if your app already uses pre-built Shady CSS styles. Note that position-dependent CSS selectors (e.g. containing `:nth-child()`) may become unreliable for siblings of your components' styles as a result of runtime-detected browser support determining if styles are removed from your components' shadow roots.

### Other new features

#### `<dom-repeat>`

- `reuseChunkedInstances`

  **What does it do?** This boolean property causes `<dom-repeat>` to reuse template instances even when `items` is replaced with a new array, matching the Polymer 1 behavior.

  By default, a `<dom-repeat>` with chunking enabled (i.e. `initialCount` >= 0) will drop all previously rendered template instances and create new ones whenever the `items` array is replaced. With `reuseChunkedInstances` set, any previously rendered template instances will instead be repopulated with data from the new array before new instances are created.

  **Should I use it?** This flag is generally recommended and can improve rendering performance of chunked `<dom-repeat>` instances with live data.

#### `LegacyElementMixin`

- `disable-upgrade`

  **What does it do?** `LegacyElementMixin` now has built-in support for the `disable-upgrade` attribute (usually provided by [`DisableUpgradeMixin`](https://polymer-library.polymer-project.org/3.0/api/mixins/disable-upgrade-mixin)) that becomes active when the global `legacyOptimizations` setting is enabled, matching the Polymer 1 behavior.

  **Should I use it?** Consider using this setting if you are already using the `legacyOptimizations` setting and migrating older components that depend on `disable-upgrade` without explicit application of `DisableUpgradeMixin`.

### Bug fixes

#### `<dom-repeat>`

- Chunking behavior

  `<dom-repeat>` no longer resets the number of rendered instances to `initialCount` when modifying `items` with `PolymerElement`'s array modification methods ([`splice`](https://polymer-library.polymer-project.org/3.0/api/mixins/element-mixin#ElementMixin-method-splice), [`push`](https://polymer-library.polymer-project.org/3.0/api/mixins/element-mixin#ElementMixin-method-push), etc.). The number of rendered instances will only be reset to `initialCount` if the `items` array itself is replaced with a new array object.

  See [#5631](https://github.com/Polymer/polymer/issues/5631) for more information.

### All commits

- [ci skip] bump to 3.4.0 ([commit](https://github.com/Polymer/polymer/commit/08585311))

- `shareBuiltCSSWithAdoptedStyleSheets` -> `useAdoptedStyleSheetsWithBuiltCSS` ([commit](https://github.com/Polymer/polymer/commit/33e14986))

- formatting ([commit](https://github.com/Polymer/polymer/commit/d0848d83))

- Fix incorrect JSDoc param name. ([commit](https://github.com/Polymer/polymer/commit/c0813cd3))

- Gate feature behind `shareBuiltCSSWithAdoptedStyleSheets`; update tests. ([commit](https://github.com/Polymer/polymer/commit/bdd76581))

- Add `shareBuiltCSSWithAdoptedStyleSheets` global setting ([commit](https://github.com/Polymer/polymer/commit/2fc9062d))

- Add stalebot config ([commit](https://github.com/Polymer/polymer/commit/b8362abb))

- Annotate more return types as !defined (#5642) ([commit](https://github.com/Polymer/polymer/commit/20b207e1))

- Ensure any previously enqueued rAF is canceled when re-rendering. Also, use instances length instead of renderedItemCount since it will be undefined on first render. ([commit](https://github.com/Polymer/polymer/commit/ddb37df9))

- Improve comment. ([commit](https://github.com/Polymer/polymer/commit/d92ff92f))

- Remove obsolete tests. ([commit](https://github.com/Polymer/polymer/commit/91f01e57))

- Simplify by making limit a derived value from existing state. This centralizes the calculation of limit based on changes to other state variables. ([commit](https://github.com/Polymer/polymer/commit/b5664cba))

- Update Sauce config to drop Safari 9, add 12 & 13. Safari 9 is now very old, and has micro task ordering bugs issues that make testing flaky. ([commit](https://github.com/Polymer/polymer/commit/a02ed026))

- Remove accidental commit of test.only ([commit](https://github.com/Polymer/polymer/commit/d67a8b51))

- When re-enabling, ensure __limit is at a good starting point and add a test for that. Also: * Ensure `__itemsArrayChanged` is cleared after every render. * Enqueue `__continueChunkingAfterRaf` before notifying renderedItemCount for safety ([commit](https://github.com/Polymer/polymer/commit/1d96db3c))

- Remove accidental commit of suite.only ([commit](https://github.com/Polymer/polymer/commit/b503db15))

- Ensure limit is reset when initialCount is disabled. Note that any falsey value for initialCount (including `0`) is interpreted as "chunking disabled". This is consistent with 1.x logic, and follows from the logic of "starting chunking by rendering zero items" doesn't really make sense. ([commit](https://github.com/Polymer/polymer/commit/60f6ccfb))

- Updates from review. * Refactoring `__render` for readability * Removing `__pool`; this was never used in v2: since we reset the pool every update and items are only ever pushed at detach time and we only detach at the end of updates (as opposed to v1 which had more sophisticated splicing) ([commit](https://github.com/Polymer/polymer/commit/0797488b))

- Store syncInfo on the dom-if, but null it in teardown. (same as invalidProps for non-fastDomIf) ([commit](https://github.com/Polymer/polymer/commit/fe86a8c8))

- Fixes for several related dom-repeat chunking issues. Fixes #5631. * Only restart chunking (resetting the list to the initialCount) if the `items` array itself changed (and not splices to the array), to match Polymer 1 behavior. * Add `reuseChunkedInstances` option to allow reusing instances even when `items` changes; this is likely the more common optimal case when using immutable data, but making it optional for backward compatibility. * Only measure render time and throttle the chunk size if we rendered a full chunk of new items. Ensures that fast re-renders of existing items don't cause the chunk size to scale up dramatically, subsequently causing too many new items to be created in one chunk. * Increase the limit by the chunk size as part of any render if there are new items to render, rather than only as a result of rendering. * Continue chunking by comparing the filtered item count to the limit (not the unfiltered item count). ([commit](https://github.com/Polymer/polymer/commit/b40840b9))

- Update comment. ([commit](https://github.com/Polymer/polymer/commit/b9bbee2c))

- Store syncInfo on instance and don't sync paths. Fixes #5629 ([commit](https://github.com/Polymer/polymer/commit/353eabde))

- Avoid Array.find (doesn't exist in IE) ([commit](https://github.com/Polymer/polymer/commit/5383f5f2))

- Add comment to skip. ([commit](https://github.com/Polymer/polymer/commit/7df89ae2))

- Skip test when custom elements polyfill is in use ([commit](https://github.com/Polymer/polymer/commit/fb1a7835))

- Copy flag to a single location rather than two. ([commit](https://github.com/Polymer/polymer/commit/688243b3))

- Lint fix. ([commit](https://github.com/Polymer/polymer/commit/3fd96719))

- Update test name. ([commit](https://github.com/Polymer/polymer/commit/dfd0e641))

- Introduce opt-out per class for `legacyNoObservedAttributes` ([commit](https://github.com/Polymer/polymer/commit/eaca1954))

- Ensure telemetry system works with `legacyNoObservedAttributes` setting ([commit](https://github.com/Polymer/polymer/commit/63addd39))

- Update package-lock.json ([commit](https://github.com/Polymer/polymer/commit/a7ffc390))

- Update test/unit/inheritance.html ([commit](https://github.com/Polymer/polymer/commit/47a54ef8))

- Fix testing issues with latest webcomponentsjs ([commit](https://github.com/Polymer/polymer/commit/61a14c17))

- Allow `undefined` in legacy _template field to fall-through to normal lookup path. ([commit](https://github.com/Polymer/polymer/commit/220099cf))

- re-add npm cache ([commit](https://github.com/Polymer/polymer/commit/700c2b0c))

- regen package-lock ([commit](https://github.com/Polymer/polymer/commit/168572a7))

- mispelled services, node 10 for consistency ([commit](https://github.com/Polymer/polymer/commit/15dba241))

- modernize travis ([commit](https://github.com/Polymer/polymer/commit/148b2ea2))

- Adds support for imperatively created elements to `legacyNoObservedAttributes` ([commit](https://github.com/Polymer/polymer/commit/28f12ca9))

- Rebase sanitize dom value getter onto legacy-undefined-noBatch (#5618) ([commit](https://github.com/Polymer/polymer/commit/afdd9119))

- Add getSanitizeDOMValue to settings API (#5617) ([commit](https://github.com/Polymer/polymer/commit/aec4cb68))

- FIx closure annotation ([commit](https://github.com/Polymer/polymer/commit/15ce881f))

- Fix closure annotation. ([commit](https://github.com/Polymer/polymer/commit/0427abe4))

- `legacyNoObservedAttributes`: Ensure user created runs before attributesChanged ([commit](https://github.com/Polymer/polymer/commit/c6675db0))

- Enable tests for `legacyNoObservedAttributes` ([commit](https://github.com/Polymer/polymer/commit/b8315d60))

- Only auto-use disable-upgrade if legacyOptimizations is set. ([commit](https://github.com/Polymer/polymer/commit/99b87649))

- Adds disable-upgrade functionality directly to LegacyElementMixin ([commit](https://github.com/Polymer/polymer/commit/a4b4723f))

- Add doc comment ([commit](https://github.com/Polymer/polymer/commit/12c39131))

- Lint fixes. ([commit](https://github.com/Polymer/polymer/commit/fa5570b1))

- Update externs. ([commit](https://github.com/Polymer/polymer/commit/41df9a59))

- Update extern format. ([commit](https://github.com/Polymer/polymer/commit/3c128fa2))

- Address review feedback. ([commit](https://github.com/Polymer/polymer/commit/957c8c4d))

- Address review feedback ([commit](https://github.com/Polymer/polymer/commit/f8dfaa56))

- Lint fixes. ([commit](https://github.com/Polymer/polymer/commit/7b0c57a4))

- Adds `legacyNoAttributes` setting ([commit](https://github.com/Polymer/polymer/commit/8ef2cc70))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/640bc80a))

- Update polymer externs for new settings. ([commit](https://github.com/Polymer/polymer/commit/5d130fae))

- Update lib/utils/settings.js ([commit](https://github.com/Polymer/polymer/commit/dbd9140a))

- Changes based on review. ([commit](https://github.com/Polymer/polymer/commit/124d878e))

- Add basic support for `adoptedStyleSheets` ([commit](https://github.com/Polymer/polymer/commit/ab04377b))

- [ci skip] Add/fix comments per review. ([commit](https://github.com/Polymer/polymer/commit/cbc722b1))

- Add missing externs for global settings. ([commit](https://github.com/Polymer/polymer/commit/7fa78973))

- Revert optimization to not wrap change notifications. This was causing a number of rendering tests to fail. Needs investigation, but possibly because wrapping calls ShadyDOM.flush, and this alters distribution timing which some tests may have inadvertently relied on. ([commit](https://github.com/Polymer/polymer/commit/848e8c9b))

- Reintroduce suppressTemplateNotifications and gate Dom-change & renderedItemCount on that. Matches Polymer 1 setting for better backward compatibility. ([commit](https://github.com/Polymer/polymer/commit/d64ee9ef))

- Add notifyDomChange back to dom-if & dom-repeat to match P1. ([commit](https://github.com/Polymer/polymer/commit/e9e0cd17))

- Simplify host stack, set __dataHost unconditionally, and make _registerHost patchable. ([commit](https://github.com/Polymer/polymer/commit/929d056b))

- Move @private annotation to decorate class definition. ([commit](https://github.com/Polymer/polymer/commit/534654de))

- Add type for _overrideLegacyUndefined. ([commit](https://github.com/Polymer/polymer/commit/a7866b36))

- Attempt to fix travis issues ([commit](https://github.com/Polymer/polymer/commit/e2895403))

- Revert `isAttached` change based on review feedback. Deemed a breaking change. ([commit](https://github.com/Polymer/polymer/commit/1ff51e68))

- Update travis to use xenial distro and, latest Firefox, and node 10 ([commit](https://github.com/Polymer/polymer/commit/9c80994f))

- Applies micro-optimizations and removes obsolete settings ([commit](https://github.com/Polymer/polymer/commit/280f4f0a))

- Work around Closure Compiler bug to avoid upcoming type error ([commit](https://github.com/Polymer/polymer/commit/5382e2ca))

- Only import each file once (#5588) ([commit](https://github.com/Polymer/polymer/commit/27779a32))

- Avoid Array.from on Set. ([commit](https://github.com/Polymer/polymer/commit/991b0997))

- Update nested template names. ([commit](https://github.com/Polymer/polymer/commit/dc0754ee))

- Add runtime stamping tests around linking & unlinking effects. ([commit](https://github.com/Polymer/polymer/commit/9e106d82))

- Ensure parent is linked to child templateInfo. Fixes fastDomIf unstopping issue. ([commit](https://github.com/Polymer/polymer/commit/5e1a8b6d))

- Remove unused TemplateInfo properties from types. ([commit](https://github.com/Polymer/polymer/commit/5d6f34f5))

- Add other used TemplateInfo property types. ([commit](https://github.com/Polymer/polymer/commit/93854364))

- Add type for TemplateInfo#parent. ([commit](https://github.com/Polymer/polymer/commit/2697cf10))

- [ci-skip] Add comment explaining confusing check in _addPropertyToAttributeMap ([commit](https://github.com/Polymer/polymer/commit/c65a58ae))

- Ensure clients are flushed when runtime stamping via `_stampTemplate`. Maintains flush semantics with Templatizer stamping (relevant to fastDomIf, which is a switch between Templatizer-based stamping and runtime _stampTemplate-based stamping). Works around an issue with `noPatch` where nested undistributed dom-if's won't stamp.  The changes to the tests are to remove testing that the full host tree is correct since the host doing the runtime stamping will no longer be the DOM getRootNode().host at ready time (this is exactly the case with Templatizer, whose semantics we intend to match). ([commit](https://github.com/Polymer/polymer/commit/7e7febc3))

- Fix template-finding issue with DisableUpgrade mixin. The existing rules are that `prototype._template` is first priority and dom-module via `is` is second priority _for a given class_. A subclass has a new shot at overriding the previous template either by defining a new `prototype._template` or a new `is` resulting in a dom-module lookup.  However, trivially subclassing a Polymer legacy element breaks these rules, since if there is no _own_ `prototype._template` on the current class, it will lookup a dom-module using `is` from up the entire prototype chain. This defeats the rule that a `prototype._template` on the superclass should have taken priority over its dom-module.  This change ensures that we only lookup dom-module if the class has an _own_ is property. ([commit](https://github.com/Polymer/polymer/commit/e534c3cf))

- Fix issue with camel cased properties and disable-upgrade ([commit](https://github.com/Polymer/polymer/commit/f95fd327))

- More closure fixes. ([commit](https://github.com/Polymer/polymer/commit/04ddc240))

- closure fixes ([commit](https://github.com/Polymer/polymer/commit/2bb488c8))

- lint fixes ([commit](https://github.com/Polymer/polymer/commit/11256634))

- Fix issue with defaults overriding bound values when disable-upgrade is used. ([commit](https://github.com/Polymer/polymer/commit/cd6d5d01))

- Add closure types ([commit](https://github.com/Polymer/polymer/commit/69140787))

- Use DisbleUpgradeMixin in legacy class generation ([commit](https://github.com/Polymer/polymer/commit/2203dae3))

- Add comment about why code is duplicated. ([commit](https://github.com/Polymer/polymer/commit/f4943890))

- Add tests for connected/disconnected while disabled ([commit](https://github.com/Polymer/polymer/commit/658c885c))

- Improve comments. ([commit](https://github.com/Polymer/polymer/commit/1e8b656c))

- Added comments. ([commit](https://github.com/Polymer/polymer/commit/d6f3a9ff))

- Fix typo and improve readbility ([commit](https://github.com/Polymer/polymer/commit/933995a0))

- Enable disable-upgrade when `legacyOptimizations` is set to true ([commit](https://github.com/Polymer/polymer/commit/f2784343))

- Remove use of Object.create on template info (significant perf impact). ([commit](https://github.com/Polymer/polymer/commit/309f77ba))

- Attempt to sync host properties on every call to _showHideChildren. Fixes an issue where a dom-if that is toggled synchronously true-false-true could fail to sync properties invalidated while false, since the hidden state is only checked at render timing, and the newly added dirty-check could fail if the hidden state has been changed back to its initial value. ([commit](https://github.com/Polymer/polymer/commit/e772ed0c))

- Add tests for extension and dom-if/repeat ([commit](https://github.com/Polymer/polymer/commit/2c264c67))

- Update stand alone disable-upgrade mixin. ([commit](https://github.com/Polymer/polymer/commit/e0ba67c4))

- Remove cruft from test ([commit](https://github.com/Polymer/polymer/commit/872094a2))

- Simplify logic for disable-upgrade ([commit](https://github.com/Polymer/polymer/commit/9c6f2661))

- Use a safer flag, based on internal testing. ([commit](https://github.com/Polymer/polymer/commit/c563d5a3))

- Reorder based on review feedback. ([commit](https://github.com/Polymer/polymer/commit/b5f8a6de))

- Fix closure type. ([commit](https://github.com/Polymer/polymer/commit/d32d300e))

- Updated comment. ([commit](https://github.com/Polymer/polymer/commit/53119175))

- Ensure hasPaths is also accumulated as part of info necessary to sync. ([commit](https://github.com/Polymer/polymer/commit/89d70557))

- Fix one more closure annotation. ([commit](https://github.com/Polymer/polymer/commit/3d09455b))

- Simplify algorithm; we already have list of computed deps in effect list. ([commit](https://github.com/Polymer/polymer/commit/064d0eff))

- Build computed graph from dependencies, rather than properties. ([commit](https://github.com/Polymer/polymer/commit/567e4640))

- Fix closure annotations for dom-if. ([commit](https://github.com/Polymer/polymer/commit/cee1893b))

- Avoid lint warnings. ([commit](https://github.com/Polymer/polymer/commit/18adf5fb))

- Minor simplifications/comments. ([commit](https://github.com/Polymer/polymer/commit/4f9fda06))

- Updates from review. ([commit](https://github.com/Polymer/polymer/commit/f0cbc837))

- Closure type fixes. ([commit](https://github.com/Polymer/polymer/commit/ff25283a))

- Initialize all settings from Polymer object when available. ([commit](https://github.com/Polymer/polymer/commit/df1eb73b))

- Fix host prop merging. ([commit](https://github.com/Polymer/polymer/commit/e4eb9f22))

- Updates based on review. ([commit](https://github.com/Polymer/polymer/commit/39207cce))

- Fix defaults back to false for new settings. ([commit](https://github.com/Polymer/polymer/commit/4bdbe925))

- Add a dirty check to showHideChildren ([commit](https://github.com/Polymer/polymer/commit/0ba19b4e))

- Fix host property syncing ([commit](https://github.com/Polymer/polymer/commit/fc693a09))

- Adds disable-upgrade directly into legacy `Polymer` elements ([commit](https://github.com/Polymer/polymer/commit/9756d861))

- Refactor DomIf into separate subclasses. ([commit](https://github.com/Polymer/polymer/commit/c2f31eda))

- Runtime stamped dom-if ([commit](https://github.com/Polymer/polymer/commit/e690dfe2))

- dom-if/dom-repeat bind-to-parent ([commit](https://github.com/Polymer/polymer/commit/27ed93af))

- Fix a few closure compiler issues ([commit](https://github.com/Polymer/polymer/commit/d55b9cb5))

- [ci skip] Add comment ([commit](https://github.com/Polymer/polymer/commit/70337ac8))

- Fix typo in comment ([commit](https://github.com/Polymer/polymer/commit/61715f1d))

- Cleanup, add tests. * remove old implementation * add API docs * rename some API * add dynamicFn to dep count * add test for method as dependency ([commit](https://github.com/Polymer/polymer/commit/b065d145))

- [wip] Add additional topo-sort based algorithm. ([commit](https://github.com/Polymer/polymer/commit/7cda770e))

- Dedupe against a single turn on only under orderedComputed ([commit](https://github.com/Polymer/polymer/commit/fc49a925))

- Fix closure issues ([commit](https://github.com/Polymer/polymer/commit/42dd361f))

- Add hasPaths optimziation ([commit](https://github.com/Polymer/polymer/commit/ef0efa6e))

- Minor comment updates ([commit](https://github.com/Polymer/polymer/commit/9ed31895))

- Evaluate computed property dependencies first. Fixes #5143 ([commit](https://github.com/Polymer/polymer/commit/832fcdec))

- Add more externs ([commit](https://github.com/Polymer/polymer/commit/2ed3bfac))

- Fix lint warnings ([commit](https://github.com/Polymer/polymer/commit/4151ef4d))

- Add comments per review feedback ([commit](https://github.com/Polymer/polymer/commit/bef674a9))

- Add legacyNotifyOrder.  Improve comments. ([commit](https://github.com/Polymer/polymer/commit/52fe20da))

- Add test for literal-only static function. ([commit](https://github.com/Polymer/polymer/commit/4c65db8d))

- Remove unnecessary literal check ([commit](https://github.com/Polymer/polymer/commit/bf05e383))

- Simplify ([commit](https://github.com/Polymer/polymer/commit/11bdc39a))

- Add templatizer warnings. Move to legacyWarnings flag. ([commit](https://github.com/Polymer/polymer/commit/aa63db00))

- Add legacyUndefined and legacyNoBatch to externs ([commit](https://github.com/Polymer/polymer/commit/cc7d4cc8))

- NOOP has to be an array for closure compiler ([commit](https://github.com/Polymer/polymer/commit/e351f4dd))

- Add comments on warning limitations. ([commit](https://github.com/Polymer/polymer/commit/940d1a7a))

- Ensure properties are set one-by-one at startup. ([commit](https://github.com/Polymer/polymer/commit/add77842))

- Remove unnecessary qualification. ([commit](https://github.com/Polymer/polymer/commit/2874c86d))

- Avoid over-warning on templatizer props and "static" dynamicFns. ([commit](https://github.com/Polymer/polymer/commit/c966eb1f))

- Store splices directly on array when `legacyUndefined` is set ([commit](https://github.com/Polymer/polymer/commit/e29a3150))

- Fix test ([commit](https://github.com/Polymer/polymer/commit/32c30837))

- Add arg length check ([commit](https://github.com/Polymer/polymer/commit/6139e889))

- Adds `legacyNoBatch` setting ([commit](https://github.com/Polymer/polymer/commit/363bef2c))

- Add tests for `legacyUndefined` setting ([commit](https://github.com/Polymer/polymer/commit/52a559fc))

- Adds `legacyUndefined` setting ([commit](https://github.com/Polymer/polymer/commit/987ae2c4))

## [v3.3.1](https://github.com/Polymer/polymer/tree/v3.3.1) (2019-11-08)
- [ci skip] bump to 3.3.1 ([commit](https://github.com/Polymer/polymer/commit/11f1f139))

- Remove TimvdLippe from CODEOWNERS ([commit](https://github.com/Polymer/polymer/commit/b99c2997))

- Add node field to PolymerDomApi ([commit](https://github.com/Polymer/polymer/commit/15747c83))

- Improve types for the template field on Polymer elements. (#5596) ([commit](https://github.com/Polymer/polymer/commit/4274bcec))

- Add module field ([commit](https://github.com/Polymer/polymer/commit/9a4d4d9a))

- Wrap other `hasOwnProperty` checks in `JSCompiler_renameProperty`. ([commit](https://github.com/Polymer/polymer/commit/0541b21a))

- Wrap `hasOwnProperty` checks for `__hasRegisterFinished` in `JSCompiler_renameProperty()`. ([commit](https://github.com/Polymer/polymer/commit/9e90fd2e))

- Fix typing error in fixPlaceholder ([commit](https://github.com/Polymer/polymer/commit/f050ce9e))

- Fix up comments based on feedback ([commit](https://github.com/Polymer/polymer/commit/ab49f51a))

- Workaround bindings to textarea.placeholder in IE ([commit](https://github.com/Polymer/polymer/commit/61767da2))

- Add additional externs (#5575) ([commit](https://github.com/Polymer/polymer/commit/69ee4688))

- Make Closure compiler happier about ShadyDOM access ([commit](https://github.com/Polymer/polymer/commit/46ee2aec))

- Remove other double import (#5565) ([commit](https://github.com/Polymer/polymer/commit/0d2c2e5d))

- Only use CONST_CASE for constants. (#5564) ([commit](https://github.com/Polymer/polymer/commit/54f8b47f))

- [skip ci] update changelog ([commit](https://github.com/Polymer/polymer/commit/ac12b3bc))

## [v3.3.0](https://github.com/Polymer/polymer/tree/v3.3.0) (2019-06-24)
- [ci skip] Update version to 3.3.0 ([commit](https://github.com/Polymer/polymer/commit/dd7c0d70))

- Don't import/export from the same file twice (#5562) ([commit](https://github.com/Polymer/polymer/commit/94585c31))

- Add @override, remove @attribute/@group/@hero/@homepage ([commit](https://github.com/Polymer/polymer/commit/ed7709f6))

- Closure compilation tweaks ([commit](https://github.com/Polymer/polymer/commit/15090f26))

- Add @return description ([commit](https://github.com/Polymer/polymer/commit/a6bff436))

- Fix some Closure annotations ([commit](https://github.com/Polymer/polymer/commit/0810bf3e))

- Pin to firefox 66 because of selenium error ([commit](https://github.com/Polymer/polymer/commit/f0fb532d))

- Fix eslint errors. ([commit](https://github.com/Polymer/polymer/commit/6dfaa5f0))

- Add some casts for places Closure doesn't understand constructor ([commit](https://github.com/Polymer/polymer/commit/10d43ce8))

- Add new mixin annotations, remove GestureEventListeners alias ([commit](https://github.com/Polymer/polymer/commit/0ae14b9c))

- Align signatures of attributeChangedCallback ([commit](https://github.com/Polymer/polymer/commit/4cc6c339))

- Add @return annotation for PROPERTY_EFFECT_TYPES getter ([commit](https://github.com/Polymer/polymer/commit/3dd189c4))

- Annotate __dataEnabled in a way analyzer understands ([commit](https://github.com/Polymer/polymer/commit/e4e9e2fb))

- Fix old global namespace type annotation for TemplateInstanceBase ([commit](https://github.com/Polymer/polymer/commit/fc190dd5))

- Add @suppress annotation for use of deprecated cssFromModules ([commit](https://github.com/Polymer/polymer/commit/54b1d78d))

- Fix GestureEventListeners generated externs name. ([commit](https://github.com/Polymer/polymer/commit/cdd4e204))

- Globally hide dom-{bind,if,repeat} elements with legacyOptmizations on ([commit](https://github.com/Polymer/polymer/commit/43f57b10))

- Update dependencies to fix firefox 67 tests ([commit](https://github.com/Polymer/polymer/commit/ff2edd5c))

- Sync closure compiler annotations ([commit](https://github.com/Polymer/polymer/commit/ad084201))

- remove unused variable in test ([commit](https://github.com/Polymer/polymer/commit/c051c5bb))

- remove debugger line ([commit](https://github.com/Polymer/polymer/commit/634d736c))

- Make sure scopeSubtree does not recurse through other ShadowRoots ([commit](https://github.com/Polymer/polymer/commit/8a5c1e9b))

- Don't set display: none under legacyOptimizations. Fixes #5541. ([commit](https://github.com/Polymer/polymer/commit/c9cf56c0))

- Use Array.from instead of a list comprehension ([commit](https://github.com/Polymer/polymer/commit/338d420c))

- Add check for // ([commit](https://github.com/Polymer/polymer/commit/3db56085))

- Use native qSA ([commit](https://github.com/Polymer/polymer/commit/e10019a0))

- Implement scopeSubtree for ShadyDOM noPatch mode ([commit](https://github.com/Polymer/polymer/commit/6bc95340))

- Remove unneccessary test ([commit](https://github.com/Polymer/polymer/commit/1f080595))

- Add URL try/catch ([commit](https://github.com/Polymer/polymer/commit/940b3cdc))

- Upstreaming cl/245273850 ([commit](https://github.com/Polymer/polymer/commit/413ef2fb))

- Allow configuring cancelling synthetic click behavior ([commit](https://github.com/Polymer/polymer/commit/00d4cdf4))

- Add test for class$ binding ([commit](https://github.com/Polymer/polymer/commit/8043d4c1))

- Fix class$ bindings for ShadyDOM.noPatch mode ([commit](https://github.com/Polymer/polymer/commit/a0b83b25))

- Add test for resolveUrl('//') ([commit](https://github.com/Polymer/polymer/commit/55373808))

- Check directly for // in resolveUrl because it isn't a valid URL ([commit](https://github.com/Polymer/polymer/commit/d0ea20a1))

- Run resolveUrl for protocol-relative urls (#5530) ([commit](https://github.com/Polymer/polymer/commit/733cf683))

- Fix lint ([commit](https://github.com/Polymer/polymer/commit/6960c2b9))

- Cast GestureEventListeners. ([commit](https://github.com/Polymer/polymer/commit/34373349))

- Work around https://github.com/google/closure-compiler/issues/3240 ([commit](https://github.com/Polymer/polymer/commit/cc7702b4))

- Fix `localTareget` when `ShadyDOM.noPatch` is in use ([commit](https://github.com/Polymer/polymer/commit/7925254b))

- webcomponentsjs 2.2.10 ([commit](https://github.com/Polymer/polymer/commit/002a4319))

- upgrade dependencies. ([commit](https://github.com/Polymer/polymer/commit/3b7c9f8e))

- upgrade webcomponentsjs to 2.2.9 ([commit](https://github.com/Polymer/polymer/commit/4e60395a))

- [ci skip] Add comment ([commit](https://github.com/Polymer/polymer/commit/c7eb7c19))

- Use `attachShadow({shadyUpgradeFragment})` ([commit](https://github.com/Polymer/polymer/commit/3af9f340))

- Remove test.only ([commit](https://github.com/Polymer/polymer/commit/ca124480))

- Ensure wildcard arguments get undefined treatment. Fixes #5428. ([commit](https://github.com/Polymer/polymer/commit/f5a45ebc))

- Fix typo ([commit](https://github.com/Polymer/polymer/commit/6adbc23c))

- Fix `className` on browsers without good native accessors ([commit](https://github.com/Polymer/polymer/commit/b13e656f))

- don't depend on `attachDom` existing. ([commit](https://github.com/Polymer/polymer/commit/8d7def72))

- Simplify ([commit](https://github.com/Polymer/polymer/commit/f1a9d4fa))

- Avoid upgrading template if no hostProps, for better perf. ([commit](https://github.com/Polymer/polymer/commit/65a5b48c))

- Update webcomponents dev dependency for testing className fix ([commit](https://github.com/Polymer/polymer/commit/a1c67e45))

- fix closure compiler error ([commit](https://github.com/Polymer/polymer/commit/002ef94e))

- fix lint issues ([commit](https://github.com/Polymer/polymer/commit/439c2455))

- Address review feedback via comment. ([commit](https://github.com/Polymer/polymer/commit/4e1d6a1a))

- Ensure `className` bindings work correctly when `ShadyDOM.noPatch` is used. ([commit](https://github.com/Polymer/polymer/commit/eb2385aa))

- Remove use of TreeWalker for finding nodes in templates. ([commit](https://github.com/Polymer/polymer/commit/24d642ec))

- Remove Google+ links in README.md and CONTRIBUTING.MD ([commit](https://github.com/Polymer/polymer/commit/dc880571))

- Use correct ShadyDOM API: `attachDom` ([commit](https://github.com/Polymer/polymer/commit/1aeaa801))

- Use `ShadyDOM.upgrade` ([commit](https://github.com/Polymer/polymer/commit/50ba9cea))

## [v3.2.0](https://github.com/Polymer/polymer/tree/v3.2.0) (2019-03-21)
- [ci skip] update polymer version ([commit](https://github.com/Polymer/polymer/commit/48769c4b))

- Fix lint ([commit](https://github.com/Polymer/polymer/commit/4cd70333))

- Add tests. ([commit](https://github.com/Polymer/polymer/commit/5886be5d))

- Ensure debouncer is removed from queue before running callback. ([commit](https://github.com/Polymer/polymer/commit/a23ac645))

- Don't clear set at end for flush reentrancy safety; canceling removes from set ([commit](https://github.com/Polymer/polymer/commit/3b164761))

- Assert the callback was called. ([commit](https://github.com/Polymer/polymer/commit/d48336d6))

- Ensure the debouncer is not already canceled before canceling. ([commit](https://github.com/Polymer/polymer/commit/fed97654))

- Fix a couple of closure type issues. * gestures - update internal type changes * debounce - fix mistaken return type ([commit](https://github.com/Polymer/polymer/commit/eb725f7f))

- Revert to `getStyle()` ([commit](https://github.com/Polymer/polymer/commit/03aec686))

- Fix getStyle definition ([commit](https://github.com/Polymer/polymer/commit/f13dd75f))

- Add extra test ([commit](https://github.com/Polymer/polymer/commit/62cf9d98))

- Use in check rather than undefined. ([commit](https://github.com/Polymer/polymer/commit/c467c345))

- Allow value to merge from previous behavior property declaration. Fixes #5503 ([commit](https://github.com/Polymer/polymer/commit/bc258d6f))

- Fix/suppress upcoming JSCompiler build errors ([commit](https://github.com/Polymer/polymer/commit/0d0da569))

- Add comment about flush order when re-debouncing ([commit](https://github.com/Polymer/polymer/commit/b63c887f))

- FIx lint ([commit](https://github.com/Polymer/polymer/commit/1e56b0e9))

- Remove debug code ([commit](https://github.com/Polymer/polymer/commit/cc6ef0e1))

- Re-add the queue removal in setConfig ([commit](https://github.com/Polymer/polymer/commit/be1afacc))

- Remove debug code ([commit](https://github.com/Polymer/polymer/commit/b750a52d))

- Remove test.only ([commit](https://github.com/Polymer/polymer/commit/1526626b))

- Fix order of flushed debouncers to match 1.x ([commit](https://github.com/Polymer/polymer/commit/b9d49597))

- Add comments and avoid Array.fill ([commit](https://github.com/Polymer/polymer/commit/567c10b3))

- Use set and clear debouncer upon completion. Fixes #5250. ([commit](https://github.com/Polymer/polymer/commit/e8c24ff4))

- Added comment based on review feedback. ([commit](https://github.com/Polymer/polymer/commit/764a233c))

- Add property reflection to notify path and friends calls to support closure-compiler renaming. ([commit](https://github.com/Polymer/polymer/commit/ad05f567))

- Add `classList` to `Polymer.dom` when `ShadyDOM.noPatch` is used ([commit](https://github.com/Polymer/polymer/commit/18ba9ae0))

- Update externs from internal ([commit](https://github.com/Polymer/polymer/commit/e35a1a7c))

- Use webcomponents 2.2.7 for initialSync tests ([commit](https://github.com/Polymer/polymer/commit/073d25f6))

- Add `@fileoverview`, put `@suppress` after it ([commit](https://github.com/Polymer/polymer/commit/aba0f904))

- address feedback ([commit](https://github.com/Polymer/polymer/commit/4321da01))

- use JSCompiler_renameProperty bare ([commit](https://github.com/Polymer/polymer/commit/fb246562))

- Remove semicolon after class definition (lint). ([commit](https://github.com/Polymer/polymer/commit/ae899c54))

- Refactor symbols to make gen-typescript-declarations happy ([commit](https://github.com/Polymer/polymer/commit/4a24ba3c))

- Ensure argument types match. ([commit](https://github.com/Polymer/polymer/commit/42735d11))

- Backport closure compiler fixes from internal ([commit](https://github.com/Polymer/polymer/commit/e3c6b254))

- Fix test warning in Edge/IE ([commit](https://github.com/Polymer/polymer/commit/a272506c))

- Fix test in IE/Edge ([commit](https://github.com/Polymer/polymer/commit/391715fb))

- Update package-lock ([commit](https://github.com/Polymer/polymer/commit/c93fc482))

- Update webcomponents vesrion. ([commit](https://github.com/Polymer/polymer/commit/0a91b158))

- Remove unused import ([commit](https://github.com/Polymer/polymer/commit/21e83e9e))

- Add comment re: undefined issue ([commit](https://github.com/Polymer/polymer/commit/67caf458))

- Move undeclared property warning to element-mixin. ([commit](https://github.com/Polymer/polymer/commit/11cd9cb2))

- Add issue for TODO ([commit](https://github.com/Polymer/polymer/commit/d3f27d0a))

- Upgrade wcjs ([commit](https://github.com/Polymer/polymer/commit/c309fef6))

- Fix lint errors. ([commit](https://github.com/Polymer/polymer/commit/0c85340b))

- Upgrade wcjs ([commit](https://github.com/Polymer/polymer/commit/09fa9854))

- Updates based on review. ([commit](https://github.com/Polymer/polymer/commit/98304fb6))

- Add better messaging for scoping test ([commit](https://github.com/Polymer/polymer/commit/4fcd9512))

- Remove addressed TODO comment. ([commit](https://github.com/Polymer/polymer/commit/28f2281b))

- Clarify warning. Add comment. ([commit](https://github.com/Polymer/polymer/commit/9dea1f78))

- Add warnings for disabling boolean settings. ([commit](https://github.com/Polymer/polymer/commit/35c48d89))

- Upgrade webcomponentsjs ([commit](https://github.com/Polymer/polymer/commit/6bd15ccb))

- Upgrade webcomponentsjs ([commit](https://github.com/Polymer/polymer/commit/2480b259))

- Refactor to make code more readable, add tests, remove dead code. ([commit](https://github.com/Polymer/polymer/commit/c78f6799))

- Adds `syncInitialRender` setting ([commit](https://github.com/Polymer/polymer/commit/d4857ecc))

- Ensure that marshalArgs pulls wildcard info value from __data It currently pulls the value from `changedProps` rather than __data, meaning it could provide stale data for re-entrant changes. ([commit](https://github.com/Polymer/polymer/commit/4d99099d))

- Fix lint warning ([commit](https://github.com/Polymer/polymer/commit/563bc858))

- Add warning for redeclared computed properties. ([commit](https://github.com/Polymer/polymer/commit/007f3cc2))

- Add warning for undeclared properties used in bindings. ([commit](https://github.com/Polymer/polymer/commit/63dadbf2))

- Make initial distribution synchronous when `legacyOptimizations` is set ([commit](https://github.com/Polymer/polymer/commit/fc7858ce))

- Ensure dispatchEvent is wrapped ([commit](https://github.com/Polymer/polymer/commit/491c2a77))

- Disable auto `strip-whitespace` on template with legacyOptimizations ([commit](https://github.com/Polymer/polymer/commit/d577c8c8))

- Add tests for calling Polymer() with ES6 class ([commit](https://github.com/Polymer/polymer/commit/3ff4ed1b))

- use a regular for-loop intead of for-of ([commit](https://github.com/Polymer/polymer/commit/86db24cd))

- Lint clean ([commit](https://github.com/Polymer/polymer/commit/bdcd37c5))

- Remove `@override` from static methods on mixins. ([commit](https://github.com/Polymer/polymer/commit/f15b137d))

- Externs should use var instead of let ([commit](https://github.com/Polymer/polymer/commit/7745d431))

- Add @suppress annotations for missing property checks. ([commit](https://github.com/Polymer/polymer/commit/7f2d736a))

- Allow `Polymer({})` calls with ES6 class ([commit](https://github.com/Polymer/polymer/commit/3624a140))

- [wrap] Fix doc comment. ([commit](https://github.com/Polymer/polymer/commit/8e506028))

- Fix typo ([commit](https://github.com/Polymer/polymer/commit/d8aac3b5))

- Make sure `_valueToNodeAttribute` uses wrap ([commit](https://github.com/Polymer/polymer/commit/4e4d6fe4))

- Suppress upcoming jscompiler errors. ([commit](https://github.com/Polymer/polymer/commit/cf2cd05e))

- compromise with typescript and closure ([commit](https://github.com/Polymer/polymer/commit/e73285b3))

- Closure typing fixes ([commit](https://github.com/Polymer/polymer/commit/e4b56e46))

- Add type jsdoc to templatize root property. ([commit](https://github.com/Polymer/polymer/commit/0da022fd))

- Remove meaningless "undefined" in settings.js ([commit](https://github.com/Polymer/polymer/commit/fcc87527))

- Make `noPatch` safe with older versions of ShadyDOM ([commit](https://github.com/Polymer/polymer/commit/a2e597c2))

- Temporarily disable type genration ([commit](https://github.com/Polymer/polymer/commit/bade986e))

- Changes based on review. ([commit](https://github.com/Polymer/polymer/commit/8954c251))

- Changes based on review. ([commit](https://github.com/Polymer/polymer/commit/42b13d0a))

- More shady compatible wrapping ([commit](https://github.com/Polymer/polymer/commit/b8f3b79c))

- Fix typos ([commit](https://github.com/Polymer/polymer/commit/acbe6496))

- Update to match 2.x branch ([commit](https://github.com/Polymer/polymer/commit/e3b3baa7))

- Revert "Manual merge from `perf-opt-disable-upgrade` branch." ([commit](https://github.com/Polymer/polymer/commit/c3bd4d6f))

- Update Polymer 3 package-lock. ([commit](https://github.com/Polymer/polymer/commit/dfe7a54c))

- Update to webcomponentsjs 2.2.0 ([commit](https://github.com/Polymer/polymer/commit/51ebf4df))

- Update to latest webcomponentsjs ([commit](https://github.com/Polymer/polymer/commit/2c560bc1))

- Manual merge from `perf-opt-disable-upgrade` branch. ([commit](https://github.com/Polymer/polymer/commit/0f022dfe))

- Remove double-import of settings ([commit](https://github.com/Polymer/polymer/commit/5422792f))

- Document properties for eslint. ([commit](https://github.com/Polymer/polymer/commit/3a4db3b1))

- Add back event tests. ([commit](https://github.com/Polymer/polymer/commit/1bce4f08))

- Use closure-safe name ([commit](https://github.com/Polymer/polymer/commit/ed5f7f27))

- Add tests ([commit](https://github.com/Polymer/polymer/commit/f3b66755))

- Ensure properties and observers are interleaved per behavior ([commit](https://github.com/Polymer/polymer/commit/ad5cb268))

- Ensure property values are always overridden by extendors/behaviors ([commit](https://github.com/Polymer/polymer/commit/2b35a74f))

- Ensure `registered` is always called on element prototype ([commit](https://github.com/Polymer/polymer/commit/50ad018c))

- err instead of air ([commit](https://github.com/Polymer/polymer/commit/ee68ea92))

- Do lazy behavior copying only when `legacyOptimizations` is set ([commit](https://github.com/Polymer/polymer/commit/d64a9c27))

- Behavior property copying fixes ([commit](https://github.com/Polymer/polymer/commit/310c7ead))

- Ensure initial static classes are preserved when a class$ binding is present ([commit](https://github.com/Polymer/polymer/commit/65a3149b))

- Get typescript compiling again. ([commit](https://github.com/Polymer/polymer/commit/bbf24c0c))

- Remove extra space ([commit](https://github.com/Polymer/polymer/commit/82c9d17e))

- Avoid copying certain properties from behaviors ([commit](https://github.com/Polymer/polymer/commit/cf30a8cc))

- skip some tests that never really worked in ShadyDOM ([commit](https://github.com/Polymer/polymer/commit/e00bf993))

- Move __activateDir into check instead of replace ([commit](https://github.com/Polymer/polymer/commit/ec00d26b))

- Don't set up observer in ShadyDOM ([commit](https://github.com/Polymer/polymer/commit/08bc1ff5))

- Manually merge changes from #5418 ([commit](https://github.com/Polymer/polymer/commit/d5e0043a))

- Fix merge conflict around toggleAttribute ([commit](https://github.com/Polymer/polymer/commit/419dce63))

- Get Polymer compiling clean under closure recommended flags ([commit](https://github.com/Polymer/polymer/commit/566dcfae))

- Apply LegacyDataMixin to TemplatizeInstanceBase. Fixes #5422 ([commit](https://github.com/Polymer/polymer/commit/6dd34569))

- TemplateStamp ([commit](https://github.com/Polymer/polymer/commit/d57e05e5))

- Fixes #5420 ([commit](https://github.com/Polymer/polymer/commit/926a6735))

- Lint fix ([commit](https://github.com/Polymer/polymer/commit/725d52c6))

- Updates ported from `perf-opt` branch ([commit](https://github.com/Polymer/polymer/commit/a08c9840))

- rename test file. ([commit](https://github.com/Polymer/polymer/commit/b211436f))

- Check for ShadyDOM and `:dir` selectors before trying css transform ([commit](https://github.com/Polymer/polymer/commit/d290be90))

- Rename Closure V1 compatibility PolymerDomApi types for TypeScript types. ([commit](https://github.com/Polymer/polymer/commit/b34b6fcb))

- Hybrid compatibility for PolymerDomApi and Polymer.Iconset types. ([commit](https://github.com/Polymer/polymer/commit/b8e30021))

- Fix another unsafe property assignment in Polymer. ([commit](https://github.com/Polymer/polymer/commit/3ee4eb96))

- Add explicit null template for array-selector ([commit](https://github.com/Polymer/polymer/commit/d2d49dd9))

- remove cruft ([commit](https://github.com/Polymer/polymer/commit/079ac3bc))

- Adds basic legacy support for ShadyDOM.unPatch (WIP) ([commit](https://github.com/Polymer/polymer/commit/e752636c))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/2db60f5b))

- Adds setting to skip style incudes and url rewriting ([commit](https://github.com/Polymer/polymer/commit/4fcacaab))

- restores functionality of Polymer.mixinBehaviors ([commit](https://github.com/Polymer/polymer/commit/4af44c8d))

- Avoids using mixins for behaviors. ([commit](https://github.com/Polymer/polymer/commit/624513f6))

- Fix jsdoc comment ([commit](https://github.com/Polymer/polymer/commit/e69c8b3c))

- Upstream warning text. ([commit](https://github.com/Polymer/polymer/commit/b4d6e70a))

- Upstream changes to externs ([commit](https://github.com/Polymer/polymer/commit/83834aff))

## [v3.1.0](https://github.com/Polymer/polymer/tree/v3.1.0) (2018-10-26)
- update dependencies ([commit](https://github.com/Polymer/polymer/commit/99e39706))

- Add beforeRegister callback to externs ([commit](https://github.com/Polymer/polymer/commit/0492390b))

- Make toggleAttribute match with native signature (#5372) ([commit](https://github.com/Polymer/polymer/commit/693f9e4e))

- Fixed typos on lines 133 and 157 (#5409) ([commit](https://github.com/Polymer/polymer/commit/750e7e1a))

- Fix signature of toggleAttribute to match native version (#5370) ([commit](https://github.com/Polymer/polymer/commit/ce85eb99))

- Update jsdoc for PropertyEffects.splice (#5367) ([commit](https://github.com/Polymer/polymer/commit/96557f78))

- Expand type of LegacyElementMixin#listen and unlisten to accept EventTargets. ([commit](https://github.com/Polymer/polymer/commit/b55c56f7))

- Update gen-closure-declarations to 0.5.0 (#5360) ([commit](https://github.com/Polymer/polymer/commit/9dbc8728))

- Add TypeScript types for observer parameters. (#5359) ([commit](https://github.com/Polymer/polymer/commit/912c19cc))

- Add missing return type to attributeChanged ([commit](https://github.com/Polymer/polymer/commit/239e99a5))

- Add specific type for behaviors ([commit](https://github.com/Polymer/polymer/commit/bf02bd32))

- Improve typings for legacy elements ([commit](https://github.com/Polymer/polymer/commit/d6d3c822))

- Add @export ([commit](https://github.com/Polymer/polymer/commit/84b69918))

- Improve types of flattened-nodes-observer further. ([commit](https://github.com/Polymer/polymer/commit/29428a82))

- Add cast for compilation ([commit](https://github.com/Polymer/polymer/commit/b0aa913d))

- Only generate types once on Travis ([commit](https://github.com/Polymer/polymer/commit/2a497433))

- Move type generation from prepack to prepare ([commit](https://github.com/Polymer/polymer/commit/104e3e56))

- Collapse imports for file into one statement ([commit](https://github.com/Polymer/polymer/commit/82e705f7))

- Cleanup modulizer conversion leftovers (#5347) ([commit](https://github.com/Polymer/polymer/commit/448093b6))

- Add comments re: need for mixing in before metaprogramming ([commit](https://github.com/Polymer/polymer/commit/d93cbfa5))

- regen-package-lock ([commit](https://github.com/Polymer/polymer/commit/2d06ff59))

- Don't run Firefox in headless mode. ([commit](https://github.com/Polymer/polymer/commit/44fcb9db))

- Fix jsdoc syntax. ([commit](https://github.com/Polymer/polymer/commit/8d4e04bc))

- Updates based on code review. Add computed tests. ([commit](https://github.com/Polymer/polymer/commit/ae1b4173))

- Use type generator binary instead of gulp script. ([commit](https://github.com/Polymer/polymer/commit/a5afc8f1))

- Remove unnecessary @const. ([commit](https://github.com/Polymer/polymer/commit/89cc5c62))

- Add return description. ([commit](https://github.com/Polymer/polymer/commit/7901dc9d))

- Grandfather defaulting sanitizeDOMValue from legacy Polymer object. ([commit](https://github.com/Polymer/polymer/commit/d5672dcf))

- Minor changes to formatting and jsdoc ([commit](https://github.com/Polymer/polymer/commit/d5935a9c))

- Update paths in gulpfile ([commit](https://github.com/Polymer/polymer/commit/f845842f))

- Fix mixin jsdoc. ([commit](https://github.com/Polymer/polymer/commit/2d2320e5))

- Add legacy-data-mixin as 1.x->2.x/3.x migration aide. Fixes #5262. ([commit](https://github.com/Polymer/polymer/commit/e385e49b))

- Fix jsdoc to pass lint ([commit](https://github.com/Polymer/polymer/commit/33828f38))

- Add documentation to boot.js ([commit](https://github.com/Polymer/polymer/commit/27036ea6))

- The return type of mixinBehaviors is unknown ([commit](https://github.com/Polymer/polymer/commit/6cf5f9d0))

- Export EventApi, same as DomApi ([commit](https://github.com/Polymer/polymer/commit/b71f9f4e))

- Remove undocumented logging feature (#5331) ([commit](https://github.com/Polymer/polymer/commit/33ab3ae6))

- Cleanup element-mixin leftovers from modulizer ([commit](https://github.com/Polymer/polymer/commit/dae63e3d))

- Use case-map lib in a saner way. ([commit](https://github.com/Polymer/polymer/commit/7241ec58))

- Fix a grab bag of closure compiler warnings. ([commit](https://github.com/Polymer/polymer/commit/658d1cf7))

- Protect DomModule.import against renaming ([commit](https://github.com/Polymer/polymer/commit/aaf2cca0))

- Add @nocollapse for jscompiler ([commit](https://github.com/Polymer/polymer/commit/4e4db700))

- Ensure boot.js can only be parsed as a module ([commit](https://github.com/Polymer/polymer/commit/a64dfb08))

- Use simpler class declaration and export form (#5325) ([commit](https://github.com/Polymer/polymer/commit/6dc01841))

- Ensure unresolved.js is an es module (#5324) ([commit](https://github.com/Polymer/polymer/commit/20d4e35c))

- Move version to ElementMixin prototype ([commit](https://github.com/Polymer/polymer/commit/2957e9d4))

- Use relative path module specifier in gen-tsd autoImport setting. ([commit](https://github.com/Polymer/polymer/commit/76cf2af1))

- Update TemplateStamp event listen param types from Node to EventTarget. (#5320) ([commit](https://github.com/Polymer/polymer/commit/e8167f7f))

- Add test for direct assignment to template. ([commit](https://github.com/Polymer/polymer/commit/7644464c))

- Add a template setter to ElementMixin. ([commit](https://github.com/Polymer/polymer/commit/d27b4a12))

- Export the current Polymer version in polymer-element.js ([commit](https://github.com/Polymer/polymer/commit/05c62f44))

- Make Polymer gestures library safe for Closure property renaming (take 2). (#5314) ([commit](https://github.com/Polymer/polymer/commit/6847cf47))

- Make event notification handler read the value from currentTarget, (#5313) ([commit](https://github.com/Polymer/polymer/commit/db2f3cc7))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/0bf1e60c))

- Upstream externs changes for DomRepeatEvent ([commit](https://github.com/Polymer/polymer/commit/e3b9d4e6))

- Back to single template getter. Add more comments. ([commit](https://github.com/Polymer/polymer/commit/10d657b3))

- Revert to legacy template getter, update tests. ([commit](https://github.com/Polymer/polymer/commit/c4b94a02))

- More updates based on code review. ([commit](https://github.com/Polymer/polymer/commit/376f44c4))

- Fix allowTemplateFromDomModule opt-in ([commit](https://github.com/Polymer/polymer/commit/36727379))

- Fix lint warnings. ([commit](https://github.com/Polymer/polymer/commit/a199aa91))

- Updates based on code review. ([commit](https://github.com/Polymer/polymer/commit/36c4dfa9))

- npm upgrade dependencies ([commit](https://github.com/Polymer/polymer/commit/a515c992))

- Fix lint warnings. ([commit](https://github.com/Polymer/polymer/commit/a0c5268c))

- Catch errors on top window using uncaughtErrorFilter Works around safari quirk when running in iframe ([commit](https://github.com/Polymer/polymer/commit/47ade191))

- Fix latent (benign) error thrown when removing dom-if via innerHTML. ([commit](https://github.com/Polymer/polymer/commit/e3066924))

- Use setting via setStrictTemplatePolicy export. ([commit](https://github.com/Polymer/polymer/commit/8667b895))

- Add tests. ([commit](https://github.com/Polymer/polymer/commit/625372ea))

- Implement opt-in `strictTemplatePolicy` (flag TBD) - disable dom-bind - disable dom-module template lookup - disable templatizer of templates not stamped in trusted polymer template ([commit](https://github.com/Polymer/polymer/commit/2e6df0ee))

- Ensure properties is only called once ([commit](https://github.com/Polymer/polymer/commit/63c7fc00))

- Remove dom-module in test ([commit](https://github.com/Polymer/polymer/commit/617cb4c9))

## [v3.0.5](https://github.com/Polymer/polymer/tree/v3.0.5) (2018-07-30)
- Add more missing .d.ts files from being npm published. ([commit](https://github.com/Polymer/polymer/commit/f372ea89))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/1a9e81c2))

## [v3.0.4](https://github.com/Polymer/polymer/tree/v3.0.4) (2018-07-30)
- Ensure generated interfaces.d.ts is included in npm package ([commit](https://github.com/Polymer/polymer/commit/003b0518))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/028a718c))

## [v3.0.3](https://github.com/Polymer/polymer/tree/v3.0.3) (2018-07-30)
- rebuild package-lock ([commit](https://github.com/Polymer/polymer/commit/95bbefd0))

- Generate typings for Polymer 3. ([commit](https://github.com/Polymer/polymer/commit/536030ac))

- Revert Promise<void> changes. ([commit](https://github.com/Polymer/polymer/commit/ac6011e0))

- Lint fixes. ([commit](https://github.com/Polymer/polymer/commit/73ae8b4d))

- Restore some externs. ([commit](https://github.com/Polymer/polymer/commit/8b1e7934))

- Upstream a bunch of g3 changes. ([commit](https://github.com/Polymer/polymer/commit/3b817192))

- Add no-unused-vars eslint suppressions. ([commit](https://github.com/Polymer/polymer/commit/745883ea))

- Annotate another two ephemeral classes. ([commit](https://github.com/Polymer/polymer/commit/c96b4502))

- Mark some ephemeral super classes as private. ([commit](https://github.com/Polymer/polymer/commit/8728287f))

- Annotate Node parameter as not null. ([commit](https://github.com/Polymer/polymer/commit/642f94f8))

- Annotate some internal classes as private. ([commit](https://github.com/Polymer/polymer/commit/fa58519c))

- Fix some appliesMixin annotations still with Polymer namespace. ([commit](https://github.com/Polymer/polymer/commit/a0a6c6b9))

- TypeScript generator config and extra interfaces for Polymer 3. ([commit](https://github.com/Polymer/polymer/commit/3ac7eed2))

- Tweaks to make Polymer 3 more amenable to typings generation. ([commit](https://github.com/Polymer/polymer/commit/605c8912))

- Fix gulp 4 issues ([commit](https://github.com/Polymer/polymer/commit/4f0337a5))

- Extend Safari exceptions beyond 10.1 ([commit](https://github.com/Polymer/polymer/commit/a78732ff))

- Ignore shady CSS scoping in getComposedHTML ([commit](https://github.com/Polymer/polymer/commit/b1aa3058))

- Fix method to force CE polyfill on in 3.x ([commit](https://github.com/Polymer/polymer/commit/84455c9c))

- Convert object to class for better compilation ([commit](https://github.com/Polymer/polymer/commit/b2681170))

- Fix Typo in Readme (#5260) ([commit](https://github.com/Polymer/polymer/commit/665901ab))

- regen package-lock.json ([commit](https://github.com/Polymer/polymer/commit/a7152dd5))

- Update supported browsers in issue template ([commit](https://github.com/Polymer/polymer/commit/1bd28098))

- Remove modulized comment ([commit](https://github.com/Polymer/polymer/commit/07f26b26))

- Update package.lock ([commit](https://github.com/Polymer/polymer/commit/1e1709cc))

- Fix typo in jsdoc (#5248) ([commit](https://github.com/Polymer/polymer/commit/218189e2))

- Replace .npmignore with package.json "files" option. (#5245) ([commit](https://github.com/Polymer/polymer/commit/eb84ea04))

- Spelling ([commit](https://github.com/Polymer/polymer/commit/2eade585))

- Update template docs (#5233) ([commit](https://github.com/Polymer/polymer/commit/31e5d058))

- fix lint ([commit](https://github.com/Polymer/polymer/commit/44e725b8))

- Port disabled fixes from 2.x ([commit](https://github.com/Polymer/polymer/commit/358a1c67))

- Update repo URL ([commit](https://github.com/Polymer/polymer/commit/cdb34fc8))

- Add badges ([commit](https://github.com/Polymer/polymer/commit/41d69801))

- Update development instructions for 3.0 (#5226) ([commit](https://github.com/Polymer/polymer/commit/83ab5a14))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/e366b368))

- Closure extern update ([commit](https://github.com/Polymer/polymer/commit/3c23d673))

- Add user-importable files to `bower.json`'s `main` field for modulizer. ([commit](https://github.com/Polymer/polymer/commit/40e312f8))

## [v3.0.2](https://github.com/Polymer/polymer/tree/v3.0.2) (2018-05-09)
- Add back modulizer manifest ([commit](https://github.com/Polymer/polymer/commit/d32797e9))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/4794b323))

## [v3.0.1](https://github.com/Polymer/polymer/tree/v3.0.1) (2018-05-09)
- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/3a4b8b89))

- Remove importHref from 3.0 ([commit](https://github.com/Polymer/polymer/commit/fd416a21))

## [v3.0.0](https://github.com/Polymer/polymer/tree/v3.0.0) (2018-05-08)
- use released versions of shadycss and webcomponentsjs ([commit](https://github.com/Polymer/polymer/commit/8f79ec40))

- Bump dependencies ([commit](https://github.com/Polymer/polymer/commit/8894e22b))

- Run Chrome & FF serially to try and help flakiness ([commit](https://github.com/Polymer/polymer/commit/95740463))

- Fix lint warning ([commit](https://github.com/Polymer/polymer/commit/ecf36f8a))

- Bump to cli 1.7.0 ([commit](https://github.com/Polymer/polymer/commit/ccb29d27))

- Removing support for returning strings from template getter. (Per previous documented deprecation: https://www.polymer-project.org/2.0/docs/devguide/dom-template#templateobject) ([commit](https://github.com/Polymer/polymer/commit/ba4491d5))

- Fix typos and nits ([commit](https://github.com/Polymer/polymer/commit/c54ff70a))

- Update to Gulp 4 ([commit](https://github.com/Polymer/polymer/commit/4e31768c))

- Add serve command to package.json and update package-lock.json ([commit](https://github.com/Polymer/polymer/commit/eb72d5aa))

- Fix for browsers that don't have input.labels. ([commit](https://github.com/Polymer/polymer/commit/036e4f66))

- Tweak introductory note, fix webpack capitalization ([commit](https://github.com/Polymer/polymer/commit/b823620e))

- gestures: Avoid spreading non-iterable in older browsers ([commit](https://github.com/Polymer/polymer/commit/2ce4f700))

- wip ([commit](https://github.com/Polymer/polymer/commit/f4534c6a))

- Readme: very small tweaks ([commit](https://github.com/Polymer/polymer/commit/d896cdd0))

- Tweak wording. ([commit](https://github.com/Polymer/polymer/commit/fb7630c3))

- Fix link ([commit](https://github.com/Polymer/polymer/commit/fc0ce189))

- Re-order sections ([commit](https://github.com/Polymer/polymer/commit/ee6a67ee))

- Fix LitElement typo ([commit](https://github.com/Polymer/polymer/commit/928c47fc))

- Depend on polymer-cli rather than wct ([commit](https://github.com/Polymer/polymer/commit/503f5631))

- Minor tweaks ([commit](https://github.com/Polymer/polymer/commit/e924ba86))

- Update README for 3.x ([commit](https://github.com/Polymer/polymer/commit/956bba73))

- Update Edge testing versions. ([commit](https://github.com/Polymer/polymer/commit/445c979b))

- Exclude all Edge versions from keyframe/font tests. ([commit](https://github.com/Polymer/polymer/commit/85278860))

- Update wcjs version. ([commit](https://github.com/Polymer/polymer/commit/4805e31f))

- Add .npmignore file (#5215) ([commit](https://github.com/Polymer/polymer/commit/b3c36df7))

- Use node 9 ([commit](https://github.com/Polymer/polymer/commit/0bb5d7c5))

- Use module flags for wct ([commit](https://github.com/Polymer/polymer/commit/8abf2ec9))

- Use babel parser for aslant for dynamic import. ([commit](https://github.com/Polymer/polymer/commit/bddeff4a))

- Fix lint errors. ([commit](https://github.com/Polymer/polymer/commit/dea23515))

- 3.0.0-pre.13 ([commit](https://github.com/Polymer/polymer/commit/da2d66dc))

- [package.json] Remove version script ([commit](https://github.com/Polymer/polymer/commit/e88c1eef))

- Update dependencies ([commit](https://github.com/Polymer/polymer/commit/1ed2b310))

- Fix test typo on Chrome ([commit](https://github.com/Polymer/polymer/commit/a11febe7))

- Fixes IE11 test issues ([commit](https://github.com/Polymer/polymer/commit/8b5803c2))

- Fixes styling tests related to using HTML Imports ([commit](https://github.com/Polymer/polymer/commit/26747422))

- Remove crufty global (fixes globals.html test) ([commit](https://github.com/Polymer/polymer/commit/676f5f3d))

- Update to webcomponents 2.0.0 and webcomponents-bundle.js ([commit](https://github.com/Polymer/polymer/commit/a4d80d09))

- Fix meaningful whitespace in test assertion ([commit](https://github.com/Polymer/polymer/commit/bff03b2d))

- Fix latent mistake using old SD API ([commit](https://github.com/Polymer/polymer/commit/3f24f71d))

- Add global for wct callback when amd compiling ([commit](https://github.com/Polymer/polymer/commit/7f9de46c))

- Eliminate pre-module code from resolveUrl tests ([commit](https://github.com/Polymer/polymer/commit/a93f81f1))

- Improve documentation and legibility. ([commit](https://github.com/Polymer/polymer/commit/ab103dc1))

- Add some global whitelists ([commit](https://github.com/Polymer/polymer/commit/d6821e45))

- Fix references to js files instead of html files ([commit](https://github.com/Polymer/polymer/commit/dfcaadb2))

- Fix glob patterns for eslint ([commit](https://github.com/Polymer/polymer/commit/206cf724))

- Fix ESLint warnings ([commit](https://github.com/Polymer/polymer/commit/6d240138))

- Eliminate more canonical path usage ([commit](https://github.com/Polymer/polymer/commit/1761c79b))

- Eliminate canonical path to wcjs ([commit](https://github.com/Polymer/polymer/commit/4b7cd869))

- Remove extra polymer-legacy.js imports ([commit](https://github.com/Polymer/polymer/commit/f39aaa8c))

- Clean up Polymer fn import ([commit](https://github.com/Polymer/polymer/commit/8069dff4))

- Add WCT config used by all tests ([commit](https://github.com/Polymer/polymer/commit/f1266845))

- Clean up exports ([commit](https://github.com/Polymer/polymer/commit/0b75920f))

- Allow Polymer fn's call to Class to be overridden. ([commit](https://github.com/Polymer/polymer/commit/65d73f17))

- add sill-relevant, deleted tests back in ([commit](https://github.com/Polymer/polymer/commit/180a92ff))

- manually change inter-package dep imports from paths to names ([commit](https://github.com/Polymer/polymer/commit/d913614d))

- manually add assetpath (import.meta.url) for tests that require it ([commit](https://github.com/Polymer/polymer/commit/0c850659))

- move behavior definition to before usage ([commit](https://github.com/Polymer/polymer/commit/09b11fa4))

- define omitted class declaration ([commit](https://github.com/Polymer/polymer/commit/ec36165e))

- remove &lt; and replace with < for innerHTML ([commit](https://github.com/Polymer/polymer/commit/5ce0d24d))

- fixed typo causing test to fail ([commit](https://github.com/Polymer/polymer/commit/0caa7dab))

- fix missing dom-module in modulization ([commit](https://github.com/Polymer/polymer/commit/6c7c770c))

- revert module wait ([commit](https://github.com/Polymer/polymer/commit/12a650b1))

- wait for elements in other modules to be defined ([commit](https://github.com/Polymer/polymer/commit/f0376406))

- no more undefined.hasShadow ([commit](https://github.com/Polymer/polymer/commit/0985652e))

- removed link rel import type css tests ([commit](https://github.com/Polymer/polymer/commit/57d4190c))

- delete debugger ([commit](https://github.com/Polymer/polymer/commit/6905dd10))

- skip link rel import type css tests on native imports ([commit](https://github.com/Polymer/polymer/commit/811ee301))

- add missing css html import ([commit](https://github.com/Polymer/polymer/commit/a52148a3))

- remove importHref tests ([commit](https://github.com/Polymer/polymer/commit/a84ad782))

- Import Polymer function in tests from legacy/polymer-fn.js ([commit](https://github.com/Polymer/polymer/commit/232b0042))

- Export Polymer function from polymer-legacy.js ([commit](https://github.com/Polymer/polymer/commit/69f488b2))

- Add new wct deps. ([commit](https://github.com/Polymer/polymer/commit/a4bedbfd))

- Fixup a few places where comments were misplaced. ([commit](https://github.com/Polymer/polymer/commit/ac2fa81f))

- Fixup license comments. ([commit](https://github.com/Polymer/polymer/commit/f664f251))

- Update package.json from modulizer's output, set polymer-element.js as main. ([commit](https://github.com/Polymer/polymer/commit/5abf4728))

- Replace sources with modulizer output. ([commit](https://github.com/Polymer/polymer/commit/cf3b7215))

- Rename HTML files to .js files to trick git's rename detection. ([commit](https://github.com/Polymer/polymer/commit/527d2cdd))

- Delete typings for now. ([commit](https://github.com/Polymer/polymer/commit/03d85982))

- Add reasoning for suppress missingProperties ([commit](https://github.com/Polymer/polymer/commit/61ca60e4))

- Don't rely on dom-module synchronously until WCR. ([commit](https://github.com/Polymer/polymer/commit/e64bd0ba))

- Avoid closure warnings. ([commit](https://github.com/Polymer/polymer/commit/412bb1e0))

- Add ability to define importMeta on legacy elements. Fixes #5163 ([commit](https://github.com/Polymer/polymer/commit/616f6662))

- Allow legacy element property definitions with only a type. Fixes #5173 ([commit](https://github.com/Polymer/polymer/commit/d321c6c9))

- Update docs. ([commit](https://github.com/Polymer/polymer/commit/c8c9e24d))

- Use Polymer.ResolveUrl.pathFromUrl ([commit](https://github.com/Polymer/polymer/commit/d9d3e439))

- Fix test under shadydom. Slight logic refactor. ([commit](https://github.com/Polymer/polymer/commit/2128ebe2))

- Fix lint warning ([commit](https://github.com/Polymer/polymer/commit/fb741ee3))

- Add importMeta getter to derive importPath from modules. Fixes #5163 ([commit](https://github.com/Polymer/polymer/commit/f7672da9))

- Reference dependencies as siblings in tests. ([commit](https://github.com/Polymer/polymer/commit/2561d868))

- Update types ([commit](https://github.com/Polymer/polymer/commit/23ba7dee))

- Add note about performance vs correctness ([commit](https://github.com/Polymer/polymer/commit/89ab7385))

- Update types. ([commit](https://github.com/Polymer/polymer/commit/5357d64a))

- Lint clean. ([commit](https://github.com/Polymer/polymer/commit/f78b0518))

- Pass through fourth namespace param on attributeChangedCallback. ([commit](https://github.com/Polymer/polymer/commit/91d4aeba))

- Add a @const annotation to help the Closure Compiler understand that Polymer.Debouncer is the name of a type. ([commit](https://github.com/Polymer/polymer/commit/e5a5725d))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/92d282a9))

- Update docs and types ([commit](https://github.com/Polymer/polymer/commit/211c223f))

- Update perf test to use strict-binding-parser ([commit](https://github.com/Polymer/polymer/commit/f53e9e8a))

- Correct import paths ([commit](https://github.com/Polymer/polymer/commit/ab93ab08))

- Only store method once for dynamic functions ([commit](https://github.com/Polymer/polymer/commit/0f0ccdad))

- Move strict-binding-parser to lib/mixins ([commit](https://github.com/Polymer/polymer/commit/a4d4eb9a))

- Rename to StrictBindingParser ([commit](https://github.com/Polymer/polymer/commit/19d4b8cb))

- Fix linter errors ([commit](https://github.com/Polymer/polymer/commit/d8cf449e))

- Extract to a mixin ([commit](https://github.com/Polymer/polymer/commit/57a14236))

- Add missing dependency to bower.json ([commit](https://github.com/Polymer/polymer/commit/333a4664))

- Fix linter warning ([commit](https://github.com/Polymer/polymer/commit/14fac019))

- Add documentation ([commit](https://github.com/Polymer/polymer/commit/df0ee354))

- Add performance test for binding-expressions ([commit](https://github.com/Polymer/polymer/commit/42f7d785))

- Rewrite parser to use switch-case instead of functions ([commit](https://github.com/Polymer/polymer/commit/423074d1))

- Remove escaping from bindings ([commit](https://github.com/Polymer/polymer/commit/8cd49479))

- Fix linter warning ([commit](https://github.com/Polymer/polymer/commit/8a5525b0))

- Refactor to be functional and add more tests ([commit](https://github.com/Polymer/polymer/commit/7eb1a627))

- Fix linter warnings ([commit](https://github.com/Polymer/polymer/commit/79d05b8a))

- Rewrite expression parser to state machine ([commit](https://github.com/Polymer/polymer/commit/13b834df))

## [v2.6.0](https://github.com/Polymer/polymer/tree/v2.6.0) (2018-03-22)
- Use function instead of Set ([commit](https://github.com/Polymer/polymer/commit/33d2e1a8))

- [ci skip] Fix typo ([commit](https://github.com/Polymer/polymer/commit/0d1b1c2e))

- Fix test in shady DOM ([commit](https://github.com/Polymer/polymer/commit/a586b72c))

- Deduplicate style includes ([commit](https://github.com/Polymer/polymer/commit/acfef71d))

- use a clearer test for shadowRoot ([commit](https://github.com/Polymer/polymer/commit/b2fb1cfd))

- Returning null in template should nullify parent template ([commit](https://github.com/Polymer/polymer/commit/2a6c0a2a))

- [ci skip] Add clarifying comment ([commit](https://github.com/Polymer/polymer/commit/0573d483))

- Correct the JSBin version ([commit](https://github.com/Polymer/polymer/commit/cb1ae7d3))

- Put attribute capitalization fix in property-effects ([commit](https://github.com/Polymer/polymer/commit/d45dd575))

- Add note about pre v3 releases ([commit](https://github.com/Polymer/polymer/commit/f9391618))

- Add note for npm package ([commit](https://github.com/Polymer/polymer/commit/8f2cc0d5))

- Add iron-component-page dev-dependency ([commit](https://github.com/Polymer/polymer/commit/d93dd1ce))

- Update several gulp dependencies ([commit](https://github.com/Polymer/polymer/commit/ca57a1f3))

- Update dom5 to 3.0.0 ([commit](https://github.com/Polymer/polymer/commit/d4a0914e))

- Update Google Closure Compiler version and fix cast ([commit](https://github.com/Polymer/polymer/commit/4004c9c4))

- Update types ([commit](https://github.com/Polymer/polymer/commit/bb61a20d))

- Fix several issues in the documentation of dom-* elements ([commit](https://github.com/Polymer/polymer/commit/8e1b3f45))

- Handle `disabled` attribute correctly for tap gesture ([commit](https://github.com/Polymer/polymer/commit/5c0f3e6a))

- add test case for nested label ([commit](https://github.com/Polymer/polymer/commit/c11c99b2))

- Add docs and cleanup matchingLabels ([commit](https://github.com/Polymer/polymer/commit/e1df1662))

- Add tests ([commit](https://github.com/Polymer/polymer/commit/70edf1f8))

- update types ([commit](https://github.com/Polymer/polymer/commit/2d674e75))

- fix tests and add dependency import ([commit](https://github.com/Polymer/polymer/commit/a37ba7e2))

- fix typings ([commit](https://github.com/Polymer/polymer/commit/8f8135b2))

- Ensure DisableUpgradeMixin extends PropertiesMixin ([commit](https://github.com/Polymer/polymer/commit/7e74e363))

- Format comment and remove deduping mixin ([commit](https://github.com/Polymer/polymer/commit/b8c66ded))

- update types ([commit](https://github.com/Polymer/polymer/commit/1fd5f9cf))

- update types ([commit](https://github.com/Polymer/polymer/commit/5bc45ce3))

- Add mixin to automatically detect capitalized HTML attributes ([commit](https://github.com/Polymer/polymer/commit/37fd5ffe))

- Add instructions for locally viewing the source documentation ([commit](https://github.com/Polymer/polymer/commit/206d3610))

- Simplify condition checking in stylesFromModule function ([commit](https://github.com/Polymer/polymer/commit/e6903821))

- Bump type generator and generate new typings. (#5119) ([commit](https://github.com/Polymer/polymer/commit/5c027309))

- dispatchEvent returns boolean (#5117) ([commit](https://github.com/Polymer/polymer/commit/9d86135c))

- Update types ([commit](https://github.com/Polymer/polymer/commit/63e7bbc7))

- Fix license links ([commit](https://github.com/Polymer/polymer/commit/f3939875))

- Fix issue with not genering the Templatizer docs ([commit](https://github.com/Polymer/polymer/commit/55708acf))

- Bump TS type generator to pick up transitive mixin handling. ([commit](https://github.com/Polymer/polymer/commit/c3dad540))

- Remove unnecessary mutableData property from MutableData mixin ([commit](https://github.com/Polymer/polymer/commit/92b83249))

- Update types ([commit](https://github.com/Polymer/polymer/commit/868fba7c))

- Add note to updateStyles regarding updates to CSS mixins ([commit](https://github.com/Polymer/polymer/commit/d458bab3))

- Avoid timing issues with polyfilled Promise ([commit](https://github.com/Polymer/polymer/commit/6b3e007e))

- Revert use of async/await due to lack of build/serve support. ([commit](https://github.com/Polymer/polymer/commit/d4a7a45b))

- Revert types. ([commit](https://github.com/Polymer/polymer/commit/dea90802))

- Update eslint parserOptions to es2017 for async/await support. ([commit](https://github.com/Polymer/polymer/commit/ef579e29))

- Use stronger check for PropertyEffects clients. Fixes #5017 ([commit](https://github.com/Polymer/polymer/commit/e6d558ec))

- Remove unneeded file ([commit](https://github.com/Polymer/polymer/commit/a5393b6d))

- [PropertiesChanged]: allow old data to be gc'd after `_propertiesChanged` ([commit](https://github.com/Polymer/polymer/commit/74907b9a))

- Update package-lock.json ([commit](https://github.com/Polymer/polymer/commit/c58f3e0d))

- Make Travis update-types failure style the same as the elements. ([commit](https://github.com/Polymer/polymer/commit/8189382d))

- Bump TypeScript generator version. ([commit](https://github.com/Polymer/polymer/commit/3e432190))

- Make EventApi.path EventTarget type non-nullable. ([commit](https://github.com/Polymer/polymer/commit/3ede9b51))

- Lint and type fixes ([commit](https://github.com/Polymer/polymer/commit/5607a2d8))

- [PropertiesChanged]: adds _shouldPropertiesChange ([commit](https://github.com/Polymer/polymer/commit/c1885a6a))

- Update docs: templatize() cannot be called multiple times ([commit](https://github.com/Polymer/polymer/commit/27fc21c5))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/65b4df86))

- Update types. ([commit](https://github.com/Polymer/polymer/commit/c3b6236a))

- Fix JSDoc example formatting ([commit](https://github.com/Polymer/polymer/commit/699cd87f))

- Use latest webcomponents polyfill bundle ([commit](https://github.com/Polymer/polymer/commit/8fef6776))

- Fix label tap by checking matched label pairs ([commit](https://github.com/Polymer/polymer/commit/a77d64e5))

- Defer creation related work via `disable-upgrade` ([commit](https://github.com/Polymer/polymer/commit/a7eb9754))

- lint fixes ([commit](https://github.com/Polymer/polymer/commit/de0ac5a2))

- Adds `Polymer.DisableUpgradeMixin` ([commit](https://github.com/Polymer/polymer/commit/62ce3148))

## [v2.5.0](https://github.com/Polymer/polymer/tree/v2.5.0) (2018-02-02)
- Update types ([commit](https://github.com/Polymer/polymer/commit/5fa059fa))

- Update JSDocs to use <dom-repeat> tags ([commit](https://github.com/Polymer/polymer/commit/636abae0))

- Fix type declarations inadvertedtly referencing Polymer.Element. (#5084) ([commit](https://github.com/Polymer/polymer/commit/82cd3dad))

- Use class syntax in <dom-repeat> documentation (#5077) ([commit](https://github.com/Polymer/polymer/commit/97837c7c))

- Add hash/abs URL resolution tests. ([commit](https://github.com/Polymer/polymer/commit/d97373dd))

- Update types. ([commit](https://github.com/Polymer/polymer/commit/892df3f3))

- Add comments about resolveUrl idiosyncrasies. ([commit](https://github.com/Polymer/polymer/commit/a829cbce))

- Revert "Move absolute url logic to element-mixin" ([commit](https://github.com/Polymer/polymer/commit/127bc866))

- Added Polymer.version to polymer-externs (#5079) ([commit](https://github.com/Polymer/polymer/commit/b52ab81d))

- Avoid tracking parentNode since it's unncessary ([commit](https://github.com/Polymer/polymer/commit/1463e3b2))

- Update types. ([commit](https://github.com/Polymer/polymer/commit/2253e0db))

- Fix nit. ([commit](https://github.com/Polymer/polymer/commit/c9208fd6))

- Avoid comment constructor for IE support. ([commit](https://github.com/Polymer/polymer/commit/a39cfd11))

- Disallow non-templates as interpolations in Polymer.html (#5023) ([commit](https://github.com/Polymer/polymer/commit/eeb71600))

- Exclude index.html from type generation. (#5076) ([commit](https://github.com/Polymer/polymer/commit/6fc285c4))

- update types ([commit](https://github.com/Polymer/polymer/commit/5521e43e))

- [element-mixin] Do not create property accessors unless a property effect exists ([commit](https://github.com/Polymer/polymer/commit/4177d9ce))

- Use containers for testing again (#5070) ([commit](https://github.com/Polymer/polymer/commit/5e2990e3))

- Invoke JS compiler rename for properties ([commit](https://github.com/Polymer/polymer/commit/74a4626a))

- Add package-lock.json back ([commit](https://github.com/Polymer/polymer/commit/c90eeb67))

- fix test. ([commit](https://github.com/Polymer/polymer/commit/1c74ecde))

- Enhance robustness by replacing slot with a comment ([commit](https://github.com/Polymer/polymer/commit/b76d81ee))

- Avoid use of element accessors on doc frag to fix IE/Edge. ([commit](https://github.com/Polymer/polymer/commit/ecb1005e))

- Fix linter errors ([commit](https://github.com/Polymer/polymer/commit/5e0bee77))

- Fix issue with observers being called twice ([commit](https://github.com/Polymer/polymer/commit/291e4f56))

- Revert package-lock change ([commit](https://github.com/Polymer/polymer/commit/86ecd982))

- [ci-skip] Update changelog (2.4.0) ([commit](https://github.com/Polymer/polymer/commit/cb88252d))

- Add package-lock.json to .gitignore ([commit](https://github.com/Polymer/polymer/commit/e53db30f))

- Update types ([commit](https://github.com/Polymer/polymer/commit/7a52cda2))

- Add comments re: instanceProps ([commit](https://github.com/Polymer/polymer/commit/cf5f818e))

- Change if-condition to check for arguments.length ([commit](https://github.com/Polymer/polymer/commit/27750109))

- Delete package-lock.json ([commit](https://github.com/Polymer/polymer/commit/e77149e2))

- [ci skip] Fix test case name ([commit](https://github.com/Polymer/polymer/commit/eee609d4))

- Fix issue where el.splice could not clear full array ([commit](https://github.com/Polymer/polymer/commit/a51de9e3))

- Make owner optional as well. ([commit](https://github.com/Polymer/polymer/commit/b52c315e))

- Update package-lock.json ([commit](https://github.com/Polymer/polymer/commit/38c0e443))

- Update typescript types again, after fixing jsdoc. ([commit](https://github.com/Polymer/polymer/commit/3045e4b7))

- Fix lint warnings. ([commit](https://github.com/Polymer/polymer/commit/715cde47))

- Update typescript types. ([commit](https://github.com/Polymer/polymer/commit/c218ae62))

- Ensure path notifications from templatized instances don't throw. Fixes #3422 ([commit](https://github.com/Polymer/polymer/commit/a9f71bd1))

- Allow templatizer to be used without owner or host prop forwarding. Fixes #4458 ([commit](https://github.com/Polymer/polymer/commit/bde5898e))

- Templatize: remove slots when hiding children ([commit](https://github.com/Polymer/polymer/commit/ea0abb95))

- Clarify API docs for PropertyAccessors mixin ([commit](https://github.com/Polymer/polymer/commit/ae58e88b))

## [v2.4.0](https://github.com/Polymer/polymer/tree/v2.4.0) (2018-01-26)
- Simplify code for <dom-repeat>'s `sort` and `filter` properties ([commit](https://github.com/Polymer/polymer/commit/88cca860))

- fix test for normal escaping ([commit](https://github.com/Polymer/polymer/commit/5fa02aa2))

- Use javascript string escaping in Polymer.html ([commit](https://github.com/Polymer/polymer/commit/4c662141))

- [ci skip] Add CODEOWNERS file (#5061) ([commit](https://github.com/Polymer/polymer/commit/90199f3b))

- Fix incorrect path modification in dom-repeat __handleObservedPaths() (#4983) (#5048) ([commit](https://github.com/Polymer/polymer/commit/4b58f54b))

- Skip certain tests in Edge 16 ([commit](https://github.com/Polymer/polymer/commit/09897d18))

- add Edge 16 testing ([commit](https://github.com/Polymer/polymer/commit/36fa08ae))

- Fix tests (#5050) ([commit](https://github.com/Polymer/polymer/commit/ecd1ba3a))

- Update to latest wct. ([commit](https://github.com/Polymer/polymer/commit/a85ff3fc))

- HTTPS, please ([commit](https://github.com/Polymer/polymer/commit/c868575c))

- Remove unnecessary limit check ([commit](https://github.com/Polymer/polymer/commit/5fb9c559))

- Fix documentation in typescript ([commit](https://github.com/Polymer/polymer/commit/bc95c5ad))

- test(logging): improve _log with single parameter with sinon.spy ([commit](https://github.com/Polymer/polymer/commit/9891f31a))

- Add article "a" ([commit](https://github.com/Polymer/polymer/commit/cefdaa93))

- Update mixinBehaviors annotation. Behaviors don't satisfy PolymerInit. (#5036) ([commit](https://github.com/Polymer/polymer/commit/d7ea2464))

- add correct return type for `querySelectorAll` (#5034) ([commit](https://github.com/Polymer/polymer/commit/6ab5c4a4))

- Gestures: fall back to event.target when composedPath is empty. (#5029) ([commit](https://github.com/Polymer/polymer/commit/98b5aadc))

- add void return type annotations (#5000) ([commit](https://github.com/Polymer/polymer/commit/589684a5))

- Easy script to update closure and typescript typings (#5026) ([commit](https://github.com/Polymer/polymer/commit/60e7121d))

- Prefer jsBin since glitch.me requires signin to not be gc'ed. ([commit](https://github.com/Polymer/polymer/commit/e7722243))

- Note that glitch editing environment is not IE11 friendly. ([commit](https://github.com/Polymer/polymer/commit/06ca708b))

- Add links to glitch.me template using polyserve. Fixes #5016 ([commit](https://github.com/Polymer/polymer/commit/9f2ec5f6))

- Update .travis.yml ([commit](https://github.com/Polymer/polymer/commit/9715ab8f))

- [ci skip] Add comment to aid archeology ([commit](https://github.com/Polymer/polymer/commit/e76a2b90))

- Move absolute url logic to element-mixin ([commit](https://github.com/Polymer/polymer/commit/9c189ac9))

- Use double tabs ([commit](https://github.com/Polymer/polymer/commit/6f7b8608))

- indentation fix ([commit](https://github.com/Polymer/polymer/commit/5dca5cd0))

- Remove trailing spaces and extra lines in CONTRIBUTING.md ([commit](https://github.com/Polymer/polymer/commit/8ed376e6))

- test(logging.html): #5007 make sure _logger called one time ([commit](https://github.com/Polymer/polymer/commit/fe48dfa4))

- _loggertest(logging.html): make seperate test suite for _logger ([commit](https://github.com/Polymer/polymer/commit/bd5821b6))

- test(logging.html): missing semicolon ([commit](https://github.com/Polymer/polymer/commit/df3c3c02))

- test(logging): _log with single parameter #5007 ([commit](https://github.com/Polymer/polymer/commit/818c537d))

- fix(legacy-element-mixin): syntax error in _logger ([commit](https://github.com/Polymer/polymer/commit/e0affe3f))

- fix(legacy-element-mixin): _log with single parameter #5006 ([commit](https://github.com/Polymer/polymer/commit/f4ecbae5))

- Fix settings so that its properly picked up by both gen-ts and modulizer ([commit](https://github.com/Polymer/polymer/commit/0356b2df))

- Unbreak the build by changing back the type ([commit](https://github.com/Polymer/polymer/commit/d5dc2a21))

- Enable gulp generate-typescript on Travis ([commit](https://github.com/Polymer/polymer/commit/764146cd))

- Make sure that Travis fails when there are non-updated generated files ([commit](https://github.com/Polymer/polymer/commit/b2cd4370))

- run `gulp generate-typescript` ([commit](https://github.com/Polymer/polymer/commit/541d1f89))

- fix ArraySplice types to more closely match code ([commit](https://github.com/Polymer/polymer/commit/f6182b34))

- [ProperitesChanged] Fix deserialization (#4996) ([commit](https://github.com/Polymer/polymer/commit/2719a9d6))

- fix(FlattenedNodesObserver): do not fail on node without children ([commit](https://github.com/Polymer/polymer/commit/09bb6cd8))

- Address latest round of comments. ([commit](https://github.com/Polymer/polymer/commit/7b581de9))

- Update PropertyEffects interface name in remap config. ([commit](https://github.com/Polymer/polymer/commit/0ebfc24d))

- Tighten more types for TypeScript and Closure (#4998) ([commit](https://github.com/Polymer/polymer/commit/e8729822))

- Add renameTypes config. ([commit](https://github.com/Polymer/polymer/commit/73666c39))

- New typings. ([commit](https://github.com/Polymer/polymer/commit/a1f33174))

- Bump gen-typescript version. ([commit](https://github.com/Polymer/polymer/commit/266d599a))

- Tighten Closure type annotations. (#4997) ([commit](https://github.com/Polymer/polymer/commit/ee4445f8))

- Mark some FlattenedNodesObserver things private. ([commit](https://github.com/Polymer/polymer/commit/5190a89c))

- Add TypeScript equivalent to Closure ITemplateArray. ([commit](https://github.com/Polymer/polymer/commit/a77310af))

- Fix compilation errors. ([commit](https://github.com/Polymer/polymer/commit/f0e31f2d))

- Use glob patterns instead of RegExps to exclude files. ([commit](https://github.com/Polymer/polymer/commit/8f8e54ca))

- Bump version of gen-typescript-declarations. ([commit](https://github.com/Polymer/polymer/commit/cf11a826))

- Handle case where there are no elements in the template ([commit](https://github.com/Polymer/polymer/commit/2d6b4684))

- Update various Polymer annotations to constrain generated types. ([commit](https://github.com/Polymer/polymer/commit/ffc35e48))

- Fix typo in comment ([commit](https://github.com/Polymer/polymer/commit/ade5e796))

- Fix regression with imported css ([commit](https://github.com/Polymer/polymer/commit/706e6021))

- Bring in latest gen-typescript-declarations updates. ([commit](https://github.com/Polymer/polymer/commit/6a0d214d))

- Apply `listeners` in constructor rather than `ready` ([commit](https://github.com/Polymer/polymer/commit/35e3c54b))

- Replace `disconnectedCallback` stub since this change is breaking. ([commit](https://github.com/Polymer/polymer/commit/c8acc183))

- Minor fixes ([commit](https://github.com/Polymer/polymer/commit/1b514b4f))

- Fix html-tag import path. ([commit](https://github.com/Polymer/polymer/commit/c9be530d))

- Update CHANGELOG. ([commit](https://github.com/Polymer/polymer/commit/3ffb895e))

- Fix import path for html-tag. ([commit](https://github.com/Polymer/polymer/commit/eb309934))

- Add generated TypeScript declarations. ([commit](https://github.com/Polymer/polymer/commit/60450bf4))

- Add script to generate TypeScript declarations. ([commit](https://github.com/Polymer/polymer/commit/1f9be786))

- Annotate klass class as @private. Annotate that dedupingMixin returns T. ([commit](https://github.com/Polymer/polymer/commit/b02c4583))

- fix eslint error for unused var in _setPendingProperty ([commit](https://github.com/Polymer/polymer/commit/a89c9ba0))

- fix closure typing with Polymer.html function ([commit](https://github.com/Polymer/polymer/commit/c519796f))

- re-add AsyncInterface definition, fix comment ([commit](https://github.com/Polymer/polymer/commit/986fb3e9))

- Avoid _setPendingProperty warning due to types not understanding deduping mixin. ([commit](https://github.com/Polymer/polymer/commit/40d47f24))

- [ci skip] Update changelog ([commit](https://github.com/Polymer/polymer/commit/f6cc61bd))

- add test for legacy Polymer({}) elements ([commit](https://github.com/Polymer/polymer/commit/8a1c76cd))

- Rename html-fn to html-tag ([commit](https://github.com/Polymer/polymer/commit/02c06aa3))

- Fix most closure warnings. ([commit](https://github.com/Polymer/polymer/commit/a12934c5))

- Add back disconnectedCallback. ([commit](https://github.com/Polymer/polymer/commit/fa40f205))

- Merge with master ([commit](https://github.com/Polymer/polymer/commit/b158e082))

- Move function out of closure.  Add comments. ([commit](https://github.com/Polymer/polymer/commit/ad539fe7))

- [ci skip] TODO for link to docs and comment spellcheck ([commit](https://github.com/Polymer/polymer/commit/5c919850))

- Use values.reduce instead of a temporary array ([commit](https://github.com/Polymer/polymer/commit/be9d6210))

- Add deprecation notice for class.template returning a string ([commit](https://github.com/Polymer/polymer/commit/530a68b4))

- [skip-ci] update comment for Polymer.html ([commit](https://github.com/Polymer/polymer/commit/bdfa5fcb))

- remove null/undefined to empty string ([commit](https://github.com/Polymer/polymer/commit/75d873a0))

- Address feedback ([commit](https://github.com/Polymer/polymer/commit/d5070bbe))

- `html` tag function for generating templates ([commit](https://github.com/Polymer/polymer/commit/1bba3abb))

- Add example for flattened-nodes-observer ([commit](https://github.com/Polymer/polymer/commit/08ad6e37))

- Minor updates based on review. ([commit](https://github.com/Polymer/polymer/commit/ed1454d6))

- Use correct assertation. ([commit](https://github.com/Polymer/polymer/commit/4692510f))

- Add tests for non-JSON literals on object props. ([commit](https://github.com/Polymer/polymer/commit/7d49e803))

- Remove PropertiesElement in favor of PropertiesMixin. ([commit](https://github.com/Polymer/polymer/commit/40f02ea1))

- FIx typo ([commit](https://github.com/Polymer/polymer/commit/8af14800))

- Skip test in old browsers. ([commit](https://github.com/Polymer/polymer/commit/a1bd9a4f))

- Remove `propertyNameForAttribute` since it's never needed. ([commit](https://github.com/Polymer/polymer/commit/8d57a6e9))

- Fix subclassing and simplify. ([commit](https://github.com/Polymer/polymer/commit/e09285db))

- Move property<->attribute case mapping to PropertiesChanged. ([commit](https://github.com/Polymer/polymer/commit/603123e1))

- Allow non-JSON literals when property type is "Object". ([commit](https://github.com/Polymer/polymer/commit/77b17b43))

- Update tests ([commit](https://github.com/Polymer/polymer/commit/82cf96bb))

- [PropertiesMixin] Fix mapping property names from attributes ([commit](https://github.com/Polymer/polymer/commit/feac9328))

- Add test for observing id attribute. ([commit](https://github.com/Polymer/polymer/commit/c56f74f9))

- Cleanup based on review. ([commit](https://github.com/Polymer/polymer/commit/4b9170ab))

- Fix deserializing dates. ([commit](https://github.com/Polymer/polymer/commit/8d24c212))

- Factoring improvements around attribute serialize/deserialize ([commit](https://github.com/Polymer/polymer/commit/a7b46b15))

- Remove crufty comment. ([commit](https://github.com/Polymer/polymer/commit/fb0f90bc))

- Lint fix ([commit](https://github.com/Polymer/polymer/commit/e8c27671))

- Add tests for setting custom `attribute` name ([commit](https://github.com/Polymer/polymer/commit/1e903a94))

- Expose less protected data. ([commit](https://github.com/Polymer/polymer/commit/74fb5151))

- ElementMixin uses PropertiesMixin for ([commit](https://github.com/Polymer/polymer/commit/0fe9434f))

- PropertiesMixin ([commit](https://github.com/Polymer/polymer/commit/3c50f44a))

- PropertyAccessors ([commit](https://github.com/Polymer/polymer/commit/5846d582))

- PropertiesChanged ([commit](https://github.com/Polymer/polymer/commit/05cb5d2c))

- Force literal true` to be set as an attribute with a value of empty string. ([commit](https://github.com/Polymer/polymer/commit/1b501944))

- Better attribute suppport ([commit](https://github.com/Polymer/polymer/commit/c91b9d19))

- fix some formatting and closure linting ([commit](https://github.com/Polymer/polymer/commit/5ae21a08))

- Lint fixes. ([commit](https://github.com/Polymer/polymer/commit/946aad5c))

- Renamed basic element to properties element ([commit](https://github.com/Polymer/polymer/commit/e3e128ba))

- Implement `basic-element` with `properties-changed` ([commit](https://github.com/Polymer/polymer/commit/d26955b4))

- Fix lint issues ([commit](https://github.com/Polymer/polymer/commit/b8fd241a))

- Improve docs and add test for case conversion. ([commit](https://github.com/Polymer/polymer/commit/152f896f))

- Add test to runner. ([commit](https://github.com/Polymer/polymer/commit/dcdb750b))

- Adds `Polymer.BasicElement` ([commit](https://github.com/Polymer/polymer/commit/717a4f41))

- Factor PropertiesChanged out of PropertyAccessors ([commit](https://github.com/Polymer/polymer/commit/aa4f186e))

- Add `accessor` property to properties object ([commit](https://github.com/Polymer/polymer/commit/c7b43f78))

- Factor to treeshake better ([commit](https://github.com/Polymer/polymer/commit/e91b6a75))

## [v2.3.1](https://github.com/Polymer/polymer/tree/v2.3.1) (2017-12-07)
- Add test that would fail with the "last style" behavior in master ([commit](https://github.com/Polymer/polymer/commit/913dfce6))

- Use padding-top to get correct computed style on older safari ([commit](https://github.com/Polymer/polymer/commit/b7c56173))

- Handle styles that are not direct children of templates correctly ([commit](https://github.com/Polymer/polymer/commit/0b1cd70a))

- [ci skip] update changelog again ([commit](https://github.com/Polymer/polymer/commit/2d739c75))

## [v2.3.0](https://github.com/Polymer/polymer/tree/v2.3.0) (2017-12-05)
- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/c727d35d))

## [v2.2.1](https://github.com/Polymer/polymer/tree/v2.2.1) (2017-12-05)
- [ci skip] commit new version in lib/utils/boot.html when using npm version ([commit](https://github.com/Polymer/polymer/commit/71fbf6ef))

- change PolymerElement extern to var ([commit](https://github.com/Polymer/polymer/commit/5c3d58aa))

- update node devDependencies ([commit](https://github.com/Polymer/polymer/commit/a39f3f41))

- fix lint error ([commit](https://github.com/Polymer/polymer/commit/f242e197))

- Fix :dir selectors with nested custom elements ([commit](https://github.com/Polymer/polymer/commit/3b76e86f))

- Update test to be more descriptive ([commit](https://github.com/Polymer/polymer/commit/86a64b6c))

- Annotate Polymer function with @global. (#4967) ([commit](https://github.com/Polymer/polymer/commit/b124b707))

- make PASSIVE_TOUCH take an argument ([commit](https://github.com/Polymer/polymer/commit/c5407a8b))

- Do not set touchend listeners to passive ([commit](https://github.com/Polymer/polymer/commit/84fa3bf3))

- Add some @function annotations to APIs that are defined by assignment. ([commit](https://github.com/Polymer/polymer/commit/29f2a0e7))

- add return jsdoc to void functions ([commit](https://github.com/Polymer/polymer/commit/a8105e55))

- Update CONTRIBUTING.md ([commit](https://github.com/Polymer/polymer/commit/14fd53c3))

- Fix typo. ([commit](https://github.com/Polymer/polymer/commit/581483f2))

- Comment reworded based on feedback. ([commit](https://github.com/Polymer/polymer/commit/80a7f1e5))

- Semantic issue (proposal) plus minor fixes ([commit](https://github.com/Polymer/polymer/commit/42ec14bf))

- Depend on webcomponents and shadycss with shady-unscoped support ([commit](https://github.com/Polymer/polymer/commit/8241b887))

- Also clarify `delay` units. Fixes #4707 ([commit](https://github.com/Polymer/polymer/commit/348ed92c))

- Ensure re-sort/filter always happens after array item set. Fixes #3626 ([commit](https://github.com/Polymer/polymer/commit/f6d4771c))

- Clarify docs on target-framerate. Fixes #4897 ([commit](https://github.com/Polymer/polymer/commit/c18a5349))

- move test after ([commit](https://github.com/Polymer/polymer/commit/45598302))

- test more permutations ([commit](https://github.com/Polymer/polymer/commit/f03e8d1b))

- Fix missing comma in `Path.translate` JSDoc ([commit](https://github.com/Polymer/polymer/commit/41616c6f))

- fix(bower): standardized version tagging (#4921) ([commit](https://github.com/Polymer/polymer/commit/6e3ae2e5))

- Minor fixes (update URLs) ([commit](https://github.com/Polymer/polymer/commit/8e7024e6))

- add license headers ([commit](https://github.com/Polymer/polymer/commit/518b4699))

- Prep for processing of `shady-unscoped` moving to ShadyCSS ([commit](https://github.com/Polymer/polymer/commit/08c3a02e))

- Implement type change in Polymer.ElementMixin ([commit](https://github.com/Polymer/polymer/commit/cda62d5f))

- instance.$.foo should only give Elements ([commit](https://github.com/Polymer/polymer/commit/4837e4a8))

- Annotate DomApi with @memberof Polymer ([commit](https://github.com/Polymer/polymer/commit/7308d8b6))

- Clarify all elements between changes must apply mixing. Fixes #4914 ([commit](https://github.com/Polymer/polymer/commit/7360f42a))

- add safari 11 to sauce testing ([commit](https://github.com/Polymer/polymer/commit/428ad8c2))

- Fix tests on Firefox. ([commit](https://github.com/Polymer/polymer/commit/9a468335))

- Update externs again. ([commit](https://github.com/Polymer/polymer/commit/1c5b731f))

- Update externs. ([commit](https://github.com/Polymer/polymer/commit/8683b27c))

- Lint fixes ([commit](https://github.com/Polymer/polymer/commit/092b210f))

- Allow style elements to be separate in the element template. ([commit](https://github.com/Polymer/polymer/commit/819652eb))

- Lint fix. ([commit](https://github.com/Polymer/polymer/commit/982d28c6))

- Add support for styles with a `shady-unscoped` attribute ([commit](https://github.com/Polymer/polymer/commit/d77e073e))

- [ci skip] Update CHANGELOG ([commit](https://github.com/Polymer/polymer/commit/314bada5))

- [ci skip] version script did not work as expected ([commit](https://github.com/Polymer/polymer/commit/4265cba1))

- adding test case for 4696 4706 ([commit](https://github.com/Polymer/polymer/commit/939ce63c))

- Support property observers which are direct function references in addition to strings. Provides better static analysis and refactoring support in multiple tools. Alleviates the need for property reflection with Closure-compiler renaming. ([commit](https://github.com/Polymer/polymer/commit/4bae2b62))

- removing package-lock.json from PR ([commit](https://github.com/Polymer/polymer/commit/0da00a1d))

- implementing the code review suggestions ([commit](https://github.com/Polymer/polymer/commit/1b51f601))

- Updating deserialize function (use of ternary operation). Fixes #4696 ([commit](https://github.com/Polymer/polymer/commit/ca139ed0))

- Updating deserialize function. Fixes #4696 ([commit](https://github.com/Polymer/polymer/commit/277ca89a))

## [v2.2.0](https://github.com/Polymer/polymer/tree/v2.2.0) (2017-10-18)
- [ci skip] Autoupdate version when releasing ([commit](https://github.com/Polymer/polymer/commit/d893d6ae))

- add edge 15, use chrome stable ([commit](https://github.com/Polymer/polymer/commit/c6f2d817))

- super it and put back takeRecords ([commit](https://github.com/Polymer/polymer/commit/02e2f148))

- more feedback ([commit](https://github.com/Polymer/polymer/commit/15cbdff5))

- Address feedback ([commit](https://github.com/Polymer/polymer/commit/e71b84a8))

- add some description of the dir mixin ([commit](https://github.com/Polymer/polymer/commit/f98ad117))

- Fix linting ([commit](https://github.com/Polymer/polymer/commit/624189a3))

- Always do the :dir transform ([commit](https://github.com/Polymer/polymer/commit/31c0ebc7))

- Clean up closure externs ([commit](https://github.com/Polymer/polymer/commit/1e5ea942))

- remove bogus semicolon ([commit](https://github.com/Polymer/polymer/commit/7d044b49))

- Declare Polymer.Templatizer directly, for Closure. (#4870) ([commit](https://github.com/Polymer/polymer/commit/3b155173))

- First draft of a `:dir` aware element mixin ([commit](https://github.com/Polymer/polymer/commit/2ef65aa6))

- [ci-skip] Update CHANGELOG ([commit](https://github.com/Polymer/polymer/commit/28e60271))

## [v2.1.1](https://github.com/Polymer/polymer/tree/v2.1.1) (2017-09-28)
- Prepare for release 2.1.1 ([commit](https://github.com/Polymer/polymer/commit/f049dd91))

- Move @externs before @license because Closure likes that. ([commit](https://github.com/Polymer/polymer/commit/c3f31455))

- just move the style instead ([commit](https://github.com/Polymer/polymer/commit/61b2c8a5))

- Copy <custom-style> styles to main document ([commit](https://github.com/Polymer/polymer/commit/155ab8a2))

- Fix typos and jsdoc (#4846) ([commit](https://github.com/Polymer/polymer/commit/b19e180a))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/44fd1eaa))

- Fix shady dom style querySelector ([commit](https://github.com/Polymer/polymer/commit/d5b6bad3))

- Fix linter error ([commit](https://github.com/Polymer/polymer/commit/2da30c33))

- Exclude script and style tags for parsing bindings ([commit](https://github.com/Polymer/polymer/commit/41fa90b3))

- Special-case undefined textarea.value same as input. Fixes #4630 ([commit](https://github.com/Polymer/polymer/commit/8aa201b9))

## [v2.1.0](https://github.com/Polymer/polymer/tree/v2.1.0) (2017-09-19)
- [ci skip] bump version to 2.1.0 ([commit](https://github.com/Polymer/polymer/commit/64788aad))

- Port #3844 to 2.x ([commit](https://github.com/Polymer/polymer/commit/00bc76e4))

- Provide a `Polymer.setPassiveTouchGestures()` function ([commit](https://github.com/Polymer/polymer/commit/3547fd37))

- Make sure closure types have braces ([commit](https://github.com/Polymer/polymer/commit/fb8039e0))

- a few more comments in return ([commit](https://github.com/Polymer/polymer/commit/f6f0a3b7))

- Fix setting, add smoke test ([commit](https://github.com/Polymer/polymer/commit/6312da57))

- Optional passive touch listeners for gestures ([commit](https://github.com/Polymer/polymer/commit/5f7597f7))

- Don't have `return /** comment */` lines ([commit](https://github.com/Polymer/polymer/commit/c802b8b2))

- [ci skip] disable closure lint for now (travis java errors) ([commit](https://github.com/Polymer/polymer/commit/e45e5bba))

- try to avoid introducing spelling errors in changelogs ([commit](https://github.com/Polymer/polymer/commit/7616e3c9))

- spelling: webcomponents ([commit](https://github.com/Polymer/polymer/commit/70504627))

- spelling: veiling ([commit](https://github.com/Polymer/polymer/commit/43f6b971))

- spelling: unnecessary ([commit](https://github.com/Polymer/polymer/commit/dc0573f8))

- spelling: toolkit ([commit](https://github.com/Polymer/polymer/commit/42edf634))

- spelling: together ([commit](https://github.com/Polymer/polymer/commit/7d6e4351))

- spelling: there-when ([commit](https://github.com/Polymer/polymer/commit/240701ec))

- spelling: theming ([commit](https://github.com/Polymer/polymer/commit/d991cce1))

- spelling: supported ([commit](https://github.com/Polymer/polymer/commit/4a2e7750))

- spelling: stylesheet ([commit](https://github.com/Polymer/polymer/commit/d138df3c))

- spelling: static ([commit](https://github.com/Polymer/polymer/commit/4354e710))

- spelling: sometimes ([commit](https://github.com/Polymer/polymer/commit/802817dc))

- spelling: shuffling ([commit](https://github.com/Polymer/polymer/commit/93a18c58))

- spelling: returns ([commit](https://github.com/Polymer/polymer/commit/3f744c3c))

- spelling: restart ([commit](https://github.com/Polymer/polymer/commit/58111054))

- spelling: responsive ([commit](https://github.com/Polymer/polymer/commit/d1da7314))

- spelling: resilient ([commit](https://github.com/Polymer/polymer/commit/d45855d9))

- spelling: resetting ([commit](https://github.com/Polymer/polymer/commit/8fb47431))

- spelling: reentrancy ([commit](https://github.com/Polymer/polymer/commit/5ea03d60))

- spelling: readonly ([commit](https://github.com/Polymer/polymer/commit/ff294a90))

- spelling: prototype ([commit](https://github.com/Polymer/polymer/commit/bbe54cc2))

- spelling: protocols ([commit](https://github.com/Polymer/polymer/commit/83df6dad))

- spelling: properties ([commit](https://github.com/Polymer/polymer/commit/bb74d2da))

- spelling: preferring ([commit](https://github.com/Polymer/polymer/commit/00e0567e))

- spelling: polyfill ([commit](https://github.com/Polymer/polymer/commit/ce0ca630))

- spelling: parameterize ([commit](https://github.com/Polymer/polymer/commit/141cefe3))

- spelling: omit ([commit](https://github.com/Polymer/polymer/commit/e3b04e51))

- spelling: offset ([commit](https://github.com/Polymer/polymer/commit/ea0acb0d))

- spelling: notification ([commit](https://github.com/Polymer/polymer/commit/ee741143))

- spelling: name ([commit](https://github.com/Polymer/polymer/commit/159803a7))

- spelling: multiple ([commit](https://github.com/Polymer/polymer/commit/602ee780))

- spelling: loaded ([commit](https://github.com/Polymer/polymer/commit/f4529864))

- spelling: jquery ([commit](https://github.com/Polymer/polymer/commit/88ce972d))

- spelling: javascript ([commit](https://github.com/Polymer/polymer/commit/f1f7f669))

- spelling: instead ([commit](https://github.com/Polymer/polymer/commit/c4be7f60))

- spelling: initial ([commit](https://github.com/Polymer/polymer/commit/3862ce0a))

- spelling: increments ([commit](https://github.com/Polymer/polymer/commit/8bda7f93))

- spelling: identify ([commit](https://github.com/Polymer/polymer/commit/17678e1a))

- spelling: github ([commit](https://github.com/Polymer/polymer/commit/0781b322))

- spelling: getting ([commit](https://github.com/Polymer/polymer/commit/c1d7c3e8))

- spelling: function ([commit](https://github.com/Polymer/polymer/commit/b9b22854))

- spelling: falsy ([commit](https://github.com/Polymer/polymer/commit/d472919a))

- spelling: enqueuing ([commit](https://github.com/Polymer/polymer/commit/96c8ed81))

- spelling: element ([commit](https://github.com/Polymer/polymer/commit/d4e54c72))

- spelling: effective ([commit](https://github.com/Polymer/polymer/commit/139edd00))

- spelling: doesn't ([commit](https://github.com/Polymer/polymer/commit/aa35d779))

- spelling: does ([commit](https://github.com/Polymer/polymer/commit/01f943d9))

- spelling: disappearing ([commit](https://github.com/Polymer/polymer/commit/508c005a))

- spelling: deserialized ([commit](https://github.com/Polymer/polymer/commit/2acbf5df))

- spelling: customize ([commit](https://github.com/Polymer/polymer/commit/0a0ac248))

- spelling: containing ([commit](https://github.com/Polymer/polymer/commit/2b09e75c))

- spelling: components ([commit](https://github.com/Polymer/polymer/commit/e11d4d6b))

- spelling: collection ([commit](https://github.com/Polymer/polymer/commit/38645c08))

- spelling: children ([commit](https://github.com/Polymer/polymer/commit/c30c5d03))

- spelling: changed ([commit](https://github.com/Polymer/polymer/commit/1579bf36))

- spelling: behavior ([commit](https://github.com/Polymer/polymer/commit/65f27655))

- spelling: attribute ([commit](https://github.com/Polymer/polymer/commit/d8f3f57d))

- spelling: attached ([commit](https://github.com/Polymer/polymer/commit/adc4f0e1))

- spelling: asynchronous ([commit](https://github.com/Polymer/polymer/commit/6c59f53b))

- Explicitly set display none on dom-* elements (#4821) ([commit](https://github.com/Polymer/polymer/commit/65859b1c))

- Publish DomBind in Polymer. scope ([commit](https://github.com/Polymer/polymer/commit/60054350))

- Fix missing semi-colons in test folder ([commit](https://github.com/Polymer/polymer/commit/72a59f77))

- Enable ESLint 'semi' rule ([commit](https://github.com/Polymer/polymer/commit/75c6fff7))

- [ci skip] update package-lock ([commit](https://github.com/Polymer/polymer/commit/ca1ce196))

- [ci skip] Add license headers to externs ([commit](https://github.com/Polymer/polymer/commit/f4a9e06e))

- Polymer.Path.get accepts both a string path or an Array path, so functions that call this should allow for either as well. Already changed for Polymer.prototype.push here: ([commit](https://github.com/Polymer/polymer/commit/42ce5a88))

- lint with closure as well ([commit](https://github.com/Polymer/polymer/commit/cc649e97))

- Update closure compiler to support polymer pass v2 ([commit](https://github.com/Polymer/polymer/commit/a4591abc))

- Revert "Adds `restamp` mode to dom-repeat." ([commit](https://github.com/Polymer/polymer/commit/d439960a))

- Add test to verify that importHref can be called twice ([commit](https://github.com/Polymer/polymer/commit/6ce904b3))

- Fix compiling with Polymer({}) calls ([commit](https://github.com/Polymer/polymer/commit/d937d5fe))

- Remove double space ([commit](https://github.com/Polymer/polymer/commit/bbf0e7c8))

- Add development workflow-related files to gitignore (#4612) ([commit](https://github.com/Polymer/polymer/commit/d5c2629f))

- Allow arbitrary whitespace in CSS imports ([commit](https://github.com/Polymer/polymer/commit/5c250d44))

- Fix dom-module API docs with static `import` function ([commit](https://github.com/Polymer/polymer/commit/9f7df4cf))

- [ci skip] update externs more from #4776 ([commit](https://github.com/Polymer/polymer/commit/c20b6574))

- imported css modules should always be before element's styles ([commit](https://github.com/Polymer/polymer/commit/679a49e4))

- Update closure annotation for Polymer.prototype.push ([commit](https://github.com/Polymer/polymer/commit/eb170cbb))

- Fixed formatting. ([commit](https://github.com/Polymer/polymer/commit/48fac922))

- Fix formatting of code in API docs (#4771) ([commit](https://github.com/Polymer/polymer/commit/eb406c71))

- Lint clean. ([commit](https://github.com/Polymer/polymer/commit/4095e12d))

- Separate scripts that modify configuration properties, as their ordering constraints are unusual. ([commit](https://github.com/Polymer/polymer/commit/49dbacb6))

- test: convert XNestedRepeat to use an inlined string template. ([commit](https://github.com/Polymer/polymer/commit/c89155ba))

- Don't rely on  implicitly creating a global,  does not. ([commit](https://github.com/Polymer/polymer/commit/28ed27e0))

- Refer to Gestures.recognizers consistently. ([commit](https://github.com/Polymer/polymer/commit/3555b458))

- Make test work in strict mode. ([commit](https://github.com/Polymer/polymer/commit/328ce594))

- In tests, explicitly write to window when creating a new global for clarity. ([commit](https://github.com/Polymer/polymer/commit/674d4685))

- [ci skip] remove duplicate definition for __dataHost in externs ([commit](https://github.com/Polymer/polymer/commit/5ab9032c))

- [ci skip] update polymer-build and run-sequence ([commit](https://github.com/Polymer/polymer/commit/0c6aa882))

- Fix tests in non-Chrome browsers ([commit](https://github.com/Polymer/polymer/commit/5a54c32b))

- Better distinguish param name from namespaced name ([commit](https://github.com/Polymer/polymer/commit/a3d6e56b))

- use wct 6 npm package ([commit](https://github.com/Polymer/polymer/commit/fbe8dcc4))

- add mixin class instance properties to externs ([commit](https://github.com/Polymer/polymer/commit/34d22acd))

- Add sanitizeDOMValue to settings.html ([commit](https://github.com/Polymer/polymer/commit/4d730e16))

- Remove reference to Polymer._toOverride, it seems like an incomplete feature/part of the test. ([commit](https://github.com/Polymer/polymer/commit/981a7600))

- Update custom-style API doc ([commit](https://github.com/Polymer/polymer/commit/52a7328e))

- Use customElements.get rather than referring to the global for Polymer.DomModule ([commit](https://github.com/Polymer/polymer/commit/bb202378))

- Add import of dom-module to file that uses it. ([commit](https://github.com/Polymer/polymer/commit/dbedcfc0))

- Do not assign to a readonly property on window ([commit](https://github.com/Polymer/polymer/commit/b64e4862))

- [ci skip] Fix documentation in PropertyAccessors ([commit](https://github.com/Polymer/polymer/commit/0f695d90))

- [ci skip] fix closure warning ([commit](https://github.com/Polymer/polymer/commit/2e7dc00b))

- Fix event path for tap event on touch ([commit](https://github.com/Polymer/polymer/commit/50bf45c3))

- [ci skip] Update changelog ([commit](https://github.com/Polymer/polymer/commit/466624ae))

- Update web-component-tester to stable version ([commit](https://github.com/Polymer/polymer/commit/ae78564c))

- Disable closure linting until the count is driven down to a reasonable level ([commit](https://github.com/Polymer/polymer/commit/6335b24f))

- Adds `restamp` mode to dom-repeat. ([commit](https://github.com/Polymer/polymer/commit/6cebeace))

## [v2.0.2](https://github.com/Polymer/polymer/tree/v2.0.2) (2017-07-14)
- remove broken npm script ([commit](https://github.com/Polymer/polymer/commit/27c67125))

- depend on webcomponentsjs 1.0.2 ([commit](https://github.com/Polymer/polymer/commit/d522de0f))

- cleanup and update npm dependencies ([commit](https://github.com/Polymer/polymer/commit/4176c6c2))

- Update LegacyElementMixin.distributeContent ([commit](https://github.com/Polymer/polymer/commit/2daf9de2))

- Remove crufty test ([commit](https://github.com/Polymer/polymer/commit/c96350b4))

- [ci skip] remove one new closure warning for updating closure ([commit](https://github.com/Polymer/polymer/commit/0cb560a4))

- Meaningful closure fixes from @ChadKillingsworth ([commit](https://github.com/Polymer/polymer/commit/88043077))

- [ci skip] clean up mixin fn and regen externs ([commit](https://github.com/Polymer/polymer/commit/72022f27))

- address some concerns from kschaaf ([commit](https://github.com/Polymer/polymer/commit/44653813))

- zero warnings left ([commit](https://github.com/Polymer/polymer/commit/3e14a1d8))

- [ci skip] Fix link closing quotes. ([commit](https://github.com/Polymer/polymer/commit/d1ad0c33))

- Remove @suppress {missingProperties} ([commit](https://github.com/Polymer/polymer/commit/2efccb95))

- Annotate Debouncer summary. (#4691) ([commit](https://github.com/Polymer/polymer/commit/806119ae))

- Fix typo in templatize.html ([commit](https://github.com/Polymer/polymer/commit/de181d6e))

- Move Debouncer memberof annotation to right place, and add a summary. (#4690) ([commit](https://github.com/Polymer/polymer/commit/77f06712))

- remove PolymerPropertyEffects type, inline DataTrigger and DataEffect types ([commit](https://github.com/Polymer/polymer/commit/7612df67))

- remove polymer-element dependency introduced by a merge conflict ([commit](https://github.com/Polymer/polymer/commit/3b7eedb8))

- update closure log ([commit](https://github.com/Polymer/polymer/commit/344ebb4c))

- remove dommodule imports ([commit](https://github.com/Polymer/polymer/commit/fc886306))

- Create style-gather.html ([commit](https://github.com/Polymer/polymer/commit/73fbbb45))

- README: fix typo ([commit](https://github.com/Polymer/polymer/commit/5355252a))

- Remove unused `__needFullRefresh` ([commit](https://github.com/Polymer/polymer/commit/bdbbfa19))

- Fixes #4650: if an observed path changes, the repeat should render but in addition, the path should be notified. This is necessary since “mutableData” is optional. ([commit](https://github.com/Polymer/polymer/commit/22d27aa0))

- last two stragglers ([commit](https://github.com/Polymer/polymer/commit/9bd89203))

- fix eslint warnings ([commit](https://github.com/Polymer/polymer/commit/ba720124))

- Down to 30ish warnings, need PolymerPass v2 ([commit](https://github.com/Polymer/polymer/commit/de87c585))

- Add lib/utils/settings.html to hold legacy settings and rootPath ([commit](https://github.com/Polymer/polymer/commit/3183e3f7))

- Fix typo in dom-repeat.html ([commit](https://github.com/Polymer/polymer/commit/d6941a34))

- guard all dommodule references ([commit](https://github.com/Polymer/polymer/commit/c3866a59))

- add more missing imports ([commit](https://github.com/Polymer/polymer/commit/8c71456d))

- Add mixin.html import to gesture-event-listeners.html ([commit](https://github.com/Polymer/polymer/commit/352dc33a))

- more fixes ([commit](https://github.com/Polymer/polymer/commit/872e1c27))

- rebaseline warnings with NTI specific warnings disabled, for now ([commit](https://github.com/Polymer/polymer/commit/abc229e5))

- Fix parsing for argument whitespace. Fixes #4643. ([commit](https://github.com/Polymer/polymer/commit/a29d8876))

- Upgrade babel-preset-babili to include RegExp fix from https://github.com/babel/babili/pull/490 ([commit](https://github.com/Polymer/polymer/commit/308cae6e))

- Not an RC anymore ([commit](https://github.com/Polymer/polymer/commit/8290002b))

- Just ensure content frag from _contentForTemplate is inert. Edge does not seem to always use the exact same owner document for templates. ([commit](https://github.com/Polymer/polymer/commit/b73caea0))

- Fix typo in prop of FlattenedNodesObserver ([commit](https://github.com/Polymer/polymer/commit/57fe7dca))

- [ci skip] Update Changelog ([commit](https://github.com/Polymer/polymer/commit/e03b2cce))

- Fix some ElementMixin warnings. ([commit](https://github.com/Polymer/polymer/commit/c0a816f6))

- Fix template.assetpath with typedef ([commit](https://github.com/Polymer/polymer/commit/ec3e948d))

- fix dom-module related errors ([commit](https://github.com/Polymer/polymer/commit/07443645))

- Fix fn binding error ([commit](https://github.com/Polymer/polymer/commit/bc504f64))

- Reduce closure warnings in PropertyAccessors ([commit](https://github.com/Polymer/polymer/commit/3591be8b))

- reduce closure warnings in TemplateStamp ([commit](https://github.com/Polymer/polymer/commit/c34ef0b2))

- [ci skip] parameterize entries for closure task ([commit](https://github.com/Polymer/polymer/commit/3a80ad8f))

- [ci skip] generating externs should be explicit ([commit](https://github.com/Polymer/polymer/commit/a8a57bf5))

- Avoid firstElementChild on DocFrag for IE11 ([commit](https://github.com/Polymer/polymer/commit/02e31d78))

- update externs for merge, update dependencies ([commit](https://github.com/Polymer/polymer/commit/e927bc9a))

- Fix impl of _contentForTemplate. Add template-stamp tests. Fixes #4597 ([commit](https://github.com/Polymer/polymer/commit/06190c9d))

- ensure latest closure, stay on polymer-build 1.1 until warnings can be ignored ([commit](https://github.com/Polymer/polymer/commit/7abd7037))

- @mixes -> @appliesMixin ([commit](https://github.com/Polymer/polymer/commit/1f21ab1a))

- @polymerMixin/@polymerMixinClass -> @mixinFunction/@mixinClass ([commit](https://github.com/Polymer/polymer/commit/f7e8021e))

- @polymerElement -> @customElement/@polymer ([commit](https://github.com/Polymer/polymer/commit/231b21c0))

- fix lint error ([commit](https://github.com/Polymer/polymer/commit/e5de1782))

- remove all "global this" warnings ([commit](https://github.com/Polymer/polymer/commit/c0ddc60b))

- remove `TemplateStamp`’s implicit dependency on `_initializeProperties` ([commit](https://github.com/Polymer/polymer/commit/f821e46a))

- fix typing for Polymer.Element ([commit](https://github.com/Polymer/polymer/commit/0b152938))

- inline cachingMixin into deduplicatingMixin ([commit](https://github.com/Polymer/polymer/commit/c3da5073))

- initialize properties in `_initializeProperties` rather than `constructor` (allows work to be done before `_initializeProperties` and is needed for proto/instance property initialization . ([commit](https://github.com/Polymer/polymer/commit/f15e4ee6))

- LegacyElementMixin to `@unrestricted` ([commit](https://github.com/Polymer/polymer/commit/c1eda7af))

- set `isAttached` constructor (for closure) but set to undefined so not picked up as proto property (avoids initial binding value) ([commit](https://github.com/Polymer/polymer/commit/6a995a23))

- Fix dedupingMixin ([commit](https://github.com/Polymer/polymer/commit/2c9ffac3))

- Fix more closure warnings ([commit](https://github.com/Polymer/polymer/commit/f04d6311))

- Fix more closure warnings ([commit](https://github.com/Polymer/polymer/commit/d0f78122))

- Fix more closure warnings. ([commit](https://github.com/Polymer/polymer/commit/0c3e3c5f))

- Fix more closure warnings. ([commit](https://github.com/Polymer/polymer/commit/b686cd77))

- Fix more closure warnings. ([commit](https://github.com/Polymer/polymer/commit/0b22959f))

- Fix more closure warnings. ([commit](https://github.com/Polymer/polymer/commit/2627e63a))

- slighly better typing for mixin function ([commit](https://github.com/Polymer/polymer/commit/b3dfd38e))

- gesture fixes ([commit](https://github.com/Polymer/polymer/commit/346e2d57))

- Fix more closure warnings. ([commit](https://github.com/Polymer/polymer/commit/fa9823f7))

- Fix some closure warnings. ([commit](https://github.com/Polymer/polymer/commit/f1a14982))

- Fix some closure warnings. ([commit](https://github.com/Polymer/polymer/commit/51855541))

- automate generating closure externs ([commit](https://github.com/Polymer/polymer/commit/89b12301))

- Fix some closure warnings. ([commit](https://github.com/Polymer/polymer/commit/37abc4e3))

- fix some closure warnings. ([commit](https://github.com/Polymer/polymer/commit/80f54421))

## [v2.0.1](https://github.com/Polymer/polymer/tree/v2.0.1) (2017-05-25)
- [ci skip] Prepare 2.0.1 ([commit](https://github.com/Polymer/polymer/commit/061b1048))

- Improve comment more ([commit](https://github.com/Polymer/polymer/commit/39877086))

- Improve comment ([commit](https://github.com/Polymer/polymer/commit/fa1469a9))

- Add comment. ([commit](https://github.com/Polymer/polymer/commit/250067b3))

- * Improve clarity: change `__dataInitialized` to `__dataReady` * When `_flushClients` is called, ensure that clients are always enabled or flushed as appropriate. This ensures that (1) clients that are enabled before the host is enabled flush properly, and (2) clients that are stamped but not enabled properly enable when the host flushes. ([commit](https://github.com/Polymer/polymer/commit/8e8692f7))

- Fix typo in  runBindingEffect documentation ([commit](https://github.com/Polymer/polymer/commit/6bd8dcfa))

- Fixes #4601. Client elements can be readied that have already enabled properties. This can happen when templatize is used to create instances with no properties. In this case, in order for properties to flush properly to clients, clients must be flushed. ([commit](https://github.com/Polymer/polymer/commit/06df53d9))

- [ci skip] Update Changelog ([commit](https://github.com/Polymer/polymer/commit/c4e516f6))

## [v2.0.0](https://github.com/Polymer/polymer/tree/v2.0.0) (2017-05-15)
- [ci skip] bump version to 2.0.0 ([commit](https://github.com/Polymer/polymer/commit/712230fc))

- [ci skip] Update Changelog ([commit](https://github.com/Polymer/polymer/commit/21ee3b4d))

## [v2.0.0-rc.9](https://github.com/Polymer/polymer/tree/v2.0.0-rc.9) (2017-05-12)
- [ci skip] Add alacarte usage smoke tests. ([commit](https://github.com/Polymer/polymer/commit/e54bc5f8))

- [skip ci] doc fixes ([commit](https://github.com/Polymer/polymer/commit/b943aa0d))

- Docs and slight renaming. ([commit](https://github.com/Polymer/polymer/commit/4eb252fe))

- Add tests. ([commit](https://github.com/Polymer/polymer/commit/1f83fd7c))

- Move hostStack to property-effects and make readyClients explicit ([commit](https://github.com/Polymer/polymer/commit/c7a81ea8))

- Turn on accessors (via __dataInitialized) only after clients have completely flushed. ([commit](https://github.com/Polymer/polymer/commit/2f1e964c))

- Adds `_enableProperties` as a new entry point that must be called to turn on properties. Prevents a bug where `_readyClients` can be called twice. ([commit](https://github.com/Polymer/polymer/commit/c6f9b315))

- [ci skip] Fix doc createPropertyEffect -> addPropertyEffect ([commit](https://github.com/Polymer/polymer/commit/90e8cd95))

- [ci skip] Update Changelog ([commit](https://github.com/Polymer/polymer/commit/448149d2))

## [v2.0.0-rc.8](https://github.com/Polymer/polymer/tree/v2.0.0-rc.8) (2017-05-11)
- Add test for boolean dynamicFn ([commit](https://github.com/Polymer/polymer/commit/03d21ce8))

- Accept boolean or object map for dynamicFns ([commit](https://github.com/Polymer/polymer/commit/f197ce24))

- update dependencies for v1 polyfills ([commit](https://github.com/Polymer/polymer/commit/d9b5b8f9))

- Null the links when unbinding. ([commit](https://github.com/Polymer/polymer/commit/42230437))

- Dedupe API docs. ([commit](https://github.com/Polymer/polymer/commit/e97a6eb7))

- Move setup to suiteSetup ([commit](https://github.com/Polymer/polymer/commit/d5b282fa))

- Uncomment previous tests ([commit](https://github.com/Polymer/polymer/commit/55b2d160))

- Add tests ([commit](https://github.com/Polymer/polymer/commit/0f4ebf62))

- [ci skip] port gen-changelog from 1.x ([commit](https://github.com/Polymer/polymer/commit/24dd897d))

- Add static API for creating property fx and minor code refactoring. ([commit](https://github.com/Polymer/polymer/commit/7497065a))

- [ci skip] remove bower.json version, add npm devDependencies & np publish config ([commit](https://github.com/Polymer/polymer/commit/6b6092e0))

- Fix comment. ([commit](https://github.com/Polymer/polymer/commit/6f1dde76))

- Fixes #4585. Data notifications do not flush host if host has not initialized clients. This preserves the Polymer 1.x guarantee that client dom is fully “readied” when data observers run. ([commit](https://github.com/Polymer/polymer/commit/3b6981d4))

- Ensure no warnings for dynamic fns. Fixes #4575 ([commit](https://github.com/Polymer/polymer/commit/d72baf9d))

- Corrected minor Method comments ([commit](https://github.com/Polymer/polymer/commit/8a2aeb65))

- Removes the `disable-upgrade` feature from Polymer 2.0. Due to #4550, the feature has a flaw for native ES6 classes and would be better implemented as either a mixin or patch to `customElements.define`. ([commit](https://github.com/Polymer/polymer/commit/972b2bab))

- Fix jsBin link. ([commit](https://github.com/Polymer/polymer/commit/811c334e))

- Ensure tags in markdown are backtracked. Short-term stopgap to ensure they are not rendered in HTML. ([commit](https://github.com/Polymer/polymer/commit/e90ef30d))

- Clean up gulpfile ([commit](https://github.com/Polymer/polymer/commit/764448c9))

- bump wct version ([commit](https://github.com/Polymer/polymer/commit/bafa1ecd))

- Disabling `lint-closure` until the error count is driven to 0 ([commit](https://github.com/Polymer/polymer/commit/c98e3799))

- fix test failures on safari 9 and chrome 41 w/focus event ([commit](https://github.com/Polymer/polymer/commit/0b00f2d9))

- update debounce example. ([commit](https://github.com/Polymer/polymer/commit/5be7ec99))

- Fixes #4553, #4554 ([commit](https://github.com/Polymer/polymer/commit/36792f94))

- save closure warnings to "closure.log" file ([commit](https://github.com/Polymer/polymer/commit/25cfc882))

- use shadycss externs directly, now only 498 warnings ([commit](https://github.com/Polymer/polymer/commit/c21a63db))

- add gulp task to lint for closure warnings ([commit](https://github.com/Polymer/polymer/commit/4e782741))

## [v2.0.0-rc.7](https://github.com/Polymer/polymer/tree/v2.0.0-rc.7) (2017-04-19)
- Add more tests. ([commit](https://github.com/Polymer/polymer/commit/73df8c5b))

- Update jsBin template for 2.0 ([commit](https://github.com/Polymer/polymer/commit/4a2db9ca))

- [ci skip] Update link to jsBin template for 2.0. ([commit](https://github.com/Polymer/polymer/commit/0aeb3170))

- Move computeLinkedPaths out of hot path and into sync setter. ([commit](https://github.com/Polymer/polymer/commit/d722cb9c))

- [ci skip] Add note re: purpose of test ([commit](https://github.com/Polymer/polymer/commit/7ecbf258))

- Fix test for fallback \_readyClients. Fixes #4547 ([commit](https://github.com/Polymer/polymer/commit/85184e8b))

- Process paths regardless of accessor, & loop on computeLinkedPaths. Fixes #4542 ([commit](https://github.com/Polymer/polymer/commit/e2d17020))

## [v2.0.0-rc.6](https://github.com/Polymer/polymer/tree/v2.0.0-rc.6) (2017-04-17)
- [ci skip] Fix API docs ([commit](https://github.com/Polymer/polymer/commit/5a4427bf))

- Guard against overwriting bound values with hasOwnProperty. Fixes #4540 ([commit](https://github.com/Polymer/polymer/commit/4c023740))

- [ci skip] reduce warnings ([commit](https://github.com/Polymer/polymer/commit/00f9e3eb))

- fix globals for goog.reflect.objectProperty -> JSCompiler_renameProperty swap ([commit](https://github.com/Polymer/polymer/commit/8867fde5))

- [ci skip] remove outdated externs file ([commit](https://github.com/Polymer/polymer/commit/626a085d))

- lint and compile successfully ([commit](https://github.com/Polymer/polymer/commit/a2fa1005))

- update dependencies ([commit](https://github.com/Polymer/polymer/commit/36603bc4))

- Rename `setPrivate` -> `setReadOnly` ([commit](https://github.com/Polymer/polymer/commit/521ed3de))

- Add `setPrivate` arg to `setProperties` ([commit](https://github.com/Polymer/polymer/commit/e6e4803f))

- Never accidental test change ([commit](https://github.com/Polymer/polymer/commit/28c15caa))

- Remove unused @method ([commit](https://github.com/Polymer/polymer/commit/6d636138))

- Standardize @return, @param, type case. ([commit](https://github.com/Polymer/polymer/commit/8cab18b1))

- Fix jsdoc warnings. ([commit](https://github.com/Polymer/polymer/commit/dab794b2))

- jsdoc fixes. ([commit](https://github.com/Polymer/polymer/commit/38a13f66))

- Fix jsdoc issues. ([commit](https://github.com/Polymer/polymer/commit/86d2eebc))

- Fix jsdoc issues. ([commit](https://github.com/Polymer/polymer/commit/8a11c8c3))

- Enable error on jsdoc mistake. ([commit](https://github.com/Polymer/polymer/commit/72a454e9))

- fix @license comments & shadycss imports. Remove custom style from externs ([commit](https://github.com/Polymer/polymer/commit/59350ad4))

- closure advanced compilation ([commit](https://github.com/Polymer/polymer/commit/eea1ca23))

## [v2.0.0-rc.5](https://github.com/Polymer/polymer/tree/v2.0.0-rc.5) (2017-04-13)
- Eliminate rest args for better perf on stable chrome. ([commit](https://github.com/Polymer/polymer/commit/fa67457c))

- Fix perf regressions. ([commit](https://github.com/Polymer/polymer/commit/86e35e3a))

- Move second tap test to the correct spot. ([commit](https://github.com/Polymer/polymer/commit/6e4b87c1))

- Add GestureEventListeners to dom-bind. ([commit](https://github.com/Polymer/polymer/commit/4f628fd9))

- Add more comments ([commit](https://github.com/Polymer/polymer/commit/d0bd96d4))

- [ci skip] Fix comment. ([commit](https://github.com/Polymer/polymer/commit/becd1d3b))

- alias another way ([commit](https://github.com/Polymer/polymer/commit/d297047e))

- use chrome beta ([commit](https://github.com/Polymer/polymer/commit/0724f187))

- Add more HTMLImports.whenReady ([commit](https://github.com/Polymer/polymer/commit/bc713187))

- Address feedback from review: * Refactor `_bindTemplate` to remove problematic `hasCreatedAccessors` * Remove vestigial `dom` from `_bindTemplate` call * Rename `_unstampTemplate` to `_removeBoundDom` * Add `infoIndex` to `nodeInfo` (and renamed parent & index) * Add test to ensure runtime accessors created for new props in runtime stamped template * Changed custom binding test to use different prop names * Added test for #first count after removing bound dom ([commit](https://github.com/Polymer/polymer/commit/b9fafb7e))

- Fix lint error. ([commit](https://github.com/Polymer/polymer/commit/dff5f2bc))

- Ensure prototype wasn't affected by runtime effects. ([commit](https://github.com/Polymer/polymer/commit/bf2dbe0a))

- Add tests for adding/removing runtime property effects. ([commit](https://github.com/Polymer/polymer/commit/14711067))

- Added tests for custom parsing, effects, and binding. ([commit](https://github.com/Polymer/polymer/commit/1cf955b9))

- Add initial runtime stamping tests. ([commit](https://github.com/Polymer/polymer/commit/eb6ab63e))

- Fix changelog generation ([commit](https://github.com/Polymer/polymer/commit/8c103d98))

- Address feedback based on review. * PropertyAccessors must call `_flushProperties` to enable * Avoid tearing off oldProps (unnecessary) * Add `addBinding` docs * Merge notifyListeners into `setupBindings` * Add comment re: path-bindings not being overridable * Remove `dom` argument from `_bindTemplate` * Rename `_stampBoundTemplate` back to `_stampTemplate` ([commit](https://github.com/Polymer/polymer/commit/6af84c45))

- Put $ on dom, and assign to element as needed. Eliminate _templateInfo reference. ([commit](https://github.com/Polymer/polymer/commit/03bed19d))

- Fix _hasAccessor for readOnly. Collapse addBinding & addBindingEffects ([commit](https://github.com/Polymer/polymer/commit/396c102c))

- Improvements to binding API: - Adds override points for _parseBindings and _evaluateBinding - Adds support for runtime template binding - Moves ready(), _hasAccessor tracking, and instance property swizzle at ready time to PropertyAccessors ([commit](https://github.com/Polymer/polymer/commit/ea4e7d97))

## [v2.0.0-rc.4](https://github.com/Polymer/polymer/tree/v2.0.0-rc.4) (2017-04-12)
- fix lint error ([commit](https://github.com/Polymer/polymer/commit/e397c434))

- Only style elements with templates ([commit](https://github.com/Polymer/polymer/commit/2356f7b8))

- [ci skip] note safari bugs ([commit](https://github.com/Polymer/polymer/commit/ef90168b))

- Various Safari 10.1 fixes ([commit](https://github.com/Polymer/polymer/commit/dea052a2))

- Add `@memberof` annotation for Polymer.Debouncer ([commit](https://github.com/Polymer/polymer/commit/352878d5))

- Import mutable-data.html in dom-bind ([commit](https://github.com/Polymer/polymer/commit/bbc0373c))

- Correct changelog version title ([commit](https://github.com/Polymer/polymer/commit/9555ca34))

- Fix readme. ([commit](https://github.com/Polymer/polymer/commit/bbfea905))

- tighten up custom-style-late test ([commit](https://github.com/Polymer/polymer/commit/2106f656))

- Fixes #4478 by adding a better warning for attributes that cannot deserialize from JSON. ([commit](https://github.com/Polymer/polymer/commit/dba28c06))

- Adds back the `beforeRegister` method. Users can no longer set the `is` property in this method; however, dynamic property effects can still be installed here. ([commit](https://github.com/Polymer/polymer/commit/7639cf81))

- Fixes #4447. Re-introduce the `hostStack` in order to maintain “client before host” ordering when `_flushProperties` is called before `connectedCallback` (e.g. as Templatize does). ([commit](https://github.com/Polymer/polymer/commit/8467a696))

- Fix custom-style-late tests ([commit](https://github.com/Polymer/polymer/commit/caafef79))

- Add test for ensuring complicated mixin ordering is correct ([commit](https://github.com/Polymer/polymer/commit/6d663354))

- move lazy-upgrade out to separate mixins repo ([commit](https://github.com/Polymer/polymer/commit/deb5a9a5))

- Only check bounding client rect on clicks that target elements ([commit](https://github.com/Polymer/polymer/commit/af37d04c))

- Adds tests from https://github.com/Polymer/polymer/pull/4099. The other changes from the PR are no longer needed. ([commit](https://github.com/Polymer/polymer/commit/c5710666))

- clean up code, factor processing lazy candidates, better docs ([commit](https://github.com/Polymer/polymer/commit/189a2083))

- Update templatize.html ([commit](https://github.com/Polymer/polymer/commit/2abfe09e))

- Doc fix (correct callback name) ([commit](https://github.com/Polymer/polymer/commit/57d22f4c))

- Fixed templatize typo ([commit](https://github.com/Polymer/polymer/commit/b6b43f36))

- Work around IE/Edge bug with :not([attr]) selectors ([commit](https://github.com/Polymer/polymer/commit/c3036232))

- Remove support for lazy-upgrade inside dom-if and dom-repeat ([commit](https://github.com/Polymer/polymer/commit/1b4a9781))

- Fix image in README ([commit](https://github.com/Polymer/polymer/commit/b860594a))

- Remove useless id check on mixins ([commit](https://github.com/Polymer/polymer/commit/8c1a5765))

- move dom-change listener for lazy-upgrade before `super.ready()` ([commit](https://github.com/Polymer/polymer/commit/ba60b820))

- [ci skip] Update doc ([commit](https://github.com/Polymer/polymer/commit/f87790d6))

- [ci skip] Update doc ([commit](https://github.com/Polymer/polymer/commit/b9774801))

- Add API docs. ([commit](https://github.com/Polymer/polymer/commit/1eb0df49))

- nodeInfo -> nodeInfoList ([commit](https://github.com/Polymer/polymer/commit/eed67504))

- Updates based on PR feedback. API docs in progress. ([commit](https://github.com/Polymer/polymer/commit/627352db))

- * ensure element cannot return to “disabled” state after upgrading. * ensure nested `beforeNextRender` calls always go before the next render * ensure nested `afterNextRender` are called after additional renders ([commit](https://github.com/Polymer/polymer/commit/e9c58add))

- Fixes #4437. Ensure `_registered` is called 1x for each element class using `LegacyElementMixin`. Ensure that a behaviors’s `registered` method is called for any extending class. ([commit](https://github.com/Polymer/polymer/commit/de09d730))

- Separate binding-specific code from template stamp. Expose override points. ([commit](https://github.com/Polymer/polymer/commit/e95afeb1))

- Use webcomponents-lite for test ([commit](https://github.com/Polymer/polymer/commit/50ae3bb7))

- add lazy-upgrade tests ([commit](https://github.com/Polymer/polymer/commit/71b70aaa))

- make a mixin for lazy upgrading ([commit](https://github.com/Polymer/polymer/commit/9891e484))

- implements `disable-upgrade` attribute which prevents readying an element until the attribute is removed. ([commit](https://github.com/Polymer/polymer/commit/a222078e))

## [v2.0.0-rc.3](https://github.com/Polymer/polymer/tree/v2.0.0-rc.3) (2017-03-15)
- add properties, behaviors, observers, hostAttributes, listeners on prototype ([commit](https://github.com/Polymer/polymer/commit/93cf3246))

- [skip ci] update test comments ([commit](https://github.com/Polymer/polymer/commit/bb52071b))

- better comment ([commit](https://github.com/Polymer/polymer/commit/a081e669))

- get behaviors only from prototypes ([commit](https://github.com/Polymer/polymer/commit/8bac5c60))

- behaviors ONLY on the prototype ([commit](https://github.com/Polymer/polymer/commit/444c043c))

- add instance behaviors ([commit](https://github.com/Polymer/polymer/commit/4bf7bdd7))

- [ci skip] minor doc edits. ([commit](https://github.com/Polymer/polymer/commit/4ae65ba2))

- [ci skip] expand range of dependencies to all rcs ([commit](https://github.com/Polymer/polymer/commit/46c10465))

## [v2.0.0-rc.2](https://github.com/Polymer/polymer/tree/v2.0.0-rc.2) (2017-03-07)
- another test fix. ([commit](https://github.com/Polymer/polymer/commit/d9418e1a))

- fix behavior warn test. ([commit](https://github.com/Polymer/polymer/commit/4439436f))

- update to latest webcomponents rc. ([commit](https://github.com/Polymer/polymer/commit/46219a39))

- move mutable data mixin to be loaded by polymer.html ([commit](https://github.com/Polymer/polymer/commit/7cebe120))

- Fix 4387. Ensure `dom-change` fired with `composed: true`. ([commit](https://github.com/Polymer/polymer/commit/3e683297))

- Allow hybrid elements (like iron-list) to make template instances with mutable data ([commit](https://github.com/Polymer/polymer/commit/ea392e3f))

- Don't override the goog namespace if it already exists ([commit](https://github.com/Polymer/polymer/commit/b30deb22))

- Use correct version ([commit](https://github.com/Polymer/polymer/commit/3b7d4484))

- Fix spelling error ([commit](https://github.com/Polymer/polymer/commit/c14ea57f))

- [ci skip] Fix note re: transpilation ([commit](https://github.com/Polymer/polymer/commit/8fd1b212))

- [ci skip] Remove obsolete note re: pre-upgrade attribute vs. property priority ([commit](https://github.com/Polymer/polymer/commit/3dd776fe))

- [ci skip] Fix note re: attached ([commit](https://github.com/Polymer/polymer/commit/b67736ec))

- [ci skip] Add back intro README content from 1.x, updated to 2.x syntax. ([commit](https://github.com/Polymer/polymer/commit/1235f449))

## [v2.0.0-rc.1](https://github.com/Polymer/polymer/tree/v2.0.0-rc.1) (2017-03-06)

<!-- the changelog tool broke, so this is ported from https://www.polymer-project.org/2.0/docs/release-notes#v-2-0-0-rc.1 -->
The following notable changes have been made since the 2.0 Preview announcement.

-   The `config` getter on element classes has been replaced by individual `properties` and
    `observers` getters, more closely resembling the 1.x syntax.

    ```js
    static get properties() {
      return {
        aProp: String,
        bProp: Number
      }
    }
    static get observers() {
      return [
        '_observeStuff(aProp,bProp)'
      ]
    }
    ```

-   1.x-style dirty checking has been reinstated for better performance. An optional mixin is
    available for elements to skip dirty checking of objects and arrays, which may be more easy to
    integrate with some state management systems. For details, see
    [Using the MutableData mixin](devguide/data-system#mutable-data) in Data system concepts.

-   Support for dynamically-created `custom-style` elements has been added.

-   Support for the external style sheet syntax, `<link rel="import" type="css">` has
    been added. This was deprecated in 1.x, but will be retained until an alternate solution is
    available for importing unprocessed CSS.

-   New properties `rootPath` and `basePath` were added to `Polymer.Element` to allow authors
    to configure how URLs are rewritten inside templates. For details, see the
    [Update URLs in templates](./upgrade#urls-in-templates) in the Upgrade guide.


## [v1.9.1-dev](https://github.com/Polymer/polymer/tree/v1.9.1-dev) (2017-04-17)
- Remove use of ES6 API. ([commit](https://github.com/Polymer/polymer/commit/96010657))

- Remove use of ES6 API. ([commit](https://github.com/Polymer/polymer/commit/646dce69))

- Ensure optimization uses hybrid parentNode ([commit](https://github.com/Polymer/polymer/commit/b7f00992))

- Use local `parentNode` ([commit](https://github.com/Polymer/polymer/commit/2e4290f8))

- Capture hybridDomRepeat. ([commit](https://github.com/Polymer/polymer/commit/ee3b9a69))

- Fix dom-if detachment ([commit](https://github.com/Polymer/polymer/commit/2722532b))

- Add dom-if test for add/remove. ([commit](https://github.com/Polymer/polymer/commit/a2825650))

- Add test for add & remove ([commit](https://github.com/Polymer/polymer/commit/4c87e1d9))

- Add 2.x hybrid affordances for stamping template content. Fixes #4536 ([commit](https://github.com/Polymer/polymer/commit/53053eb4))

- Fix lint ([commit](https://github.com/Polymer/polymer/commit/f29104f2))

- Make tests more strict. ([commit](https://github.com/Polymer/polymer/commit/ea65a6d0))

- Use `_importPath` in `resolveUrl` so it available early. Fixes #4532 ([commit](https://github.com/Polymer/polymer/commit/1a7d3b11))

- [ci skip] update Changelog ([commit](https://github.com/Polymer/polymer/commit/3ce4e176))

## [v1.9.0-dev](https://github.com/Polymer/polymer/tree/v1.9.0-dev) (2017-04-13)
- [ci skip] skip looking in build log, again ([commit](https://github.com/Polymer/polymer/commit/1d282c7f))

- [ci skip] backport changelog fixes ([commit](https://github.com/Polymer/polymer/commit/d6a7ac71))

- * allow setting `rootPath` * disallow setting `importPath` (this is supported in 2.x but not 1.x) ([commit](https://github.com/Polymer/polymer/commit/ac067652))

- Add `importPath` and `rootPath` to support 2.x hybrid compatible elements. ([commit](https://github.com/Polymer/polymer/commit/daaf460a))

- [ci skip] Update Changelog ([commit](https://github.com/Polymer/polymer/commit/80c899f4))

- Add missing semicolon after variable assignment ([commit](https://github.com/Polymer/polymer/commit/afb21c8f))

- Update PRIMER.md ([commit](https://github.com/Polymer/polymer/commit/4d66a353))

## [v1.8.1-dev](https://github.com/Polymer/polymer/tree/v1.8.1-dev) (2017-02-27)
- Exclude SD polyfill tests for Edge due to lack of workarounds for Edge DocFrag bugs. ([commit](https://github.com/Polymer/polymer/commit/de45ba02))

- [ci skip] Update comment to include reference to problem browser. ([commit](https://github.com/Polymer/polymer/commit/72f21fe6))

- Check documentElement instead of body to guarantee it's there. ([commit](https://github.com/Polymer/polymer/commit/a0ad3bbe))

- add tests ([commit](https://github.com/Polymer/polymer/commit/20de9287))

- Adds a setting `preserveStyleIncludes` which, when used with a shadow dom targeted css build and native custom properties, will copy styles into the Shadow DOM template rather than collapsing them into a single style. This will (1) allow the browser to optimize parsing of shared styles because they remain intact, (2) reduce the size of the css build resources when shared styles are used since they are not pre-collapsed. This option does perform registration runtime work to add included styles to element templates. ([commit](https://github.com/Polymer/polymer/commit/2315547e))

- Fix test failures by feature detecting instance `properties` accessors. Can't rely on `__proto__` on IE10, but that browser doesn't need to avoid `properties`. ([commit](https://github.com/Polymer/polymer/commit/f2a12cb1))

- Read properties off of proto during configuration. ([commit](https://github.com/Polymer/polymer/commit/a68c0b3e))

- remove cruft. ([commit](https://github.com/Polymer/polymer/commit/632f0e47))

- Ensure disable-upgrade elements are not "configured". Fixes #4302 ([commit](https://github.com/Polymer/polymer/commit/b36915f6))

- change lastresponse to last-response in dom-bind example ([commit](https://github.com/Polymer/polymer/commit/4427b0b6))

- [ci skip] Update Changelog ([commit](https://github.com/Polymer/polymer/commit/2d804a28))

## [v1.8.0-dev](https://github.com/Polymer/polymer/tree/v1.8.0-dev) (2017-02-06)
- Add comment. ([commit](https://github.com/Polymer/polymer/commit/a42cb209))

- Only keep `disable-upgrade` attribute if it is an attribute binding. ([commit](https://github.com/Polymer/polymer/commit/62e9b84b))

- spacing. ([commit](https://github.com/Polymer/polymer/commit/5030c1b9))

- Update webcomponentsjs dependency ([commit](https://github.com/Polymer/polymer/commit/ca7dbb84))

- Change `isInert` to `disable-upgrade` and feature is now supported only via the `disable-upgrade` attribute. ([commit](https://github.com/Polymer/polymer/commit/f8f903cf))

- Add tests for `is-inert` ([commit](https://github.com/Polymer/polymer/commit/e1561f65))

- Prevent annotator from removing the `is-inert` attribute. ([commit](https://github.com/Polymer/polymer/commit/91925148))

- fixes for users of Polymer.Class ([commit](https://github.com/Polymer/polymer/commit/0f53bef4))

- Add support for `isInert` to allow elements to boot up in an inert state. e.g. `<x-foo is-inert></x-foo>`. Setting `xFoo.isInert = false` causes the element to boot up. ([commit](https://github.com/Polymer/polymer/commit/ca3f59d3))

- Small typos updated ([commit](https://github.com/Polymer/polymer/commit/bc023648))

- work around older firefox handling of the "properties" property on HTMLElement prototype ([commit](https://github.com/Polymer/polymer/commit/13f36c7f))

- improve comments ([commit](https://github.com/Polymer/polymer/commit/c76ba5b9))

- Add comments. Behavior fast copy flag changed to `_noAccessors`. ([commit](https://github.com/Polymer/polymer/commit/52ea6002))

- Fix tests on IE10 and simplify constructor shortcut. ([commit](https://github.com/Polymer/polymer/commit/e588f1f5))

- Make dom-module work on older Safari. ([commit](https://github.com/Polymer/polymer/commit/73b62a63))

- micro-optimizations: (1) favor mixin over extends where possible, (2) unroll behavior lifecycle calls, (3) avoid creating a custom constructor when not used, (4) provide `_skipDefineProperty` setting on behaviors which copies properties via assignment rather than `copyOwnProperty` ([commit](https://github.com/Polymer/polymer/commit/a1c1285d))

- Ensure done. ([commit](https://github.com/Polymer/polymer/commit/08753237))

- Test positive case of suppressBindingNotifications ([commit](https://github.com/Polymer/polymer/commit/1b19b784))

- Add notifyDomBind to dom-bind. ([commit](https://github.com/Polymer/polymer/commit/ad7f91d6))

- Test Polymer.Settings inside test. ([commit](https://github.com/Polymer/polymer/commit/4b286f19))

- Revert unnecessary change. ([commit](https://github.com/Polymer/polymer/commit/dcde6d4c))

- Fix test lint issue. ([commit](https://github.com/Polymer/polymer/commit/26c669ce))

- Add global flags to suppress unnecessary notification events. Fixes #4262. * `Polymer.Settings.suppressTemplateNotifications `- disables `dom-change` and `rendered-item-count` events from `dom-if`, `dom-repeat`, and `don-bind`. Users can opt back into `dom-change` events by setting the `notify-dom-change` attribute (`notifyDomChange: true` property) to `dom-if`/`don-repeat` instances. * `Polymer.Settings.suppressBindingNotifications` - disables notify effects when propagating data downward via bindings. Generally these are never useful unless users are explicitly doing something like `<my-el foo="{{foo}} on-foo-changed="{{handleFoo}}">` or calling `addEventListener('foo-changed', ...)` on an element where `foo` is bound (we attempted to make this the default some time back but needed to revert it when we found via https://github.com/Polymer/polymer/issues/3077 that users were indeed doing this).  Users that avoid these patterns can enjoy the potentially significant benefit of suppressing unnecessary events during downward data flow by opting into this flag. ([commit](https://github.com/Polymer/polymer/commit/83e14c43))

- Fix `strip-whitespace` for nested templates. ([commit](https://github.com/Polymer/polymer/commit/a3b75eb3))

- [ci skip] update changelog v1.7.1 ([commit](https://github.com/Polymer/polymer/commit/03e22a1c))

- Close backtick in ISSUE_TEMPLATE.md ([commit](https://github.com/Polymer/polymer/commit/b0dea8bc))

## [v1.7.1-dev](https://github.com/Polymer/polymer/tree/v1.7.1-dev) (2016-12-14)
- Remove dependency on WebComponents for IE detection ([commit](https://github.com/Polymer/polymer/commit/650c16a9))

- Make sure text nodes are distributed when translating slot to content ([commit](https://github.com/Polymer/polymer/commit/87e312f1))

- always use the document listener ([commit](https://github.com/Polymer/polymer/commit/5ddcb8d1))

- Add tests for no-gesture interop ([commit](https://github.com/Polymer/polymer/commit/4be7e9f6))

- fix lint error ([commit](https://github.com/Polymer/polymer/commit/9c8eaa9d))

- Use document-wide passive touch listener to update ghostclick blocker target ([commit](https://github.com/Polymer/polymer/commit/947172f8))

- only need to recalc if styleProperties missing ([commit](https://github.com/Polymer/polymer/commit/5bfe2792))

- simpler implementation, only recompute when using shim variables ([commit](https://github.com/Polymer/polymer/commit/5231d87f))

- [ci skip] update travis.yml from 2.0 ([commit](https://github.com/Polymer/polymer/commit/1a9c5c8c))

- Always update style properties when calling getComputedStyleValue ([commit](https://github.com/Polymer/polymer/commit/fb8575c6))

- Add tests ([commit](https://github.com/Polymer/polymer/commit/29de0055))

- Fix #4123: Memory leak when using `importHref` ([commit](https://github.com/Polymer/polymer/commit/132010ea))

- Prevent _showHideChildren from being called on placeholders. ([commit](https://github.com/Polymer/polymer/commit/0468c60a))

- fix broken link to Google JavaScript syle guide in documentation ([commit](https://github.com/Polymer/polymer/commit/376d146f))

- Better explanation thanks to @kevinpschaaf ([commit](https://github.com/Polymer/polymer/commit/0dae8f0d))

- [ci skip] fix changelog title ([commit](https://github.com/Polymer/polymer/commit/16712cb6))

- [ci skip] Update Changelog for 1.7.0 ([commit](https://github.com/Polymer/polymer/commit/d6af21b5))

- Resolving issue #1745 with Polymer docs ([commit](https://github.com/Polymer/polymer/commit/bb875275))

- fixed broken tests/missing web components ([commit](https://github.com/Polymer/polymer/commit/f2b01e34))

- 3430 - ie memory leak fixes - disable event caching, fixed resolver url adding to root doc, and weak map ie issues ([commit](https://github.com/Polymer/polymer/commit/a6e66f92))

- Briefly explain how to split element definition ([commit](https://github.com/Polymer/polymer/commit/c6462286))

- Fix copy&pasted comment ([commit](https://github.com/Polymer/polymer/commit/d595c0cc))

## [v1.7.0](https://github.com/Polymer/polymer/tree/v1.7.0) (2016-09-28)
- Fix IE style cache performance ([commit](https://github.com/Polymer/polymer/commit/d08b694))

- no need for :root to be first in the selector ([commit](https://github.com/Polymer/polymer/commit/63433c8))

- fix tests on !chrome browsers ([commit](https://github.com/Polymer/polymer/commit/7ce981b))

- Translate `:root` to `:host > *` for element styles ([commit](https://github.com/Polymer/polymer/commit/fea64b9))

- Define checkRoot only once ([commit](https://github.com/Polymer/polymer/commit/a49b366))

- Fix normalizeRootSelector ([commit](https://github.com/Polymer/polymer/commit/c2278a0))

- Comment on using the ast walker to replace selector ([commit](https://github.com/Polymer/polymer/commit/9658665))

- update travis config ([commit](https://github.com/Polymer/polymer/commit/c00687a))

- Transform ::slotted() to ::content ([commit](https://github.com/Polymer/polymer/commit/541fdfb))

- Test on native shadow DOM also. ([commit](https://github.com/Polymer/polymer/commit/11afc1f))

- Reorder. ([commit](https://github.com/Polymer/polymer/commit/cbae058))

- Remove unused. ([commit](https://github.com/Polymer/polymer/commit/92d1d8a))

- Add fallback support/test. ([commit](https://github.com/Polymer/polymer/commit/037abdd))

- A little more dry. ([commit](https://github.com/Polymer/polymer/commit/6fd0e1f))

- Use name. ([commit](https://github.com/Polymer/polymer/commit/4aa8da2))

- Support default slot semantics. ([commit](https://github.com/Polymer/polymer/commit/d458dd3))

- Remove opt-in. Exclude content from copy. ([commit](https://github.com/Polymer/polymer/commit/41e5dc0))

- Make sure click events can always trigger tap, even on touch only devices ([commit](https://github.com/Polymer/polymer/commit/02441ca))

- Add support for slot->content transformation. Need to bikeshed opt-in attribute (currently "auto-content") ([commit](https://github.com/Polymer/polymer/commit/ebf31ca))

- Support more expressive `:root` and `html` selectors ([commit](https://github.com/Polymer/polymer/commit/2a8f21a))

- Fix typo ([commit](https://github.com/Polymer/polymer/commit/192eb56))

- test for mixins in custom-style ordering ([commit](https://github.com/Polymer/polymer/commit/37646f7))

- Do not insert semicolon when fixing var() syntax ([commit](https://github.com/Polymer/polymer/commit/0a338a7))

- Make sure mixins are applied no matter the ordering of definition ([commit](https://github.com/Polymer/polymer/commit/9daea3d))

- Update gulp-eslint to 3.x ([commit](https://github.com/Polymer/polymer/commit/8b89f02))

- Fixes #3676: retain `<style>` in `<template preserve-content/>` ([commit](https://github.com/Polymer/polymer/commit/8a4c00c))

- [ci skip] Update Changelog for v1.6.1 ([commit](https://github.com/Polymer/polymer/commit/ec04461))

- Apply to _marshalArgs. ([commit](https://github.com/Polymer/polymer/commit/b2cd932))

- Rename Path.head() to Path.root(). ([commit](https://github.com/Polymer/polymer/commit/77808d9))

- Use head in templatizer ([commit](https://github.com/Polymer/polymer/commit/478978d))

- Modify _annotationPathEffect ([commit](https://github.com/Polymer/polymer/commit/852aba0))

- Use isDescendant ([commit](https://github.com/Polymer/polymer/commit/b9944fe))

- Use isDeep ([commit](https://github.com/Polymer/polymer/commit/5627a55))

- Replace _fixPath. ([commit](https://github.com/Polymer/polymer/commit/6d1dd88))

- Replace _modelForPath. ([commit](https://github.com/Polymer/polymer/commit/b02eda0))

- Replace _patchMatchesEffect. ([commit](https://github.com/Polymer/polymer/commit/6ad9295))

- Add path library. ([commit](https://github.com/Polymer/polymer/commit/0320763))

- Revert "Fix _patchMatchesEffect. (#3631)" ([commit](https://github.com/Polymer/polymer/commit/a64f227))

## [v1.6.1](https://github.com/Polymer/polymer/tree/v1.6.1) (2016-08-01)
- Property Shim needs to handle build output from apply shim ([commit](https://github.com/Polymer/polymer/commit/d726a51))

- Do not resolve urls with leading slash and other protocols ([commit](https://github.com/Polymer/polymer/commit/94f95ec))

- Mark that non-inheritable properties being set to `inherit` is not supported ([commit](https://github.com/Polymer/polymer/commit/0a2b31e))

- Put `getInitialValueForProperty` on ApplyShim ([commit](https://github.com/Polymer/polymer/commit/0489ccf))

- Skip `initial` and `inherit` on IE 10 and 11 ([commit](https://github.com/Polymer/polymer/commit/63c3bfb))

- Handle mixins with property values of inherit and initial ([commit](https://github.com/Polymer/polymer/commit/c7571e5))

- Split tests for use-before-create and reusing mixin names for variables ([commit](https://github.com/Polymer/polymer/commit/8de1bec))

- Make sure we don't populate the mixin map for every variable ([commit](https://github.com/Polymer/polymer/commit/6265ade))

- [apply shim] Track dependencies for mixins before creation ([commit](https://github.com/Polymer/polymer/commit/2cab461))

- [property shim] Make sure "initial" and "inherit" behave as they would natively ([commit](https://github.com/Polymer/polymer/commit/0887dba))

- fix lint issue. ([commit](https://github.com/Polymer/polymer/commit/95eadbd))

- Fixes #3801. Ensure style host calculates custom properties before element. This ensures the scope's styles are prepared to be inspected by the element for matching rules. ([commit](https://github.com/Polymer/polymer/commit/5967f2d))

- Clean up custom-style use of apply shim ([commit](https://github.com/Polymer/polymer/commit/0859803))

- gate comparing css text on using native css properties ([commit](https://github.com/Polymer/polymer/commit/8fcb5f6))

- Only invalidate mixin if it defines new properties ([commit](https://github.com/Polymer/polymer/commit/b27f842))

- Make __currentElementProto optional for build tool ([commit](https://github.com/Polymer/polymer/commit/64d41e6))

- Rerun Apply Shim when mixins with consumers are redefined ([commit](https://github.com/Polymer/polymer/commit/498e23f))

- updateNativeStyles should only remove styles set by updateNativeStyles ([commit](https://github.com/Polymer/polymer/commit/831be4f))

- [ci skip] add smoke test for scope caching with custom-style ([commit](https://github.com/Polymer/polymer/commit/43955ea))

- Remove unused arg. ([commit](https://github.com/Polymer/polymer/commit/95cd415))

- Remove dirty check for custom events; unnecessary after #3678. Fixes #3677. ([commit](https://github.com/Polymer/polymer/commit/92a9398))

- Use _configValue to avoid setting readOnly. Add tests. ([commit](https://github.com/Polymer/polymer/commit/36467fa))

- Missing piece to fixing #3094 ([commit](https://github.com/Polymer/polymer/commit/694b35e))

- Opt in to "even lazier" behavior by setting `lazyRegister` to "max". This was done to preserve compatibility with the existing feature. Specifically, when "max" is used, setting `is` in `beforeRegister` and defining `factoryImpl` may only be done on an element's prototype and not its behaviors. In addition, the element's `beforeRegister` is called *before* its behaviors' `beforeRegisters` rather than *after* as in the normal case. ([commit](https://github.com/Polymer/polymer/commit/b271a88))

- Replace 'iff' with 'if and only if' ([commit](https://github.com/Polymer/polymer/commit/f7659eb))

- Fix test in IE10. ([commit](https://github.com/Polymer/polymer/commit/fb95dc8))

- cleanup check for sourceCapabilities ([commit](https://github.com/Polymer/polymer/commit/4c44fb7))

- Fix #3786 by adding a `noUrlSettings` flag to Polymer.Settings ([commit](https://github.com/Polymer/polymer/commit/8a26759))

- Fix mouse input delay on systems with a touchscreen ([commit](https://github.com/Polymer/polymer/commit/ed4c18a))

- Ensure properties override attributes at upgrade time. Fixes #3779. ([commit](https://github.com/Polymer/polymer/commit/f2938ec))

- Refresh cache'd styles contents in IE 10 and 11 ([commit](https://github.com/Polymer/polymer/commit/80be0df))

- change travis config ([commit](https://github.com/Polymer/polymer/commit/1256301))

- Fix css shady build mistakenly matching root rules as host rules ([commit](https://github.com/Polymer/polymer/commit/5dfb9c9))

- [ci skip] update changelog for v1.6.0 ([commit](https://github.com/Polymer/polymer/commit/d8bab9c))

- Make lazyRegister have 'even lazier' behavior such that behaviors are not mixed in until first-instance time. ([commit](https://github.com/Polymer/polymer/commit/9676d6d))

- need takeRecords in complex var example ([commit](https://github.com/Polymer/polymer/commit/b40561b))

- add reduced test case ([commit](https://github.com/Polymer/polymer/commit/26fe9b9))

- Replace VAR_MATCH regex with a simple state machine / callback ([commit](https://github.com/Polymer/polymer/commit/4ebec15))

- Expose an `lazierRegister` flag to defer additional work until first create time. This change requires that a behavior not implement a custom constructor or set the element's `is` property. ([commit](https://github.com/Polymer/polymer/commit/5c5b18e))

- Improve type signatures: `Polymer.Base.extend` and `Polymer.Base.mixin` ([commit](https://github.com/Polymer/polymer/commit/8382aa7))

- Fix for changing property to the same value ([commit](https://github.com/Polymer/polymer/commit/66e6e22))

- Include iron-component-page in devDependencies ([commit](https://github.com/Polymer/polymer/commit/639d5d8))

- Ensure fromAbove in _forwardParentProp. ([commit](https://github.com/Polymer/polymer/commit/072dcff))

## [v1.6.0](https://github.com/Polymer/polymer/tree/v1.6.0) (2016-06-29)
- Fix test to account for pseudo element differences x-browser. ([commit](https://github.com/Polymer/polymer/commit/54a462d))

- Restore functionality of selectors like `:host(.foo)::after`. ([commit](https://github.com/Polymer/polymer/commit/ff88e17))

- add comment. ([commit](https://github.com/Polymer/polymer/commit/e770343))

- re-support selectors like `:host[inline]` since this was previously supported under shady-dom. ([commit](https://github.com/Polymer/polymer/commit/4e51ef6))

- fix linting ([commit](https://github.com/Polymer/polymer/commit/4817d61))

- Add test for not matching `x-foox-bar` given `:host(x-bar)` used inside `x-foo` ([commit](https://github.com/Polymer/polymer/commit/4e08fa1))

- fix test in IE/FF. ([commit](https://github.com/Polymer/polymer/commit/ec111f1))

- simplify :host fixup ([commit](https://github.com/Polymer/polymer/commit/c3355fd))

- Fixes #3739: correctly shim `:host(.element-name)` as `element-name.element-name`. ([commit](https://github.com/Polymer/polymer/commit/997240a))

- Fixes #3734: address HI/CE timing issue in importHref. Fixes upgrade time dependencies of scripts on previous elements in async imports. ([commit](https://github.com/Polymer/polymer/commit/84662b9))

- Ensure element scope selectors are updated correctly when updateStyles is called when element is not in dom. ([commit](https://github.com/Polymer/polymer/commit/6d90480))

- add comment. ([commit](https://github.com/Polymer/polymer/commit/620e59f))

- remove unneeded flag. ([commit](https://github.com/Polymer/polymer/commit/b5b8a2a))

- Fixes #3730 and inspired by (https://github.com/Polymer/polymer/pull/3585) ([commit](https://github.com/Polymer/polymer/commit/ab431ed))

- custom-style triggers updateStyles if root scope (StyleDefaults) has style properties when the custom-style is created. ([commit](https://github.com/Polymer/polymer/commit/4852f6c))

- Fix _patchMatchesEffect. (#3631) ([commit](https://github.com/Polymer/polymer/commit/b78e5af))

- Fixes #3555. Ensure selectors including `::content` without a prefix … (#3721) ([commit](https://github.com/Polymer/polymer/commit/1058896))

- Fixes #3530. When `updateStyles` is called and an element is not attached, invalidate its styling so that when it is attached, its custom properties will be updated. ([commit](https://github.com/Polymer/polymer/commit/ae4a07e))

- Make sure effect functions receive latest values ([commit](https://github.com/Polymer/polymer/commit/34b2c79))

- [ci skip] data binding edge case smoke test ([commit](https://github.com/Polymer/polymer/commit/a54c1f2))

- Use `whenReady` to apply custom styles. ([commit](https://github.com/Polymer/polymer/commit/129488b))

- Use firefox 46 for testing ([commit](https://github.com/Polymer/polymer/commit/fbe5b0f))

- Need to wait until render to test. ([commit](https://github.com/Polymer/polymer/commit/92293f9))

- address feedback ([commit](https://github.com/Polymer/polymer/commit/4dc780a))

- Fix lint, use query params instead of duplicate file. ([commit](https://github.com/Polymer/polymer/commit/e4880d9))

- Ensure custom styles updated after adding custom-style async. Fixes #3705. ([commit](https://github.com/Polymer/polymer/commit/f770438))

- Store cacheablility on the scope ([commit](https://github.com/Polymer/polymer/commit/bc9519e))

- fix decorateStyles with custom-style ([commit](https://github.com/Polymer/polymer/commit/57a6769))

- Do not scope cache elements with media rules, :host(), or :host-context() selectors ([commit](https://github.com/Polymer/polymer/commit/5c3b917))

- Support preventDefault() on touch (#3693) ([commit](https://github.com/Polymer/polymer/commit/b9c874e))

- Shim CSS Mixins in terms of CSS Custom Properties (#3587) ([commit](https://github.com/Polymer/polymer/commit/6c0acef))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/adef722))

## [v1.5.0](https://github.com/Polymer/polymer/tree/v1.5.0) (2016-05-31)
- Fix test in Firefox that was hacked to work in Canary (instead filed https://bugs.chromium.org/p/chromium/issues/detail?id=614198). ([commit](https://github.com/Polymer/polymer/commit/1e2aed5))

- remove unneeded argument ([commit](https://github.com/Polymer/polymer/commit/4a99b83))

- slight optimization, avoid work if no cssText is set. ([commit](https://github.com/Polymer/polymer/commit/ce0bf86))

- More efficient fix for #3661. Re-uses cached style element that needs to be replaced in the document rather than creating a new one. ([commit](https://github.com/Polymer/polymer/commit/63f91ae))

- Fixes #3661: ensure that cached style points to the applied style for Shady DOM styling. This ensures that the cache can be used to determine if a style needs to be applied to the document and prevents extra unnecessary styles from being added. This could happen when a property cascaded to a nested element and updateStyles was called after properties have changed. ([commit](https://github.com/Polymer/polymer/commit/717fc3a))

- Fix flakey attached/detached timing test. ([commit](https://github.com/Polymer/polymer/commit/04da868))

- remove HTML comment ([commit](https://github.com/Polymer/polymer/commit/d339b28))

- add more style[include] doc ([commit](https://github.com/Polymer/polymer/commit/b8fd12d))

- Update the package.json name to match the actual npm published package. (#3570) ([commit](https://github.com/Polymer/polymer/commit/e57eb49))

- Remove unused event cache store (#3591) ([commit](https://github.com/Polymer/polymer/commit/364ede9))

- [ci skip] sudo should be "required" ([commit](https://github.com/Polymer/polymer/commit/c0e0a73))

- transition to travis trusty images ([commit](https://github.com/Polymer/polymer/commit/b7c0b1f))

- fine, console.dir then ([commit](https://github.com/Polymer/polymer/commit/c8cb3be))

- fix ie missing console.table for stubbing ([commit](https://github.com/Polymer/polymer/commit/6d39644))

- Support the devtools console.log api (multiple strings) for polymer logging ([commit](https://github.com/Polymer/polymer/commit/909ee82))

- Compute and use correct annotation value during config ([commit](https://github.com/Polymer/polymer/commit/1b02e96))

- Set propertyName on parent props for config phase. ([commit](https://github.com/Polymer/polymer/commit/d9c03a4))

- Refactorings around how computational expressions get their arguments ([commit](https://github.com/Polymer/polymer/commit/677f10c))

- Fix safari 7 again ([commit](https://github.com/Polymer/polymer/commit/b30f962))

- Expose public API to reset mouse cancelling for testing touch ([commit](https://github.com/Polymer/polymer/commit/18bf9d4))

- Delay detached callback with the same strategy as attached callback ([commit](https://github.com/Polymer/polymer/commit/7a244fa))

- [ci skip] Add missing dom5 devDependency ([commit](https://github.com/Polymer/polymer/commit/5e2050a))

- Don't use `translate` as a method for testing ([commit](https://github.com/Polymer/polymer/commit/f80346f))

- Only fix prototype when registering at first create time. ([commit](https://github.com/Polymer/polymer/commit/7ad2bff))

- Fixes #3525: Makes lazy registration compatible with platforms (like IE10) on which a custom element's prototype must be simulated. ([commit](https://github.com/Polymer/polymer/commit/4834651))

- make sure gulp-cli 1 is used ([commit](https://github.com/Polymer/polymer/commit/29067ca))

- Ensure Annotator recognizes dynamic fn as dependency for parent props. ([commit](https://github.com/Polymer/polymer/commit/15ff463))

- [ci skip] Update CHANGELOG ([commit](https://github.com/Polymer/polymer/commit/223aa34))

- Enabling caching of node_modules on Travis ([commit](https://github.com/Polymer/polymer/commit/6b6ec5d))

- Fix undefined class attribute in undefined template scope ([commit](https://github.com/Polymer/polymer/commit/e21c59e))

- Use a parser based html minification ([commit](https://github.com/Polymer/polymer/commit/0536e35))

- Call _notifyPath instead of notifyPath in templatizer ([commit](https://github.com/Polymer/polymer/commit/067b7ed))

- Keep it real for notifyPath. ([commit](https://github.com/Polymer/polymer/commit/40a1f79))

- Null debounced callback to set for GC. ([commit](https://github.com/Polymer/polymer/commit/f366c1c))

## [v1.4.0](https://github.com/Polymer/polymer/tree/v1.4.0) (2016-03-18)
- Fast check in createdCallback to see if registration has finished. ([commit](https://github.com/Polymer/polymer/commit/a3fce19))

- even more lazy: defer template lookup and style collection until finish register time. ([commit](https://github.com/Polymer/polymer/commit/103f790))

- fix lint errors. ([commit](https://github.com/Polymer/polymer/commit/d7a2baa))

- * turn on lazy registration via `Polymer.Settings.lazyRegister` * ensure registration finished by calling `Element.prototype.ensureRegisterFinished()` ([commit](https://github.com/Polymer/polymer/commit/31c785d))

- remove crufty smoke test. ([commit](https://github.com/Polymer/polymer/commit/3dd1b61))

- fix lint issues ([commit](https://github.com/Polymer/polymer/commit/0447228))

- Change `forceRegister` to `eagerRegister` and add `Polymer.Settings.eagerRegister` flag. ([commit](https://github.com/Polymer/polymer/commit/f6597ec))

- Add `forceRegister` flag to force an element to fully register when `Polymer` is called. Normally, some work is deferred until the first element instance is created. ([commit](https://github.com/Polymer/polymer/commit/d53323d))

- Call registered no prototype. ([commit](https://github.com/Polymer/polymer/commit/812db6a))

- Lazy register features we can be deferred until first instance. This is an optimization which can speed up page load time when elements are registered but not needed at time of first paint/interaction ([commit](https://github.com/Polymer/polymer/commit/31702ff))

- Do not reflect uppercase properties ([commit](https://github.com/Polymer/polymer/commit/72d35e0))

- Make sure event.path is an array ([commit](https://github.com/Polymer/polymer/commit/2dfdd7b))

- fix testing failures on assert.notInclude of null ([commit](https://github.com/Polymer/polymer/commit/8066919))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/58e6713))

## [v1.3.1](https://github.com/Polymer/polymer/tree/v1.3.1) (2016-03-02)
- Fix lint errors. ([commit](https://github.com/Polymer/polymer/commit/44d06f1))

- Add test. ([commit](https://github.com/Polymer/polymer/commit/02660c1))

- Fix lint error. ([commit](https://github.com/Polymer/polymer/commit/e2c5f9e))

- Ensure that dom-bind always waits until DOMContentLoaded to render. This ensures a script can install api on the dom-bind prior to it rendering. Previously dom-bind waited for first render, but an early parser yield can make this occur unexpectedly early. ([commit](https://github.com/Polymer/polymer/commit/cc0e9df))

- Refine fix for #3461 so that the decision to apply a static or property stylesheet relies on the same info. ([commit](https://github.com/Polymer/polymer/commit/ff96f9e))

- Clean the .eslintignore ([commit](https://github.com/Polymer/polymer/commit/04d06a5))

- [ci skip] Add header for those asking questions ([commit](https://github.com/Polymer/polymer/commit/9d6111c))

- Fixes #3461: Only avoid creating a statically scoped stylesheet when properties are consumed in an element, properly excluding properties produced as a result of consumption. ([commit](https://github.com/Polymer/polymer/commit/e26a806))

- tweaks to new README ([commit](https://github.com/Polymer/polymer/commit/809352d))

- [ci skip] Update Changelog ([commit](https://github.com/Polymer/polymer/commit/4f3f463))

- Updated the README.md for a non-technical user to understand ([commit](https://github.com/Polymer/polymer/commit/0729cef))

## [v1.3.0](https://github.com/Polymer/polymer/tree/v1.3.0) (2016-02-22)
- [ci skip] Add instructions to pull request template ([commit](https://github.com/Polymer/polymer/commit/933c920))

- [ci skip] markdown fail ([commit](https://github.com/Polymer/polymer/commit/a8e01e2))

- [ci skip] Add instructions to issue template ([commit](https://github.com/Polymer/polymer/commit/ace0f72))

- Make sure to configure properties on polymer elements that do not have property effects. ([commit](https://github.com/Polymer/polymer/commit/f93c3e5))

- Fix lint errors. ([commit](https://github.com/Polymer/polymer/commit/5ac5ee7))

- Add comment. Ensure Date deserializes to String for correctness. ([commit](https://github.com/Polymer/polymer/commit/69c7087))

- Serialize before deserialize when configuring attrs. Fixes #3433. ([commit](https://github.com/Polymer/polymer/commit/ec85582))

- Restrict early property set to properties that have accessors. This allows users to set properties in `created` which are listed in `properties` but which have no accessor. ([commit](https://github.com/Polymer/polymer/commit/4cfb245))

- fix crlf once and for all ([commit](https://github.com/Polymer/polymer/commit/6c5afe5))

- fix test linting from #3350 ([commit](https://github.com/Polymer/polymer/commit/37f7157))

- Use the new .github folder for issue and pull request templates ([commit](https://github.com/Polymer/polymer/commit/58529c2))

- [ci skip] Use https for jsbin ([commit](https://github.com/Polymer/polymer/commit/3e33fd4))

- [ci skip] Add issue and pr template ([commit](https://github.com/Polymer/polymer/commit/cc1ef9a))

- Update to gulp-eslint v2 ([commit](https://github.com/Polymer/polymer/commit/dca0dda))

- fix lint errors ([commit](https://github.com/Polymer/polymer/commit/7da9a38))

- Minor fixes based on review. ([commit](https://github.com/Polymer/polymer/commit/f2c1d4a))

- Undo fix on IE10 where the custom elements polyfill's mixin strategy makes this unfeasible. ([commit](https://github.com/Polymer/polymer/commit/ef629f4))

- Update comments. ([commit](https://github.com/Polymer/polymer/commit/b870fe0))

- Add test that late resolved functions don't warn ([commit](https://github.com/Polymer/polymer/commit/0037c53))

- Add support for properties defined in a behavior. ([commit](https://github.com/Polymer/polymer/commit/b6abf26))

- Generalized approach supporting compute and observers ([commit](https://github.com/Polymer/polymer/commit/f4486a2))

- Proper implementation ([commit](https://github.com/Polymer/polymer/commit/3c12178))

- Support dynamic functions for computed annotations. ([commit](https://github.com/Polymer/polymer/commit/3f1bc4e))

- ordering issue for when assert is defined in native html imports ([commit](https://github.com/Polymer/polymer/commit/d81f6bc))

- Lint the tests ([commit](https://github.com/Polymer/polymer/commit/e5063ca))

- Add support for one-of attribute selector while not breaking support for general sibling combinator. Fixes #3023. Fix taken from #3067. ([commit](https://github.com/Polymer/polymer/commit/5a493d8))

- Fix bindings with special characters ([commit](https://github.com/Polymer/polymer/commit/d385873))

- [ci skip] move linting into before_script stage ([commit](https://github.com/Polymer/polymer/commit/1b5fc9a))

- Fix lint error and uncomment test. ([commit](https://github.com/Polymer/polymer/commit/c00c47f))

- Add test for overriding property based :host selector from outside. ([commit](https://github.com/Polymer/polymer/commit/71c41ed))

- Add comment and fix typo ([commit](https://github.com/Polymer/polymer/commit/b0e16f0))

- Ensure _propertySetter is installed first. Fixes #3063 ([commit](https://github.com/Polymer/polymer/commit/6362f60))

- Disable tap gesture when track gesture is firing for ancestor node ([commit](https://github.com/Polymer/polymer/commit/6f2c1fc))

- Fix parsing of parenthesis in default of variable declaration ([commit](https://github.com/Polymer/polymer/commit/926d0e5))

- Rename _mapRule to _mapRuleOntoParent ([commit](https://github.com/Polymer/polymer/commit/cd42595))

- Test with ESLint enabled ([commit](https://github.com/Polymer/polymer/commit/acdfc1e))

- Make behaviors array unique ([commit](https://github.com/Polymer/polymer/commit/4cde38a))

- Use deserialize from the node. ([commit](https://github.com/Polymer/polymer/commit/a3641e2))

- Actually execute case-map ([commit](https://github.com/Polymer/polymer/commit/d84d75b))

- [ci skip] .eslintrc is deprecated, add .json suffix ([commit](https://github.com/Polymer/polymer/commit/c7554d9))

- Make the test more look like a spec ([commit](https://github.com/Polymer/polymer/commit/db7c324))

- Configure attr's with property effects. More robust fix for #3288. ([commit](https://github.com/Polymer/polymer/commit/0f55d1d))

- Use ESLint for Polymer ([commit](https://github.com/Polymer/polymer/commit/f3c4bb1))

- Add test suite for effects order ([commit](https://github.com/Polymer/polymer/commit/56df8f7))

- Fix negation when a negated binding is changed ([commit](https://github.com/Polymer/polymer/commit/21383a3))

- Add unit test suite for CaseMap ([commit](https://github.com/Polymer/polymer/commit/ee9a600))

- Fixes for IE style ordering issue. ([commit](https://github.com/Polymer/polymer/commit/162f81e))

- Fixes #3326. Changes inspired by #3276 and #3344 ([commit](https://github.com/Polymer/polymer/commit/b5ba9a8))

- Fix for getters/setters for property become inaccessible when property set on element before it is ready ([commit](https://github.com/Polymer/polymer/commit/ecd9b09))

- Non-destructive `@keyframes` rule transformation. ([commit](https://github.com/Polymer/polymer/commit/b9f2482))

- Fix test regression from PR 3289 ([commit](https://github.com/Polymer/polymer/commit/5205d6a))

- Move test and add to runner. ([commit](https://github.com/Polymer/polymer/commit/aeb44de))

- make isDebouncerActive actually return a bool ([commit](https://github.com/Polymer/polymer/commit/dee9b98))

- Lint the javascript code with eslint ([commit](https://github.com/Polymer/polymer/commit/f7d2bdf))

- i suck at git ([commit](https://github.com/Polymer/polymer/commit/b40f639))

- Fix for scoping when class is not specified on element (null was prepended instead of empty string) ([commit](https://github.com/Polymer/polymer/commit/24e9fc7))

- Using constant rather than plain `:host` and `::content`, also create regexp object only once ([commit](https://github.com/Polymer/polymer/commit/c6c28f5))

- Eliminate the need to write `:host ::content` instead of just `::content`, while keeping the same processing under the hood ([commit](https://github.com/Polymer/polymer/commit/d9f3dda))

- Fix: There is no effect of kind 'computedAnnotation' ([commit](https://github.com/Polymer/polymer/commit/06cd560))

- fix test case in 5d17efc ([commit](https://github.com/Polymer/polymer/commit/4a9ef8e))

- add test for 3326 ([commit](https://github.com/Polymer/polymer/commit/854fdbf))

- [ci skip] update CHANGELOG ([commit](https://github.com/Polymer/polymer/commit/3d2cb71))

- Exclude attribute bindings from configuration. Fixes #3288. ([commit](https://github.com/Polymer/polymer/commit/246ea72))

- Doubled `Polymer.CaseMap.dashToCamelCase` performance with simplified and once compiled RegExp. 5 times faster `Polymer.CaseMap.camelToDashCase` using simplified replace part, simplified and once compiled RegExp. ([commit](https://github.com/Polymer/polymer/commit/90938e3))

- Update PRIMER.md ([commit](https://github.com/Polymer/polymer/commit/bb4d558))

- Unit tests ([commit](https://github.com/Polymer/polymer/commit/de371bb))

- Allow newlines in computed binding argument list ([commit](https://github.com/Polymer/polymer/commit/b745f45))

- Remove redundant assign to window.Polymer ([commit](https://github.com/Polymer/polymer/commit/b2f8e8f))

- parentProps should not override argument based props ([commit](https://github.com/Polymer/polymer/commit/898fe89))

## [v1.2.4](https://github.com/Polymer/polymer/tree/v1.2.4) (2016-01-27)
- Fixes #3337. When a doc fragment is added, only update the invalidation state of the insertion point list of the shadyRoot IFF it is not already invalid. This fixes an issue that was detected when an a doc fragment that did not include an insertion point was added after one that did but before distribution. ([commit](https://github.com/Polymer/polymer/commit/d26b003))

- fix build output with new vulcanize ([commit](https://github.com/Polymer/polymer/commit/c317711))

- Revert style properties change from fd5778470551f677c2aa5827398681abb1994a88 ([commit](https://github.com/Polymer/polymer/commit/0a0b580))

- Fix shadow dom test. ([commit](https://github.com/Polymer/polymer/commit/6b83911))

- Add shadow root support. (tests broken) ([commit](https://github.com/Polymer/polymer/commit/4b7da35))

- Ensure dom-if moved into doc fragment is torn down. Fixes #3324 ([commit](https://github.com/Polymer/polymer/commit/6c4f5d5))

- improve test. ([commit](https://github.com/Polymer/polymer/commit/d70c40a))

- Update comment. ([commit](https://github.com/Polymer/polymer/commit/aa14687))

- In addition to fragments, also handle non-distributed elements more completely. ([commit](https://github.com/Polymer/polymer/commit/fe2699e))

- Simplify fix for fragment children management. ([commit](https://github.com/Polymer/polymer/commit/713377e))

- Fix test under polyfill. ([commit](https://github.com/Polymer/polymer/commit/25da63d))

- Ensure fragments added via Polymer.dom always have elements removed, even when distribution does not select those elements. ([commit](https://github.com/Polymer/polymer/commit/101eb3d))

- Fixes #3321. Only let dom-repeat insert elements in attached if it has been previously detached; correctly avoid re-adding children in document fragments to an element's logical linked list if they are already there. ([commit](https://github.com/Polymer/polymer/commit/9f2464d))

- Ugh ([commit](https://github.com/Polymer/polymer/commit/172d93c))

- Fixes #3308. Use an explicit undefined check to test if logical tree information exists. ([commit](https://github.com/Polymer/polymer/commit/9106398))

- add test ([commit](https://github.com/Polymer/polymer/commit/b1ea014))

- use class attribute in applyElementScopeSelector ([commit](https://github.com/Polymer/polymer/commit/07d8c06))

- Remove reference to _composedChildren ([commit](https://github.com/Polymer/polymer/commit/9f85acd))

- Fix typo in documentation for set() ([commit](https://github.com/Polymer/polymer/commit/aa47515))

- Fix typo in dom-tree-api ([commit](https://github.com/Polymer/polymer/commit/ae98a7c))

- Correct use of document.contains to document.documentElement.contains on IE. ([commit](https://github.com/Polymer/polymer/commit/0e74810))

- Ensure querySelector always returns `null` when a node is not found. Also optimize querySelector such that the matcher halts on the first result. ([commit](https://github.com/Polymer/polymer/commit/b9e5cce))

- Fixes #3295. Only cache a false-y result for an element's owner shady root iff the element is currently in the document. ([commit](https://github.com/Polymer/polymer/commit/6e16619))

- Use local references to wrapper functions; add test element tree to native shadow tests; reorder test elements. ([commit](https://github.com/Polymer/polymer/commit/47ee2ca))

- Remove leftover garbage line ([commit](https://github.com/Polymer/polymer/commit/d7567b7))

- Removes the case where activeElement could be in the light DOM of a ShadowRoot. ([commit](https://github.com/Polymer/polymer/commit/e848af8))

- DOM API implementation of `activeElement`. ([commit](https://github.com/Polymer/polymer/commit/2984576))

- Remove call to `wrap` in deepContains ([commit](https://github.com/Polymer/polymer/commit/4cbdef7))

- Fixes #3270. ([commit](https://github.com/Polymer/polymer/commit/7d0485b))

- Include more styling tests under ShadowDOM. Fix custom-style media query test to work under both shadow/shady. ([commit](https://github.com/Polymer/polymer/commit/33a24bb))

- Remove duplicate code related to dom traversal in Polymer.dom. ([commit](https://github.com/Polymer/polymer/commit/555252b))

- Fix parsing of minimized css output also for mixins ([commit](https://github.com/Polymer/polymer/commit/87d02e0))

- Set position to relative to make Safari to succeed top/bottom tests ([commit](https://github.com/Polymer/polymer/commit/94f505a))

- Fix parsing of minimized css output ([commit](https://github.com/Polymer/polymer/commit/f92f9ff))

- Fix for `Polymer.dom(...)._query()` method doesn't exist which causes `Polymer.updateStyles()` to fail ([commit](https://github.com/Polymer/polymer/commit/0eea7a6))

- Minor factoring of dom patching. ([commit](https://github.com/Polymer/polymer/commit/8c95014))

- use destination insertion points when calculating the path ([commit](https://github.com/Polymer/polymer/commit/3f8b6ee))

- Store all dom tree data in `__dom` private storage; implement composed patching via a linked list. ([commit](https://github.com/Polymer/polymer/commit/9a3bead))

- Modernize the build ([commit](https://github.com/Polymer/polymer/commit/2b69bb1))

- Add more globals to whitelist for safari ([commit](https://github.com/Polymer/polymer/commit/82b2443))

- Shady patching: patch element accessors in composed tree; fixes HTMLImports polyfill support. ([commit](https://github.com/Polymer/polymer/commit/d135fef))

- remove unused code; minor changes based on review. ([commit](https://github.com/Polymer/polymer/commit/c3fbd10))

- added polymer-mini and polymer-micro to main ([commit](https://github.com/Polymer/polymer/commit/da5d781))

- Updates the patch-don experiment to work with recent changes. ([commit](https://github.com/Polymer/polymer/commit/b9e6859))

- Fixes #3113 ([commit](https://github.com/Polymer/polymer/commit/fadd455))

- Polymer.dom: when adding a node, only remove the node from its existing location if it's not a fragment and has a parent. ([commit](https://github.com/Polymer/polymer/commit/9915627))

- Consistently use TreeApi.Composed api for composed dom manipulation; use TreeApi.Logical methods to get node leaves. Avoid making a Polymer.dom when TreeApi.Logical can provide the needed info. ([commit](https://github.com/Polymer/polymer/commit/5033fdb))

- Produce nicer error on malformed observer ([commit](https://github.com/Polymer/polymer/commit/0e248f5))

- Deduplicate setup and verifying in notify-path test suite ([commit](https://github.com/Polymer/polymer/commit/68707ad))

- more explicit tests for debouncer wait and no-wait behavior ([commit](https://github.com/Polymer/polymer/commit/8ef7bac))

- speed up microtask testing ([commit](https://github.com/Polymer/polymer/commit/9bef4c0))

- ensure isDebouncerActive returns a Boolean ([commit](https://github.com/Polymer/polymer/commit/3916493))

- add more debouncer tests ([commit](https://github.com/Polymer/polymer/commit/0206852))

- remove dead debounce test assertion ([commit](https://github.com/Polymer/polymer/commit/9b898c2))

- Factoring of distribution logic in both add and remove cases. ([commit](https://github.com/Polymer/polymer/commit/8272d5e))

- Minor typo in docs: call the debounce callback ([commit](https://github.com/Polymer/polymer/commit/02c5c79))

- Correct test to avoid using `firstElementChild` on a documentFragment since it is not universally supported. ([commit](https://github.com/Polymer/polymer/commit/dfa6a44))

- Remove all TODOs ([commit](https://github.com/Polymer/polymer/commit/6467ae1))

- Revert "Add .gitattributes to solve line endings cross-OS (merge after other PRs)" ([commit](https://github.com/Polymer/polymer/commit/b6b8293))

- Make renderedItemCount readOnly & add tests. ([commit](https://github.com/Polymer/polymer/commit/e39d5ba))

- Revert "Fix parsing of minimized css output" ([commit](https://github.com/Polymer/polymer/commit/d3145e8))

- Custom setProperty for bindings to hidden textNodes. Fixes #3157. ([commit](https://github.com/Polymer/polymer/commit/c6be10d))

- Ensure dom-if in host does not restamp when host detaches. Fixes #3125. ([commit](https://github.com/Polymer/polymer/commit/bb85e2b))

- Avoid making a copy of childNodes when a dom fragment is inserted in the logical tree. ([commit](https://github.com/Polymer/polymer/commit/dcbafbf))

- Slightly faster `findAnnotatedNodes` ([commit](https://github.com/Polymer/polymer/commit/43fc853))

- Add .gitattributes to solve line endings cross-OS ([commit](https://github.com/Polymer/polymer/commit/94c2bc2))

- Ensure literals are excluded from parent props. Fixes #3128. Fixes #3121. ([commit](https://github.com/Polymer/polymer/commit/526fa3c))

- Fix parsing of minimized css output ([commit](https://github.com/Polymer/polymer/commit/d458690))

- Disable chunked dom-repeat tests on IE due to CI rAF flakiness. ([commit](https://github.com/Polymer/polymer/commit/7fe5e2b))

- Add comment. ([commit](https://github.com/Polymer/polymer/commit/d8ecd45))

- Make Polymer.dom.flush reentrant-safe. Fixes #3115. ([commit](https://github.com/Polymer/polymer/commit/644105a))

- Fixes #3108. Moves `debounce` functionality from polymer-micro to polymer-mini. The functionality belongs at the mini tier and was never actually functional in micro. ([commit](https://github.com/Polymer/polymer/commit/3df4ef2))

- Clarify this is for IE. ([commit](https://github.com/Polymer/polymer/commit/63782fa))

- Patch rAF to setTimeout to reduce flakiness on CI. ([commit](https://github.com/Polymer/polymer/commit/35abadc))

- added missing semicolons, removed some unused variables ([commit](https://github.com/Polymer/polymer/commit/00ed797))

- ?Node ([commit](https://github.com/Polymer/polymer/commit/9385891))

- Remove closures holding element references after mouseup/touchend ([commit](https://github.com/Polymer/polymer/commit/811f766))

- set class attribute instead of using classname ([commit](https://github.com/Polymer/polymer/commit/690838a))

- Include wildcard character in identifier. Fixes #3084. ([commit](https://github.com/Polymer/polymer/commit/c36d6c1))

- Revert fromAbove in applyEffectValue. Add test. Fixes #3077. ([commit](https://github.com/Polymer/polymer/commit/156122c))

- loosen isLightDescendant's @param type to Node ([commit](https://github.com/Polymer/polymer/commit/c635797))

- Put beforeRegister in the behaviorProperties. ([commit](https://github.com/Polymer/polymer/commit/445b6cd))

- ES5 strict doesn't like function declarations inside inner blocks. ([commit](https://github.com/Polymer/polymer/commit/51d3fa6))

- Fixes #3065: Add dom-repeat.renderedItemCount property ([commit](https://github.com/Polymer/polymer/commit/b589f70))

- Minor factoring; ensure base properties set on instance. ([commit](https://github.com/Polymer/polymer/commit/da15ff0))

- Fix typos. ([commit](https://github.com/Polymer/polymer/commit/c12d3ed))

- Simplify more. ([commit](https://github.com/Polymer/polymer/commit/186e053))

- Improvements to regex. ([commit](https://github.com/Polymer/polymer/commit/a3d17d5))

- Give dom-repeat#_targetFrameTime a type ([commit](https://github.com/Polymer/polymer/commit/adad9ce))

- [skip ci] update travis config to firefox latest ([commit](https://github.com/Polymer/polymer/commit/608ce9f))

- Add a couple of tests. ([commit](https://github.com/Polymer/polymer/commit/108b7f9))

- Suppress warnings and expected errors in test suite ([commit](https://github.com/Polymer/polymer/commit/92d6fcb))

- Use linked-list for element tree traversal. Factor Polymer.DomApi into shadow/shady modules. ([commit](https://github.com/Polymer/polymer/commit/306cc81))

- Avoid throwing with invalid keys/paths. Fixes #3018. ([commit](https://github.com/Polymer/polymer/commit/5076ee0))

- Use stricter binding parsing for efficiency and correctness.  Fixes #2705. ([commit](https://github.com/Polymer/polymer/commit/04cd184))

- Simpler travis config ([commit](https://github.com/Polymer/polymer/commit/68b457d))

- [ci skip] Update Changelog ([commit](https://github.com/Polymer/polymer/commit/7e7600a))

- Fix for incorrect CSS selectors specificity as reported in #2531 Fix for overriding mixin properties, fixes #1873 Added awareness from `@apply()` position among other rules so that it is preserved after CSS variables/mixing substitution. `Polymer.StyleUtil.clearStyleRules()` method removed as it is not used anywhere. Some unused variables removed. Typos, unused variables and unnecessary escaping in regexps corrected. Tests added. ([commit](https://github.com/Polymer/polymer/commit/fd57784))

- Fix for method parsing in computed binding ([commit](https://github.com/Polymer/polymer/commit/c2e43d3))

- Fix doc typo. ([commit](https://github.com/Polymer/polymer/commit/8886c2c))

- Filtering causes unexpected issues ([commit](https://github.com/Polymer/polymer/commit/df22564))

- Fix using value$ on input element ([commit](https://github.com/Polymer/polymer/commit/05a1e95))

- added missing semicolons, removed some unused variables ([commit](https://github.com/Polymer/polymer/commit/338574d))

## [v1.2.3](https://github.com/Polymer/polymer/tree/v1.2.3) (2015-11-16)
- Call decorate instead of bootstrap for template prepping ([commit](https://github.com/Polymer/polymer/commit/e2a2cfd))

- Fix global leak test. Necessary due to changes to test harness. ([commit](https://github.com/Polymer/polymer/commit/134766f))

- Defer property application only when a custom-style is first created. ([commit](https://github.com/Polymer/polymer/commit/4bf0e13))

- Update comment. ([commit](https://github.com/Polymer/polymer/commit/27e1dcd))

- Simplify custom-style property deferment. ([commit](https://github.com/Polymer/polymer/commit/a970493))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/98acb3a))

- Fixes #2692. Ensures that custom-style properties are applied async but before next render so that all properties are defined before any are consumed by custom-styles. Also refines dom-module's early upgrade code so that it does not affect other elements (corrects for example, custom-styles upgrading before expected). ([commit](https://github.com/Polymer/polymer/commit/b829f2a))

- Remove undesired full-stop from outputs ([commit](https://github.com/Polymer/polymer/commit/68d5c55))

- Fix Formatting ([commit](https://github.com/Polymer/polymer/commit/724e1bc))

## [v1.2.2](https://github.com/Polymer/polymer/tree/v1.2.2) (2015-11-12)
- use local reference for wrap. ([commit](https://github.com/Polymer/polymer/commit/b15e5b9))

- Add Polymer.DomApi.wrap ([commit](https://github.com/Polymer/polymer/commit/6cf974a))

- For correctness, bind listeners must use a property's current value rather than its passed value. ([commit](https://github.com/Polymer/polymer/commit/aca404f))

- Explicitly making an element's `_template` falsy is now considered an allowable setting. This means the element stamps no content, doesn't collect any styles, and avoids looking up a dom-module. This helps address #2708 and the 5 elements Polymer registers that have no template have been set with `_template: null`. ([commit](https://github.com/Polymer/polymer/commit/b905a37))

- Make test work under native Shadow DOM. ([commit](https://github.com/Polymer/polymer/commit/4f9c2bd))

- In `_notifyListener`, only use `e.detail` if the event has a detail. This is necessary for `::eventName` compatibility where `eventName` is a native event like `change`. ([commit](https://github.com/Polymer/polymer/commit/3ece552))

- Fix TOC re: host event listeners. ([commit](https://github.com/Polymer/polymer/commit/ce32459))

- Fix compound bindings with braces in literals ([commit](https://github.com/Polymer/polymer/commit/561b28b))

- Re-enable listeners of the form 'a.b' (todo: make this more efficient). ([commit](https://github.com/Polymer/polymer/commit/139257b))

- Avoid stomping on property objects when mixing behaviors. ([commit](https://github.com/Polymer/polymer/commit/ec4d313))

- Update test to avoid template polyfill issues. ([commit](https://github.com/Polymer/polymer/commit/fa96ff3))

- Ensure parent node exists when stamping. Fixes #2685. ([commit](https://github.com/Polymer/polymer/commit/62f2d2a))

- Add global leak test to runner. ([commit](https://github.com/Polymer/polymer/commit/dc2255c))

- Add global leak test. ([commit](https://github.com/Polymer/polymer/commit/7f71b4c))

- Fix typo that prevented correct functioning of Polymer.dom under Shadow DOM and add tests to catch. ([commit](https://github.com/Polymer/polymer/commit/cdc9fde))

- maintain compatibility with older `_notifyChange` arguments. ([commit](https://github.com/Polymer/polymer/commit/f5aec30))

- Weird assignment fix ([commit](https://github.com/Polymer/polymer/commit/9e6f77a))

- add comment. ([commit](https://github.com/Polymer/polymer/commit/f2d5f44))

- For efficiency, use cached events in data system, for property and path changes. ([commit](https://github.com/Polymer/polymer/commit/da71dfe))

- Fixes #2690 ([commit](https://github.com/Polymer/polymer/commit/d8b78d4))

- change after render method to `Polymer.RenderStatus.afterNextRender` ([commit](https://github.com/Polymer/polymer/commit/8949c04))

- When effect values are applied via bindings, use fromAbove gambit to avoid unnecessary wheel spinning. (This is now possible since we have fast lookup for readOnly where we want to avoid doing the set at all). ([commit](https://github.com/Polymer/polymer/commit/c520907))

- do readOnly check for configured properties where they are handed down, rather than when they are consumed. ([commit](https://github.com/Polymer/polymer/commit/24bcedb))

- Minor cleanup. ([commit](https://github.com/Polymer/polymer/commit/0b21506))

- Avoid creating unnecessary placeholders for full refresh. ([commit](https://github.com/Polymer/polymer/commit/996289a))

- Simplify ([commit](https://github.com/Polymer/polymer/commit/c5e1135))

- Fix typo. ([commit](https://github.com/Polymer/polymer/commit/680c56d))

- Update docs. ([commit](https://github.com/Polymer/polymer/commit/352ccbe))

- _removeInstance -> _detachAndRemoveInstance ([commit](https://github.com/Polymer/polymer/commit/ba7a16f))

- Remove limit & chunkCount API. Refactor insert/remove. ([commit](https://github.com/Polymer/polymer/commit/f447c0e))

- add back deepContains (got removed incorrectly in merge). ([commit](https://github.com/Polymer/polymer/commit/d53ab57))

- fix line endings. ([commit](https://github.com/Polymer/polymer/commit/0233d6d))

- revert host attributes ordering change optimization as it was not worth the trouble (barely measurable and more cumbersome impl). ([commit](https://github.com/Polymer/polymer/commit/f9894a0))

- rename host functions fix typos afterFirstRender is now raf+setTimeout dom-repeat: remove cruft ([commit](https://github.com/Polymer/polymer/commit/d82840b))

- Fix Gestures when using SD polyfill ([commit](https://github.com/Polymer/polymer/commit/96e4bfa))

- Fix for multiple consequent spaces present in CSS selectors, fixes #2670 ([commit](https://github.com/Polymer/polymer/commit/ecddb56))

- avoid configuration work when unnecessary ([commit](https://github.com/Polymer/polymer/commit/e0fbfbe))

- lazily create effect objects so we can more easily abort processing. avoid forEach ([commit](https://github.com/Polymer/polymer/commit/66df196))

- provides support for memoizing pathFn on effect; only process effects/listeners if they exist. ([commit](https://github.com/Polymer/polymer/commit/a2376b6))

- memoize pathFn on effect (note: notifyPath change made in previous commit); avoid forEach. ([commit](https://github.com/Polymer/polymer/commit/d93340a))

- Avoid using .slice and .forEach ([commit](https://github.com/Polymer/polymer/commit/d2c02a9))

- Added support for short unicode escape sequences, fixes #2650 ([commit](https://github.com/Polymer/polymer/commit/2c87145))

- Fix for BEM-like CSS selectors under media queries, fixes #2639. Small optimization for produced CSS (empty rules produced semicolon before, now empty string). ([commit](https://github.com/Polymer/polymer/commit/35c89f1))

- Fix parsing of custom properties with 'var' in value ([commit](https://github.com/Polymer/polymer/commit/61abfbd))

- Clean up cruft. ([commit](https://github.com/Polymer/polymer/commit/59c27fa))

- Add tests and fix issues. ([commit](https://github.com/Polymer/polymer/commit/e99e5fa))

- dom-repeat chunked/throttled render API ([commit](https://github.com/Polymer/polymer/commit/e9aebd7))

- Fix formatting. ([commit](https://github.com/Polymer/polymer/commit/56734a7))

- Add notes on running unit tests. ([commit](https://github.com/Polymer/polymer/commit/492f310))

- Corrected method name. Fixes #2649. ([commit](https://github.com/Polymer/polymer/commit/5168604))

- Fix typos in more efficient array copying. ([commit](https://github.com/Polymer/polymer/commit/53f3a7d))

- Adds `Polymer.RenderStatus.afterFirstRender` method. Call to perform tasks after an element first renders. ([commit](https://github.com/Polymer/polymer/commit/71b5c2a))

- More efficient array management in Polymer.DomApi. ([commit](https://github.com/Polymer/polymer/commit/320d5c7))

- Fixes #2652 ([commit](https://github.com/Polymer/polymer/commit/e35c4e9))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/0dc69df))

- Fix whitespace around bindings. ([commit](https://github.com/Polymer/polymer/commit/d7d0ed6))

- Add support for `strip-whitespace`. Should fix #2511. ([commit](https://github.com/Polymer/polymer/commit/35a1b94))

- Improve efficiency of attribute configuration. ([commit](https://github.com/Polymer/polymer/commit/f7d86e9))

- Remove use of Function.bind ([commit](https://github.com/Polymer/polymer/commit/25aab8b))

- fix typos. ([commit](https://github.com/Polymer/polymer/commit/5fb20da))

- Re-use data change events. Remove unused/undocumented listener object specific node listening feature. ([commit](https://github.com/Polymer/polymer/commit/8bdedf3))

- Add flattened properties to dom-bind, templatizer, optimize by 'liming properties that are protected/private and not readOnly from list. ([commit](https://github.com/Polymer/polymer/commit/2ba08ec))

- Use flattened list of properties for fast access during configuration and attribute->property ([commit](https://github.com/Polymer/polymer/commit/acdd242))

- Assemble effect strings at prototype time. ([commit](https://github.com/Polymer/polymer/commit/4745e8f))

- Fallback to string lookup to fix support for extra effects. ([commit](https://github.com/Polymer/polymer/commit/d3c4611))

- Fix typo. ([commit](https://github.com/Polymer/polymer/commit/ead9adb))

- Correct NodeList copying. ([commit](https://github.com/Polymer/polymer/commit/1d29e19))

- Avoid Polymer.dom.setAttribute when unneeded. ([commit](https://github.com/Polymer/polymer/commit/9c5a404))

- More efficient iteration. ([commit](https://github.com/Polymer/polymer/commit/23a9a06))

- Avoid forEach ([commit](https://github.com/Polymer/polymer/commit/ebeaf80))

- Copy dom NodeList faster than slice. ([commit](https://github.com/Polymer/polymer/commit/8cad475))

- Avoid function lookup by string. ([commit](https://github.com/Polymer/polymer/commit/e2674bc))

- Add test for parsing multi-line css comments ([commit](https://github.com/Polymer/polymer/commit/6f21ae6))

## [v1.2.1](https://github.com/Polymer/polymer/tree/v1.2.1) (2015-10-29)
- Fix test for SD polyfill ([commit](https://github.com/Polymer/polymer/commit/dd8b3e9))

- Add pre-condition check for completeness. ([commit](https://github.com/Polymer/polymer/commit/89304dc))

- Find non distributed children with deepContains ([commit](https://github.com/Polymer/polymer/commit/8e6f55a))

- Ensure outer paths aren't forwarded to instance props. Fixes #2556. ([commit](https://github.com/Polymer/polymer/commit/01273e9))

- Add `Polymer.dom.deepContains` ([commit](https://github.com/Polymer/polymer/commit/279bf63))

- [ci skip] Update CHANGELOG ([commit](https://github.com/Polymer/polymer/commit/e1f83d2))

- isLightDescendant should return false for self ([commit](https://github.com/Polymer/polymer/commit/a0debf4))

- Fix for mixins declaration with space before colon. Allow any space character or even `{` and `}` (before and after capturing pattern correspondingly) as pattern boundaries instead of new lines only. In minified sources there might be no space, semicolon or line start, so we need to account that as well. ([commit](https://github.com/Polymer/polymer/commit/883aa5c))

## [v1.2.0](https://github.com/Polymer/polymer/tree/v1.2.0) (2015-10-22)
- A simpler travis config ([commit](https://github.com/Polymer/polymer/commit/3338b67))

- Fix #2587: When Polymer.dom(el).appendChild(node) is called, cleanup work must be performed on the existing parent of node. This change fixes a missing case in this cleanup work: if the existing parent has a observer via `Polymer.dom(parent).observeNodes`, it needs to be notified that node is being removed even if the node does not have specific logical info. For example, if an observed node has no Shady DOM and has a child that is removed. A test for this case was added. ([commit](https://github.com/Polymer/polymer/commit/0d4f418))

- add fancy travis status badge to the readme ([commit](https://github.com/Polymer/polymer/commit/e29fca8))

- Do not configure compound property/attribute binding if literal if empty. Fixes #2583. ([commit](https://github.com/Polymer/polymer/commit/ca4724a))

- Update .travis.yml ([commit](https://github.com/Polymer/polymer/commit/ef366c5))

- Remove web-component-tester cache. ([commit](https://github.com/Polymer/polymer/commit/4ae23ce))

- Fix IE10 regressions. Fixes #2582 * Copy attribute list before modifying it * Fall back to document for current document if no currentScript ([commit](https://github.com/Polymer/polymer/commit/ee65e68))

- Allow _atEndOfMicrotask to be patchable. ([commit](https://github.com/Polymer/polymer/commit/e2d8446))

- contributing copy fixup ([commit](https://github.com/Polymer/polymer/commit/ed22c50))

- Update CONTRIBUTING.md ([commit](https://github.com/Polymer/polymer/commit/0c21efc))

- Add travis config ([commit](https://github.com/Polymer/polymer/commit/6fb7684))

- Factor into functions. ([commit](https://github.com/Polymer/polymer/commit/b2117dc))

- Fix deepEqual on Safari 9 due to Safari enumeration bug. ([commit](https://github.com/Polymer/polymer/commit/445d603))

- ensure distribution observers see all changes that can come from attributes under native Shadow DOM; +minor factoring ([commit](https://github.com/Polymer/polymer/commit/344f5cc))

- Add <content>.getDistributedNodes observation. Refactor flush. ([commit](https://github.com/Polymer/polymer/commit/8b1face))

- Add docs ([commit](https://github.com/Polymer/polymer/commit/0ede79a))

- Make shadow attribute tracking automatic based on detecting a <content select> that depends on attributes; add tests. ([commit](https://github.com/Polymer/polymer/commit/54911a7))

- Add comments. ([commit](https://github.com/Polymer/polymer/commit/758c483))

- Fix typo. ([commit](https://github.com/Polymer/polymer/commit/74a87a0))

- Replace _compoundInitializationEffect with statically-initialized literals in the template for attributes & textContent, and by configuring literal values of properties in _configureAnnotationReferences. ([commit](https://github.com/Polymer/polymer/commit/2f1bd31))

- Simplify change tracking by always dirty checking at the observer level. Under Shadow DOM, use a deep MO to watch for attributes. ([commit](https://github.com/Polymer/polymer/commit/669acaa))

- Fix URL to component.kitchen ([commit](https://github.com/Polymer/polymer/commit/d9af504))

- Update the Google+ community link ([commit](https://github.com/Polymer/polymer/commit/c6684e5))

- Fixes from review. ([commit](https://github.com/Polymer/polymer/commit/a300862))

- Remove compound binding limitation from primer. ([commit](https://github.com/Polymer/polymer/commit/b1c1b35))

- Exclude compound bindings from configure; revisit later. ([commit](https://github.com/Polymer/polymer/commit/1035e2d))

- Apply effect value from compound parts. ([commit](https://github.com/Polymer/polymer/commit/c30ac10))

- Store binding parts in notes. ([commit](https://github.com/Polymer/polymer/commit/1026498))

- Fix missing var ([commit](https://github.com/Polymer/polymer/commit/68edb83))

- Add radix for correctness. ([commit](https://github.com/Polymer/polymer/commit/a79f012))

- Separate public & private get, flip conditions, add notifyPath API. ([commit](https://github.com/Polymer/polymer/commit/97503ec))

- Fix typo in comments. ([commit](https://github.com/Polymer/polymer/commit/e59dbef))

- Improvements to path API. Fixes #2509. * Allows `set` to take paths with array #keys * Allows `notifyPath` to take paths with array indices * Exposes public notifySplices API ([commit](https://github.com/Polymer/polymer/commit/10021cc))

- Fix merge issue. ([commit](https://github.com/Polymer/polymer/commit/85c23e1))

- Denote keys with # to disambiguate from index. Fixes #2007. ([commit](https://github.com/Polymer/polymer/commit/85d8a3a))

- update CHANGELOG to 1.1.5 ([commit](https://github.com/Polymer/polymer/commit/b2b23c4))

- make tests work on polyfill. ([commit](https://github.com/Polymer/polymer/commit/9ff2ee4))

- add `observeNodes` tests. ([commit](https://github.com/Polymer/polymer/commit/bd90b57))

- Add optional attribute tracking to support better distributed node notifications under shadow dom. ([commit](https://github.com/Polymer/polymer/commit/8242a98))

- Add `Polymer.dom().notifyObservers` method to 'kick' observers, for example, when attributes change under Shadow DOM. ([commit](https://github.com/Polymer/polymer/commit/07261e4))

- Add mutation tracking for distributedNodes. ([commit](https://github.com/Polymer/polymer/commit/b11f86b))

- Factor dom-api's into separate helpers. ([commit](https://github.com/Polymer/polymer/commit/effedcb))

- Adds `Polymer.dom(element).observeChildren(callback)` api ([commit](https://github.com/Polymer/polymer/commit/6499e83))

- Adds `getEffectiveChildNodes`, `getEffectiveChildren`, `getEffectiveTextContent` ([commit](https://github.com/Polymer/polymer/commit/f34fb45))

## [v1.1.5](https://github.com/Polymer/polymer/tree/v1.1.5) (2015-10-08)
- Simplify ([commit](https://github.com/Polymer/polymer/commit/79dfe1f))

- Clean up templatizer _pathEffectorImpl. ([commit](https://github.com/Polymer/polymer/commit/1a89bcf))

- Add issue link. ([commit](https://github.com/Polymer/polymer/commit/e4c2433))

- Missing var keyword ([commit](https://github.com/Polymer/polymer/commit/45fcbcf))

- Make sure we only actually call _listen once ([commit](https://github.com/Polymer/polymer/commit/837e9b8))

- Add templatizer tests.  Fix issues from tests. ([commit](https://github.com/Polymer/polymer/commit/2d97cd7))

- Use 'value' in place of 'object' when referring to detail. ([commit](https://github.com/Polymer/polymer/commit/f17be35))

- Allow any type, not just objects, as the detail for fire. ([commit](https://github.com/Polymer/polymer/commit/ec59f57))

- Make model param of stamp method optional. ([commit](https://github.com/Polymer/polymer/commit/a2e1e64))

- add test to ensure unlisten events do not fire ([commit](https://github.com/Polymer/polymer/commit/bf2f694))

- add tests ([commit](https://github.com/Polymer/polymer/commit/900d82b))

- Only one real listener per `listen` call ([commit](https://github.com/Polymer/polymer/commit/8bd380a))

- add util method for shadow children ([commit](https://github.com/Polymer/polymer/commit/1e9110a))

- Add notify-path API to templatized template. Fixes #2505. ([commit](https://github.com/Polymer/polymer/commit/2e086fe))

- Parent property values should come from template. Fixes #2504. ([commit](https://github.com/Polymer/polymer/commit/23c883b))

- Added note about including a clear repro case. ([commit](https://github.com/Polymer/polymer/commit/e18f009))

- added request to submit an issue before sending a PR ([commit](https://github.com/Polymer/polymer/commit/6ed836f))

- update CHANGELOG to 1.1.4 ([commit](https://github.com/Polymer/polymer/commit/c2b7c31))

## [v1.1.4](https://github.com/Polymer/polymer/tree/v1.1.4) (2015-09-25)
- :memo: Update description ([commit](https://github.com/Polymer/polymer/commit/6afb8be))

- :art: Use npm command bin lookup ([commit](https://github.com/Polymer/polymer/commit/84258d4))

- :grapes: Add missing test dependency ([commit](https://github.com/Polymer/polymer/commit/5726b8e))

- Reset handlers queue after finished replaying events ([commit](https://github.com/Polymer/polymer/commit/76a5f17))

- Update the README.md to Polymer 1.1 ([commit](https://github.com/Polymer/polymer/commit/40c455a))

- Add note on arrayDelete with array vs. path ([commit](https://github.com/Polymer/polymer/commit/d2b71a5))

- Add unlinkPath tests. ([commit](https://github.com/Polymer/polymer/commit/bee110b))

- Update changelog ([commit](https://github.com/Polymer/polymer/commit/573ca29))

- Remove dead code; add tests. ([commit](https://github.com/Polymer/polymer/commit/ab85884))

- Allow multiple paths to be linked using linkPath. Fixes #2048 ([commit](https://github.com/Polymer/polymer/commit/b221dbe))

- Fix docs for stamp method ([commit](https://github.com/Polymer/polymer/commit/8adbe60))

- http to https for jsbin ([commit](https://github.com/Polymer/polymer/commit/d842435))

- Typo ([commit](https://github.com/Polymer/polymer/commit/d558c0d))

- Fix typos in PRIMER.md ([commit](https://github.com/Polymer/polymer/commit/cf793f4))

## [v1.1.3](https://github.com/Polymer/polymer/tree/v1.1.3) (2015-09-04)
- Fixes #2403 ([commit](https://github.com/Polymer/polymer/commit/a6694b7))

- Only try to decrement gesture dependency counter if dependency exists ([commit](https://github.com/Polymer/polymer/commit/8886e8c))

- update changelog with v1.1.2 ([commit](https://github.com/Polymer/polymer/commit/d3a7c93))

- prepare v1.1.2 ([commit](https://github.com/Polymer/polymer/commit/e78be4f))

## [v1.1.2](https://github.com/Polymer/polymer/tree/v1.1.2) (2015-08-28)
- Improve composed parent tracking. ([commit](https://github.com/Polymer/polymer/commit/4d15789))

- move the mixing-in of behaviors so that it happens before `register` behaviors are invoked ([commit](https://github.com/Polymer/polymer/commit/637367c))

- Fixes #2378 ([commit](https://github.com/Polymer/polymer/commit/a9f081b))

- Fixes #2356: issue a warning and don't throw an exception when a style include cannot be found. Fixes #2357: include data now comes before any textContent in a style element. ([commit](https://github.com/Polymer/polymer/commit/a16ada1))

- remove unneeded protection code for extends. ([commit](https://github.com/Polymer/polymer/commit/8eada87))

- Add test ([commit](https://github.com/Polymer/polymer/commit/47ff0e8))

- add test for `registered` behavior affecting a value then used by features ([commit](https://github.com/Polymer/polymer/commit/230528c))

- add tests for new Polymer() argument support (and make Base tests aware of new abstract method `_desugarBehaviors`) ([commit](https://github.com/Polymer/polymer/commit/9734a3a))

- invoke `registration` behavior before registering features, so behaviors can alter features, this requires calling behavior flattening as part of prototype desugaring instead of as part of behavior prep, so the flattened list is available early ([commit](https://github.com/Polymer/polymer/commit/6224dc3))

- do `registered` behaviors before invoking `registerFeatures` so `registered` can affect properties used by features (ref #2329) ([commit](https://github.com/Polymer/polymer/commit/61d611c))

- specifically create `Polymer` object on `window` to satisfy strict mode (fixes #2363) ([commit](https://github.com/Polymer/polymer/commit/a75133d))

- Remove forceUpgraded check in dom-module.import ([commit](https://github.com/Polymer/polymer/commit/b85b641))

- Fixes #2341: branch Polymer.dom to use native dom methods under Shadow DOM for: appendChild, insertBefore, removeChild, replaceChild, cloneNode. ([commit](https://github.com/Polymer/polymer/commit/9b1f706))

- Fixes #2334: when composing nodes in shady dom, check if a node is where we expect it to be before removing it from its distributed position. We do this because the node may have been moved by Polymer.dom in a way that triggered distribution of its previous location. The node is already where it needs to be so removing it from its parent when it's no longer distributed is destructive. ([commit](https://github.com/Polymer/polymer/commit/4ea69c2))

- use cached template annotations when possible ([commit](https://github.com/Polymer/polymer/commit/b0733d3))

- fix comment typos ([commit](https://github.com/Polymer/polymer/commit/a0a3e0c))

- Update changelog with v1.1.1 release ([commit](https://github.com/Polymer/polymer/commit/12fa867))

## [v1.1.1](https://github.com/Polymer/polymer/tree/v1.1.1) (2015-08-20)
- Fixes #2263: ensure custom-style can parse variable definitions in supported selectors (e.g. /deep/) without exception due to unknown css. ([commit](https://github.com/Polymer/polymer/commit/894492b))

- Fixes #2311, #2323: when elements are removed from their previous position when they are added elsewhere, make sure to remove them from composed, not logical parent. ([commit](https://github.com/Polymer/polymer/commit/3d93116))

- Update Changelog ([commit](https://github.com/Polymer/polymer/commit/039ef93))

- Add selectedItem property ([commit](https://github.com/Polymer/polymer/commit/d65acd0))

- Add test for large splice ([commit](https://github.com/Polymer/polymer/commit/c967583))

- Use numeric sort when removing dom-repeat instances ([commit](https://github.com/Polymer/polymer/commit/fccbd8a))

- Fixes #2267: properly find dom-module for mixed case elements ([commit](https://github.com/Polymer/polymer/commit/76c58b8))

- Fixes #2304: avoid trying to read style data from imports that did not load. ([commit](https://github.com/Polymer/polymer/commit/0d1f206))

- Avoid saving logical info on parent when a content is added inside a fragment + slight factoring. ([commit](https://github.com/Polymer/polymer/commit/36072be))

- Fixes #2276: avoid losing logical information and simplify logical tree handling ([commit](https://github.com/Polymer/polymer/commit/ee61627))

- Moved check earlier. Added test for negative literal. ([commit](https://github.com/Polymer/polymer/commit/1a87ab4))

- Fixes #2253: refine logical tree check and populate parents of insertion points with logical info only if necessary. Fixes #2283: when a node is removed, we need to potentially distribute not only its host but also its parent. ([commit](https://github.com/Polymer/polymer/commit/6619f6c))

- Support for negative numbers in computed bindings ([commit](https://github.com/Polymer/polymer/commit/fc53f50))

## [v1.1.0](https://github.com/Polymer/polymer/tree/v1.1.0) (2015-08-13)
- Add comment. ([commit](https://github.com/Polymer/polymer/commit/337b54a))

- Add tests for key splice fix. ([commit](https://github.com/Polymer/polymer/commit/4bc055b))

- Fixes #2251: resolve imported stylesheets against correct document. ([commit](https://github.com/Polymer/polymer/commit/68af666))

- Reduce keySplices to minimum change set before notifying. Fixes #2261 ([commit](https://github.com/Polymer/polymer/commit/f74d072))

- Make `clearSelection` public. ([commit](https://github.com/Polymer/polymer/commit/7497729))

- Add logical info iff an element being added is an insertion point; do not add logical info for any element in a shady root. ([commit](https://github.com/Polymer/polymer/commit/45cb150))

- Make `clearSelection` public. ([commit](https://github.com/Polymer/polymer/commit/d55be7d))

- Fixes #2235. Manages logical information in shady distribution more directly by capturing it explicitly when needed and not whenever distribution is run. ([commit](https://github.com/Polymer/polymer/commit/21500fb))

- ensure path fixup is applied correctly to styles in templates. ([commit](https://github.com/Polymer/polymer/commit/b22f3cd))

- Based on feedback, change `module` to `include` in custom-style and dom-module style marshaling. ([commit](https://github.com/Polymer/polymer/commit/f469129))

- Document custom-style module property. ([commit](https://github.com/Polymer/polymer/commit/398d9f7))

- Add comment. ([commit](https://github.com/Polymer/polymer/commit/4e640c7))

- Add tests and require `module` to be on `style` elements. ([commit](https://github.com/Polymer/polymer/commit/58d3c3b))

- `custom-style` supports `module` property that accepts a `dom-module` containing style data. `don-module` style data may be specified inside `<template>` elements and style elements also support module attribute for referencing additional modules containing style data. ([commit](https://github.com/Polymer/polymer/commit/3734c4d))

- don-module no longer needs to eagerly upgrade custom elements since the web components polyfills do this automatically. ([commit](https://github.com/Polymer/polymer/commit/051e1bf))

## [v1.0.9](https://github.com/Polymer/polymer/tree/v1.0.9) (2015-08-07)
- Remove undocumented return value. ([commit](https://github.com/Polymer/polymer/commit/1764d0c))

- Add default, update docs. ([commit](https://github.com/Polymer/polymer/commit/ca267a5))

- Add tests for isSelected. ([commit](https://github.com/Polymer/polymer/commit/15d63ef))

- Default selected to empty array. Add isSelected API. ([commit](https://github.com/Polymer/polymer/commit/d4e7140))

- Fixes #2218: match style properties against scope transformed selector (not property unique selector) ([commit](https://github.com/Polymer/polymer/commit/c9e9062))

- Remove notify for items (unnecessary). ([commit](https://github.com/Polymer/polymer/commit/a370860))

- Uncomment line. ([commit](https://github.com/Polymer/polymer/commit/b25330b))

- Give toggle a default. ([commit](https://github.com/Polymer/polymer/commit/db9bda5))

- Use multi-prop observer; default selected to null. ([commit](https://github.com/Polymer/polymer/commit/ba4bf38))

- Add tests. Reset selection on items/multi change. Remove async. ([commit](https://github.com/Polymer/polymer/commit/5bca55b))

- Property matching must check non-transformed rule selector. ([commit](https://github.com/Polymer/polymer/commit/5b9a5ce))

- Make _itemsChanged depend on multi. ([commit](https://github.com/Polymer/polymer/commit/1b21397))

- Make sure mouse position is not a factor for .click() in IE 10 ([commit](https://github.com/Polymer/polymer/commit/1a2fb4d))

- Always trigger tap for synthetic click events ([commit](https://github.com/Polymer/polymer/commit/1eef1a7))

- Fixes #2193: Implements workaround for https://code.google.com/p/chromium/issues/detail?id=516550 by adding Polymer.RenderStatus.whenReady and using it to defer `attached` ([commit](https://github.com/Polymer/polymer/commit/2bffc4c))

- Fix polyfill templates ([commit](https://github.com/Polymer/polymer/commit/d78c934))

- Use `_clientsReadied` to avoid missing attribute->property sets in ready. ([commit](https://github.com/Polymer/polymer/commit/165f716))

- Make propagation of attribute changes at configure time more efficient ([commit](https://github.com/Polymer/polymer/commit/b269c1d))

- add offsetParent smoke tests ([commit](https://github.com/Polymer/polymer/commit/0b2cfae))

- Fixes #1673: ensure instance effects exist before marshaling attributes. ([commit](https://github.com/Polymer/polymer/commit/7c83df5))

- Fix typo. ([commit](https://github.com/Polymer/polymer/commit/97944e4))

- Clarify `fire` option defaults. Fixes #2180 ([commit](https://github.com/Polymer/polymer/commit/7c3e516))

- Add cross-reference for API docs. Fixes #2180 ([commit](https://github.com/Polymer/polymer/commit/9bdcc3b))

- Updated utils & removed fn signatures; defer to API docs. Fixes #2180 ([commit](https://github.com/Polymer/polymer/commit/b9b86d5))

- Update core- to iron-ajax in PRIMER.md  as in Polymer/docs#1276, Polymer/docs#1275 ([commit](https://github.com/Polymer/polymer/commit/e99358a))

- Update core- to iron-ajax in jsdoc for dom-bind  as in Polymer/docs#1276, Polymer/docs#1275 ([commit](https://github.com/Polymer/polymer/commit/07327c0))

- Make properties replacement robust against properties which start with a leading `;` ([commit](https://github.com/Polymer/polymer/commit/3ea0333))

- Fixes #2154: ensure Polymer.dom always sees wrapped nodes when ShadowDOM polyfill is in use. ([commit](https://github.com/Polymer/polymer/commit/fc90aa0))

- Use css parser's property stripping code in custom-style. ([commit](https://github.com/Polymer/polymer/commit/756ef1b))

- Deduplicate track/untrack document event listener logic ([commit](https://github.com/Polymer/polymer/commit/53037d4))

- Automatically filter mouseevents without the left mouse button ([commit](https://github.com/Polymer/polymer/commit/bbc3b57))

- Fixes #2113: ensures custom-style rules that use @apply combined with defining properties apply correctly. ([commit](https://github.com/Polymer/polymer/commit/69a4aa5))

- Correct & simplify per spec. ([commit](https://github.com/Polymer/polymer/commit/7b8b7fd))

- Clean up logic. ([commit](https://github.com/Polymer/polymer/commit/d4deb5d))

- More loosely match expression function names ([commit](https://github.com/Polymer/polymer/commit/6cfa759))

- Fix link to direct to Cross-scope styling ([commit](https://github.com/Polymer/polymer/commit/f9c58bc))

- Update behaviors order.  Fixes #2144. ([commit](https://github.com/Polymer/polymer/commit/2a51661))

- Cache style.display & textContent and re-apply on true. Fixes #2037 ([commit](https://github.com/Polymer/polymer/commit/2611285))

- Fixes #2118: force element `is` to be lowercase: mixing case causes confusion and breaks style shimming for type extensions. ([commit](https://github.com/Polymer/polymer/commit/c8905f9))

- Allow array API's accept string & negative args. Fixes #2062. Brings the API more in line with native splice, etc. ([commit](https://github.com/Polymer/polymer/commit/7e2ceeb))

- Fix #2107: improve binding expression parser to match valid javascript property names. ([commit](https://github.com/Polymer/polymer/commit/7560130))

## [v1.0.8](https://github.com/Polymer/polymer/tree/v1.0.8) (2015-07-23)
- Disable tracking if scrolling ([commit](https://github.com/Polymer/polymer/commit/ee5177d))

- Fixes #2125: adds a register method to dom-module to support imperative creation. ([commit](https://github.com/Polymer/polymer/commit/861f4aa))

- Move recognizer reset into start of event flow ([commit](https://github.com/Polymer/polymer/commit/a7495f7))

- Fixed small typo on PRIMER.md ([commit](https://github.com/Polymer/polymer/commit/bc40821))

- remove alternate calculation for _rootDataHost ([commit](https://github.com/Polymer/polymer/commit/26663cd))

- Don't call `dom-change` when detached. ([commit](https://github.com/Polymer/polymer/commit/bdb8fa3))

- Fix typo. ([commit](https://github.com/Polymer/polymer/commit/65911bd))

- Improve code formatting. ([commit](https://github.com/Polymer/polymer/commit/3968c84))

- Up flush MAX to 100 and add overflow warning. ([commit](https://github.com/Polymer/polymer/commit/8bcc416))

- Fixes #1998: add api doc for `customStyle` property ([commit](https://github.com/Polymer/polymer/commit/91577c9))

- Handle commentnodes correctly for textContent and innerHTML ([commit](https://github.com/Polymer/polymer/commit/6d56d2b))

- Fixes #2098: don't accept undefined values as initial config ([commit](https://github.com/Polymer/polymer/commit/1a5c391))

- Remove key check; int check should guarantee key. ([commit](https://github.com/Polymer/polymer/commit/dbf833e))

- Add unit tests. ([commit](https://github.com/Polymer/polymer/commit/bc4b142))

- Allow setting non-index array properties. Fixes #2096. ([commit](https://github.com/Polymer/polymer/commit/f8cad94))

- update tests. ([commit](https://github.com/Polymer/polymer/commit/8922323))

- added `render` method to dom-bind which can be called when async imports are used; documented template render functions ([commit](https://github.com/Polymer/polymer/commit/348896a))

- Fixes #2039: Polymer.dom.flush now triggers Custom Elements polyfill mutations and includes an api (`Polymer.dom.addDebouncer(debouncer)`) for adding debouncers which should run at flush time. Template rendering debouncers are placed in the flush list. ([commit](https://github.com/Polymer/polymer/commit/89a767c))

- Fixes #2010, fixes #1818: Shady dom mutations which trigger additional mutations are now successfully enqueued. ([commit](https://github.com/Polymer/polymer/commit/a26247b))

- debounce returns debouncer. ([commit](https://github.com/Polymer/polymer/commit/fb52120))

- Update index.html ([commit](https://github.com/Polymer/polymer/commit/119df98))

## [v1.0.7](https://github.com/Polymer/polymer/tree/v1.0.7) (2015-07-16)
- Replace placeholders backwards to simplify. ([commit](https://github.com/Polymer/polymer/commit/5eda235))

- Remove unnecessary keys bookkeeping. ([commit](https://github.com/Polymer/polymer/commit/3e02bfd))

- Minor tweaks to comments, internal API consistency. ([commit](https://github.com/Polymer/polymer/commit/82958d4))

- Always use placeholders; fix insertion reference bug. ([commit](https://github.com/Polymer/polymer/commit/4a45d4f))

- Simplify. ([commit](https://github.com/Polymer/polymer/commit/4eda393))

- Rename variables for clarity. ([commit](https://github.com/Polymer/polymer/commit/15c1241))

- Fix reuse logic to handle multiple mutations in same turn. Fixes #2009. ([commit](https://github.com/Polymer/polymer/commit/1bf5f6d))

- Be more explicit. ([commit](https://github.com/Polymer/polymer/commit/a6bd5a5))

- Add Polymer.instanceof & isInstance. Fixes #2083. ([commit](https://github.com/Polymer/polymer/commit/7954f93))

- Fixes #2081: make Polymer.dom(element).getDistributedNodes and Polymer.dom(element).getDestinationInsertionPoints() always return at least an empty array (was generating exception under Shadow DOM); make element.getContentChildNodes and element.getContentChildren always return at least an empty array when a selector is passed that does not find a <content>  (was generating exception under Shadow DOM) ([commit](https://github.com/Polymer/polymer/commit/f966381))

- Fixes #2077: workaround IE text node splitting issue that can make text bindings fail. ([commit](https://github.com/Polymer/polymer/commit/312d11f))

- Fixes #2078: when computing custom style properties, make sure the styling scope is valid when the element is attached to a shadowRoot whose host is not a Polymer element. ([commit](https://github.com/Polymer/polymer/commit/fab2ed7))

- update CHANGELOG for 1.0.6 ([commit](https://github.com/Polymer/polymer/commit/c46ec11))

\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/GitHub-Changelog-Generator) below*
## [v1.0.6](https://github.com/Polymer/polymer/tree/v1.0.6) (2015-07-09)

**Fixed issues:**

- Basic support for host-context [\#1895](https://github.com/Polymer/polymer/issues/1895)

- custom property resolver tripping over some selectors? [\#1938](https://github.com/Polymer/polymer/issues/1938)

- Parsing compressed CSS does not work [\#1927](https://github.com/Polymer/polymer/issues/1927)

- Support Polymer.dom().classList.contains [\#1907](https://github.com/Polymer/polymer/issues/1907)

- Add support for :host-context [\#1900](https://github.com/Polymer/polymer/issues/1900)

- Grey overlay in mobile Safari [\#1970](https://github.com/Polymer/polymer/issues/1970)

- `node.unlisten` removes native event listeners too often [\#1988](https://github.com/Polymer/polymer/issues/1988)

- `notifyPath` doesn't return as its documentation says [\#1966](https://github.com/Polymer/polymer/issues/1966)

- "TypeError: Cannot set property 'display' of undefined" when HTML comment is present inside a dom-if template that evaluates to truthy [\#1786](https://github.com/Polymer/polymer/issues/1786)

- `dom-repeat` in a falsy `dom-if` should hide newly stamped children [\#1751](https://github.com/Polymer/polymer/issues/1751)

- Typo in Polymer.mixin API documentation [\#2001](https://github.com/Polymer/polymer/issues/2001)

- Low-level changes for `iron-list` integration (`fire` & `modelForElement`) [\#2003](https://github.com/Polymer/polymer/issues/2003)

- Normalized event difference with ShadowDOM and Shady [\#1921](https://github.com/Polymer/polymer/issues/1921)

- DOM API innerHTML adds only first element [\#1972](https://github.com/Polymer/polymer/issues/1972)

- with Polymer\#1.05-update, style-sheets and custom-style-elements are not parsed in my project anymore [\#1974](https://github.com/Polymer/polymer/issues/1974)

- Expected behavior for importNode,cloneNode [\#1888](https://github.com/Polymer/polymer/issues/1888)

- \#1.0.5 computed property function name limitations? [\#2016](https://github.com/Polymer/polymer/issues/2016)

## [v1.0.5](https://github.com/Polymer/polymer/tree/v1.0.5) (2015-06-25)

**Fixed issues:**

- Bindings to concrete types not propagating correctly from template to collection [\#1839](https://github.com/Polymer/polymer/issues/1839)

- Setting individual array elements not working [\#1854](https://github.com/Polymer/polymer/issues/1854)

- `CustomStyle` change has no effect [\#1851](https://github.com/Polymer/polymer/issues/1851)

- With Shady DOM, `<content>` doesn't get passed to another element inside `dom-if` [\#1902](https://github.com/Polymer/polymer/issues/1902)

- Provide a convenience method for setting `customStyle` and calling `updateStyles` [\#1915](https://github.com/Polymer/polymer/issues/1915)

- If an `async` callback throws an error, it's never removed from the callback list [\#1759](https://github.com/Polymer/polymer/issues/1759)

- `dom-if`: undefined is considered falsy only once [\#1742](https://github.com/Polymer/polymer/issues/1742)

- Setting `readOnly` AND `computed` on properties [\#1925](https://github.com/Polymer/polymer/issues/1925)

- `Uncaught TypeError: this.mixin is not a function` [\#1911](https://github.com/Polymer/polymer/issues/1911)

- `Polymer.Base.async` "infinite loop" condition [\#1933](https://github.com/Polymer/polymer/issues/1933)

- Custom property resolver tripping over some selectors? [\#1938](https://github.com/Polymer/polymer/issues/1938)

- Annotated attribute binding issues [\#1874](https://github.com/Polymer/polymer/issues/1874)

- Parsing compressed CSS does not work [\#1927](https://github.com/Polymer/polymer/issues/1927)

## [v1.0.4](https://github.com/Polymer/polymer/tree/v1.0.4) (2015-06-17)

**Closed issues:**

- Error when i put a paper-input inside a paper-drawer-panel [\#1893](https://github.com/Polymer/polymer/issues/1893)

- Open the website country restrictions [\#1885](https://github.com/Polymer/polymer/issues/1885)

- Observers  executed twice if defined in both the properties and the observers array [\#1884](https://github.com/Polymer/polymer/issues/1884)

- If I set element property before component registered I cannot change it anymore [\#1882](https://github.com/Polymer/polymer/issues/1882)

- Polymer icon set not scaling with size [\#1881](https://github.com/Polymer/polymer/issues/1881)

- How binding a JSON in Polymer 1.0 [\#1878](https://github.com/Polymer/polymer/issues/1878)

- Annotated attribute binding issues [\#1874](https://github.com/Polymer/polymer/issues/1874)

- Paper Elements don't appear on site [\#1868](https://github.com/Polymer/polymer/issues/1868)

- \[1.0\] Inserted content not toggled when inside dom-if [\#1862](https://github.com/Polymer/polymer/issues/1862)

- Polymer Catalog -- link-related usability issue [\#1860](https://github.com/Polymer/polymer/issues/1860)

- Issues with catalog on Chromium 37.0.2062.120, 41.0.2272.76, and Firefox 38.0 [\#1859](https://github.com/Polymer/polymer/issues/1859)

- documentation bug; search elements [\#1858](https://github.com/Polymer/polymer/issues/1858)

- can I two way binding a properties type of 'Number' to attribute? [\#1856](https://github.com/Polymer/polymer/issues/1856)

- 'this' points to Window rather than custom element when called through setTimeOut\(\) [\#1853](https://github.com/Polymer/polymer/issues/1853)

- Cannot define an element in the main document \(Firefox and Internet explorer\) [\#1850](https://github.com/Polymer/polymer/issues/1850)

- Feature: array variable accessor [\#1849](https://github.com/Polymer/polymer/issues/1849)

- Support for expressions and filters [\#1847](https://github.com/Polymer/polymer/issues/1847)

- key/value iteration support for template dom-repeat [\#1846](https://github.com/Polymer/polymer/issues/1846)

- Styling local DOM [\#1842](https://github.com/Polymer/polymer/issues/1842)

- Polymer bouded property not updating - or getting reset \(sometimes\) [\#1840](https://github.com/Polymer/polymer/issues/1840)

- insertRule\('body /deep/ myclass' + ' {' + cssText + '}', index\); throws error in ff and ie [\#1836](https://github.com/Polymer/polymer/issues/1836)

- this.insertRule\("body /deep/ someclass", index\); error [\#1835](https://github.com/Polymer/polymer/issues/1835)

- \<core-scaffold\> 0.5 toolbar background coloring broken [\#1834](https://github.com/Polymer/polymer/issues/1834)

- Radio buttons break when using border-box [\#1832](https://github.com/Polymer/polymer/issues/1832)

- polymer 1.0 how to use dom-if ? [\#1828](https://github.com/Polymer/polymer/issues/1828)

- Remove the undocumented "find nearest template" feature when registering [\#1827](https://github.com/Polymer/polymer/issues/1827)

- Remove `preventDefault` from track [\#1824](https://github.com/Polymer/polymer/issues/1824)

- Need a way to cancel track and tap from down [\#1823](https://github.com/Polymer/polymer/issues/1823)

- Computed bindings are not updated when using polymer's this.push to add elements [\#1822](https://github.com/Polymer/polymer/issues/1822)

-  Two-way bindings to array members not updating when data edited in dom-repeat template \(bug or feature?\) [\#1821](https://github.com/Polymer/polymer/issues/1821)

- Binding undefined does not work as expected [\#1813](https://github.com/Polymer/polymer/issues/1813)

- Can't declare Boolean attributes with default of true? [\#1812](https://github.com/Polymer/polymer/issues/1812)

- array-selector doesn't work with `multi` unless `toggle` is specified  [\#1810](https://github.com/Polymer/polymer/issues/1810)

- Style shim only converts a single ::shadow or /deep/ in a selector [\#1809](https://github.com/Polymer/polymer/issues/1809)

- Incorrect style for custom CSS properties when extending a native element [\#1807](https://github.com/Polymer/polymer/issues/1807)

- Document compatibility with browser [\#1805](https://github.com/Polymer/polymer/issues/1805)

- Unwrapped dom-if causes DOMException [\#1804](https://github.com/Polymer/polymer/issues/1804)

- \<template is=dom-if\> fails to add rows to a table if they contain \<content\> [\#1800](https://github.com/Polymer/polymer/issues/1800)

- Data binding causes infinite loop if value is NaN [\#1799](https://github.com/Polymer/polymer/issues/1799)

- Issues with polymer 1.0 dom-repeat templates using paper-radio-group and the selected property [\#1792](https://github.com/Polymer/polymer/issues/1792)

- bind attribute replacement [\#1790](https://github.com/Polymer/polymer/issues/1790)

- The Shadows sucks [\#1788](https://github.com/Polymer/polymer/issues/1788)

- Is there a list of Polymer 1.0 elements in the documentations? as it used to be 0.5! [\#1782](https://github.com/Polymer/polymer/issues/1782)

- Custom style variables for elements added outside of polymer [\#1781](https://github.com/Polymer/polymer/issues/1781)

- Can I recover the contaminated DOM? [\#1779](https://github.com/Polymer/polymer/issues/1779)

- \[1.0\] Data-binding: Is there any way to do this imperatively? [\#1778](https://github.com/Polymer/polymer/issues/1778)

- DATA-BINDING [\#1772](https://github.com/Polymer/polymer/issues/1772)

- \[1.0\] polymer attribute used in a string behaving differently from 0.5 [\#1770](https://github.com/Polymer/polymer/issues/1770)

- \[1.0.2\] Setting property treated as idempotent, but isn't [\#1768](https://github.com/Polymer/polymer/issues/1768)

- official element-table bower package [\#1767](https://github.com/Polymer/polymer/issues/1767)

- Shopping card polymer element [\#1766](https://github.com/Polymer/polymer/issues/1766)

- How to create a polymer element from iron-ajax element response [\#1764](https://github.com/Polymer/polymer/issues/1764)

- iron-collapse is focusable \(by clicking or tabbing into it\), which produces a focus outline in browsers [\#1760](https://github.com/Polymer/polymer/issues/1760)

- dom-repeat data binding: not working as expected [\#1758](https://github.com/Polymer/polymer/issues/1758)

- \[1.0.3\] Do not resolve hash-only urls used for routing [\#1757](https://github.com/Polymer/polymer/issues/1757)

- \[1.0.3\]Cannot start up after upgrade [\#1754](https://github.com/Polymer/polymer/issues/1754)

- Content nodes in `dom-if` template do not distribute correctly [\#1753](https://github.com/Polymer/polymer/issues/1753)

- overriding the custom css variables only works for the first dom element on the page [\#1752](https://github.com/Polymer/polymer/issues/1752)

- paper-checkbox should have an indeterminate state [\#1749](https://github.com/Polymer/polymer/issues/1749)

- nested dom-repeat with sort attribute shows duplicate entries when adding new items. [\#1744](https://github.com/Polymer/polymer/issues/1744)

- `attached` handler executed in wrong order in chrome browser. [\#1743](https://github.com/Polymer/polymer/issues/1743)

- \[1.0.2\] '$' is undefined when 'created' is being called  [\#1728](https://github.com/Polymer/polymer/issues/1728)

- \[1.0\] ::before / ::after psudo selectors in a custom-style [\#1668](https://github.com/Polymer/polymer/issues/1668)

- Need Polymer.Base.unlisten to remove the event listener [\#1639](https://github.com/Polymer/polymer/issues/1639)

- custom-style sometimes does not apply variables [\#1637](https://github.com/Polymer/polymer/issues/1637)

- \[0.9.4\] Dom-if template doesn't stamp when its content contains a wrapped insertion point [\#1631](https://github.com/Polymer/polymer/issues/1631)

- With \<template if=\> missing how can I have several different styles applied? [\#1419](https://github.com/Polymer/polymer/issues/1419)

**Merged pull requests:**

- Includes element defaults in the list of own properties by which elements are styled. [\#1891](https://github.com/Polymer/polymer/pull/1891) ([sorvell](https://github.com/sorvell))

- Style shimming fixes [\#1857](https://github.com/Polymer/polymer/pull/1857) ([sorvell](https://github.com/sorvell))

- Clear composedNodes when an element upgrades without an insertion point [\#1845](https://github.com/Polymer/polymer/pull/1845) ([sorvell](https://github.com/sorvell))

- Allow user prevention of `tap` and `track` gestures from `down` [\#1843](https://github.com/Polymer/polymer/pull/1843) ([azakus](https://github.com/azakus))

- Fix incorrect test for `toggle`. Fixes \#1810. [\#1841](https://github.com/Polymer/polymer/pull/1841) ([arthurevans](https://github.com/arthurevans))

- Use var keyword when declaring local variable so it doesn't leak to global scope. [\#1838](https://github.com/Polymer/polymer/pull/1838) ([trevordixon](https://github.com/trevordixon))

- No implicit template \(fixes \#1827\) [\#1837](https://github.com/Polymer/polymer/pull/1837) ([sjmiles](https://github.com/sjmiles))

- Fix jsdoc for splice [\#1820](https://github.com/Polymer/polymer/pull/1820) ([jscissr](https://github.com/jscissr))

- Fix dynamic insertion of wrapped or redistributing content. [\#1816](https://github.com/Polymer/polymer/pull/1816) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Handle NaN correctly in bindings [\#1811](https://github.com/Polymer/polymer/pull/1811) ([azakus](https://github.com/azakus))

- Fix 1752 [\#1797](https://github.com/Polymer/polymer/pull/1797) ([sorvell](https://github.com/sorvell))

- Do not apply/notify keySplices if array has not been Collectionified. Fixes \#1744 [\#1795](https://github.com/Polymer/polymer/pull/1795) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Use gulp-vulcanize concurrently for faster builds [\#1793](https://github.com/Polymer/polymer/pull/1793) ([azakus](https://github.com/azakus))

- Fixes \#1757, do not resolve hash-only urls used for routing [\#1780](https://github.com/Polymer/polymer/pull/1780) ([nippur72](https://github.com/nippur72))

- Add `unlisten` function [\#1740](https://github.com/Polymer/polymer/pull/1740) ([azakus](https://github.com/azakus))

- Custom style fix [\#1638](https://github.com/Polymer/polymer/pull/1638) ([sorvell](https://github.com/sorvell))

## [v1.0.3](https://github.com/Polymer/polymer/tree/v1.0.3) (2015-06-05)

**Closed issues:**

- paper-toolbar \[title\] conflicts with HTML \[title\] [\#1745](https://github.com/Polymer/polymer/issues/1745)

- Bound data-\* attributes being stripped from template children [\#1737](https://github.com/Polymer/polymer/issues/1737)

- Polymer.Base.splice and dom-repeat [\#1733](https://github.com/Polymer/polymer/issues/1733)

- \[1.0.0\] Light DOM being replaced by shady DOM on ready [\#1732](https://github.com/Polymer/polymer/issues/1732)

- \[1.0.2\] Databinding and nested objects [\#1731](https://github.com/Polymer/polymer/issues/1731)

- Paper-tabs in Flexbox [\#1730](https://github.com/Polymer/polymer/issues/1730)

- When not including `webcomponentsjs`, a script in `\<head\>` after imports will break `unresolved` attribute [\#1723](https://github.com/Polymer/polymer/issues/1723)

- Create 1.0.x Release [\#1721](https://github.com/Polymer/polymer/issues/1721)

- RENAME listeners TO events [\#1719](https://github.com/Polymer/polymer/issues/1719)

- Uncaught TypeError When splicing an array into emptiness [\#1714](https://github.com/Polymer/polymer/issues/1714)

- Paper-Button references \<core-icon\> [\#1709](https://github.com/Polymer/polymer/issues/1709)

- Events for paper-menu or paper-item [\#1708](https://github.com/Polymer/polymer/issues/1708)

- Why is there no javascript file? [\#1707](https://github.com/Polymer/polymer/issues/1707)

- Evergreen browser incompatibility [\#1706](https://github.com/Polymer/polymer/issues/1706)

- \[1.0\] shady dom inserts '\<content\>' more than once [\#1704](https://github.com/Polymer/polymer/issues/1704)

- Issue running Polymer Started Kit 1.0.0 [\#1703](https://github.com/Polymer/polymer/issues/1703)

- iron-form body data malformed [\#1702](https://github.com/Polymer/polymer/issues/1702)

- \[1.0\] Attached callback is differently resolved on chrome and ff [\#1699](https://github.com/Polymer/polymer/issues/1699)

- Polymer 1.0 and WebComponents.js [\#1698](https://github.com/Polymer/polymer/issues/1698)

- \[dom-if\] is not as inert as \<template\> should be [\#1695](https://github.com/Polymer/polymer/issues/1695)

- can't use flex inside neon-animated-pages [\#1694](https://github.com/Polymer/polymer/issues/1694)

- Polymer::Attributes: couldn`t decode Array as JSON [\#1693](https://github.com/Polymer/polymer/issues/1693)

- Mobile links off homepage dont work [\#1692](https://github.com/Polymer/polymer/issues/1692)

- Computed property doesn't work in dom-repeat [\#1691](https://github.com/Polymer/polymer/issues/1691)

- core-animated-pages any plans? [\#1689](https://github.com/Polymer/polymer/issues/1689)

- Where's paper-dropdown-menu 1.0? [\#1684](https://github.com/Polymer/polymer/issues/1684)

- \[1.0\] dom-repeat observe non-array values [\#1683](https://github.com/Polymer/polymer/issues/1683)

- Element catalog, google-analytics, docs missing [\#1681](https://github.com/Polymer/polymer/issues/1681)

- Binding not working for open text [\#1677](https://github.com/Polymer/polymer/issues/1677)

- Blog link in README.md and CONTRIBUTING.md is wrong [\#1676](https://github.com/Polymer/polymer/issues/1676)

- Strange lines on polymer site menu [\#1675](https://github.com/Polymer/polymer/issues/1675)

- Need to parameterize path to fonts [\#1674](https://github.com/Polymer/polymer/issues/1674)

- How to add dynamic classes in dom-repeat 1.0 [\#1671](https://github.com/Polymer/polymer/issues/1671)

- Array mutation without using helper methods [\#1666](https://github.com/Polymer/polymer/issues/1666)

- Wrapping non interpolated strings with span in 1.0 [\#1664](https://github.com/Polymer/polymer/issues/1664)

- dom-if template got rendered once even if the condition is false [\#1663](https://github.com/Polymer/polymer/issues/1663)

- Cannot read property 'slice' of undefined on firebase update [\#1661](https://github.com/Polymer/polymer/issues/1661)

- \[1.0.2\] Global leak found in \_marshalArgs [\#1660](https://github.com/Polymer/polymer/issues/1660)

- \[1.0\] Changes in appendChild from 0.9 to 1.0? [\#1657](https://github.com/Polymer/polymer/issues/1657)

- Using scroll header panel together with dialog will cause backdrop to cover up dialog [\#1656](https://github.com/Polymer/polymer/issues/1656)

- Color Extraction [\#1654](https://github.com/Polymer/polymer/issues/1654)

- using AngularJS with paper elements [\#1649](https://github.com/Polymer/polymer/issues/1649)

- Gestures event issue - No offsets management [\#1646](https://github.com/Polymer/polymer/issues/1646)

- \[0.9\] event on-blur does not work on paper-input [\#1634](https://github.com/Polymer/polymer/issues/1634)

- \[0.9.4\] Nested dom-if templates show invalid content [\#1632](https://github.com/Polymer/polymer/issues/1632)

- paper-slider input box overflow. [\#1611](https://github.com/Polymer/polymer/issues/1611)

- \[0.9\] Documentation issue \(unbind & dispose\) [\#1607](https://github.com/Polymer/polymer/issues/1607)

- Better dependency management [\#1592](https://github.com/Polymer/polymer/issues/1592)

**Merged pull requests:**

- Make \_\_styleScoped a one-time optimization. Fixes \#1733 [\#1739](https://github.com/Polymer/polymer/pull/1739) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Move non-webcomponents script unresolved case to `load` instead of synchronous [\#1724](https://github.com/Polymer/polymer/pull/1724) ([azakus](https://github.com/azakus))

- Fix for IE. [\#1717](https://github.com/Polymer/polymer/pull/1717) ([achimnol](https://github.com/achimnol))

- Fix broken link [\#1688](https://github.com/Polymer/polymer/pull/1688) ([weiland](https://github.com/weiland))

- Fix syntax highlighting [\#1687](https://github.com/Polymer/polymer/pull/1687) ([weiland](https://github.com/weiland))

- Fixes link license [\#1685](https://github.com/Polymer/polymer/pull/1685) ([mateusortiz](https://github.com/mateusortiz))

- fixed a little typo [\#1682](https://github.com/Polymer/polymer/pull/1682) ([fredpedro](https://github.com/fredpedro))

- fix html comment in README.md [\#1680](https://github.com/Polymer/polymer/pull/1680) ([campersau](https://github.com/campersau))

- Changed to https like other links [\#1653](https://github.com/Polymer/polymer/pull/1653) ([henricavalcante](https://github.com/henricavalcante))

- dom-if hidden state is \(this.\_hideTemplateChildren || !this.if\). [\#1635](https://github.com/Polymer/polymer/pull/1635) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Re-insert rows when re-attaching. Fixes \#1498. Fixes \#1714. [\#1629](https://github.com/Polymer/polymer/pull/1629) ([kevinpschaaf](https://github.com/kevinpschaaf))

## [v1.0.2](https://github.com/Polymer/polymer/tree/v1.0.2) (2015-05-29)

## [v1.0.1](https://github.com/Polymer/polymer/tree/v1.0.1) (2015-05-29)

**Implemented enhancements:**

- using javascript core functions [\#1641](https://github.com/Polymer/polymer/issues/1641)

**Fixed bugs:**

- \[1.0\] Tap gesture does not trigger when calling `this.click` in IE10 [\#1640](https://github.com/Polymer/polymer/issues/1640)

**Closed issues:**

- Logic for tap distance should be "both axes within TAP\_DISTANCE" [\#1652](https://github.com/Polymer/polymer/issues/1652)

- Site is not looking good in Mac Chrome Versión 43.0.2357.81 \(64-bit\)  [\#1650](https://github.com/Polymer/polymer/issues/1650)

- Different result is shown. [\#1647](https://github.com/Polymer/polymer/issues/1647)

- Wrong end tag name in README.md [\#1645](https://github.com/Polymer/polymer/issues/1645)

- on-tap doesn't trigger on checkbox 0.5 [\#1586](https://github.com/Polymer/polymer/issues/1586)

**Merged pull requests:**

- I want to put a space before Jim. [\#1648](https://github.com/Polymer/polymer/pull/1648) ([yutori](https://github.com/yutori))

- Fixes link url [\#1643](https://github.com/Polymer/polymer/pull/1643) ([zenorocha](https://github.com/zenorocha))

- Fixes typo [\#1642](https://github.com/Polymer/polymer/pull/1642) ([zenorocha](https://github.com/zenorocha))

- updated readme and added contributing file [\#1628](https://github.com/Polymer/polymer/pull/1628) ([tjsavage](https://github.com/tjsavage))

## [v1.0.0](https://github.com/Polymer/polymer/tree/v1.0.0) (2015-05-27)

**Closed issues:**

- \[0.9.4\] Data binding works only for "id" attribute? [\#1633](https://github.com/Polymer/polymer/issues/1633)

- \[0.9\] when I move a dom-repeat element from one parent to another, the items will gone [\#1498](https://github.com/Polymer/polymer/issues/1498)

## [v0.9.4](https://github.com/Polymer/polymer/tree/v0.9.4) (2015-05-27)

**Closed issues:**

- Polymer.version undefined in 0.9 [\#1625](https://github.com/Polymer/polymer/issues/1625)

**Merged pull requests:**

- Add back Polymer.version string [\#1626](https://github.com/Polymer/polymer/pull/1626) ([azakus](https://github.com/azakus))

## [v0.9.3](https://github.com/Polymer/polymer/tree/v0.9.3) (2015-05-26)

**Closed issues:**

- Property values that contain a `:` inside a mixin. [\#1623](https://github.com/Polymer/polymer/issues/1623)

- \[0.9.2\] dom-repeat issues in 0.9.2 [\#1615](https://github.com/Polymer/polymer/issues/1615)

- \[0.9.1, 0.9.2\] Polymer.dom\(\).appendChild\(\) no longer working [\#1612](https://github.com/Polymer/polymer/issues/1612)

- \[0.9\] "dom-if" not binding to an object's boolean property [\#1606](https://github.com/Polymer/polymer/issues/1606)

- \[0.9\] Custom attributes on elements not working \(original: iron-icon styling troubles\) [\#1604](https://github.com/Polymer/polymer/issues/1604)

- Blog down https://blog.polymer-project.org/  [\#1603](https://github.com/Polymer/polymer/issues/1603)

- Improve error message if observer is missing [\#1538](https://github.com/Polymer/polymer/issues/1538)

- \[0.9\] New gulp build hangs until enter key is pressed [\#1519](https://github.com/Polymer/polymer/issues/1519)

- \[0.8\] better error when bound change handler is missing [\#1206](https://github.com/Polymer/polymer/issues/1206)

**Merged pull requests:**

- Fixes url's in style mixins. [\#1624](https://github.com/Polymer/polymer/pull/1624) ([sorvell](https://github.com/sorvell))

- Initialize \_config with values set before creating accessors. [\#1618](https://github.com/Polymer/polymer/pull/1618) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Update docs.  Add warnings. [\#1614](https://github.com/Polymer/polymer/pull/1614) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Refactor build process [\#1613](https://github.com/Polymer/polymer/pull/1613) ([azakus](https://github.com/azakus))

## [v0.9.2](https://github.com/Polymer/polymer/tree/v0.9.2) (2015-05-25)

**Fixed bugs:**

- Default values for custom variables  [\#1543](https://github.com/Polymer/polymer/issues/1543)

**Closed issues:**

- \[0.9.1\] Regression in styling with custom css mixins [\#1601](https://github.com/Polymer/polymer/issues/1601)

- Dynamic distribution fails when using SD polyfill and host is nested in another host and has filtering insertion points [\#1595](https://github.com/Polymer/polymer/issues/1595)

- Custom properties defined on `:host` shouldn't override document styles. [\#1555](https://github.com/Polymer/polymer/issues/1555)

**Merged pull requests:**

- Native xstyle fix [\#1605](https://github.com/Polymer/polymer/pull/1605) ([sorvell](https://github.com/sorvell))

- Xstyle 1555 [\#1602](https://github.com/Polymer/polymer/pull/1602) ([sorvell](https://github.com/sorvell))

## [v0.9.1](https://github.com/Polymer/polymer/tree/v0.9.1) (2015-05-23)

**Implemented enhancements:**

- Array helpers don't notify length change [\#1573](https://github.com/Polymer/polymer/issues/1573)

- \[0.9.0-rc.1\] Method expression without arguments is not invoked [\#1516](https://github.com/Polymer/polymer/issues/1516)

- \[0.8\] Polymer.dom\(\) should expose innerHTML and textContent [\#1429](https://github.com/Polymer/polymer/issues/1429)

- How do you cancel job1 completely before its timeout value occur? [\#1374](https://github.com/Polymer/polymer/issues/1374)

- \[0.8\] Feature request: computed properties in x-repeat [\#1337](https://github.com/Polymer/polymer/issues/1337)

**Fixed bugs:**

- Computed properties with no dependencies generate a syntax error [\#1348](https://github.com/Polymer/polymer/issues/1348)

- \[0.8\] host-context improperly shimmed [\#1346](https://github.com/Polymer/polymer/issues/1346)

**Closed issues:**

- Tap event not firing the first time after tracking another element [\#1590](https://github.com/Polymer/polymer/issues/1590)

- domReady [\#1587](https://github.com/Polymer/polymer/issues/1587)

- Content tag does not work inside dom-if template [\#1584](https://github.com/Polymer/polymer/issues/1584)

- /deep/ css selector not work in chrome browser [\#1583](https://github.com/Polymer/polymer/issues/1583)

- Under native ShadowDOM "dom-if" doesn't stamp out the content even when "if" property is true [\#1582](https://github.com/Polymer/polymer/issues/1582)

- Iron-Input hint not turning into label on ChromeBook apps [\#1581](https://github.com/Polymer/polymer/issues/1581)

- Binding text remains in \<input value="{{value::input}}"\> on IE10 [\#1578](https://github.com/Polymer/polymer/issues/1578)

- \[0.9\] Extends delays/breaks polymer element setup [\#1575](https://github.com/Polymer/polymer/issues/1575)

- \[0.9\] Gesture event throws exception when dragged outside document [\#1574](https://github.com/Polymer/polymer/issues/1574)

- dom-repeat filter/sort needs to be able to observe parent scope [\#1572](https://github.com/Polymer/polymer/issues/1572)

- Logical Operators doesn't work anymore in 0.9 [\#1568](https://github.com/Polymer/polymer/issues/1568)

- Reposted from Angular Issue \#1723: Unable to define correct CSS @Rules when CSS shimming is enabled [\#1566](https://github.com/Polymer/polymer/issues/1566)

- \[0.9.0\] Problem putting a dom-if template in a light DOM when the component's \<content\> itself is wrapped in a dom-if [\#1565](https://github.com/Polymer/polymer/issues/1565)

- hypergrid is a polymer custom component [\#1561](https://github.com/Polymer/polymer/issues/1561)

- serializeValueToAttribute returns undefined [\#1559](https://github.com/Polymer/polymer/issues/1559)

- Offsetting core drawer panel [\#1557](https://github.com/Polymer/polymer/issues/1557)

- \[0.9\] How to dynamically import elements? [\#1554](https://github.com/Polymer/polymer/issues/1554)

- Release process should have change log [\#1553](https://github.com/Polymer/polymer/issues/1553)

- \[0.9\] on-click="kickAction\(\)" [\#1552](https://github.com/Polymer/polymer/issues/1552)

- Layout functionality in 0.9 [\#1551](https://github.com/Polymer/polymer/issues/1551)

- \[0.9\] hostAttributes: Noooooooo! [\#1549](https://github.com/Polymer/polymer/issues/1549)

- \[0.9\] hidden$="{{isHidden}}" vs hidden=$"{{isHidden}}" [\#1548](https://github.com/Polymer/polymer/issues/1548)

- seems that case sensitive properties doesn't work [\#1547](https://github.com/Polymer/polymer/issues/1547)

- webcomponents loading order [\#1544](https://github.com/Polymer/polymer/issues/1544)

- Data-binding to native DOM element inside of auto-binding template invokes style scoping [\#1542](https://github.com/Polymer/polymer/issues/1542)

- 0.9 zip file nearly empty [\#1541](https://github.com/Polymer/polymer/issues/1541)

- Polymer.dom\(parent\).querySelector polyfill is broken in 0.8 [\#1540](https://github.com/Polymer/polymer/issues/1540)

- Imported resource from origin 'file://' has been blocked from loading by Cross-Origin Resource Sharing policy: Received an invalid response. Origin 'null' is therefore not allowed access. [\#1535](https://github.com/Polymer/polymer/issues/1535)

- \[0.9.0-rc.1\] Cannot set property 'touchAction' of undefinedGestures.setTouchAction [\#1533](https://github.com/Polymer/polymer/issues/1533)

- Could I disable the two-way binding? [\#1529](https://github.com/Polymer/polymer/issues/1529)

- \[0.9\] Can't override the css property if the property is already set on the host via custom property [\#1525](https://github.com/Polymer/polymer/issues/1525)

- \[0.5.6\] Hang in loading polymer [\#1524](https://github.com/Polymer/polymer/issues/1524)

- \[0.0.9-rc.1\] Array changes event is not delivered [\#1523](https://github.com/Polymer/polymer/issues/1523)

- \[0.9\] dom-bind not working with document.createElement [\#1515](https://github.com/Polymer/polymer/issues/1515)

- Please, more info about new releases [\#1507](https://github.com/Polymer/polymer/issues/1507)

- \[0.9\] Annotated computed properties don't work on autobinding template [\#1500](https://github.com/Polymer/polymer/issues/1500)

- Upgrade from polymer 0.5 to 0.8 [\#1492](https://github.com/Polymer/polymer/issues/1492)

- \[0.8\] Binding a property with value 'undefined' to an input value on IE11 shows the raw binding [\#1491](https://github.com/Polymer/polymer/issues/1491)

- \[0.8\] SVG elements fail on IE11 due to missing classList [\#1490](https://github.com/Polymer/polymer/issues/1490)

- Cross domain HTML import [\#1489](https://github.com/Polymer/polymer/issues/1489)

- Using Polymer with NW.js [\#1481](https://github.com/Polymer/polymer/issues/1481)

- 0.9: String literals as parameters of computed properties [\#1475](https://github.com/Polymer/polymer/issues/1475)

- Inheritance of CSS Variables [\#1470](https://github.com/Polymer/polymer/issues/1470)

- support data binding with ES6 module? [\#1465](https://github.com/Polymer/polymer/issues/1465)

- \[0.8\] IE9 styles broken [\#1464](https://github.com/Polymer/polymer/issues/1464)

- how to get polymer and requirejs working together? [\#1463](https://github.com/Polymer/polymer/issues/1463)

- .8 domReady never being called [\#1460](https://github.com/Polymer/polymer/issues/1460)

- TODO in polymer.js references fixed bug [\#1457](https://github.com/Polymer/polymer/issues/1457)

- \[0.8\] Self-closing p tag breaks template [\#1455](https://github.com/Polymer/polymer/issues/1455)

- \[0.8\] x-repeat failing to stamp instances on safari [\#1443](https://github.com/Polymer/polymer/issues/1443)

- \[0.8\] `\<content select=".class"\>` and `hostAttributes` don't work together [\#1431](https://github.com/Polymer/polymer/issues/1431)

- \[0.8\] Binding to "id" is not working [\#1426](https://github.com/Polymer/polymer/issues/1426)

- Event handlers within x-repeat always target the first instance of an element [\#1425](https://github.com/Polymer/polymer/issues/1425)

- \[0.8\] host, port, etc are reserved for anchor elements; let's avoid them [\#1417](https://github.com/Polymer/polymer/issues/1417)

- \[0.8\] IE11 displays and then hides Custom Elements [\#1412](https://github.com/Polymer/polymer/issues/1412)

- \[0.8\] x-repeat objectizes arrays of strings [\#1411](https://github.com/Polymer/polymer/issues/1411)

- \[0.8\] style scope missing  [\#1410](https://github.com/Polymer/polymer/issues/1410)

- Polymer 0.8 cant bind to array item. [\#1409](https://github.com/Polymer/polymer/issues/1409)

- \[0.8\]\[styling\] Want to define custom variables in the same scope as their references  [\#1406](https://github.com/Polymer/polymer/issues/1406)

- \[0.8\]\[styling\] Should be able to mixin sibling properties [\#1399](https://github.com/Polymer/polymer/issues/1399)

- \[0.8\] Properties deserialized from native inputs lose their type [\#1396](https://github.com/Polymer/polymer/issues/1396)

- Shady DOM doesn't correctly parse custom property rules. [\#1389](https://github.com/Polymer/polymer/issues/1389)

- Shady DOM custom properties don't inherit. [\#1388](https://github.com/Polymer/polymer/issues/1388)

- \[0.8\] dom-module nice but not perfect [\#1380](https://github.com/Polymer/polymer/issues/1380)

- \[0.8\] notify: true Bad idea unless it has a huge performance gain [\#1379](https://github.com/Polymer/polymer/issues/1379)

- Style mixin syntax is incompatible with Sass [\#1373](https://github.com/Polymer/polymer/issues/1373)

- \[x-repeat\] can't bind to childNodes under Shadow DOM [\#1367](https://github.com/Polymer/polymer/issues/1367)

- \[0.8\] - default property values are not set by the time observers are called [\#1364](https://github.com/Polymer/polymer/issues/1364)

- \[0.8\]: observer callbacks changed parameter ordering [\#1363](https://github.com/Polymer/polymer/issues/1363)

- \[0.8\] HTMLAnchor has a `host` property, breaks the intended behavior of `Polymer.Base.\_queryHost` [\#1359](https://github.com/Polymer/polymer/issues/1359)

- \[0.8\] Style scoped immediate descendant selector no longer matches projected content [\#1312](https://github.com/Polymer/polymer/issues/1312)

- Spaces in binding causes SyntaxError: Unexpected identifier. [\#1311](https://github.com/Polymer/polymer/issues/1311)

- Tracking issue: Supporting CSP in 0.8+ [\#1306](https://github.com/Polymer/polymer/issues/1306)

- \[0.8\] `readOnly` property without `notify` will not be `readOnly` [\#1294](https://github.com/Polymer/polymer/issues/1294)

- Shady styling increases selector specificity [\#1279](https://github.com/Polymer/polymer/issues/1279)

- \[0.8\] body unresolved broken [\#1271](https://github.com/Polymer/polymer/issues/1271)

- \[0.8\] accidental shared state in configure value? [\#1269](https://github.com/Polymer/polymer/issues/1269)

- \[0.8\] Properties observers registered too early [\#1258](https://github.com/Polymer/polymer/issues/1258)

- \[0.8\] Polymer.import missing [\#1248](https://github.com/Polymer/polymer/issues/1248)

- \[0.8\] Consider always assigning to native properties [\#1226](https://github.com/Polymer/polymer/issues/1226)

**Merged pull requests:**

- Notify array.length changes.  Fixes \#1573. [\#1600](https://github.com/Polymer/polymer/pull/1600) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Make `dom-bind` not scope element classes. Fixes \#1542 [\#1599](https://github.com/Polymer/polymer/pull/1599) ([sorvell](https://github.com/sorvell))

- 1565,1582,1584 fix [\#1597](https://github.com/Polymer/polymer/pull/1597) ([sorvell](https://github.com/sorvell))

- Wait until imports resolve to stamp. Fixes \#1500 [\#1594](https://github.com/Polymer/polymer/pull/1594) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Perform dom-bind work in attached/detached. Add tests. [\#1591](https://github.com/Polymer/polymer/pull/1591) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Clear input.value attribute before removing for IE. Fixes \#1491. Fixe… [\#1589](https://github.com/Polymer/polymer/pull/1589) ([kevinpschaaf](https://github.com/kevinpschaaf))

- iterate behavior mixins in reverse order as the `hasOwnProperty` chec… [\#1588](https://github.com/Polymer/polymer/pull/1588) ([sjmiles](https://github.com/sjmiles))

- serializeValueToAttribute always provokes distribute if necessary [\#1580](https://github.com/Polymer/polymer/pull/1580) ([sorvell](https://github.com/sorvell))

- Use more resilient shadowroot checking [\#1579](https://github.com/Polymer/polymer/pull/1579) ([azakus](https://github.com/azakus))

- Literal args comma fix [\#1577](https://github.com/Polymer/polymer/pull/1577) ([sjmiles](https://github.com/sjmiles))

- allow behavior arrays to contain nested behavior arrays [\#1576](https://github.com/Polymer/polymer/pull/1576) ([sjmiles](https://github.com/sjmiles))

- X style fixes [\#1570](https://github.com/Polymer/polymer/pull/1570) ([sorvell](https://github.com/sorvell))

- Fix typo in PRIMER.md [\#1569](https://github.com/Polymer/polymer/pull/1569) ([ragingwind](https://github.com/ragingwind))

- Remove unused keyCodes enum [\#1564](https://github.com/Polymer/polymer/pull/1564) ([jklein24](https://github.com/jklein24))

- Xstyle [\#1556](https://github.com/Polymer/polymer/pull/1556) ([sorvell](https://github.com/sorvell))

## [v0.9.0](https://github.com/Polymer/polymer/tree/v0.9.0) (2015-05-14)

**Implemented enhancements:**

- Expose dom-repeat.\_instanceForElement [\#1501](https://github.com/Polymer/polymer/issues/1501)

**Closed issues:**

- Change color of main panel [\#1536](https://github.com/Polymer/polymer/issues/1536)

- \[0.8.0-rc.5\] observers as an array [\#1527](https://github.com/Polymer/polymer/issues/1527)

- \[0.9\] Touch scroll gesture, setScrollDirection doesn't work any longer [\#1520](https://github.com/Polymer/polymer/issues/1520)

- \[0.9\] Data binding? [\#1517](https://github.com/Polymer/polymer/issues/1517)

- `this.$.\*` isn't set if an element \* is inside a `dom-if` block and the condition evaluates to true [\#1513](https://github.com/Polymer/polymer/issues/1513)

- Paper-action-dialog with backdrop disables window [\#1509](https://github.com/Polymer/polymer/issues/1509)

- How to pass data from polymer element [\#1503](https://github.com/Polymer/polymer/issues/1503)

- \[0.9\] auto-binding, x-repeat template not working [\#1502](https://github.com/Polymer/polymer/issues/1502)

- \[0.9\] if="{{ 1 \< 2 }}" not supported?! [\#1499](https://github.com/Polymer/polymer/issues/1499)

- \[0.9\] touch track fails on iPhone, .touchIdentifier vs .identifier [\#1496](https://github.com/Polymer/polymer/issues/1496)

- Internet Explorer 11 "Failed to open data:text/javascript;charset=utf-8," [\#1485](https://github.com/Polymer/polymer/issues/1485)

- \[0.5.5\] Function calling is not working in custom element [\#1484](https://github.com/Polymer/polymer/issues/1484)

- \[0.8\] Nested insertion points lose elements after distributeContent [\#1480](https://github.com/Polymer/polymer/issues/1480)

- \[0.8\] Binding the value of an input box with {{value::input}} loses caret index [\#1471](https://github.com/Polymer/polymer/issues/1471)

- \[0.8\] Nested property binding not working on Firefox/IE [\#1391](https://github.com/Polymer/polymer/issues/1391)

- Memory Leak when using Data Bindings [\#1116](https://github.com/Polymer/polymer/issues/1116)

**Merged pull requests:**

- Update to wcjs 0.7.0. [\#1532](https://github.com/Polymer/polymer/pull/1532) ([kevinpschaaf](https://github.com/kevinpschaaf))

- 0.8 negate annotated computation [\#1528](https://github.com/Polymer/polymer/pull/1528) ([sjmiles](https://github.com/sjmiles))

- Add commands to test build [\#1522](https://github.com/Polymer/polymer/pull/1522) ([azakus](https://github.com/azakus))

- Implement a minimum track distance [\#1518](https://github.com/Polymer/polymer/pull/1518) ([azakus](https://github.com/azakus))

- Process nested templates in base, parse method args for parentProps. [\#1514](https://github.com/Polymer/polymer/pull/1514) ([kevinpschaaf](https://github.com/kevinpschaaf))

- trasnacted -\> transacted in PRIMER.md [\#1512](https://github.com/Polymer/polymer/pull/1512) ([Shrugs](https://github.com/Shrugs))

- Add missing comma in code example [\#1510](https://github.com/Polymer/polymer/pull/1510) ([fredj](https://github.com/fredj))

- 0.8 shady api [\#1508](https://github.com/Polymer/polymer/pull/1508) ([sorvell](https://github.com/sorvell))

- Fix dom-module closing tag [\#1497](https://github.com/Polymer/polymer/pull/1497) ([fredj](https://github.com/fredj))

- Add more docs for Gestures [\#1495](https://github.com/Polymer/polymer/pull/1495) ([azakus](https://github.com/azakus))

- Fix nits from \#1486 [\#1494](https://github.com/Polymer/polymer/pull/1494) ([azakus](https://github.com/azakus))

- Change x-style to custom-style in comments [\#1493](https://github.com/Polymer/polymer/pull/1493) ([chuckh](https://github.com/chuckh))

## [v0.9.0-rc.1](https://github.com/Polymer/polymer/tree/v0.9.0-rc.1) (2015-05-06)

**Merged pull requests:**

- Rename x-\* elements. [\#1488](https://github.com/Polymer/polymer/pull/1488) ([sorvell](https://github.com/sorvell))

- 0.8 lexical template scope [\#1487](https://github.com/Polymer/polymer/pull/1487) ([kevinpschaaf](https://github.com/kevinpschaaf))

- 0.8 gestures in core [\#1486](https://github.com/Polymer/polymer/pull/1486) ([sjmiles](https://github.com/sjmiles))

## [0.5.6](https://github.com/Polymer/polymer/tree/0.5.6) (2015-05-05)

**Implemented enhancements:**

- \[0.8\] `hostAttributes` should respect user-provided defaults [\#1458](https://github.com/Polymer/polymer/issues/1458)

**Closed issues:**

- Unable to connect to github.com... [\#1468](https://github.com/Polymer/polymer/issues/1468)

- error using mixins as computed property or in template methods in 0.8.0-rc.7 [\#1456](https://github.com/Polymer/polymer/issues/1456)

- \[0.8\] observers as an object. [\#1452](https://github.com/Polymer/polymer/issues/1452)

- \[0.8\] getDistributedNodes\(\) does not update when distributed content changes [\#1449](https://github.com/Polymer/polymer/issues/1449)

- \[0.8\] behaviors override properties on elements [\#1444](https://github.com/Polymer/polymer/issues/1444)

- \[0.8\] bower.json license does not follow specification [\#1435](https://github.com/Polymer/polymer/issues/1435)

- Error in 0.8 RC6 - not present in RC4 [\#1428](https://github.com/Polymer/polymer/issues/1428)

- \[0.8\] Support :root in x-style [\#1415](https://github.com/Polymer/polymer/issues/1415)

- \[0.8\] 'style-scope undefined' when combined with hostAttributes and x-if template [\#1400](https://github.com/Polymer/polymer/issues/1400)

- \[0.8\] `\<link rel="import" type="css"\>` styles are shimmed out of order [\#1349](https://github.com/Polymer/polymer/issues/1349)

- Polymer 0.5.2 release have version 0.5.1 [\#1033](https://github.com/Polymer/polymer/issues/1033)

**Merged pull requests:**

- 0.8 x style [\#1482](https://github.com/Polymer/polymer/pull/1482) ([sorvell](https://github.com/sorvell))

- Fix translate3d call after transform refactor [\#1478](https://github.com/Polymer/polymer/pull/1478) ([azakus](https://github.com/azakus))

- 0.8 array notification [\#1477](https://github.com/Polymer/polymer/pull/1477) ([kevinpschaaf](https://github.com/kevinpschaaf))

- don't trap `id` for marshalling if it's a binding directive + test [\#1474](https://github.com/Polymer/polymer/pull/1474) ([sjmiles](https://github.com/sjmiles))

- use `hasOwnProperty` to avoid overwriting prototype methods when mixing in behaviors \(+test\) [\#1473](https://github.com/Polymer/polymer/pull/1473) ([sjmiles](https://github.com/sjmiles))

- 0.8 fix xif polyfill [\#1469](https://github.com/Polymer/polymer/pull/1469) ([kevinpschaaf](https://github.com/kevinpschaaf))

- 0.8 patching [\#1462](https://github.com/Polymer/polymer/pull/1462) ([sorvell](https://github.com/sorvell))

- 0.8 api scrub [\#1440](https://github.com/Polymer/polymer/pull/1440) ([kevinpschaaf](https://github.com/kevinpschaaf))

- typo in PRIMER.md [\#1430](https://github.com/Polymer/polymer/pull/1430) ([batista](https://github.com/batista))

- Build polymer 0.8. [\#1402](https://github.com/Polymer/polymer/pull/1402) ([garlicnation](https://github.com/garlicnation))

## [v0.8.0-rc.7](https://github.com/Polymer/polymer/tree/v0.8.0-rc.7) (2015-04-22)

**Closed issues:**

- \[0.8\] `readOnly` properties do not receive the initial value specified by `value` [\#1393](https://github.com/Polymer/polymer/issues/1393)

**Merged pull requests:**

- Fixes style scoping when elements are stamped inside repeats. [\#1439](https://github.com/Polymer/polymer/pull/1439) ([sorvell](https://github.com/sorvell))

- 0.8 repeat fixes [\#1438](https://github.com/Polymer/polymer/pull/1438) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Change user `constructor` to `factoryImpl` as an aid to compilation tool... [\#1437](https://github.com/Polymer/polymer/pull/1437) ([sorvell](https://github.com/sorvell))

- No more circular dependencies, because bower. [\#1436](https://github.com/Polymer/polymer/pull/1436) ([nevir](https://github.com/nevir))

- 0.8 behaviors [\#1433](https://github.com/Polymer/polymer/pull/1433) ([kevinpschaaf](https://github.com/kevinpschaaf))

- defeated -\> disabled [\#1423](https://github.com/Polymer/polymer/pull/1423) ([MetaMemoryT](https://github.com/MetaMemoryT))

## [v0.8.0-rc.6](https://github.com/Polymer/polymer/tree/v0.8.0-rc.6) (2015-04-20)

## [v0.8.0-rc.5](https://github.com/Polymer/polymer/tree/v0.8.0-rc.5) (2015-04-20)

**Closed issues:**

- \[0.8\] Global settings overwritten by webcomponents [\#1404](https://github.com/Polymer/polymer/issues/1404)

- \[0.8\] distributeContent loses light children [\#1394](https://github.com/Polymer/polymer/issues/1394)

- \[ShadyDOM\] Exception when removing non-distributed nodes [\#1366](https://github.com/Polymer/polymer/issues/1366)

**Merged pull requests:**

- 0.8 path effects [\#1422](https://github.com/Polymer/polymer/pull/1422) ([kevinpschaaf](https://github.com/kevinpschaaf))

- 0.8 nested template [\#1398](https://github.com/Polymer/polymer/pull/1398) ([kevinpschaaf](https://github.com/kevinpschaaf))

- 0.8 shim class [\#1397](https://github.com/Polymer/polymer/pull/1397) ([sorvell](https://github.com/sorvell))

- \<iron-doc-viewer\> based index for local dev [\#1395](https://github.com/Polymer/polymer/pull/1395) ([nevir](https://github.com/nevir))

- Add license to css-parse.html [\#1378](https://github.com/Polymer/polymer/pull/1378) ([garlicnation](https://github.com/garlicnation))

## [v0.8.0-rc.4](https://github.com/Polymer/polymer/tree/v0.8.0-rc.4) (2015-04-10)

## [v0.8.0-rc.3](https://github.com/Polymer/polymer/tree/v0.8.0-rc.3) (2015-04-09)

**Closed issues:**

- Polymer-micro.html broken? [\#1390](https://github.com/Polymer/polymer/issues/1390)

- listener for DOMContentLoaded and window resize [\#1384](https://github.com/Polymer/polymer/issues/1384)

- \[0.8\] Opting into native Shadow DOM isn't documented [\#1382](https://github.com/Polymer/polymer/issues/1382)

- Polymer in 10 Minutes - 3. Create an app [\#1371](https://github.com/Polymer/polymer/issues/1371)

- Polymer in 10 Minutes - Reusing other elements [\#1370](https://github.com/Polymer/polymer/issues/1370)

- \[0.5.5\] Event fire error on safari [\#1362](https://github.com/Polymer/polymer/issues/1362)

- \[0.8\] importHref fails in IE/FF [\#1343](https://github.com/Polymer/polymer/issues/1343)

- Attribute Value of "selected" in the tutorial [\#1228](https://github.com/Polymer/polymer/issues/1228)

**Merged pull requests:**

- 0.8 machined [\#1386](https://github.com/Polymer/polymer/pull/1386) ([sorvell](https://github.com/sorvell))

- Clarify concept of host to mean dom host. Related: [\#1372](https://github.com/Polymer/polymer/pull/1372) ([sorvell](https://github.com/sorvell))

## [v0.8.0-rc.2](https://github.com/Polymer/polymer/tree/v0.8.0-rc.2) (2015-04-02)

**Closed issues:**

- \[0.8\] Using one-way binding to propagate upward [\#1360](https://github.com/Polymer/polymer/issues/1360)

## [v0.8.0](https://github.com/Polymer/polymer/tree/v0.8.0) (2015-04-02)

**Implemented enhancements:**

- \[Shadow DOM\] Make Shadow DOM optional  [\#1042](https://github.com/Polymer/polymer/issues/1042)

**Closed issues:**

- \[0.8\] extended my-input element isn't shown [\#1350](https://github.com/Polymer/polymer/issues/1350)

- Polymer function not accessible in firefox/safari [\#1316](https://github.com/Polymer/polymer/issues/1316)

**Merged pull requests:**

- Fix undeclared variable exception in \_distributeInsertionPoint. [\#1351](https://github.com/Polymer/polymer/pull/1351) ([icetraxx](https://github.com/icetraxx))

- 0.8 custom notify event [\#1335](https://github.com/Polymer/polymer/pull/1335) ([kevinpschaaf](https://github.com/kevinpschaaf))

## [v0.8.0-rc.1](https://github.com/Polymer/polymer/tree/v0.8.0-rc.1) (2015-03-26)

**Fixed bugs:**

- \[0.8-preview\] Throws exception if left-hand-side of a property binding contains a dash  [\#1161](https://github.com/Polymer/polymer/issues/1161)

- Bindings in \<style\> no longer work under polyfill [\#270](https://github.com/Polymer/polymer/issues/270)

**Closed issues:**

- core-list needs your attention [\#1333](https://github.com/Polymer/polymer/issues/1333)

- Icons oversized on Firefox on polymer-project.org [\#1328](https://github.com/Polymer/polymer/issues/1328)

- \[0.8\] Unable to observe property 'hidden' [\#1322](https://github.com/Polymer/polymer/issues/1322)

- \[0.8\] Unexpected token \] [\#1298](https://github.com/Polymer/polymer/issues/1298)

- \[0.8\] Text bindings break if parenthesis are used [\#1297](https://github.com/Polymer/polymer/issues/1297)

- \[0.8\] Shady style processor doesn't drop operator for ::content [\#1293](https://github.com/Polymer/polymer/issues/1293)

- Polymer layout collision with another frameworks like Angular Material [\#1289](https://github.com/Polymer/polymer/issues/1289)

- Polymer Project Site - Broken Link [\#1288](https://github.com/Polymer/polymer/issues/1288)

- core-ajax [\#1287](https://github.com/Polymer/polymer/issues/1287)

- demo portions of documentation are missing/404 [\#1286](https://github.com/Polymer/polymer/issues/1286)

- \[0.8\] `attached` is called at different points in lifecycle for ShadeyDOM vs ShadowDOM [\#1285](https://github.com/Polymer/polymer/issues/1285)

- \[0.8\] Listening to events on an element produces different results under ShadowDOM v. ShadyDOM [\#1284](https://github.com/Polymer/polymer/issues/1284)

- Attribute selectors incorrectly scoped [\#1282](https://github.com/Polymer/polymer/issues/1282)

- \[0.8-preview\] Shadey styles have incorrect order of precedence [\#1277](https://github.com/Polymer/polymer/issues/1277)

- \[0.8\] Styling scoping not working with type extension elements [\#1275](https://github.com/Polymer/polymer/issues/1275)

- Typo on website [\#1273](https://github.com/Polymer/polymer/issues/1273)

- \[0.8-preview\] All properties are available for data binding [\#1262](https://github.com/Polymer/polymer/issues/1262)

- \[0.8\] camel-case attributes do not deserialize to properties correctly. [\#1257](https://github.com/Polymer/polymer/issues/1257)

- paper-autogrow-textarea bug [\#1255](https://github.com/Polymer/polymer/issues/1255)

- \<paper-input-decorator label=“birthday”\> [\#1251](https://github.com/Polymer/polymer/issues/1251)

- How addEventListener in nested template? [\#1250](https://github.com/Polymer/polymer/issues/1250)

- \<paper-input-decorator label="test" autoValidate?="{{autoValidate}}"\> [\#1249](https://github.com/Polymer/polymer/issues/1249)

- Installing with Bower not working [\#1246](https://github.com/Polymer/polymer/issues/1246)

- Bower package not found [\#1245](https://github.com/Polymer/polymer/issues/1245)

- \[0.8\] template x-repeat throws error under native ShadowDOM [\#1244](https://github.com/Polymer/polymer/issues/1244)

- \[0.8\] Multiple computed properties call same method [\#1242](https://github.com/Polymer/polymer/issues/1242)

- \[0.8\] value binding not working in samples.html [\#1241](https://github.com/Polymer/polymer/issues/1241)

- \[0.8\] encapsulate and class binding not working well together [\#1240](https://github.com/Polymer/polymer/issues/1240)

- Links in SPA tutorial are broken [\#1239](https://github.com/Polymer/polymer/issues/1239)

- What is the complete Polymer Public API? [\#1233](https://github.com/Polymer/polymer/issues/1233)

- content does not get wrapped on mobile devices [\#1221](https://github.com/Polymer/polymer/issues/1221)

- BUG: web-component-tester, sauce-connect-launcher dependency [\#1214](https://github.com/Polymer/polymer/issues/1214)

- Why calling polymer.js instead of polymer.min.js? [\#1213](https://github.com/Polymer/polymer/issues/1213)

- Imperatively declared element's custom fired event does not bubble up. [\#1212](https://github.com/Polymer/polymer/issues/1212)

- \[0.8\] Attribute deserialization possibly busted? [\#1208](https://github.com/Polymer/polymer/issues/1208)

- \[0.8\] Undefined method in constructor [\#1207](https://github.com/Polymer/polymer/issues/1207)

- Typo [\#1205](https://github.com/Polymer/polymer/issues/1205)

- \[0.8\] x-template should provide bound values to elements' configure [\#1200](https://github.com/Polymer/polymer/issues/1200)

- Dynamically publishing attributes [\#1198](https://github.com/Polymer/polymer/issues/1198)

- Template's script doesn't execute when imported from another document \(polyfill\) [\#1197](https://github.com/Polymer/polymer/issues/1197)

- \[0.8-preview\] x-repeat standalone issue [\#1192](https://github.com/Polymer/polymer/issues/1192)

- Polymer.Import - handle 404's [\#1184](https://github.com/Polymer/polymer/issues/1184)

- Get Started Tutorial [\#1181](https://github.com/Polymer/polymer/issues/1181)

- Initialization might fail when surrounded by p-element [\#1180](https://github.com/Polymer/polymer/issues/1180)

- Why no paper-label? [\#1174](https://github.com/Polymer/polymer/issues/1174)

- Polymer \(inline styling\) inconsistent between Chrome and Firefox [\#1172](https://github.com/Polymer/polymer/issues/1172)

- \[0.8-preview\] Bespoke element constructors [\#1151](https://github.com/Polymer/polymer/issues/1151)

- \[0.8-preview\] detached not getting called when the element being removed is in the localDom of another element. [\#1145](https://github.com/Polymer/polymer/issues/1145)

- \[0.8-preview\] Boolean attribute change handlers are called before `localDom` or `lightDom` are available. [\#1131](https://github.com/Polymer/polymer/issues/1131)

- Reference to `HTMLLinkElement` in `Polymer.import` callback [\#1127](https://github.com/Polymer/polymer/issues/1127)

- 0.8-preview: multiple arguments to computed method [\#1092](https://github.com/Polymer/polymer/issues/1092)

- 0.8-preview: handle case-sensitivity problems around attributes [\#1080](https://github.com/Polymer/polymer/issues/1080)

- 0.8-preview: "ready" fires before "created"? [\#1079](https://github.com/Polymer/polymer/issues/1079)

- Wrong Bindings types documentation [\#980](https://github.com/Polymer/polymer/issues/980)

**Merged pull requests:**

- update webcomponents dependency [\#1339](https://github.com/Polymer/polymer/pull/1339) ([garlicnation](https://github.com/garlicnation))

- Update bower.json to point to wcjs at 0.6.0 instead of master. [\#1338](https://github.com/Polymer/polymer/pull/1338) ([garlicnation](https://github.com/garlicnation))

- Fix typo an -\> and [\#1330](https://github.com/Polymer/polymer/pull/1330) ([ragingwind](https://github.com/ragingwind))

- Update PRIMER.md [\#1327](https://github.com/Polymer/polymer/pull/1327) ([mohanaravind](https://github.com/mohanaravind))

- Move notify event target check to \_notifyListener. [\#1323](https://github.com/Polymer/polymer/pull/1323) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Shady DOM optimizations: \(1\) fast path distribution when no insertion po... [\#1320](https://github.com/Polymer/polymer/pull/1320) ([sorvell](https://github.com/sorvell))

- \[0.8\] Minor doc typo [\#1313](https://github.com/Polymer/polymer/pull/1313) ([fredj](https://github.com/fredj))

- \[0.8\] Bye bye bowerrc [\#1310](https://github.com/Polymer/polymer/pull/1310) ([nevir](https://github.com/nevir))

- 0.8 gestures [\#1309](https://github.com/Polymer/polymer/pull/1309) ([frankiefu](https://github.com/frankiefu))

- Make webcomponentsjs a bower dependency [\#1307](https://github.com/Polymer/polymer/pull/1307) ([robdodson](https://github.com/robdodson))

- Walk attributes backward to avoid IE veto on removeAttribute. [\#1302](https://github.com/Polymer/polymer/pull/1302) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Update PRIMER.md [\#1301](https://github.com/Polymer/polymer/pull/1301) ([mohanaravind](https://github.com/mohanaravind))

- Separate attributes function from annotations [\#1300](https://github.com/Polymer/polymer/pull/1300) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Bugfix: ReferenceError: c is not defined [\#1295](https://github.com/Polymer/polymer/pull/1295) ([atotic](https://github.com/atotic))

- Minor text edits on DOM API description [\#1281](https://github.com/Polymer/polymer/pull/1281) ([arthurevans](https://github.com/arthurevans))

- Fixes typo and broken link in PRIMER. [\#1274](https://github.com/Polymer/polymer/pull/1274) ([batista](https://github.com/batista))

- 0.8 demodulate [\#1264](https://github.com/Polymer/polymer/pull/1264) ([sjmiles](https://github.com/sjmiles))

- 0.8 property config [\#1256](https://github.com/Polymer/polymer/pull/1256) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Fixed insertion of numbers and booleans in the weakmap in 0.8-preview [\#1253](https://github.com/Polymer/polymer/pull/1253) ([cedric-marcone](https://github.com/cedric-marcone))

- Unique comp props [\#1243](https://github.com/Polymer/polymer/pull/1243) ([ssorallen](https://github.com/ssorallen))

- Standardize indentation across examples in Primer [\#1235](https://github.com/Polymer/polymer/pull/1235) ([ssorallen](https://github.com/ssorallen))

- Use correct `Dom` capitalization in Primer doc [\#1222](https://github.com/Polymer/polymer/pull/1222) ([ssorallen](https://github.com/ssorallen))

- Collection repeat [\#1215](https://github.com/Polymer/polymer/pull/1215) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Fix typo in PRIMER.md [\#1204](https://github.com/Polymer/polymer/pull/1204) ([fredj](https://github.com/fredj))

## [0.5.5](https://github.com/Polymer/polymer/tree/0.5.5) (2015-02-18)

**Closed issues:**

- Need a Polymer Core \(team member\) representative asap? [\#1194](https://github.com/Polymer/polymer/issues/1194)

**Merged pull requests:**

- possible fix for \[0.8-preview\] \#1192 [\#1202](https://github.com/Polymer/polymer/pull/1202) ([sjmiles](https://github.com/sjmiles))

- Basic test for x-template stamping [\#1199](https://github.com/Polymer/polymer/pull/1199) ([nevir](https://github.com/nevir))

## [0.5.5-rc1](https://github.com/Polymer/polymer/tree/0.5.5-rc1) (2015-02-13)

**Closed issues:**

- How Polymer handle elements' model communication? [\#1187](https://github.com/Polymer/polymer/issues/1187)

- Polymer is failing silently without any console error [\#1171](https://github.com/Polymer/polymer/issues/1171)

- Elements created at runtime, can't know when ready [\#1158](https://github.com/Polymer/polymer/issues/1158)

- core-dropdown-menu is ugly magugly [\#1146](https://github.com/Polymer/polymer/issues/1146)

- polymer element not compatible with IE [\#1143](https://github.com/Polymer/polymer/issues/1143)

- polymer element not compatible with IE [\#1142](https://github.com/Polymer/polymer/issues/1142)

- Please improve home site's colors [\#1141](https://github.com/Polymer/polymer/issues/1141)

- polymer element not compatible with IE [\#1140](https://github.com/Polymer/polymer/issues/1140)

- polymer element not compatible with IE [\#1139](https://github.com/Polymer/polymer/issues/1139)

- polymer element not compatible with IE [\#1138](https://github.com/Polymer/polymer/issues/1138)

- Element with id="exports" results in uncaught "Observer is not defined" exception [\#1134](https://github.com/Polymer/polymer/issues/1134)

- Data-binding in \<template\> on objects attributes have strange behaviour \[bug?\] [\#1129](https://github.com/Polymer/polymer/issues/1129)

- tipAttribute is not working properly [\#1126](https://github.com/Polymer/polymer/issues/1126)

- IE 10+11 + data binding in inline style not working in Polymer v0.5.4 [\#1124](https://github.com/Polymer/polymer/issues/1124)

- webcomponents.min.js:11 Uncaught TypeError: undefined is not a function [\#1122](https://github.com/Polymer/polymer/issues/1122)

- TypeError: Attempting to configurable attribute of unconfigurable property. [\#1119](https://github.com/Polymer/polymer/issues/1119)

- Template with svg style url\(\#id\) is shimmed with file name [\#751](https://github.com/Polymer/polymer/issues/751)

**Merged pull requests:**

- 0.8 dash case [\#1191](https://github.com/Polymer/polymer/pull/1191) ([sjmiles](https://github.com/sjmiles))

- Add externs. [\#1165](https://github.com/Polymer/polymer/pull/1165) ([garlicnation](https://github.com/garlicnation))

- primer: fix module syntax [\#1162](https://github.com/Polymer/polymer/pull/1162) ([morethanreal](https://github.com/morethanreal))

- nit: fix typo in PRIMER.md [\#1147](https://github.com/Polymer/polymer/pull/1147) ([rictic](https://github.com/rictic))

- Add build script for autoclave [\#1132](https://github.com/Polymer/polymer/pull/1132) ([azakus](https://github.com/azakus))

## [0.5.4](https://github.com/Polymer/polymer/tree/0.5.4) (2015-01-24)

**Closed issues:**

- Dropdown Menu [\#1118](https://github.com/Polymer/polymer/issues/1118)

- Extracting an unknown archive [\#1103](https://github.com/Polymer/polymer/issues/1103)

## [0.5.3](https://github.com/Polymer/polymer/tree/0.5.3) (2015-01-21)

## [0.5.3-rc2](https://github.com/Polymer/polymer/tree/0.5.3-rc2) (2015-01-21)

**Closed issues:**

- problems trying 0.5.3-rc [\#1117](https://github.com/Polymer/polymer/issues/1117)

- Missing e in function - Tutorial [\#1110](https://github.com/Polymer/polymer/issues/1110)

- Cannot find function or filter [\#1102](https://github.com/Polymer/polymer/issues/1102)

- core-icons:work bug [\#1100](https://github.com/Polymer/polymer/issues/1100)

- https://www.polymer-project.org/components/all-of-them/all-of-them.html [\#1096](https://github.com/Polymer/polymer/issues/1096)

- Safari is not opening the demo page of polymer [\#1088](https://github.com/Polymer/polymer/issues/1088)

- 0.8-preview: newline confuses findAnnotatedNode [\#1078](https://github.com/Polymer/polymer/issues/1078)

**Merged pull requests:**

- \[0.8\] name -\> is [\#1112](https://github.com/Polymer/polymer/pull/1112) ([nevir](https://github.com/nevir))

- \[0.8\] Fix small typos in PRIMER.md [\#1098](https://github.com/Polymer/polymer/pull/1098) ([peterwmwong](https://github.com/peterwmwong))

## [0.5.3-rc](https://github.com/Polymer/polymer/tree/0.5.3-rc) (2015-01-15)

**Fixed bugs:**

- Need consistent path behavior [\#651](https://github.com/Polymer/polymer/issues/651)

**Closed issues:**

- Missing scrollbars, and mouse wheel not working [\#1089](https://github.com/Polymer/polymer/issues/1089)

- Very noticeable sluggishness when scrolling [\#1084](https://github.com/Polymer/polymer/issues/1084)

- Can't build 0.8-preview and there is no build information at all [\#1075](https://github.com/Polymer/polymer/issues/1075)

- paper-toggle-button and paper-checkbox events incorrectly documented [\#1074](https://github.com/Polymer/polymer/issues/1074)

- Failed to assign list scroller to scroller of headerPanel [\#1072](https://github.com/Polymer/polymer/issues/1072)

- this.$ gets polluted with shadow dom of other components [\#1069](https://github.com/Polymer/polymer/issues/1069)

- Documentation Wrong and no worked Data binding on IE11 [\#1067](https://github.com/Polymer/polymer/issues/1067)

- How to replace tag name depend on attribute? [\#1064](https://github.com/Polymer/polymer/issues/1064)

- DataBinding not full work in IE \(polymer-0.5.2\) [\#1063](https://github.com/Polymer/polymer/issues/1063)

- Template references in SVG not working [\#1061](https://github.com/Polymer/polymer/issues/1061)

- Docs examples missing custom element name [\#1058](https://github.com/Polymer/polymer/issues/1058)

- :host styles not rendering [\#1057](https://github.com/Polymer/polymer/issues/1057)

- Redraw menu list [\#1054](https://github.com/Polymer/polymer/issues/1054)

- fire message to other element [\#1045](https://github.com/Polymer/polymer/issues/1045)

- img width 100% event [\#1044](https://github.com/Polymer/polymer/issues/1044)

- Typo [\#1041](https://github.com/Polymer/polymer/issues/1041)

- Please hire a competent technical writer [\#1036](https://github.com/Polymer/polymer/issues/1036)

- Chrome: Faulty responsiveness if window size is instantly changed [\#1034](https://github.com/Polymer/polymer/issues/1034)

- Polymer in 10 minutes - horizontal scroll bar doesn't work in chrome [\#1030](https://github.com/Polymer/polymer/issues/1030)

- Arguments in the function expressions are not watched - binding fails [\#1021](https://github.com/Polymer/polymer/issues/1021)

- core-selector doesn't work on FF/linux for core\_elements \>= 5.0 [\#1015](https://github.com/Polymer/polymer/issues/1015)

- Missing web-animations-next-lite.min.js [\#1014](https://github.com/Polymer/polymer/issues/1014)

- webcomponents.js doesn't work [\#1013](https://github.com/Polymer/polymer/issues/1013)

- The main page and demos doesn't work on Firefox!!!! [\#1007](https://github.com/Polymer/polymer/issues/1007)

- Remember scroll position of selected page and prevent auto scrolling when selecting a other page. [\#1000](https://github.com/Polymer/polymer/issues/1000)

- No field view on iOS 8 [\#986](https://github.com/Polymer/polymer/issues/986)

- \<meta name="layout" content="polymer or some other layout2"\> [\#959](https://github.com/Polymer/polymer/issues/959)

- Stoped to render on firefox after .35 update \(trying to fix jquery conflict\) [\#697](https://github.com/Polymer/polymer/issues/697)

- on-click doesn't work with bootstrap and jQuery [\#625](https://github.com/Polymer/polymer/issues/625)

**Merged pull requests:**

- Adjust to the new unit test layout [\#1093](https://github.com/Polymer/polymer/pull/1093) ([nevir](https://github.com/nevir))

- Make `ready` independent of attached state and make distribution go top-down logically and composition unwind bottom-up [\#1039](https://github.com/Polymer/polymer/pull/1039) ([sorvell](https://github.com/sorvell))

- 0.8 simplex [\#1028](https://github.com/Polymer/polymer/pull/1028) ([sorvell](https://github.com/sorvell))

- Expands the `\<content\>` element to remember logical DOM [\#1017](https://github.com/Polymer/polymer/pull/1017) ([jmesserly](https://github.com/jmesserly))

## [0.5.2](https://github.com/Polymer/polymer/tree/0.5.2) (2014-12-11)

**Closed issues:**

- Best\(?\) practice for loading & saving relational data [\#1008](https://github.com/Polymer/polymer/issues/1008)

- the demos don't work in  Chrome and Opera [\#1006](https://github.com/Polymer/polymer/issues/1006)

- one click triggers two  popup of paper-dropdown-menu [\#1004](https://github.com/Polymer/polymer/issues/1004)

- polymer-project.org bad link [\#1003](https://github.com/Polymer/polymer/issues/1003)

- \[Firefox\] \[Regression 0.4.2 -\> 0.5.0\] `on-tap` event not catched [\#997](https://github.com/Polymer/polymer/issues/997)

- In Q&A, answer about hosting for tests is misleading [\#994](https://github.com/Polymer/polymer/issues/994)

- core-overlay not working on firefox 34 [\#993](https://github.com/Polymer/polymer/issues/993)

- Circular dependency between core-iconset and core-icon bower modules [\#992](https://github.com/Polymer/polymer/issues/992)

- www.polymer-project.org unusable in firefox [\#991](https://github.com/Polymer/polymer/issues/991)

- \<core-tooltip\> and paper-fab don't like each other. [\#988](https://github.com/Polymer/polymer/issues/988)

- Weird bug in Firefox and Safari [\#984](https://github.com/Polymer/polymer/issues/984)

- Polymer 0.5.0 for iOS 8 Console reports ReferenceError: Can't find variable: logFlags [\#981](https://github.com/Polymer/polymer/issues/981)

- 404 Documentation Link [\#977](https://github.com/Polymer/polymer/issues/977)

- scrolling over a paper-input-decorator using a touch device selects that input making it nearly impossible to scroll over paper-input fields on a mobile device [\#973](https://github.com/Polymer/polymer/issues/973)

- core-item ignores clicks on polymer-project.org in Firefox [\#968](https://github.com/Polymer/polymer/issues/968)

- https://www.polymer-project.org/platform/custom-elements.html has a 404 for the "Shadow dom" button [\#967](https://github.com/Polymer/polymer/issues/967)

- ZIP download missing minified webcomponents.js [\#965](https://github.com/Polymer/polymer/issues/965)

- Unable to get on-core-select to fire in paper-dropdown-menu [\#957](https://github.com/Polymer/polymer/issues/957)

- 0.5.1 Element Name could not be inferred | Safari && Mobile Safari [\#956](https://github.com/Polymer/polymer/issues/956)

- url relative path ../  not works for cross domain  link import [\#955](https://github.com/Polymer/polymer/issues/955)

- url relative path ../  not works for cross domain  link import [\#954](https://github.com/Polymer/polymer/issues/954)

- Can't get a \<core-menu-button\> component in \<core-toolbar\> to show child nodes [\#951](https://github.com/Polymer/polymer/issues/951)

- paper-autogrow text not in bower update [\#949](https://github.com/Polymer/polymer/issues/949)

- Need info how to test polymer elements using Selenium. [\#948](https://github.com/Polymer/polymer/issues/948)

- "horizontal layout wrap" broken in fireFox [\#945](https://github.com/Polymer/polymer/issues/945)

- Zip file is empty upon download [\#943](https://github.com/Polymer/polymer/issues/943)

- on-tap not working on Firefox [\#941](https://github.com/Polymer/polymer/issues/941)

- \[Question\] Using Polymer for progressive enhancement [\#940](https://github.com/Polymer/polymer/issues/940)

- Buttons not working after vulcanize [\#935](https://github.com/Polymer/polymer/issues/935)

- Dropdown Resizing [\#930](https://github.com/Polymer/polymer/issues/930)

- demo content [\#929](https://github.com/Polymer/polymer/issues/929)

- https://www.polymer-project.org/components/web-component-tester/browser.js not found [\#928](https://github.com/Polymer/polymer/issues/928)

- web-animations.html missing from web-animations-next - \(Polymer 0.5.1\) [\#923](https://github.com/Polymer/polymer/issues/923)

- Paper Menu button page on Polymer website shows example for paper dropdown menu not paper menu button [\#922](https://github.com/Polymer/polymer/issues/922)

- Click handlers don't work anymore on iOS with 0.5.0 [\#918](https://github.com/Polymer/polymer/issues/918)

- paper-dropdown-menu not working correctly or documentation needs update.  [\#911](https://github.com/Polymer/polymer/issues/911)

- Add API for communicating hide/show/resize from parents to interested children [\#849](https://github.com/Polymer/polymer/issues/849)

- bower install on yosemite [\#808](https://github.com/Polymer/polymer/issues/808)

- Two finger touch events - not working [\#802](https://github.com/Polymer/polymer/issues/802)

- Create a core-label, associate a label with a child focusable control [\#793](https://github.com/Polymer/polymer/issues/793)

- Not possible to stay on older version \(0.3.5\) [\#758](https://github.com/Polymer/polymer/issues/758)

**Merged pull requests:**

- 0.8 miceplay [\#1012](https://github.com/Polymer/polymer/pull/1012) ([kevinpschaaf](https://github.com/kevinpschaaf))

- Spelling correction. [\#996](https://github.com/Polymer/polymer/pull/996) ([germ13](https://github.com/germ13))

- Use possessive "its" [\#970](https://github.com/Polymer/polymer/pull/970) ([BrianGeppert](https://github.com/BrianGeppert))

- README update [\#927](https://github.com/Polymer/polymer/pull/927) ([rottina](https://github.com/rottina))

## [0.5.1](https://github.com/Polymer/polymer/tree/0.5.1) (2014-11-12)

**Closed issues:**

- Bug on site [\#920](https://github.com/Polymer/polymer/issues/920)

- href in my element not working on iOS [\#919](https://github.com/Polymer/polymer/issues/919)

- \[Polymer\#0.5.0\]\[Safari\] TypeError: undefined is not an object \(evaluating 'HTMLImports.path.resolveUrlsInStyle'\) \(url.js line 199\) [\#915](https://github.com/Polymer/polymer/issues/915)

- \[Polymer\#0.5.0\]\[Firefox\] TypeError: HTMLImports.path is undefined \(platform.js line 14\)  [\#914](https://github.com/Polymer/polymer/issues/914)

- \[Polymer\#0.5.0\]\[Chrome\] Uncaught TypeError: Cannot read property 'parse' of undefined \(boot.js line 14\) [\#913](https://github.com/Polymer/polymer/issues/913)

- web-animations-next/web-animations.html file missing [\#909](https://github.com/Polymer/polymer/issues/909)

- No release notes for 0.5.0 [\#908](https://github.com/Polymer/polymer/issues/908)

- Back button navigation sometimes broken on polymer-project website [\#907](https://github.com/Polymer/polymer/issues/907)

- Designer Tool page appears blank [\#906](https://github.com/Polymer/polymer/issues/906)

- Polymer is undefined in IE11 [\#905](https://github.com/Polymer/polymer/issues/905)

- Using polymer with Jinja2 server side templating [\#904](https://github.com/Polymer/polymer/issues/904)

- ERR\_CONNECTION\_CLOSED trying to visit blog.polymer-project.org [\#894](https://github.com/Polymer/polymer/issues/894)

- Consider not dirty check polling when the tab is not visible [\#892](https://github.com/Polymer/polymer/issues/892)

## [0.5.0](https://github.com/Polymer/polymer/tree/0.5.0) (2014-11-10)

**Fixed bugs:**

- Links to "\#" get rewritten to just "" which causes a refresh if clicked [\#672](https://github.com/Polymer/polymer/issues/672)

**Closed issues:**

- Incorrect behaviour for disabled fields with Polymer paper-input-decorator [\#901](https://github.com/Polymer/polymer/issues/901)

- Ajax responseChanged return logged twice [\#900](https://github.com/Polymer/polymer/issues/900)

- behavior difference between \<my-component/\> and \<my-component\>\</my-component\> [\#899](https://github.com/Polymer/polymer/issues/899)

- on-tap does not cause paper-input value to be committed [\#890](https://github.com/Polymer/polymer/issues/890)

- \<paper-item\> has 'iconSrc' attribute, should be 'src' like \<paper-fab\>, \<paper-icon-button\> and \<paper-menu-button\> [\#889](https://github.com/Polymer/polymer/issues/889)

- paper-input documentation lacks details on field validation [\#888](https://github.com/Polymer/polymer/issues/888)

- paper-input documentation inconsistently suggests theming via JS properties [\#887](https://github.com/Polymer/polymer/issues/887)

- paper-input documentation suggests html /deep/ selectors, inconsistent with other elements [\#886](https://github.com/Polymer/polymer/issues/886)

- paper-input cursor doesn't seem to support theming [\#885](https://github.com/Polymer/polymer/issues/885)

- paper-input styling instructions lack the ::shadow pseudo-element [\#884](https://github.com/Polymer/polymer/issues/884)

- paper-dropdown-menu: selectedProperty doesn't seem to work [\#881](https://github.com/Polymer/polymer/issues/881)

- Add support for native ES6 class Symbol [\#880](https://github.com/Polymer/polymer/issues/880)

- demo page fails https://www.polymer-project.org/components/core-ajax/demo.html [\#838](https://github.com/Polymer/polymer/issues/838)

- core-icon-button does but paper-icon-button does not load core-iconset-svg [\#834](https://github.com/Polymer/polymer/issues/834)

- paper-fab button href bad [\#830](https://github.com/Polymer/polymer/issues/830)

- Documentation error on core-animation [\#828](https://github.com/Polymer/polymer/issues/828)

- Data-binding within component inside template style [\#827](https://github.com/Polymer/polymer/issues/827)

- Can't scroll using mouse or keyboard [\#817](https://github.com/Polymer/polymer/issues/817)

- On-tap sends event twice on touch device [\#814](https://github.com/Polymer/polymer/issues/814)

- paper-button  raised attribute does not work properly when set programmatically [\#812](https://github.com/Polymer/polymer/issues/812)

- Trying to import core-ajax I get an appendChild on \#document error [\#810](https://github.com/Polymer/polymer/issues/810)

- core-ajax demo not working [\#807](https://github.com/Polymer/polymer/issues/807)

- Disabled on Switch is not working [\#806](https://github.com/Polymer/polymer/issues/806)

- core-dropdown 0.4.2 not working [\#804](https://github.com/Polymer/polymer/issues/804)

- paper-button has wrong documentation [\#801](https://github.com/Polymer/polymer/issues/801)

- Importing Polymer fails, cannot find WebComponents [\#797](https://github.com/Polymer/polymer/issues/797)

- Link Tooling information  is down [\#792](https://github.com/Polymer/polymer/issues/792)

- Can't set the background color of paper-progress from javascript [\#787](https://github.com/Polymer/polymer/issues/787)

- Element stops working if taken off the DOM and put back in [\#782](https://github.com/Polymer/polymer/issues/782)

- paper drop down list showing in middle of screen first time. [\#776](https://github.com/Polymer/polymer/issues/776)

- Template repeat index value is evaluated only after loop end [\#774](https://github.com/Polymer/polymer/issues/774)

- Polymer + Cordova + PhoneGap + iOS = Very Laggy / Slow? [\#773](https://github.com/Polymer/polymer/issues/773)

- Repository error [\#767](https://github.com/Polymer/polymer/issues/767)

- problem accessing polymer properties from content script [\#753](https://github.com/Polymer/polymer/issues/753)

- Polymer as UI only [\#752](https://github.com/Polymer/polymer/issues/752)

**Merged pull requests:**

- add space between "go" and "to" [\#778](https://github.com/Polymer/polymer/pull/778) ([jodytate](https://github.com/jodytate))

- Create a basic jsdoc externs file for Polymer [\#769](https://github.com/Polymer/polymer/pull/769) ([rictic](https://github.com/rictic))

## [0.4.2](https://github.com/Polymer/polymer/tree/0.4.2) (2014-10-02)

**Closed issues:**

- 'Flexible children' example doesn't work. [\#772](https://github.com/Polymer/polymer/issues/772)

- Google Drive Element Error in IE [\#771](https://github.com/Polymer/polymer/issues/771)

- doesn't work in a zip file [\#766](https://github.com/Polymer/polymer/issues/766)

- Paper-Dialog on page load doesnt work in firefox. [\#761](https://github.com/Polymer/polymer/issues/761)

- Extending input not working in Chromium 37.0.2062.94 Ubuntu 14.10 \(290621\) \(64-bit\) [\#754](https://github.com/Polymer/polymer/issues/754)

- core-list scroll [\#748](https://github.com/Polymer/polymer/issues/748)

- Topeka responsiveness  [\#708](https://github.com/Polymer/polymer/issues/708)

- Chrome - animation glitch [\#593](https://github.com/Polymer/polymer/issues/593)

## [0.3.6](https://github.com/Polymer/polymer/tree/0.3.6) (2014-09-18)

## [0.4.1](https://github.com/Polymer/polymer/tree/0.4.1) (2014-09-18)

**Implemented enhancements:**

- Feature request: testing whether a custom element extends a certain type [\#380](https://github.com/Polymer/polymer/issues/380)

**Fixed bugs:**

- Elements failing `instanceof` after WebComponentsReady [\#402](https://github.com/Polymer/polymer/issues/402)

**Closed issues:**

- OSX Yosemite [\#750](https://github.com/Polymer/polymer/issues/750)

- File structure not the same, when using bower [\#747](https://github.com/Polymer/polymer/issues/747)

- Closing the overlay resets the position to center of window [\#746](https://github.com/Polymer/polymer/issues/746)

- noscript breaks inheritance [\#740](https://github.com/Polymer/polymer/issues/740)

- In age-slider example, using space in name results in truncated name [\#739](https://github.com/Polymer/polymer/issues/739)

- Improve documentation for core-icon when using custom icon sets [\#738](https://github.com/Polymer/polymer/issues/738)

- Broken Link in Docs/CreatingElements/AddPropertiesAndMethods [\#737](https://github.com/Polymer/polymer/issues/737)

- Miss placing script element inside a polymer element lead to miss leading error message [\#736](https://github.com/Polymer/polymer/issues/736)

- Not a BUG - FYI: Update tutorial - core-icon-button [\#730](https://github.com/Polymer/polymer/issues/730)

- FormData wrapper breaks XMLHttpRequest\#send\(FormData\) in Firefox [\#725](https://github.com/Polymer/polymer/issues/725)

- Tap event does not fire for SVG elements anymore [\#722](https://github.com/Polymer/polymer/issues/722)

- Computed property can't be data-bound from outside [\#638](https://github.com/Polymer/polymer/issues/638)

- IE issues [\#592](https://github.com/Polymer/polymer/issues/592)

- ShadowDOM renderer invalidated after insertion-point distribution [\#512](https://github.com/Polymer/polymer/issues/512)

- Content inside `\<template\>` breaks extending `\<body\>` element. [\#421](https://github.com/Polymer/polymer/issues/421)

## [0.4.0](https://github.com/Polymer/polymer/tree/0.4.0) (2014-08-28)

**Implemented enhancements:**

- Use the John Resig inheritance to define the component prototype [\#647](https://github.com/Polymer/polymer/issues/647)

- on-\* expression support [\#446](https://github.com/Polymer/polymer/issues/446)

- add component-laid-out lifecycle callback [\#434](https://github.com/Polymer/polymer/issues/434)

- Allow creating \<polymer-element\>s without Shadow DOM [\#222](https://github.com/Polymer/polymer/issues/222)

- Consider adding support for loading user selectable css resources per element [\#219](https://github.com/Polymer/polymer/issues/219)

- Provide a provide a way to instantiate the template directly into the element [\#157](https://github.com/Polymer/polymer/issues/157)

- Consider deserializing to Date from attributes, if property is Date-valued [\#119](https://github.com/Polymer/polymer/issues/119)

**Fixed bugs:**

- polymer-body double fire `ready`/`created`/`attached` [\#447](https://github.com/Polymer/polymer/issues/447)

- Polymer's controller-styles system doesn't work well with ShadowDOMPolyfill [\#224](https://github.com/Polymer/polymer/issues/224)

- Globals clobbering other globals [\#185](https://github.com/Polymer/polymer/issues/185)

- `bind` boilerplate base is inflexible [\#179](https://github.com/Polymer/polymer/issues/179)

**Closed issues:**

- Possible shared state on core elements. [\#731](https://github.com/Polymer/polymer/issues/731)

- paper-input element doesn't show keyboard on Firefox OS 2.0 [\#727](https://github.com/Polymer/polymer/issues/727)

- designerr on polymer page lacks demo'd functioniality from youtube quickstart. [\#726](https://github.com/Polymer/polymer/issues/726)

- PhantomJS Support [\#724](https://github.com/Polymer/polymer/issues/724)

- http://www.polymer-project.org/platform/web-animations.html [\#721](https://github.com/Polymer/polymer/issues/721)

- Polymer site appears broken on Safari 8 [\#719](https://github.com/Polymer/polymer/issues/719)

- Non ASCII strings set in JavaScript show up as ? in Firefox [\#717](https://github.com/Polymer/polymer/issues/717)

- Materials page in Polymer is not rendering correctly [\#716](https://github.com/Polymer/polymer/issues/716)

- Polymer elements not rendering in Android 4.1.2 and 4.2.1. Works on 4.4.2 [\#714](https://github.com/Polymer/polymer/issues/714)

- Bower private packages & stats [\#711](https://github.com/Polymer/polymer/issues/711)

- Step-4 of tutorial code for post-card Polymer prototype does not use element name [\#710](https://github.com/Polymer/polymer/issues/710)

- Polymer does absolutely nothing if you have an "undeclared" element [\#709](https://github.com/Polymer/polymer/issues/709)

- Syntax error in example bower.json [\#707](https://github.com/Polymer/polymer/issues/707)

- Semver not being followed correctly [\#704](https://github.com/Polymer/polymer/issues/704)

- Safari bug when rendering a table using nested loops [\#700](https://github.com/Polymer/polymer/issues/700)

- Clicking on Paper Tab execute twice [\#696](https://github.com/Polymer/polymer/issues/696)

- div with tool attribute does not allow flex for div within  [\#695](https://github.com/Polymer/polymer/issues/695)

- it keeps resetting [\#694](https://github.com/Polymer/polymer/issues/694)

- Handlers disappearing when you hide the template [\#690](https://github.com/Polymer/polymer/issues/690)

- on-change event triggered twice [\#687](https://github.com/Polymer/polymer/issues/687)

- Consider making core-component-page a devDependency [\#683](https://github.com/Polymer/polymer/issues/683)

- custom nodes within svg aren't created [\#681](https://github.com/Polymer/polymer/issues/681)

- App not rendering on IE and Firefox [\#668](https://github.com/Polymer/polymer/issues/668)

- Clarification on the modularity of Polymer within external web component scripts: Is Polymer designed in a way to export it as a \(commonjs\) module? [\#666](https://github.com/Polymer/polymer/issues/666)

- Future Support for Installing Polymer through Chocolatey package manager [\#657](https://github.com/Polymer/polymer/issues/657)

- RangeError: Maximum call stack size exceeded. On Safari 7.0.5 [\#656](https://github.com/Polymer/polymer/issues/656)

- transform-style: preserve-3d causing odd stutter on hover of custom element [\#652](https://github.com/Polymer/polymer/issues/652)

- fire should only check for null and undefined. [\#646](https://github.com/Polymer/polymer/issues/646)

- 'target' field in 'event' argument passed into callback function for click/pointer events refers to first element instantiated [\#641](https://github.com/Polymer/polymer/issues/641)

- document.querySelectorAll sluggish on Firefox \(v30\) for large DOM [\#629](https://github.com/Polymer/polymer/issues/629)

- TemplateBinding should warn/console log about using bind with references. [\#615](https://github.com/Polymer/polymer/issues/615)

- platform fails to load [\#606](https://github.com/Polymer/polymer/issues/606)

- Can't keyboard nav around a custom element in a div that has contenteditable="true" [\#601](https://github.com/Polymer/polymer/issues/601)

- Polymer doesn't appear to work at all under iOS 8 beta 2 [\#591](https://github.com/Polymer/polymer/issues/591)

- Resources not loading in http://www.polymer-project.org/tools/designer/ [\#585](https://github.com/Polymer/polymer/issues/585)

- Unable to extend iframe [\#580](https://github.com/Polymer/polymer/issues/580)

- Custom element that performs dynamic HTML Import gets corrupted offsetWidth when used inside \<template\> [\#554](https://github.com/Polymer/polymer/issues/554)

- Wrap as UMD - Do not force window global [\#534](https://github.com/Polymer/polymer/issues/534)

- Difference in inherited styles between Chrome & other browsers [\#531](https://github.com/Polymer/polymer/issues/531)

- Problem during bower install [\#529](https://github.com/Polymer/polymer/issues/529)

- Adding method `childrenChanged` crashes Firefox/Safari [\#528](https://github.com/Polymer/polymer/issues/528)

- fire and asyncFire need return values [\#527](https://github.com/Polymer/polymer/issues/527)

- Errors in Safari 7 with Polymer 0.3.1 [\#523](https://github.com/Polymer/polymer/issues/523)

- Polymer not working in elementary OS [\#520](https://github.com/Polymer/polymer/issues/520)

- Two way binding with Html attribute [\#519](https://github.com/Polymer/polymer/issues/519)

- Polyfills crashing jsbin [\#517](https://github.com/Polymer/polymer/issues/517)

- Polymer breaks dependency resolution with query strings [\#513](https://github.com/Polymer/polymer/issues/513)

- binding to a builtin name fails cryptically [\#510](https://github.com/Polymer/polymer/issues/510)

- Content of nested template is empty [\#500](https://github.com/Polymer/polymer/issues/500)

- Extending Vanilla JS Custom Element with polymer-element [\#496](https://github.com/Polymer/polymer/issues/496)

- Trouble in latest Canary reading styles in attached handler of imported element [\#493](https://github.com/Polymer/polymer/issues/493)

- Keyboard Support [\#473](https://github.com/Polymer/polymer/issues/473)

- HTML Imports polyfill is missing the .import property [\#471](https://github.com/Polymer/polymer/issues/471)

- Pseudo-classes in \<content\> select attribute [\#470](https://github.com/Polymer/polymer/issues/470)

- Using a keyword in attribute name causes error in IE11 [\#466](https://github.com/Polymer/polymer/issues/466)

- Error - Uncaught Possible attempt to load Polymer twice  [\#464](https://github.com/Polymer/polymer/issues/464)

- Get full list of polymer-elements. [\#460](https://github.com/Polymer/polymer/issues/460)

- document.registerElement raises error "Options missing required prototype property" [\#455](https://github.com/Polymer/polymer/issues/455)

- Exception when updating inner child element attributes from an object property in a repeat [\#454](https://github.com/Polymer/polymer/issues/454)

- Double quotes don't work in polyfill-next-selector content [\#453](https://github.com/Polymer/polymer/issues/453)

- title attribute cause issue in firefox [\#451](https://github.com/Polymer/polymer/issues/451)

- template bind="x as y" doesn't work on safari [\#450](https://github.com/Polymer/polymer/issues/450)

- Generating an observe block in created or ready doesn't bind [\#448](https://github.com/Polymer/polymer/issues/448)

- \<polymer-ui-accordion\> doesn't always work with Shadow DOM polyfill [\#444](https://github.com/Polymer/polymer/issues/444)

- Polymer breaks `instanceof` for native elements. [\#424](https://github.com/Polymer/polymer/issues/424)

- Add @license tag [\#413](https://github.com/Polymer/polymer/issues/413)

- Can't turn body into custom element via is="..." [\#409](https://github.com/Polymer/polymer/issues/409)

- bindProperties logger call refers to nonexistent variables [\#406](https://github.com/Polymer/polymer/issues/406)

- Polymer fails to render elements when query string contains a slash [\#401](https://github.com/Polymer/polymer/issues/401)

- Using native CustomElements and ShadowDOM polyfill together may cause unwanted attached/detached callbacks being called [\#399](https://github.com/Polymer/polymer/issues/399)

- Variable picked by `constructor` attribute is set after upgrade events. [\#398](https://github.com/Polymer/polymer/issues/398)

- Exception when invoking super from ready when the node is created by \<template repeat\> [\#397](https://github.com/Polymer/polymer/issues/397)

- automatic node finding within a template-if [\#387](https://github.com/Polymer/polymer/issues/387)

- Challenges of building a menu system in Polymer [\#382](https://github.com/Polymer/polymer/issues/382)

- XSS Vulnerability [\#375](https://github.com/Polymer/polymer/issues/375)

- Publishing an attribute named 'disabled' generates exception in IE10 [\#372](https://github.com/Polymer/polymer/issues/372)

- template if expression, trailing blanks should be ignored [\#370](https://github.com/Polymer/polymer/issues/370)

- processing bindings in a specific order [\#368](https://github.com/Polymer/polymer/issues/368)

- AngularJS incompatibility: need to unwrap elements when jqLite.data\(\) is used [\#363](https://github.com/Polymer/polymer/issues/363)

- Polymer makes getScreenCTM\(\) crash [\#351](https://github.com/Polymer/polymer/issues/351)

- Sorting an array can result in an \*Changed method firing [\#350](https://github.com/Polymer/polymer/issues/350)

- Reentrancy question: reflectPropertyToAttribute can trigger unwanted attributedChanged effects [\#349](https://github.com/Polymer/polymer/issues/349)

- ShadowDOMPolyfill is way, way too intrusive!  [\#346](https://github.com/Polymer/polymer/issues/346)

- Separate out platform.js from polymer core [\#344](https://github.com/Polymer/polymer/issues/344)

- Attribute values should be copied to property values before `created` [\#342](https://github.com/Polymer/polymer/issues/342)

- custom event handler matching is case sensitive [\#340](https://github.com/Polymer/polymer/issues/340)

- Fragments in links get rewritten to point to directory of import [\#339](https://github.com/Polymer/polymer/issues/339)

- Address polymer-elements that take child elements [\#337](https://github.com/Polymer/polymer/issues/337)

- Declarative event discovery on custom elements [\#336](https://github.com/Polymer/polymer/issues/336)

- test-button element class with extends="button" can't be instantiated with \<test-button\> syntax [\#334](https://github.com/Polymer/polymer/issues/334)

- Page rendering issue - navigation [\#333](https://github.com/Polymer/polymer/issues/333)

- Cannot modify a template's contents while it is stamping [\#330](https://github.com/Polymer/polymer/issues/330)

- Publish sub-projects on npm, add them to package.json. [\#326](https://github.com/Polymer/polymer/issues/326)

- stack: "TypeError: Object \#\<Object\> has no method 'getAttr [\#325](https://github.com/Polymer/polymer/issues/325)

- Support angular/django style filters [\#323](https://github.com/Polymer/polymer/issues/323)

- createElement-wrapped \<img\> throws TypeError on \<canvas\> drawImage [\#316](https://github.com/Polymer/polymer/issues/316)

- Databinding breaks after removing and reattaching an element to the DOM [\#311](https://github.com/Polymer/polymer/issues/311)

- Ensure {{}} are removed after binding [\#304](https://github.com/Polymer/polymer/issues/304)

- Getting started instructions incomplete: no polymer.min.js  [\#300](https://github.com/Polymer/polymer/issues/300)

- Site is not showing properly in IE11 [\#299](https://github.com/Polymer/polymer/issues/299)

- Prevent event bubbling in polyfill [\#296](https://github.com/Polymer/polymer/issues/296)

- Prevent duplicate ID's in polyfill [\#295](https://github.com/Polymer/polymer/issues/295)

- remove use of deprecated cancelBubble? [\#292](https://github.com/Polymer/polymer/issues/292)

- Polymer throws error in Canary when registering an element via import [\#290](https://github.com/Polymer/polymer/issues/290)

- Type Convert Error when work with canvas [\#288](https://github.com/Polymer/polymer/issues/288)

- DOM Spec Input - Virtual MutationRecords [\#281](https://github.com/Polymer/polymer/issues/281)

- polymer animation not support ios [\#279](https://github.com/Polymer/polymer/issues/279)

- Event.cancelBubble cannot be used for stopping event propagation in Polymer [\#275](https://github.com/Polymer/polymer/issues/275)

- Consider removing controllerStyles and requiring explicitly adding stylesheets [\#272](https://github.com/Polymer/polymer/issues/272)

- Write up suggestions on dealing with performance [\#269](https://github.com/Polymer/polymer/issues/269)

- improve on-\* delegation by introducing control for Polymer-bubbling \(as distinct from DOM bubbling\) [\#259](https://github.com/Polymer/polymer/issues/259)

- Consider issuing a warning when a polymer-element's shadowRoot contains un-upgraded custom elements [\#258](https://github.com/Polymer/polymer/issues/258)

- on-tap doesn't fire all the time that on-click does [\#255](https://github.com/Polymer/polymer/issues/255)

- Chrome Packaged App: including the UI elements is not convenient [\#248](https://github.com/Polymer/polymer/issues/248)

- Polymer doesn't work on Iceweasel web browser [\#247](https://github.com/Polymer/polymer/issues/247)

- It's confusing that you need to nest a \<template repeat\> inside an outermost \<template\>. [\#245](https://github.com/Polymer/polymer/issues/245)

- http://www.polymer-project.org/tooling-strategy.html is a bit spare [\#244](https://github.com/Polymer/polymer/issues/244)

- documentation for attributeChanged is wrong [\#242](https://github.com/Polymer/polymer/issues/242)

- Using scoped models impacts 2-way property binding [\#220](https://github.com/Polymer/polymer/issues/220)

- loader seems to fail at random, but frequently when serving from localhost [\#218](https://github.com/Polymer/polymer/issues/218)

- Cloned attributes should not override user attributes in markup [\#190](https://github.com/Polymer/polymer/issues/190)

- Sugaring dynamics in ShadowDOM [\#176](https://github.com/Polymer/polymer/issues/176)

- Asynchronous attribute declaration [\#160](https://github.com/Polymer/polymer/issues/160)

- Consider adding broadcast [\#145](https://github.com/Polymer/polymer/issues/145)

- explore performance impact of import-order of components [\#108](https://github.com/Polymer/polymer/issues/108)

- title attribute [\#97](https://github.com/Polymer/polymer/issues/97)

- Write doc about attributes and type inference when applying to properties [\#93](https://github.com/Polymer/polymer/issues/93)

- Confusing cancelBubble  [\#74](https://github.com/Polymer/polymer/issues/74)

## [0.3.5](https://github.com/Polymer/polymer/tree/0.3.5) (2014-08-08)

**Closed issues:**

- Internet explorer is not binding inside \<select\> tag [\#692](https://github.com/Polymer/polymer/issues/692)

- \<core-collapse\> syntax issue. [\#689](https://github.com/Polymer/polymer/issues/689)

- TemplateBinding.js Uncaught HierarchyRequestError [\#688](https://github.com/Polymer/polymer/issues/688)

- TypeError: Argument 1 of Window.getDefaultComputedStyle does not implement interface Element [\#686](https://github.com/Polymer/polymer/issues/686)

- Not working in Safari - Window [\#682](https://github.com/Polymer/polymer/issues/682)

- Polymer should respect XHTML syntax [\#680](https://github.com/Polymer/polymer/issues/680)

- polymer design tool issue [\#679](https://github.com/Polymer/polymer/issues/679)

- Incomplete zip files. [\#676](https://github.com/Polymer/polymer/issues/676)

- Polymer Designer always deletes everything [\#674](https://github.com/Polymer/polymer/issues/674)

- Wrong import path on Designer Preview when importing polymer.html [\#670](https://github.com/Polymer/polymer/issues/670)

- error 404 on core-transition demo page  [\#669](https://github.com/Polymer/polymer/issues/669)

- Polymer site is not reachable. [\#667](https://github.com/Polymer/polymer/issues/667)

- TypeError and NetworkError when starting the designer tool from the url [\#665](https://github.com/Polymer/polymer/issues/665)

- Scroll disappearing on Polymer Website [\#661](https://github.com/Polymer/polymer/issues/661)

- paper-menu-button is not responsive [\#660](https://github.com/Polymer/polymer/issues/660)

- Core-drawer-panel hardcoded drawer width [\#659](https://github.com/Polymer/polymer/issues/659)

- the BSD license link at the bottom of http://www.polymer-project.org/ is a 404 [\#655](https://github.com/Polymer/polymer/issues/655)

- Polymer breaks URL [\#653](https://github.com/Polymer/polymer/issues/653)

- Cannot install polymer 0.3.4 [\#643](https://github.com/Polymer/polymer/issues/643)

- Polymer breaks KnockoutJS outside of Chrome [\#640](https://github.com/Polymer/polymer/issues/640)

- Paper button keeps flashing [\#639](https://github.com/Polymer/polymer/issues/639)

- \<core-style\> should use an element that parses in plain text mode [\#637](https://github.com/Polymer/polymer/issues/637)

- "Assertion Failed" unwrapping event [\#636](https://github.com/Polymer/polymer/issues/636)

- Rating Slider Knob goes outside boundaries [\#635](https://github.com/Polymer/polymer/issues/635)

- typo on http://www.polymer-project.org/docs/elements/paper-elements.html\#paper-menu-button [\#632](https://github.com/Polymer/polymer/issues/632)

- core-list is inefficient in data initialization [\#631](https://github.com/Polymer/polymer/issues/631)

- Closing tags with /\> leads to ignored shadow DOM content [\#628](https://github.com/Polymer/polymer/issues/628)

- Paper Elements use inline scripts =\> violate Chrome packaged app CSP rules [\#613](https://github.com/Polymer/polymer/issues/613)

- paper-tab::shadow \#ink glitches when click is held [\#611](https://github.com/Polymer/polymer/issues/611)

- Core-toolbar breaking material design speck [\#605](https://github.com/Polymer/polymer/issues/605)

- \<input list="x"\>\<datalist id="x"\> as a component used within another component [\#600](https://github.com/Polymer/polymer/issues/600)

- core-scroll-header-panel won't hide navigation bar on Android \(stable and beta\) [\#569](https://github.com/Polymer/polymer/issues/569)

- Scroll Header Panel flowing over panel scroll bar [\#555](https://github.com/Polymer/polymer/issues/555)

- Drawer Panel is not working. [\#550](https://github.com/Polymer/polymer/issues/550)

- Polymer 0.2.2 polymer-animation-group.js logs error to console [\#463](https://github.com/Polymer/polymer/issues/463)

- polymer-ui-scaffold and polymer-ui-nav-arrow [\#343](https://github.com/Polymer/polymer/issues/343)

- Better error when creating an element without a hyphenated name [\#303](https://github.com/Polymer/polymer/issues/303)

- polymer-ajax fails silently when json is not valid json [\#257](https://github.com/Polymer/polymer/issues/257)

## [0.3.4](https://github.com/Polymer/polymer/tree/0.3.4) (2014-07-11)

**Fixed bugs:**

- FormData.constructor fails when passed HTMLFormElement in Firefox [\#587](https://github.com/Polymer/polymer/issues/587)

**Closed issues:**

- Paper component focusable demo missing [\#624](https://github.com/Polymer/polymer/issues/624)

- Step 1 of Tutorial incomplete [\#623](https://github.com/Polymer/polymer/issues/623)

- Step-1 of tutorial instructions are missing vital CSS [\#622](https://github.com/Polymer/polymer/issues/622)

- Link on paper-tabs for paper-tab is broken [\#621](https://github.com/Polymer/polymer/issues/621)

- Wrong example in polymer tutorial [\#618](https://github.com/Polymer/polymer/issues/618)

- Please improve the Core Elements / Scaffold example [\#617](https://github.com/Polymer/polymer/issues/617)

- Polymer demos are not working in android stock browser and polymer is not working in cordova apps in JellyBean and prior versions. It is throwing "Window is not defined error in platform.js file at line number 15". [\#616](https://github.com/Polymer/polymer/issues/616)

- Chrome Packaged App: Refused to evaluate a string as JavaScript because 'unsafe-eval' [\#612](https://github.com/Polymer/polymer/issues/612)

- Broken doc in 'using core icons [\#610](https://github.com/Polymer/polymer/issues/610)

- Navigation menu error [\#609](https://github.com/Polymer/polymer/issues/609)

- IE 11 issues [\#608](https://github.com/Polymer/polymer/issues/608)

- deadlink in polymer site [\#604](https://github.com/Polymer/polymer/issues/604)

- extjs and polymerjs [\#603](https://github.com/Polymer/polymer/issues/603)

- Mistake on proto-element.html [\#602](https://github.com/Polymer/polymer/issues/602)

- paper-slider does not work properly in Safari and FireFox [\#599](https://github.com/Polymer/polymer/issues/599)

- Polymer designer color-picker has no specific color palette [\#598](https://github.com/Polymer/polymer/issues/598)

- Paper Elements Input does not work on iOS [\#596](https://github.com/Polymer/polymer/issues/596)

- Core-Transition Demo  [\#594](https://github.com/Polymer/polymer/issues/594)

- Starting a webserver in Python [\#590](https://github.com/Polymer/polymer/issues/590)

- simple style attribute bindings and styleObject filter not working in IE11 \(maybe other versions as well\) [\#589](https://github.com/Polymer/polymer/issues/589)

- Images not rendering in the demp app tutorial [\#588](https://github.com/Polymer/polymer/issues/588)

- Core-transition demo link returns 404 [\#586](https://github.com/Polymer/polymer/issues/586)

- Paper-Checkbox Animation Fix [\#584](https://github.com/Polymer/polymer/issues/584)

- Designer will not save [\#583](https://github.com/Polymer/polymer/issues/583)

- ::content polyfill for VanillaJS Templates and Custom Elements [\#582](https://github.com/Polymer/polymer/issues/582)

- core-transition-css Error: Not Found [\#581](https://github.com/Polymer/polymer/issues/581)

- Polymer Tutorial step 1 multiple core-select events [\#578](https://github.com/Polymer/polymer/issues/578)

- Material design link is broken [\#577](https://github.com/Polymer/polymer/issues/577)

- core-scroll-header-panel background missing? [\#576](https://github.com/Polymer/polymer/issues/576)

- Can't get any of the demos work?? [\#575](https://github.com/Polymer/polymer/issues/575)

- paper-elements.html not found [\#574](https://github.com/Polymer/polymer/issues/574)

- Tutorial Typo [\#572](https://github.com/Polymer/polymer/issues/572)

- tutorial step-2: missing slash on closing div tag [\#571](https://github.com/Polymer/polymer/issues/571)

- Minor Duplication: unnecessary core-icon-button declaration block to style the fill color of the favorite icon  [\#570](https://github.com/Polymer/polymer/issues/570)

- Layout Messed  [\#568](https://github.com/Polymer/polymer/issues/568)

- Chromebook [\#565](https://github.com/Polymer/polymer/issues/565)

- \[Docs\]  The "Learn" page on polymer-project.org crashes Safari Mobile [\#563](https://github.com/Polymer/polymer/issues/563)

- core-scroll-header-panel won't hide nav bar on Chrome for Android [\#562](https://github.com/Polymer/polymer/issues/562)

- Polymer flat design phonegap [\#560](https://github.com/Polymer/polymer/issues/560)

- Input examples do not work in iPad iOS 7.1.1 [\#558](https://github.com/Polymer/polymer/issues/558)

- Demo & Edit on GitHub links not working on component page [\#557](https://github.com/Polymer/polymer/issues/557)

- Download link for checkboxes is broken [\#556](https://github.com/Polymer/polymer/issues/556)

- core-slide demo not found [\#553](https://github.com/Polymer/polymer/issues/553)

- Polymer website side panel menus overlaps url: http://www.polymer-project.org/docs/start/tutorial/intro.html [\#552](https://github.com/Polymer/polymer/issues/552)

- document.querySelector containing ::shadow fails in Firefox 30 [\#551](https://github.com/Polymer/polymer/issues/551)

- docs-menu polymer-ui-menu { position: fixed; } - Mozilla Firefox 30.0 [\#549](https://github.com/Polymer/polymer/issues/549)

- Invalid Zip File [\#547](https://github.com/Polymer/polymer/issues/547)

- http://www.polymer-project.org/docs/elements/core-elements.html\#core-overlay-layer links to 404 page not found [\#546](https://github.com/Polymer/polymer/issues/546)

- Polymer docs gives wrong information [\#545](https://github.com/Polymer/polymer/issues/545)

- Can't open .zip files.. [\#544](https://github.com/Polymer/polymer/issues/544)

- \[docs tutorial\] step 3 code sample post-service closing tag [\#543](https://github.com/Polymer/polymer/issues/543)

- All of the top menu functionalities are not working [\#542](https://github.com/Polymer/polymer/issues/542)

- Sidebar menu elements are overlaid [\#541](https://github.com/Polymer/polymer/issues/541)

- Edit on GitHub Link returning 404 error [\#540](https://github.com/Polymer/polymer/issues/540)

- rendering problems with new website in FF on osx [\#539](https://github.com/Polymer/polymer/issues/539)

- \[Docs\] polymer-ui-menu on docs page doesn't seem to be displaying correctly, Chromium and Firefox [\#538](https://github.com/Polymer/polymer/issues/538)

- I think I found a mistake in the tutorial, not sure where to put it... [\#536](https://github.com/Polymer/polymer/issues/536)

- \[In Docs\] Wrong link in "Demo" button [\#535](https://github.com/Polymer/polymer/issues/535)

- I think seed-element shouldn't advise ignoring .bowerrc [\#533](https://github.com/Polymer/polymer/issues/533)

- The trouble with the now-deprecated applyAuthorStyles in Polymer Elements [\#532](https://github.com/Polymer/polymer/issues/532)

- Polymer does not display cyrillic characters correctly [\#498](https://github.com/Polymer/polymer/issues/498)

## [0.3.3](https://github.com/Polymer/polymer/tree/0.3.3) (2014-06-20)

**Closed issues:**

-  `stopPropagation\(\)` does not work for polymer events [\#530](https://github.com/Polymer/polymer/issues/530)

- bower.json missing "main" and "moduleType" [\#525](https://github.com/Polymer/polymer/issues/525)

- Published property with default value not reflected [\#509](https://github.com/Polymer/polymer/issues/509)

## [0.3.2](https://github.com/Polymer/polymer/tree/0.3.2) (2014-06-09)

**Closed issues:**

- Since 0.3.0 binding array elements doesn't work [\#526](https://github.com/Polymer/polymer/issues/526)

- minor documentation content issue [\#522](https://github.com/Polymer/polymer/issues/522)

- `\<content select=".test"\>` is not observing condition updates of child elements? [\#505](https://github.com/Polymer/polymer/issues/505)

## [0.3.1](https://github.com/Polymer/polymer/tree/0.3.1) (2014-05-30)

**Closed issues:**

- Bind to `value` on `\<input type="color"\>` [\#521](https://github.com/Polymer/polymer/issues/521)

- classList not working anymore [\#518](https://github.com/Polymer/polymer/issues/518)

## [0.3.0](https://github.com/Polymer/polymer/tree/0.3.0) (2014-05-27)

**Implemented enhancements:**

- Add Polymer.version [\#227](https://github.com/Polymer/polymer/issues/227)

**Closed issues:**

- Source Code Sandbox  - Web Components en action - Google I / O 2013 [\#516](https://github.com/Polymer/polymer/issues/516)

- Adding an event handler in an event handler can lead to infinite looping [\#511](https://github.com/Polymer/polymer/issues/511)

- Polymer alters the results of scoped queries in querySelectorAll [\#508](https://github.com/Polymer/polymer/issues/508)

- A non-body element marked "unresolved" still gets shown during boot [\#507](https://github.com/Polymer/polymer/issues/507)

- When running Parse.FacebookUtils.init Polymer raises InvalidCharacterError exception. [\#506](https://github.com/Polymer/polymer/issues/506)

- Content incorrectly rendered inside table. [\#503](https://github.com/Polymer/polymer/issues/503)

- 404 on polymer-project.org/docs/start/customelements\#elementtypes  [\#499](https://github.com/Polymer/polymer/issues/499)

- Chrome Packaged App: Refused to evaluate a string as JavaScript because 'unsafe-eval' .... [\#252](https://github.com/Polymer/polymer/issues/252)

- on-\* event delegation \(other than on host node\) does not work with non-bubbling events [\#208](https://github.com/Polymer/polymer/issues/208)

## [0.2.4](https://github.com/Polymer/polymer/tree/0.2.4) (2014-05-12)

**Closed issues:**

- Mongolian vowel separator causing exceptions. [\#495](https://github.com/Polymer/polymer/issues/495)

- Problem with root-relative URLs and the History API [\#494](https://github.com/Polymer/polymer/issues/494)

- Standalone template binding docs missing? [\#491](https://github.com/Polymer/polymer/issues/491)

- unable to use Polymer's dom mutation observer polyfill with mutation summary library [\#490](https://github.com/Polymer/polymer/issues/490)

- I guess there is a mistake in polymer documentation [\#489](https://github.com/Polymer/polymer/issues/489)

- Unclear how to bind complex data objects  to new instances of polymer-element as a passed-in attribute [\#488](https://github.com/Polymer/polymer/issues/488)

- Update expressions doc to clarify what's observed [\#486](https://github.com/Polymer/polymer/issues/486)

- on-change doesn't get triggered when change happens programmatically [\#484](https://github.com/Polymer/polymer/issues/484)

- style="color:{{person.nameColor}}" does not work in IE11 [\#483](https://github.com/Polymer/polymer/issues/483)

- Publish a property by listing it in the `attributes` fails [\#482](https://github.com/Polymer/polymer/issues/482)

- Can't get polymer 0.2.3 via bower \(now\) [\#481](https://github.com/Polymer/polymer/issues/481)

- bower out of date? [\#480](https://github.com/Polymer/polymer/issues/480)

- Crash when Polymer/Platform loaded twice [\#478](https://github.com/Polymer/polymer/issues/478)

- Can't dynamically import an element definition in Canary [\#477](https://github.com/Polymer/polymer/issues/477)

- Middle clicking results in navigation not new tab [\#472](https://github.com/Polymer/polymer/issues/472)

## [0.2.3](https://github.com/Polymer/polymer/tree/0.2.3) (2014-04-18)

**Fixed bugs:**

- Including platform.js breaks YouTube's iframe API [\#468](https://github.com/Polymer/polymer/issues/468)

**Closed issues:**

- Custom pseudo-elements cannot be targeted outside shadow dom [\#475](https://github.com/Polymer/polymer/issues/475)

- document.registerElement\('foo', {extends: undefined}\) fails [\#462](https://github.com/Polymer/polymer/issues/462)

- onBeforeUnload Event broken [\#461](https://github.com/Polymer/polymer/issues/461)

## [0.2.2](https://github.com/Polymer/polymer/tree/0.2.2) (2014-03-31)

**Implemented enhancements:**

- Consider inferring polymer-element tag name for registration [\#195](https://github.com/Polymer/polymer/issues/195)

**Closed issues:**

- Reusing css libraries through out Polymer elements [\#459](https://github.com/Polymer/polymer/issues/459)

- Meta: Shadow DOM styling renames [\#458](https://github.com/Polymer/polymer/issues/458)

- Compatibility with Angular JS - manual bootstrap fails on document.body and document.documentElement when using Platform.js  [\#457](https://github.com/Polymer/polymer/issues/457)

- Problem with data binding and custom attributes in Firefox 27, 29. [\#456](https://github.com/Polymer/polymer/issues/456)

-  addEventListener beforeunload not working [\#445](https://github.com/Polymer/polymer/issues/445)

- Having any \<link rel="stylesheet"\> makes entire app fail to initialize [\#441](https://github.com/Polymer/polymer/issues/441)

- Issues with platform version resolution with Bower and 0.2.1 [\#440](https://github.com/Polymer/polymer/issues/440)

- Polymer event bindings don't pass Firefox Marketplace CSP checks [\#439](https://github.com/Polymer/polymer/issues/439)

- Iterating over a member object [\#436](https://github.com/Polymer/polymer/issues/436)

- \<template if\> evaluating all expressions twice [\#433](https://github.com/Polymer/polymer/issues/433)

- Remove support for applyAuthorStyles/resetStyleInheritance [\#425](https://github.com/Polymer/polymer/issues/425)

- Conflicts with Revealjs style sheets [\#410](https://github.com/Polymer/polymer/issues/410)

- Bower install broken for latest and \#0.1.3 [\#407](https://github.com/Polymer/polymer/issues/407)

- Add organization logo [\#361](https://github.com/Polymer/polymer/issues/361)

- Add a declarative way to set applyAuthorStyles on a element's shadowRoot [\#106](https://github.com/Polymer/polymer/issues/106)

## [0.2.1](https://github.com/Polymer/polymer/tree/0.2.1) (2014-03-07)

**Closed issues:**

- attributeChanged is not called under some circumstances [\#438](https://github.com/Polymer/polymer/issues/438)

- Add polyfill support for new Shadow DOM CSS cominbators [\#435](https://github.com/Polymer/polymer/issues/435)

- Problem with special characters and HTML entities [\#432](https://github.com/Polymer/polymer/issues/432)

- FOUC body\[unresolved\] should be \[unresolved\] [\#431](https://github.com/Polymer/polymer/issues/431)

-  polymer-project.org menu scroll behaviour is distracting [\#430](https://github.com/Polymer/polymer/issues/430)

- polymer-list is broken in \#0.2.0 [\#427](https://github.com/Polymer/polymer/issues/427)

- polymer-project.org is slow [\#426](https://github.com/Polymer/polymer/issues/426)

- Polymer setup Instructions resulted in blank screen [\#423](https://github.com/Polymer/polymer/issues/423)

- Custom Elements and canvas/ctx functionality on iOS [\#422](https://github.com/Polymer/polymer/issues/422)

- External styles fails to load [\#420](https://github.com/Polymer/polymer/issues/420)

- Cannot access content \(childNodes\) in nested Polymer Element [\#414](https://github.com/Polymer/polymer/issues/414)

**Merged pull requests:**

- Update README.md [\#428](https://github.com/Polymer/polymer/pull/428) ([kentaromiura](https://github.com/kentaromiura))

## [0.2.0](https://github.com/Polymer/polymer/tree/0.2.0) (2014-02-15)

**Closed issues:**

- HTMLImports.Loader maybe callback twice [\#418](https://github.com/Polymer/polymer/issues/418)

- Binding to input type=range does not work in IE 11 [\#416](https://github.com/Polymer/polymer/issues/416)

- Serveral issues on Opera browser [\#411](https://github.com/Polymer/polymer/issues/411)

- Adding Polymer to a page causes Typekit fonts to break [\#408](https://github.com/Polymer/polymer/issues/408)

- Polymer bind method -- should take oneTime flag? [\#405](https://github.com/Polymer/polymer/issues/405)

- how to use part style in polymer? [\#376](https://github.com/Polymer/polymer/issues/376)

- polymer declarative event doesn't work in lightdom mode [\#331](https://github.com/Polymer/polymer/issues/331)

- Expose a way to get shadowRoots by name of creating declaration, e.g. getShadowRoot\('x-foo'\) [\#310](https://github.com/Polymer/polymer/issues/310)

**Merged pull requests:**

- update copyright year [\#412](https://github.com/Polymer/polymer/pull/412) ([gdi2290](https://github.com/gdi2290))

## [0.1.4](https://github.com/Polymer/polymer/tree/0.1.4) (2014-01-27)

**Closed issues:**

- polymer-localstorage-load only fires if the value has previously been set [\#404](https://github.com/Polymer/polymer/issues/404)

- CSS generated content without space goes missing \(Safari\) [\#403](https://github.com/Polymer/polymer/issues/403)

- \(docs\): Core API reference page doesn't load [\#400](https://github.com/Polymer/polymer/issues/400)

- Repeating a template from "content" does not work with repeat="d in data" [\#396](https://github.com/Polymer/polymer/issues/396)

## [0.1.3](https://github.com/Polymer/polymer/tree/0.1.3) (2014-01-17)

**Closed issues:**

- polymer-ajax is missing the "body" attribute in the \<polymer-element\> declaration [\#395](https://github.com/Polymer/polymer/issues/395)

- this year is 2014 [\#394](https://github.com/Polymer/polymer/issues/394)

- Can't separate attributes in element's definition with vertical whitespace [\#393](https://github.com/Polymer/polymer/issues/393)

- "deliverDeclarations Platform is not a function" error loading polymer.js [\#391](https://github.com/Polymer/polymer/issues/391)

- Assertion Error thrown [\#388](https://github.com/Polymer/polymer/issues/388)

## [0.1.2](https://github.com/Polymer/polymer/tree/0.1.2) (2014-01-10)

**Closed issues:**

- Polymer UI Sidebar Menu doesn't work in JSBin [\#389](https://github.com/Polymer/polymer/issues/389)

- Pointer Event Example links currently 404 Not Found [\#385](https://github.com/Polymer/polymer/issues/385)

- Getting started examples are all broken for tk-\* [\#383](https://github.com/Polymer/polymer/issues/383)

- function strings for declarative event handlers appear in the markup [\#378](https://github.com/Polymer/polymer/issues/378)

- binding to multiple mustaches \(e.g. foo="{{bar}} {{zot}}"\) causes exception [\#377](https://github.com/Polymer/polymer/issues/377)

- Attribute value not correctly propagated to elements [\#374](https://github.com/Polymer/polymer/issues/374)

- Calling this.super can refer to the wrong method [\#373](https://github.com/Polymer/polymer/issues/373)

- "Getting the code" instructions are out of date/broken [\#369](https://github.com/Polymer/polymer/issues/369)

- polymer-ui-menu-item does not show the icon [\#365](https://github.com/Polymer/polymer/issues/365)

- polymer-selected class is not applied to Polymer UI elements [\#364](https://github.com/Polymer/polymer/issues/364)

- InvalidCharacterError on document.register if $ exists in constructor function name [\#362](https://github.com/Polymer/polymer/issues/362)

- Exception when running on Canary without Experimental Web Platform Features [\#360](https://github.com/Polymer/polymer/issues/360)

- Page navigation issue [\#353](https://github.com/Polymer/polymer/issues/353)

- in polymer 0.0.20131025  element id attribute not allowed [\#332](https://github.com/Polymer/polymer/issues/332)

- FAQ entry on scoped animations is not accurate [\#141](https://github.com/Polymer/polymer/issues/141)

## [0.1.1](https://github.com/Polymer/polymer/tree/0.1.1) (2013-12-12)

**Closed issues:**

- Polyfill support for reprojecting content in shadow nodes [\#367](https://github.com/Polymer/polymer/issues/367)

- bower instructions don't work [\#366](https://github.com/Polymer/polymer/issues/366)

- Broken Links [\#359](https://github.com/Polymer/polymer/issues/359)

- Failing to import polymer.html can cause an infinite loop [\#356](https://github.com/Polymer/polymer/issues/356)

- The bower pkg looks broken [\#355](https://github.com/Polymer/polymer/issues/355)

- Documentation display issue [\#352](https://github.com/Polymer/polymer/issues/352)

## [0.1.0](https://github.com/Polymer/polymer/tree/0.1.0) (2013-11-27)

**Closed issues:**

- shim styling: need to support ^ and ^^ when they are defined outside of \<polymer-element\> [\#354](https://github.com/Polymer/polymer/issues/354)

- Extensions to type extension custom elements must specify an extends property when registering [\#347](https://github.com/Polymer/polymer/issues/347)

- ShadowDOM polyfill breaks CSS `content: attr\(foo\)` [\#345](https://github.com/Polymer/polymer/issues/345)

## [v0.0.20131107](https://github.com/Polymer/polymer/tree/v0.0.20131107) (2013-11-07)

**Closed issues:**

- `ready` and `created` are listed in the wrong order [\#338](https://github.com/Polymer/polymer/issues/338)

- CSS: pseudo-classes don't work with :host under the polyfill [\#335](https://github.com/Polymer/polymer/issues/335)

- Allow bindings to wire events to functions [\#324](https://github.com/Polymer/polymer/issues/324)

## [v0.0.20131025](https://github.com/Polymer/polymer/tree/v0.0.20131025) (2013-10-25)

**Implemented enhancements:**

- Consider providing a mechanism to easily observe a set of property paths [\#194](https://github.com/Polymer/polymer/issues/194)

**Closed issues:**

- binding style attribute in IE doesn't work [\#327](https://github.com/Polymer/polymer/issues/327)

- CSS: only add \[is=..\] selector if element is type-extension [\#320](https://github.com/Polymer/polymer/issues/320)

- Clarification on use of template repeat for \<tr\> & \<select\> [\#318](https://github.com/Polymer/polymer/issues/318)

- Autofocus doesn't work with polymer-veiling. [\#317](https://github.com/Polymer/polymer/issues/317)

- Polyfill: @polyfill @host rules are broken in an extended element [\#315](https://github.com/Polymer/polymer/issues/315)

- Polyfill: Parent styles are not inherited if there's no \<template\> in an extended class [\#314](https://github.com/Polymer/polymer/issues/314)

**Merged pull requests:**

- Event bindings [\#328](https://github.com/Polymer/polymer/pull/328) ([azakus](https://github.com/azakus))

- Remove SideTable dependency [\#322](https://github.com/Polymer/polymer/pull/322) ([azakus](https://github.com/azakus))

- fix Node.bind to pass the property name to reflectPropertyToAttribute [\#319](https://github.com/Polymer/polymer/pull/319) ([jmesserly](https://github.com/jmesserly))

## [v0.0.20131010](https://github.com/Polymer/polymer/tree/v0.0.20131010) (2013-10-10)

**Closed issues:**

- trailing space in polymer attributes causes exception in IE10 [\#313](https://github.com/Polymer/polymer/issues/313)

- Calling cancelUnbindAll is cumbersome under the CustomElements polyfill [\#312](https://github.com/Polymer/polymer/issues/312)

- Calling methods on proxies returned when querying nodes can yield different results than calling directly on impl even without shadow dom use [\#309](https://github.com/Polymer/polymer/issues/309)

- Using this.$.\[id\] syntax yields different results in Canary than when using Polyfill [\#308](https://github.com/Polymer/polymer/issues/308)

- Debugging polymer apps: stack trace is wacko [\#307](https://github.com/Polymer/polymer/issues/307)

- Need Object.observe-enabled builders in waterfall [\#306](https://github.com/Polymer/polymer/issues/306)

- FR: Error on failed import [\#189](https://github.com/Polymer/polymer/issues/189)

## [v0.0.20131003](https://github.com/Polymer/polymer/tree/v0.0.20131003) (2013-10-03)

**Implemented enhancements:**

- Allow hooking into the template instantiation process [\#156](https://github.com/Polymer/polymer/issues/156)

- Support stylesheets in element templates [\#146](https://github.com/Polymer/polymer/issues/146)

- System for automatic setting of component instance attributes [\#92](https://github.com/Polymer/polymer/issues/92)

**Closed issues:**

- Polymer tests failing with Object.observe enabled [\#302](https://github.com/Polymer/polymer/issues/302)

- FAQ bug: polymer fails CSP because of inline script tags not XHR. [\#301](https://github.com/Polymer/polymer/issues/301)

- \<propertyName\>Changed may get called twice for a single property value change [\#298](https://github.com/Polymer/polymer/issues/298)

- Two-way Binding doesn't work in canary [\#297](https://github.com/Polymer/polymer/issues/297)

- please create gh-pages [\#294](https://github.com/Polymer/polymer/issues/294)

- Conditional attributes are not properly bound [\#293](https://github.com/Polymer/polymer/issues/293)

- Bound boolean isn't set from true to false when radio button is unchecked [\#291](https://github.com/Polymer/polymer/issues/291)

- Bindings in nested templates with named scopes fail to update correctly after initial population [\#285](https://github.com/Polymer/polymer/issues/285)

- \<content\> not being displayed if too deep. [\#283](https://github.com/Polymer/polymer/issues/283)

- polymer-element who to fire properties change？ [\#282](https://github.com/Polymer/polymer/issues/282)

- how to get inner element [\#280](https://github.com/Polymer/polymer/issues/280)

- how to bind tap event on children node [\#278](https://github.com/Polymer/polymer/issues/278)

- Provide finer control over unresolved element styling [\#276](https://github.com/Polymer/polymer/issues/276)

- Question regarding your usage of a getter [\#274](https://github.com/Polymer/polymer/issues/274)

- Consider removing "tools" submodule [\#271](https://github.com/Polymer/polymer/issues/271)

- Community registry in the wild [\#268](https://github.com/Polymer/polymer/issues/268)

- HTMLImports fails on IE9 [\#229](https://github.com/Polymer/polymer/issues/229)

- External element scripts not loading [\#216](https://github.com/Polymer/polymer/issues/216)

- polymer-element script tag are ignored when using innerHTML to inject polymer-element\(s\) into the page [\#205](https://github.com/Polymer/polymer/issues/205)

- Galaxy Nexus Stock-Browser [\#202](https://github.com/Polymer/polymer/issues/202)

- Allow body FOUC prevention to be optional [\#197](https://github.com/Polymer/polymer/issues/197)

- Consider converting attributes with dashes into to camelCased properties [\#193](https://github.com/Polymer/polymer/issues/193)

- \(IE only\) Last element created by \<template repeat\> is unbound [\#187](https://github.com/Polymer/polymer/issues/187)

- Can't bind to the value of a custom element that extends \<input\> [\#186](https://github.com/Polymer/polymer/issues/186)

- Calling offsetWidth in a style-modifying forEach is slow [\#180](https://github.com/Polymer/polymer/issues/180)

- Explicitly fire ready\(\) [\#178](https://github.com/Polymer/polymer/issues/178)

- Consider deserializing to Number only if property is already Number-valued [\#120](https://github.com/Polymer/polymer/issues/120)

- Cannot load Google's jsapi inside of a component [\#115](https://github.com/Polymer/polymer/issues/115)

- Document toolkit styling helpers [\#101](https://github.com/Polymer/polymer/issues/101)

- Make sure properties are not doc'd as attributes [\#96](https://github.com/Polymer/polymer/issues/96)

- Document that attributes and properties are not dynamically converted [\#94](https://github.com/Polymer/polymer/issues/94)

**Merged pull requests:**

- Removes unnecessary px declarations in coordinate attributes. [\#289](https://github.com/Polymer/polymer/pull/289) ([mrmrs](https://github.com/mrmrs))

- remove extra argument to unbindProperty that was ignored [\#286](https://github.com/Polymer/polymer/pull/286) ([jmesserly](https://github.com/jmesserly))

- small fix to bubbles parameter of utils.fire [\#284](https://github.com/Polymer/polymer/pull/284) ([jmesserly](https://github.com/jmesserly))

## [v0.0.20130912](https://github.com/Polymer/polymer/tree/v0.0.20130912) (2013-09-12)

**Fixed bugs:**

- Updated use of PathObservers to match new API [\#267](https://github.com/Polymer/polymer/issues/267)

**Closed issues:**

- Point each repo's CONTRIBUTING file to Polymer's [\#273](https://github.com/Polymer/polymer/issues/273)

- Nested templates throwing exceptions with reference to observe.js [\#264](https://github.com/Polymer/polymer/issues/264)

- Perf regression in polyfill - 20130808 release  [\#236](https://github.com/Polymer/polymer/issues/236)

- Auto-registration of polymer-elements broken? [\#221](https://github.com/Polymer/polymer/issues/221)

## [v0.0.20130905](https://github.com/Polymer/polymer/tree/v0.0.20130905) (2013-09-05)

**Closed issues:**

- SD polyfill in latest release breaks chromestatus.com [\#263](https://github.com/Polymer/polymer/issues/263)

- On latest Chrome Canary, using vulcanized version won't show the style of elements [\#262](https://github.com/Polymer/polymer/issues/262)

- grunt will fail using the latest commit of polymer-all [\#261](https://github.com/Polymer/polymer/issues/261)

- Need a way to get the activeElement inside a Polymer element [\#253](https://github.com/Polymer/polymer/issues/253)

- When using minified version on polymer, images of the button don't show in the ui-toolbar example [\#251](https://github.com/Polymer/polymer/issues/251)

- Make sure boolean properties are reflected as boolean attributes [\#240](https://github.com/Polymer/polymer/issues/240)

- Attributes are not reflected at bind time [\#239](https://github.com/Polymer/polymer/issues/239)

- HTML imports fail when url params contain '/' characters [\#238](https://github.com/Polymer/polymer/issues/238)

- Unable to use the Sandbox on Chrome \<= 28 [\#138](https://github.com/Polymer/polymer/issues/138)

## [v0.0.20130829](https://github.com/Polymer/polymer/tree/v0.0.20130829) (2013-08-28)

**Closed issues:**

- loading a local file \(file:///\) using polymer will fail to load properly [\#260](https://github.com/Polymer/polymer/issues/260)

- uppercase signals do not work [\#256](https://github.com/Polymer/polymer/issues/256)

- Chrome Packaged App: including UI elements in an application will show some errors [\#249](https://github.com/Polymer/polymer/issues/249)

- Changing a DOM attribute doesn't change the model [\#246](https://github.com/Polymer/polymer/issues/246)

- Latest build broken w/ jQuery \(chrome 28\) [\#243](https://github.com/Polymer/polymer/issues/243)

- window.Loader name colliding with ES6 window.Loader \(modules\) [\#237](https://github.com/Polymer/polymer/issues/237)

**Merged pull requests:**

- Recursive build for polymer [\#250](https://github.com/Polymer/polymer/pull/250) ([azakus](https://github.com/azakus))

## [v0.0.20130815](https://github.com/Polymer/polymer/tree/v0.0.20130815) (2013-08-15)

## [v0.0.20130816](https://github.com/Polymer/polymer/tree/v0.0.20130816) (2013-08-15)

**Fixed bugs:**

- FF broken in latest release w/ dom.webcomponents.enabled: true [\#235](https://github.com/Polymer/polymer/issues/235)

**Closed issues:**

- HTMLImports fails silently on Chrome 28.0.1500.95 \(Debian , 64bit\) [\#234](https://github.com/Polymer/polymer/issues/234)

- ss [\#233](https://github.com/Polymer/polymer/issues/233)

- Internet Explorer - not working at all [\#217](https://github.com/Polymer/polymer/issues/217)

**Merged pull requests:**

- 8/15 master -\> stable [\#241](https://github.com/Polymer/polymer/pull/241) ([azakus](https://github.com/azakus))

- Fixes for some of the workbench samples [\#232](https://github.com/Polymer/polymer/pull/232) ([chrisbu](https://github.com/chrisbu))

## [v0.0.20130808](https://github.com/Polymer/polymer/tree/v0.0.20130808) (2013-08-08)

**Implemented enhancements:**

- Add @version string to build files [\#226](https://github.com/Polymer/polymer/issues/226)

**Closed issues:**

- Events on distributed nodes aren't bubbled to parent nodes in shadow DOM under polyfill [\#230](https://github.com/Polymer/polymer/issues/230)

- `ReferenceError: PathObserver is not defined` when loading in node-webkit [\#228](https://github.com/Polymer/polymer/issues/228)

**Merged pull requests:**

- 8/8 master -\> stable [\#231](https://github.com/Polymer/polymer/pull/231) ([azakus](https://github.com/azakus))

## [v0.0.20130801](https://github.com/Polymer/polymer/tree/v0.0.20130801) (2013-08-01)

**Implemented enhancements:**

- It's awkward to make a property with an object default value [\#215](https://github.com/Polymer/polymer/issues/215)

- Throw a more useful error if Polymer.register is used [\#210](https://github.com/Polymer/polymer/issues/210)

- Consider if/when/how to reflect bound property values to attributes [\#188](https://github.com/Polymer/polymer/issues/188)

- Make platform and toolkit builds available as simple downloads and/or from CDN [\#87](https://github.com/Polymer/polymer/issues/87)

**Closed issues:**

- If `Polymer\(\)` is not called almost immediately, the element is not initialised. [\#214](https://github.com/Polymer/polymer/issues/214)

- Input value is not initialised. [\#213](https://github.com/Polymer/polymer/issues/213)

- Fail more gracefully on unsupported browsers [\#207](https://github.com/Polymer/polymer/issues/207)

- Binding and xxxChanged function break if element is moved to a different shadow [\#203](https://github.com/Polymer/polymer/issues/203)

- table element problems on firefox [\#196](https://github.com/Polymer/polymer/issues/196)

- Bindings on a range input not working well in google chrome [\#182](https://github.com/Polymer/polymer/issues/182)

- Add support for creating Polymer elements imperatively [\#163](https://github.com/Polymer/polymer/issues/163)

- Issue with scrolling using the flot library [\#162](https://github.com/Polymer/polymer/issues/162)

- \[Feature Request\] Using Bower instead of submodules [\#147](https://github.com/Polymer/polymer/issues/147)

- minor documentation typo [\#139](https://github.com/Polymer/polymer/issues/139)

**Merged pull requests:**

- 8/1 master -\> stable [\#223](https://github.com/Polymer/polymer/pull/223) ([azakus](https://github.com/azakus))

## [v0.0.20130711](https://github.com/Polymer/polymer/tree/v0.0.20130711) (2013-07-11)

**Implemented enhancements:**

- Support resetStyleInheritance on prototype [\#199](https://github.com/Polymer/polymer/issues/199)

- Add styling polyfill support for pseudos [\#152](https://github.com/Polymer/polymer/issues/152)

**Fixed bugs:**

- template/element polyfill styling need !important [\#191](https://github.com/Polymer/polymer/issues/191)

- Type extension elements lose styling under polyfill [\#171](https://github.com/Polymer/polymer/issues/171)

- When polymer-scope="global" is used to pull a stylesheet to the document, it appears multiple times [\#155](https://github.com/Polymer/polymer/issues/155)

- PathObservers in observeProperties.js must be created at insertedCallback and removed at removeCallback [\#121](https://github.com/Polymer/polymer/issues/121)

- shimStyling: styles defined within shadowDOM are not prefixed with the scope name in Firefox [\#107](https://github.com/Polymer/polymer/issues/107)

- Event target is incorrect after certain DOM changes in ShadowDOM Polyfill [\#102](https://github.com/Polymer/polymer/issues/102)

- Bindings in icon-button fail under ShadowDOMPolyfill [\#83](https://github.com/Polymer/polymer/issues/83)

- \[dev\] Uncaught ReferenceError: SideTable is not defined [\#80](https://github.com/Polymer/polymer/issues/80)

- \[dev\] template iterate doesn't work inside component [\#79](https://github.com/Polymer/polymer/issues/79)

- Toolkit Components fail if they have a property named "node" [\#78](https://github.com/Polymer/polymer/issues/78)

- Support component upgrade using "is" style declaration [\#71](https://github.com/Polymer/polymer/issues/71)

- Styles declared in a component's shadowRoot should not leak out of the component [\#70](https://github.com/Polymer/polymer/issues/70)

- this.node.webkitShadowRoot needs to return ShadowRoot [\#68](https://github.com/Polymer/polymer/issues/68)

- Commented @host rule style gets applied [\#67](https://github.com/Polymer/polymer/issues/67)

- data: URLs are being rewritten to relative URLs in \<style\> [\#66](https://github.com/Polymer/polymer/issues/66)

- Custom Element shim incorrectly handles @host rule [\#65](https://github.com/Polymer/polymer/issues/65)

- path.js needs to handle absolute url paths [\#62](https://github.com/Polymer/polymer/issues/62)

- imperative instantiation is broken [\#56](https://github.com/Polymer/polymer/issues/56)

- nodes inside a component's shadowDOM have incorrect model when using shadowDOM shim [\#43](https://github.com/Polymer/polymer/issues/43)

- g-component custom events can be handled in wrong scope [\#30](https://github.com/Polymer/polymer/issues/30)

**Closed issues:**

- Consider optimizing propertyForAttribute [\#181](https://github.com/Polymer/polymer/issues/181)

- nameInThis\(\) in oop.js is slow [\#177](https://github.com/Polymer/polymer/issues/177)

- Internationalization of Web Components [\#175](https://github.com/Polymer/polymer/issues/175)

- polymer-scope="controller" should not install the same stylesheet multiple times  [\#173](https://github.com/Polymer/polymer/issues/173)

- Add polyfill styling support for @host :scope [\#170](https://github.com/Polymer/polymer/issues/170)

- Error loading polymer if window.location.hash is not null [\#167](https://github.com/Polymer/polymer/issues/167)

- Unexpected result upgraded plain DOM to custom element instance [\#166](https://github.com/Polymer/polymer/issues/166)

- Alias this.webkitShadowRoot -\> this.shadowRoot [\#165](https://github.com/Polymer/polymer/issues/165)

- Simplest way to "Fire up a web server" to run examples [\#161](https://github.com/Polymer/polymer/issues/161)

- Custom elements seem to cache data after being deleted and re-added [\#159](https://github.com/Polymer/polymer/issues/159)

- Prevent memory leaking under MDV polyfill [\#154](https://github.com/Polymer/polymer/issues/154)

- Element templates are stamped into shadowRoot with unbound values [\#153](https://github.com/Polymer/polymer/issues/153)

- Styles should not be shimmed asynchronously under ShadowDOMPolyfill [\#151](https://github.com/Polymer/polymer/issues/151)

- Polymer.js fails to load with "ReferenceError: Can't find variable: Window" on Windows 7 Safari browser and iPad 1 iOS 5.1.1 [\#149](https://github.com/Polymer/polymer/issues/149)

- Stylesheets in \<element\> elements are emitted in incorrect order [\#148](https://github.com/Polymer/polymer/issues/148)

- Web animations is not loaded by Polymer [\#140](https://github.com/Polymer/polymer/issues/140)

- Polymer components should be called monomers.   [\#137](https://github.com/Polymer/polymer/issues/137)

- Small error in "Getting Started" tutorial [\#136](https://github.com/Polymer/polymer/issues/136)

- add doc-comments to 'base.js' [\#133](https://github.com/Polymer/polymer/issues/133)

- Attribute-based styles not always updated [\#132](https://github.com/Polymer/polymer/issues/132)

- attributeChanged event on "sub-component" not fired in Canary but works in Chrome [\#131](https://github.com/Polymer/polymer/issues/131)

- Stylesheets throw exception if toolkit-scope is defined and the element definition is inline [\#127](https://github.com/Polymer/polymer/issues/127)

- Consider deserializing to Array from attributes, if property is Array-valued [\#124](https://github.com/Polymer/polymer/issues/124)

- Modify attrs.js to accept Date strings in custom element attribute values [\#118](https://github.com/Polymer/polymer/issues/118)

- Attribute value that's a comma delineated list of numbers is converted to a property incorrectly [\#117](https://github.com/Polymer/polymer/issues/117)

- Including toolkit.js on a page moves all \<style\>s to  the \<head\>. [\#114](https://github.com/Polymer/polymer/issues/114)

- PointerEvents registration fails in the presence of ShadowDOMPolyfill in some cases [\#111](https://github.com/Polymer/polymer/issues/111)

- Distributing template content to a shadowDOM can fail under shadowDOM polyfill [\#110](https://github.com/Polymer/polymer/issues/110)

- Cursor moves to end of input after typing [\#109](https://github.com/Polymer/polymer/issues/109)

- toolkitchen.github.io code samples not showing up in ff [\#105](https://github.com/Polymer/polymer/issues/105)

- Document Browser support and test coverage using Testing CI and Travis CI [\#104](https://github.com/Polymer/polymer/issues/104)

- clean up commented code in events.js [\#100](https://github.com/Polymer/polymer/issues/100)

- rename `base.send` to `base.fire` or `base.bubble` [\#98](https://github.com/Polymer/polymer/issues/98)

- toolkit.min.js missing method shimStyling [\#91](https://github.com/Polymer/polymer/issues/91)

- Git repo url incorrect [\#89](https://github.com/Polymer/polymer/issues/89)

- Menu-button workbench file hangs chrome under ShadowDOM Polyfill [\#86](https://github.com/Polymer/polymer/issues/86)

- can't make bindings to objects on elements instantiated by mdv [\#81](https://github.com/Polymer/polymer/issues/81)

- Don't name things \_, \_\_ and $ [\#73](https://github.com/Polymer/polymer/issues/73)

- @host styles aren't processed for base elements [\#72](https://github.com/Polymer/polymer/issues/72)

- "export" flag attribute documented in platform.js is actually "exportas" [\#64](https://github.com/Polymer/polymer/issues/64)

- handlers="..." declarative events listen on the host element and therefore see no event target info for events generated in  shadowDom [\#41](https://github.com/Polymer/polymer/issues/41)

- MutationObserver code for custom event \(on-\*\) binding is inefficient [\#24](https://github.com/Polymer/polymer/issues/24)

- g-component published properties don't inherit [\#18](https://github.com/Polymer/polymer/issues/18)

- g-component property automation is inefficient [\#15](https://github.com/Polymer/polymer/issues/15)

- Add unit tests for g-overlay, g-selector, g-selection [\#11](https://github.com/Polymer/polymer/issues/11)

- Document public api [\#10](https://github.com/Polymer/polymer/issues/10)

- have some good defaults for g-overlay [\#7](https://github.com/Polymer/polymer/issues/7)

**Merged pull requests:**

- 7/11 master -\> stable [\#204](https://github.com/Polymer/polymer/pull/204) ([azakus](https://github.com/azakus))

- Correct test to check global div [\#201](https://github.com/Polymer/polymer/pull/201) ([ebidel](https://github.com/ebidel))

- Fixes issue \#199 - adds support for resetStyleInheritance on prototype [\#200](https://github.com/Polymer/polymer/pull/200) ([ebidel](https://github.com/ebidel))

- Switch to \<polymer-element\> [\#192](https://github.com/Polymer/polymer/pull/192) ([azakus](https://github.com/azakus))

- 6/17 master -\> stable [\#184](https://github.com/Polymer/polymer/pull/184) ([azakus](https://github.com/azakus))

- Fix a typo in contributing.md [\#183](https://github.com/Polymer/polymer/pull/183) ([alexhancock](https://github.com/alexhancock))

- Flatten repos [\#174](https://github.com/Polymer/polymer/pull/174) ([azakus](https://github.com/azakus))

- 6/5 master -\> stable [\#172](https://github.com/Polymer/polymer/pull/172) ([azakus](https://github.com/azakus))

- Merge mdv-syntax branch [\#168](https://github.com/Polymer/polymer/pull/168) ([sjmiles](https://github.com/sjmiles))

- added array & obj support to attrs.js \(plus refactor\) [\#158](https://github.com/Polymer/polymer/pull/158) ([bsatrom](https://github.com/bsatrom))

- Fix link in CONTRIBUTING.md [\#144](https://github.com/Polymer/polymer/pull/144) ([markhealey](https://github.com/markhealey))

- 5/15 master -\> stable [\#135](https://github.com/Polymer/polymer/pull/135) ([azakus](https://github.com/azakus))

- 5/14 master -\> stable [\#134](https://github.com/Polymer/polymer/pull/134) ([azakus](https://github.com/azakus))

- Add custom date parsing module [\#130](https://github.com/Polymer/polymer/pull/130) ([bsatrom](https://github.com/bsatrom))

- 5/9 master -\> stable [\#125](https://github.com/Polymer/polymer/pull/125) ([azakus](https://github.com/azakus))

- added deserialization of Date attributes for custom elements [\#122](https://github.com/Polymer/polymer/pull/122) ([bsatrom](https://github.com/bsatrom))

- merge Observer branch [\#113](https://github.com/Polymer/polymer/pull/113) ([sjmiles](https://github.com/sjmiles))

- 4/17 master -\> stable [\#99](https://github.com/Polymer/polymer/pull/99) ([azakus](https://github.com/azakus))

- Bring experimental test harness in from alt-test branch [\#85](https://github.com/Polymer/polymer/pull/85) ([sjmiles](https://github.com/sjmiles))

- Wrap grunt test in xvfb for virtual display. [\#84](https://github.com/Polymer/polymer/pull/84) ([agable-chromium](https://github.com/agable-chromium))

- Add step-generator script to toolkit [\#82](https://github.com/Polymer/polymer/pull/82) ([agable-chromium](https://github.com/agable-chromium))

- Stop using \_\_{lookup,define}{G,S}etter\_\_ [\#76](https://github.com/Polymer/polymer/pull/76) ([arv](https://github.com/arv))

- Use XMLHttpRequest directly [\#75](https://github.com/Polymer/polymer/pull/75) ([arv](https://github.com/arv))

- Updating meta tag [\#61](https://github.com/Polymer/polymer/pull/61) ([ebidel](https://github.com/ebidel))

- Adding Contributors guide [\#60](https://github.com/Polymer/polymer/pull/60) ([ebidel](https://github.com/ebidel))

- Tweaks to README. [\#58](https://github.com/Polymer/polymer/pull/58) ([ebidel](https://github.com/ebidel))

- latest event handling scheme [\#55](https://github.com/Polymer/polymer/pull/55) ([sjmiles](https://github.com/sjmiles))

- g-panels updates [\#54](https://github.com/Polymer/polymer/pull/54) ([sorvell](https://github.com/sorvell))

- g-component tweaks to improve data-binding [\#53](https://github.com/Polymer/polymer/pull/53) ([sjmiles](https://github.com/sjmiles))

- updated components for the new changes in g-component [\#52](https://github.com/Polymer/polymer/pull/52) ([frankiefu](https://github.com/frankiefu))

- Merge polybinding branch into master [\#51](https://github.com/Polymer/polymer/pull/51) ([sjmiles](https://github.com/sjmiles))

- minor fixes to support app development [\#49](https://github.com/Polymer/polymer/pull/49) ([sorvell](https://github.com/sorvell))

- added g-menu-button and g-toolbar [\#48](https://github.com/Polymer/polymer/pull/48) ([frankiefu](https://github.com/frankiefu))

- g-overlay: simplify styling. [\#47](https://github.com/Polymer/polymer/pull/47) ([sorvell](https://github.com/sorvell))

- g-overlay update: simplify and add basic management for focus and z-index. [\#46](https://github.com/Polymer/polymer/pull/46) ([sorvell](https://github.com/sorvell))

- add unit tests to cover more components and the latest sugaring in g-components [\#45](https://github.com/Polymer/polymer/pull/45) ([frankiefu](https://github.com/frankiefu))

- fixes issue \#30: allow findController to step out of lightDOM [\#44](https://github.com/Polymer/polymer/pull/44) ([sjmiles](https://github.com/sjmiles))

- update g-ajax and minor g-panels and g-page fixes [\#42](https://github.com/Polymer/polymer/pull/42) ([sorvell](https://github.com/sorvell))

- update to use the new g-component sugar [\#40](https://github.com/Polymer/polymer/pull/40) ([frankiefu](https://github.com/frankiefu))

- g-component minor fixup; updates for g-page and g-panels [\#39](https://github.com/Polymer/polymer/pull/39) ([sorvell](https://github.com/sorvell))

- implement new 'protected' syntax [\#38](https://github.com/Polymer/polymer/pull/38) ([sjmiles](https://github.com/sjmiles))

- g-component and g-panels minor changes [\#37](https://github.com/Polymer/polymer/pull/37) ([sorvell](https://github.com/sorvell))

- filter mustaches in takeAttributes, other minor tweaks [\#36](https://github.com/Polymer/polymer/pull/36) ([sjmiles](https://github.com/sjmiles))

- g-page: use external stylesheet [\#35](https://github.com/Polymer/polymer/pull/35) ([sorvell](https://github.com/sorvell))

- added g-page component [\#34](https://github.com/Polymer/polymer/pull/34) ([sorvell](https://github.com/sorvell))

- g-component attribute parsing fix; g-panels & g-overlay & g-ajax minor fixes [\#33](https://github.com/Polymer/polymer/pull/33) ([sorvell](https://github.com/sorvell))

- bug fixes, more indirection around 'conventions' [\#32](https://github.com/Polymer/polymer/pull/32) ([sjmiles](https://github.com/sjmiles))

- minor updates/fixes to g-component, selector and menu [\#31](https://github.com/Polymer/polymer/pull/31) ([frankiefu](https://github.com/frankiefu))

- g-panels minor bug fixes [\#29](https://github.com/Polymer/polymer/pull/29) ([sorvell](https://github.com/sorvell))

- add g-panels [\#28](https://github.com/Polymer/polymer/pull/28) ([sorvell](https://github.com/sorvell))

- g-overlay: refactor/simplify [\#27](https://github.com/Polymer/polymer/pull/27) ([sorvell](https://github.com/sorvell))

- g-component: fix typo [\#26](https://github.com/Polymer/polymer/pull/26) ([sorvell](https://github.com/sorvell))

- update components based on changes in g-component [\#25](https://github.com/Polymer/polymer/pull/25) ([frankiefu](https://github.com/frankiefu))

- MDV sugaring  [\#23](https://github.com/Polymer/polymer/pull/23) ([sjmiles](https://github.com/sjmiles))

- menu component and basic component unit tests [\#22](https://github.com/Polymer/polymer/pull/22) ([frankiefu](https://github.com/frankiefu))

- "DOMTokenList.enable" was renamed to "toggle" at platform, update polyfill [\#21](https://github.com/Polymer/polymer/pull/21) ([sjmiles](https://github.com/sjmiles))

- use MutationObserver to maintain custom event bindings, bug fixes [\#20](https://github.com/Polymer/polymer/pull/20) ([sjmiles](https://github.com/sjmiles))

- tabs component, simplify togglebutton and more unit tests [\#19](https://github.com/Polymer/polymer/pull/19) ([frankiefu](https://github.com/frankiefu))

- unit test harness [\#17](https://github.com/Polymer/polymer/pull/17) ([frankiefu](https://github.com/frankiefu))

- use shadow="shim" instead of shimShadow for compatibility with URL override [\#16](https://github.com/Polymer/polymer/pull/16) ([sjmiles](https://github.com/sjmiles))

- change property automation to be property-first instead of attribute-first [\#14](https://github.com/Polymer/polymer/pull/14) ([sjmiles](https://github.com/sjmiles))

- call shadowRootCreated in the right scope and add g-ratings component [\#13](https://github.com/Polymer/polymer/pull/13) ([frankiefu](https://github.com/frankiefu))

- update for names changes in polyfill [\#12](https://github.com/Polymer/polymer/pull/12) ([frankiefu](https://github.com/frankiefu))

- add g-selection and g-selector components [\#9](https://github.com/Polymer/polymer/pull/9) ([sjmiles](https://github.com/sjmiles))

- add ajax and togglebutton components [\#8](https://github.com/Polymer/polymer/pull/8) ([frankiefu](https://github.com/frankiefu))

- various changes to enable g-overlay [\#6](https://github.com/Polymer/polymer/pull/6) ([sjmiles](https://github.com/sjmiles))

- add g-icon-button [\#4](https://github.com/Polymer/polymer/pull/4) ([sjmiles](https://github.com/sjmiles))

- fix path [\#3](https://github.com/Polymer/polymer/pull/3) ([sjmiles](https://github.com/sjmiles))

- make workBench live with toolkit [\#2](https://github.com/Polymer/polymer/pull/2) ([sjmiles](https://github.com/sjmiles))

- Initial Components [\#1](https://github.com/Polymer/polymer/pull/1) ([sjmiles](https://github.com/sjmiles))
