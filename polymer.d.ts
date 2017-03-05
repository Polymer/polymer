declare namespace Polymer {
  type Constructor<T> = new(...args: any[]) => T;

  function dedupingMixin(mixin: function): function;

  class DomModule extends HTMLElement {
    register(id: any);
  }

  interface PropertyAccessors {
    protected _initializeProperties();
    protected _initializeProtoProperties(props: any);
    protected _ensureAttribute(attribute: any, value: any);
    protected _attributeToProperty(attribute: any, value: any, type: any);
    protected _propertyToAttribute(property: any, attribute: any, value: any);
    protected _valueToNodeAttribute(node: any, value: any, attribute: any);
    protected _serializeValue(value: any);
    protected _deserializeValue(value: any, type: any);
    protected _createPropertyAccessor(property: any, readOnly: any);
    protected _setProperty(property: any, value: any);
    protected _setPendingProperty(property: any, value: any);
    protected _isPropertyPending(prop: any);
    protected _invalidateProperties();
    protected _flushProperties();
    protected _propertiesChanged(currentProps: any, changedProps: any, oldProps: any);
    protected _shouldPropertyChange(property: any, value: any, old: any);
}
  const PropertyAccessors: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<PropertyAccessors>;

  interface TemplateStamp {
    protected _stampTemplate(template: any);
    protected _parseTemplateAnnotations(template: any);
    protected _addMethodEventListenerToNode(node: any, eventName: any, methodName: any, context: any);
    protected _addEventListenerToNode(node: any, eventName: any, handler: any);
    protected _removeEventListenerFromNode(node: any, eventName: any, handler: any);
}
  const TemplateStamp: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<TemplateStamp>;

  interface PropertyEffects {
    protected _initializeProperties();
    protected _initializeProtoProperties(props: any);
    protected _addPropertyEffect(property: any, type: any, effect: any);
    protected _hasPropertyEffect(property: any, type: any);
    protected _hasReadOnlyEffect(property: any);
    protected _hasNotifyEffect(property: any);
    protected _hasReflectEffect(property: any);
    protected _hasComputedEffect(property: any);
    protected _setPendingPropertyOrPath(path: any, value: any, shouldNotify: any, isPathNotification: any);
    protected _setUnmanagedPropertyToNode(node: any, prop: any, value: any);
    protected _setPendingProperty(property: any, value: any, shouldNotify: any);
    protected _setProperty(property: any, value: any);
    protected _invalidateProperties();
    protected _enqueueClient(client: any);
    protected _flushClients();
    setProperties(props: any);
    protected _flushProperties();
    ready();
    protected _readyClients();
    protected _stampTemplate(template: any);
    protected _propertiesChanged(currentProps: any, changedProps: any, oldProps: any);
    linkPaths(to: any, from: any);
    unlinkPaths(path: any);
    notifySplices(path: any, splices: any);
    get(path: any, root: any);
    set(path: any, value: any, root: any);
    push(path: any, ...items: any);
    pop(path: any);
    splice(path: any, start: any, deleteCount: any, ...items: any);
    shift(path: any);
    unshift(path: any, ...items: any);
    notifyPath(path: any, value: any);
    protected _createReadOnlyProperty(property: any, protectedSetter: any);
    protected _createPropertyObserver(property: any, methodName: any, dynamicFn: any);
    protected _createMethodObserver(expression: any, dynamicFns: any);
    protected _createNotifyingProperty(property: any);
    protected _createReflectedProperty(property: any);
    protected _createComputedProperty(property: any, expression: any, dynamicFns: any);
    protected _bindTemplate(template: any, dynamicFns: any);
}
  const PropertyEffects: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<PropertyEffects>;

  interface ElementMixin {
    protected _initializeProperties();
    connectedCallback();
    disconnectedCallback();
    protected _readyClients();
    protected _attachDom(dom: any);
    attributeChangedCallback(name: any, old: any, value: any);
    updateStyles(properties: any);
    resolveUrl(url: any, base: any);
}
  const ElementMixin: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<ElementMixin>;

  interface GestureEventListeners {
    protected _addEventListenerToNode(node: any, eventName: any, handler: any);
    protected _removeEventListenerFromNode(node: any, eventName: any, handler: any);
}
  const GestureEventListeners: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<GestureEventListeners>;

  function importHref(href: string, onload: Function=, onerror: Function=, optAsync: boolean=): HTMLLinkElement;

  function enqueueDebouncer(debouncer: Polymer.Debouncer);

  function flush();

  function dom(obj: (Node|Event)): (DomApi|EventApi);

  interface LegacyElementMixin {
    protected created();
    protected attached();
    protected detached();
    protected attributeChanged();
    protected _initializeProperties();
    protected _registered();
    protected ready();
    protected _ensureAttributes();
    protected _applyListeners();
    serialize(value: any);
    deserialize(value: any, type: any);
    reflectPropertyToAttribute(property: any, attribute: any, value: any);
    serializeValueToAttribute(value: any, attribute: any, node: any);
    extend(prototype: any, api: any);
    mixin(target: any, source: any);
    chainObject(object: any, inherited: any);
    instanceTemplate(template: any);
    fire(type: any, detail: any, options: any);
    listen(node: any, eventName: any, methodName: any);
    unlisten(node: any, eventName: any, methodName: any);
    setScrollDirection(direction: any, node: any);
    $$(slctr: any);
    distributeContent();
    getEffectiveChildNodes();
    queryDistributedElements(selector: any);
    getEffectiveChildren();
    getEffectiveTextContent();
    queryEffectiveChildren(selector: any);
    queryAllEffectiveChildren(selector: any);
    getContentChildNodes(slctr: any);
    getContentChildren(slctr: any);
    isLightDescendant(node: any);
    isLocalDescendant(node: any);
    scopeSubtree(container: any, shouldObserve: any);
    getComputedStyleValue(property: any);
    debounce(jobName: any, callback: any, wait: any);
    isDebouncerActive(jobName: any);
    flushDebouncer(jobName: any);
    cancelDebouncer(jobName: any);
    async(callback: any, waitTime: any);
    cancelAsync(handle: any);
    create(tag: any, props: any);
    importHref(href: any, onload: any, onerror: any, optAsync: any);
    elementMatches(selector: any, node: any);
    toggleAttribute(name: any, bool: any, node: any);
    toggleClass(name: any, bool: any, node: any);
    transform(transformText: any, node: any);
    translate3d(x: any, y: any, z: any, node: any);
    arrayDelete(arrayOrPath: any, item: any);
    protected _logger(level: any, args: any);
    protected _log(...args: any);
    protected _warn(...args: any);
    protected _error(...args: any);
    protected _logf(...args: any);
}
  const LegacyElementMixin: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<LegacyElementMixin>;

  function mixinBehaviors(behaviors: (Object|Array), klass: HTMLElement);

  function Class(info: Object): Polymer.LegacyElement;

  interface MutableData {
    protected _shouldPropertyChange(property: any, value: any, old: any);
}
  const MutableData: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<MutableData>;

  interface OptionalMutableData {
    mutableData: boolean;
    protected _shouldPropertyChange(property: any, value: any, old: any);
}
  const OptionalMutableData: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<OptionalMutableData>;

  class DomBind extends domBindBase {
    protected _initializeProperties();
    protected _initializeProtoProperties(props: any);
    protected _addPropertyEffect(property: any, type: any, effect: any);
    protected _hasPropertyEffect(property: any, type: any);
    protected _hasReadOnlyEffect(property: any);
    protected _hasNotifyEffect(property: any);
    protected _hasReflectEffect(property: any);
    protected _hasComputedEffect(property: any);
    protected _setPendingPropertyOrPath(path: any, value: any, shouldNotify: any, isPathNotification: any);
    protected _setUnmanagedPropertyToNode(node: any, prop: any, value: any);
    protected _setPendingProperty(property: any, value: any, shouldNotify: any);
    protected _setProperty(property: any, value: any);
    protected _invalidateProperties();
    protected _enqueueClient(client: any);
    protected _flushClients();
    setProperties(props: any);
    protected _flushProperties();
    ready();
    protected _readyClients();
    protected _stampTemplate(template: any);
    protected _propertiesChanged(currentProps: any, changedProps: any, oldProps: any);
    linkPaths(to: any, from: any);
    unlinkPaths(path: any);
    notifySplices(path: any, splices: any);
    get(path: any, root: any);
    set(path: any, value: any, root: any);
    push(path: any, ...items: any);
    pop(path: any);
    splice(path: any, start: any, deleteCount: any, ...items: any);
    shift(path: any);
    unshift(path: any, ...items: any);
    notifyPath(path: any, value: any);
    protected _createReadOnlyProperty(property: any, protectedSetter: any);
    protected _createPropertyObserver(property: any, methodName: any, dynamicFn: any);
    protected _createMethodObserver(expression: any, dynamicFns: any);
    protected _createNotifyingProperty(property: any);
    protected _createReflectedProperty(property: any);
    protected _createComputedProperty(property: any, expression: any, dynamicFns: any);
    protected _bindTemplate(template: any, dynamicFns: any);
    attributeChangedCallback();
    render();
  }

const Element = Polymer.ElementMixin(HTMLElement) {
    protected _initializeProperties();
    connectedCallback();
    disconnectedCallback();
    protected _readyClients();
    protected _attachDom(dom: any);
    attributeChangedCallback(name: any, old: any, value: any);
    updateStyles(properties: any);
    resolveUrl(url: any, base: any);
  }

  class DomRepeat extends Polymer.OptionalMutableData(Polymer.Element) {
    items: Array;
    as: string;
    indexAs: string;
    itemsIndexAs: string;
    sort: Function;
    filter: Function;
    observe: string;
    delay: number;
    renderedItemCount: number;
    initialCount: number;
    targetFramerate: number;
    protected _targetFrameTime: number;
    protected _initializeProperties();
    protected _readyClients();
    protected _attachDom(dom: any);
    attributeChangedCallback(name: any, old: any, value: any);
    updateStyles(properties: any);
    resolveUrl(url: any, base: any);
    protected _shouldPropertyChange(property: any, value: any, old: any);
    render();
    protected _showHideChildren(hidden: any);
    itemForElement(el: any);
    indexForElement(el: any);
    modelForElement(el: any);
  }

  class DomIf extends Polymer.Element {
    if: boolean;
    restamp: boolean;
    protected _initializeProperties();
    protected _readyClients();
    protected _attachDom(dom: any);
    attributeChangedCallback(name: any, old: any, value: any);
    updateStyles(properties: any);
    resolveUrl(url: any, base: any);
    render();
    protected _showHideChildren();
  }

  interface ArraySelectorMixin {
    items: Array;
    multi: boolean;
    selected: Object;
    selectedItem: Object;
    toggle: boolean;
    clearSelection();
    isSelected(item: any);
    isIndexSelected(idx: any);
    deselect(item: any);
    deselectIndex(idx: any);
    select(item: any);
    selectIndex(idx: any);
}
  const ArraySelectorMixin: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<ArraySelectorMixin>;

  class ArraySelector extends ArraySelectorMixin(Polymer.Element) {
    items: Array;
    multi: boolean;
    selected: Object;
    selectedItem: Object;
    toggle: boolean;
    protected _initializeProperties();
    connectedCallback();
    disconnectedCallback();
    protected _readyClients();
    protected _attachDom(dom: any);
    attributeChangedCallback(name: any, old: any, value: any);
    updateStyles(properties: any);
    resolveUrl(url: any, base: any);
    clearSelection();
    isSelected(item: any);
    isIndexSelected(idx: any);
    deselect(item: any);
    deselectIndex(idx: any);
    select(item: any);
    selectIndex(idx: any);
  }

  class CustomStyle extends HTMLElement {
    getStyle();
  }

}