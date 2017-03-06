declare namespace Polymer {
  type Constructor<T> = new(...args: any[]) => T;

  function dedupingMixin(mixin: Function): Function;

  class DomModule extends HTMLElement {
    register(id: any);
  }

  interface PropertyAccessors {
    _initializeProperties();
    _initializeProtoProperties(props: any);
    _ensureAttribute(attribute: any, value: any);
    _attributeToProperty(attribute: any, value: any, type: any);
    _propertyToAttribute(property: any, attribute: any, value: any);
    _valueToNodeAttribute(node: any, value: any, attribute: any);
    _serializeValue(value: any);
    _deserializeValue(value: any, type: any);
    _createPropertyAccessor(property: any, readOnly: any);
    _setProperty(property: any, value: any);
    _setPendingProperty(property: any, value: any);
    _isPropertyPending(prop: any);
    _invalidateProperties();
    _flushProperties();
    _propertiesChanged(currentProps: any, changedProps: any, oldProps: any);
    _shouldPropertyChange(property: any, value: any, old: any);
  }
  const PropertyAccessors: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<PropertyAccessors>;

  interface TemplateStamp {
    _stampTemplate(template: any);
    _parseTemplateAnnotations(template: any);
    _addMethodEventListenerToNode(node: any, eventName: any, methodName: any, context: any);
    _addEventListenerToNode(node: any, eventName: any, handler: any);
    _removeEventListenerFromNode(node: any, eventName: any, handler: any);
  }
  const TemplateStamp: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<TemplateStamp>;

  interface PropertyEffects extends TemplateStamp, PropertyAccessors{
    _initializeProperties();
    _initializeProtoProperties(props: any);
    _addPropertyEffect(property: any, type: any, effect: any);
    _hasPropertyEffect(property: any, type: any);
    _hasReadOnlyEffect(property: any);
    _hasNotifyEffect(property: any);
    _hasReflectEffect(property: any);
    _hasComputedEffect(property: any);
    _setPendingPropertyOrPath(path: any, value: any, shouldNotify: any, isPathNotification: any);
    _setUnmanagedPropertyToNode(node: any, prop: any, value: any);
    _setPendingProperty(property: any, value: any, shouldNotify: any);
    _setProperty(property: any, value: any);
    _invalidateProperties();
    _enqueueClient(client: any);
    _flushClients();
    setProperties(props: any);
    _flushProperties();
    ready();
    _readyClients();
    _stampTemplate(template: any);
    _propertiesChanged(currentProps: any, changedProps: any, oldProps: any);
    linkPaths(to: any, from: any);
    unlinkPaths(path: any);
    notifySplices(path: any, splices: any);
    get(path: any, root: any);
    set(path: any, value: any, root: any);
    push(path: any, ...items: any[]);
    pop(path: any);
    splice(path: any, start: any, deleteCount: any, ...items: any[]);
    shift(path: any);
    unshift(path: any, ...items: any[]);
    notifyPath(path: any, value: any);
    _createReadOnlyProperty(property: any, protectedSetter: any);
    _createPropertyObserver(property: any, methodName: any, dynamicFn: any);
    _createMethodObserver(expression: any, dynamicFns: any);
    _createNotifyingProperty(property: any);
    _createReflectedProperty(property: any);
    _createComputedProperty(property: any, expression: any, dynamicFns: any);
    _bindTemplate(template: any, dynamicFns: any);
  }
  const PropertyEffects: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<PropertyEffects>;

  interface ElementMixin extends PropertyEffects{
    _initializeProperties();
    connectedCallback();
    disconnectedCallback();
    _readyClients();
    _attachDom(dom: any);
    attributeChangedCallback(name: any, old: any, value: any);
    updateStyles(properties: any);
    resolveUrl(url: any, base: any);
  }
  const ElementMixin: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<ElementMixin>;

  interface GestureEventListeners {
    _addEventListenerToNode(node: any, eventName: any, handler: any);
    _removeEventListenerFromNode(node: any, eventName: any, handler: any);
  }
  const GestureEventListeners: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<GestureEventListeners>;

  function importHref(href: string, onload: Function, onerror: Function, optAsync: boolean): HTMLLinkElement;

  function enqueueDebouncer(debouncer: Polymer.Debouncer);

  function flush();

  function dom(obj: (Node|Event)): (DomApi|EventApi);

  interface LegacyElementMixin extends ElementMixin, GestureEventListeners{
    created();
    attached();
    detached();
    attributeChanged();
    _initializeProperties();
    _registered();
    ready();
    _ensureAttributes();
    _applyListeners();
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
    _logger(level: any, args: any);
    _log(...args: any[]);
    _warn(...args: any[]);
    _error(...args: any[]);
    _logf(...args: any[]);
  }
  const LegacyElementMixin: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<LegacyElementMixin>;

  function mixinBehaviors(behaviors: (Object|Array), klass: HTMLElement);

  function Class(info: Object): Polymer.LegacyElement;

  interface MutableData {
    _shouldPropertyChange(property: any, value: any, old: any);
  }
  const MutableData: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<MutableData>;

  interface OptionalMutableData {
    mutableData: boolean;
    _shouldPropertyChange(property: any, value: any, old: any);
  }
  const OptionalMutableData: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<OptionalMutableData>;

  class DomBind extends Polymer.OptionalMutableData(Polymer.PropertyEffects(HTMLElement)) {
    attributeChangedCallback();
    render();
  }

  const Element = Polymer.ElementMixin(HTMLElement);

  class DomRepeat extends Polymer.OptionalMutableData(Polymer.Element) {
    items: any[];
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
    _targetFrameTime: number;
    render();
    _showHideChildren(hidden: any);
    itemForElement(el: any);
    indexForElement(el: any);
    modelForElement(el: any);
  }

  class DomIf extends Polymer.Element {
    if: boolean;
    restamp: boolean;
    render();
    _showHideChildren();
  }

  interface ArraySelectorMixin {
    items: any[];
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
  }

  class CustomStyle extends HTMLElement {
    getStyle();
  }

}