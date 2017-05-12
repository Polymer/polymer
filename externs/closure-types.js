
/**
 * @fileoverview Closure types for Polymer mixins
 * @externs
 *
 * This file is generated, do not edit manually
 */
/* eslint-disable no-unused-vars, strict */

/**
* @record
*/
function Polymer_PropertyAccessors(){}
/**
*/
Polymer_PropertyAccessors.prototype._initializeProperties = function(){};
/**
* @param {Object} props
*/
Polymer_PropertyAccessors.prototype._initializeProtoProperties = function(props){};
/**
* @param {Object} props
*/
Polymer_PropertyAccessors.prototype._initializeInstanceProperties = function(props){};
/**
* @param {string} attribute
* @param {string} value
*/
Polymer_PropertyAccessors.prototype._ensureAttribute = function(attribute, value){};
/**
* @param {string} attribute
* @param {string} value
* @param {*} type
*/
Polymer_PropertyAccessors.prototype._attributeToProperty = function(attribute, value, type){};
/**
* @param {string} property
* @param {string=} attribute
* @param {*=} value
*/
Polymer_PropertyAccessors.prototype._propertyToAttribute = function(property, attribute, value){};
/**
* @param {Element} node
* @param {*} value
* @param {string} attribute
*/
Polymer_PropertyAccessors.prototype._valueToNodeAttribute = function(node, value, attribute){};
/**
* @param {*} value
* @return {(string|undefined)}
*/
Polymer_PropertyAccessors.prototype._serializeValue = function(value){};
/**
* @param {string} value
* @param {*} type
* @return {*}
*/
Polymer_PropertyAccessors.prototype._deserializeValue = function(value, type){};
/**
* @param {string} property
* @param {boolean=} readOnly
*/
Polymer_PropertyAccessors.prototype._createPropertyAccessor = function(property, readOnly){};
/**
* @param {string} property
* @return {boolean}
*/
Polymer_PropertyAccessors.prototype._hasAccessor = function(property){};
/**
* @param {string} property
* @param {*} value
*/
Polymer_PropertyAccessors.prototype._setProperty = function(property, value){};
/**
* @param {string} property
* @param {*} value
* @return {boolean}
*/
Polymer_PropertyAccessors.prototype._setPendingProperty = function(property, value){};
/**
* @param {string} prop
* @return {boolean}
*/
Polymer_PropertyAccessors.prototype._isPropertyPending = function(prop){};
/**
*/
Polymer_PropertyAccessors.prototype._invalidateProperties = function(){};
/**
*/
Polymer_PropertyAccessors.prototype._flushProperties = function(){};
/**
*/
Polymer_PropertyAccessors.prototype.ready = function(){};
/**
* @param {Object} currentProps
* @param {Object} changedProps
* @param {Object} oldProps
*/
Polymer_PropertyAccessors.prototype._propertiesChanged = function(currentProps, changedProps, oldProps){};
/**
* @param {string} property
* @param {*} value
* @param {*} old
* @return {boolean}
*/
Polymer_PropertyAccessors.prototype._shouldPropertyChange = function(property, value, old){};
/**
* @record
*/
function Polymer_TemplateStamp(){}
/**
*/
Polymer_TemplateStamp.prototype._initializeProperties = function(){};
/**
* @param {HTMLTemplateElement} template
* @return {DocumentFragment}
*/
Polymer_TemplateStamp.prototype._stampTemplate = function(template){};
/**
* @param {Node} node
* @param {string} eventName
* @param {string} methodName
* @param {*=} context
* @return {Function}
*/
Polymer_TemplateStamp.prototype._addMethodEventListenerToNode = function(node, eventName, methodName, context){};
/**
* @param {Node} node
* @param {string} eventName
* @param {Function} handler
*/
Polymer_TemplateStamp.prototype._addEventListenerToNode = function(node, eventName, handler){};
/**
* @param {Node} node
* @param {string} eventName
* @param {Function} handler
*/
Polymer_TemplateStamp.prototype._removeEventListenerFromNode = function(node, eventName, handler){};
/**
* @record
* @extends {Polymer_TemplateStamp}
* @extends {Polymer_PropertyAccessors}
*/
function Polymer_PropertyEffects(){}
/**
* @override
*/
Polymer_PropertyEffects.prototype._initializeProperties = function(){};
/**
* @override
* @param {*} props
*/
Polymer_PropertyEffects.prototype._initializeProtoProperties = function(props){};
/**
* @override
* @param {*} props
*/
Polymer_PropertyEffects.prototype._initializeInstanceProperties = function(props){};
/**
* @param {string} property
* @param {string} type
* @param {Object=} effect
*/
Polymer_PropertyEffects.prototype._addPropertyEffect = function(property, type, effect){};
/**
* @param {string} property
* @param {string} type
* @param {Object=} effect
*/
Polymer_PropertyEffects.prototype._removePropertyEffect = function(property, type, effect){};
/**
* @param {string} property
* @param {string=} type
* @return {boolean}
*/
Polymer_PropertyEffects.prototype._hasPropertyEffect = function(property, type){};
/**
* @param {string} property
* @return {boolean}
*/
Polymer_PropertyEffects.prototype._hasReadOnlyEffect = function(property){};
/**
* @param {string} property
* @return {boolean}
*/
Polymer_PropertyEffects.prototype._hasNotifyEffect = function(property){};
/**
* @param {string} property
* @return {boolean}
*/
Polymer_PropertyEffects.prototype._hasReflectEffect = function(property){};
/**
* @param {string} property
* @return {boolean}
*/
Polymer_PropertyEffects.prototype._hasComputedEffect = function(property){};
/**
* @param {(string|!Array.<(number|string)>)} path
* @param {*} value
* @param {boolean=} shouldNotify
* @param {boolean=} isPathNotification
* @return {boolean}
*/
Polymer_PropertyEffects.prototype._setPendingPropertyOrPath = function(path, value, shouldNotify, isPathNotification){};
/**
* @param {Node} node
* @param {string} prop
* @param {*} value
*/
Polymer_PropertyEffects.prototype._setUnmanagedPropertyToNode = function(node, prop, value){};
/**
* @override
* @param {*} property
* @param {*} value
* @param {*} shouldNotify
*/
Polymer_PropertyEffects.prototype._setPendingProperty = function(property, value, shouldNotify){};
/**
* @override
* @param {*} property
* @param {*} value
*/
Polymer_PropertyEffects.prototype._setProperty = function(property, value){};
/**
* @override
*/
Polymer_PropertyEffects.prototype._invalidateProperties = function(){};
/**
* @param {Object} client
*/
Polymer_PropertyEffects.prototype._enqueueClient = function(client){};
/**
*/
Polymer_PropertyEffects.prototype._flushClients = function(){};
/**
* @param {Object} props
* @param {boolean=} setReadOnly
*/
Polymer_PropertyEffects.prototype.setProperties = function(props, setReadOnly){};
/**
* @override
*/
Polymer_PropertyEffects.prototype.ready = function(){};
/**
*/
Polymer_PropertyEffects.prototype._readyClients = function(){};
/**
* @override
* @param {*} currentProps
* @param {*} changedProps
* @param {*} oldProps
*/
Polymer_PropertyEffects.prototype._propertiesChanged = function(currentProps, changedProps, oldProps){};
/**
* @param {Object} changedProps
* @param {Object} oldProps
* @param {boolean} hasPaths
*/
Polymer_PropertyEffects.prototype._propagatePropertyChanges = function(changedProps, oldProps, hasPaths){};
/**
* @param {(string|!Array.<(string|number)>)} to
* @param {(string|!Array.<(string|number)>)} from
*/
Polymer_PropertyEffects.prototype.linkPaths = function(to, from){};
/**
* @param {(string|!Array.<(string|number)>)} path
*/
Polymer_PropertyEffects.prototype.unlinkPaths = function(path){};
/**
* @param {string} path
* @param {Array} splices
*/
Polymer_PropertyEffects.prototype.notifySplices = function(path, splices){};
/**
* @param {(string|!Array.<(string|number)>)} path
* @param {Object=} root
* @return {*}
*/
Polymer_PropertyEffects.prototype.get = function(path, root){};
/**
* @param {(string|!Array.<(string|number)>)} path
* @param {*} value
* @param {Object=} root
*/
Polymer_PropertyEffects.prototype.set = function(path, value, root){};
/**
* @param {string} path
* @param {*} items
* @return {number}
*/
Polymer_PropertyEffects.prototype.push = function(path, items){};
/**
* @param {string} path
* @return {*}
*/
Polymer_PropertyEffects.prototype.pop = function(path){};
/**
* @param {string} path
* @param {number} start
* @param {number} deleteCount
* @param {*} items
* @return {Array}
*/
Polymer_PropertyEffects.prototype.splice = function(path, start, deleteCount, items){};
/**
* @param {string} path
* @return {*}
*/
Polymer_PropertyEffects.prototype.shift = function(path){};
/**
* @param {string} path
* @param {*} items
* @return {number}
*/
Polymer_PropertyEffects.prototype.unshift = function(path, items){};
/**
* @param {string} path
* @param {*=} value
*/
Polymer_PropertyEffects.prototype.notifyPath = function(path, value){};
/**
* @param {string} property
* @param {boolean=} protectedSetter
*/
Polymer_PropertyEffects.prototype._createReadOnlyProperty = function(property, protectedSetter){};
/**
* @param {string} property
* @param {string} methodName
* @param {boolean=} dynamicFn
*/
Polymer_PropertyEffects.prototype._createPropertyObserver = function(property, methodName, dynamicFn){};
/**
* @param {string} expression
* @param {Object=} dynamicFns
*/
Polymer_PropertyEffects.prototype._createMethodObserver = function(expression, dynamicFns){};
/**
* @param {string} property
*/
Polymer_PropertyEffects.prototype._createNotifyingProperty = function(property){};
/**
* @param {string} property
*/
Polymer_PropertyEffects.prototype._createReflectedProperty = function(property){};
/**
* @param {string} property
* @param {string} expression
* @param {Object=} dynamicFns
*/
Polymer_PropertyEffects.prototype._createComputedProperty = function(property, expression, dynamicFns){};
/**
* @param {HTMLTemplateElement} template
* @param {boolean=} instanceBinding
* @return {Object}
*/
Polymer_PropertyEffects.prototype._bindTemplate = function(template, instanceBinding){};
/**
* @param {HTMLTemplateElement} template
* @return {DocumentFragment}
*/
Polymer_PropertyEffects.prototype._stampTemplate = function(template){};
/**
* @param {DocumentFragment} dom
*/
Polymer_PropertyEffects.prototype._removeBoundDom = function(dom){};
/**
* @record
* @extends {Polymer_PropertyEffects}
*/
function Polymer_ElementMixin(){}
/**
* @override
*/
Polymer_ElementMixin.prototype._initializeProperties = function(){};
/**
* @override
*/
Polymer_ElementMixin.prototype.connectedCallback = function(){};
/**
* @override
*/
Polymer_ElementMixin.prototype.disconnectedCallback = function(){};
/**
* @override
*/
Polymer_ElementMixin.prototype.ready = function(){};
/**
* @override
*/
Polymer_ElementMixin.prototype._readyClients = function(){};
/**
* @param {NodeList} dom
* @return {Node}
*/
Polymer_ElementMixin.prototype._attachDom = function(dom){};
/**
* @override
* @param {*} name
* @param {*} old
* @param {*} value
*/
Polymer_ElementMixin.prototype.attributeChangedCallback = function(name, old, value){};
/**
* @param {Object=} properties
*/
Polymer_ElementMixin.prototype.updateStyles = function(properties){};
/**
* @param {string} url
* @param {string=} base
* @return {string}
*/
Polymer_ElementMixin.prototype.resolveUrl = function(url, base){};
/**
* @record
*/
function Polymer_GestureEventListeners(){}
/**
* @param {*} node
* @param {*} eventName
* @param {*} handler
*/
Polymer_GestureEventListeners.prototype._addEventListenerToNode = function(node, eventName, handler){};
/**
* @param {*} node
* @param {*} eventName
* @param {*} handler
*/
Polymer_GestureEventListeners.prototype._removeEventListenerFromNode = function(node, eventName, handler){};
/**
* @record
* @extends {Polymer_ElementMixin}
* @extends {Polymer_GestureEventListeners}
*/
function Polymer_LegacyElementMixin(){}
/**
*/
Polymer_LegacyElementMixin.prototype.created = function(){};
/**
*/
Polymer_LegacyElementMixin.prototype.attached = function(){};
/**
*/
Polymer_LegacyElementMixin.prototype.detached = function(){};
/**
*/
Polymer_LegacyElementMixin.prototype.attributeChanged = function(){};
/**
* @override
*/
Polymer_LegacyElementMixin.prototype._initializeProperties = function(){};
/**
*/
Polymer_LegacyElementMixin.prototype._registered = function(){};
/**
* @override
*/
Polymer_LegacyElementMixin.prototype.ready = function(){};
/**
*/
Polymer_LegacyElementMixin.prototype._ensureAttributes = function(){};
/**
*/
Polymer_LegacyElementMixin.prototype._applyListeners = function(){};
/**
* @param {*} value
* @return {string}
*/
Polymer_LegacyElementMixin.prototype.serialize = function(value){};
/**
* @param {string} value
* @param {*} type
* @return {*}
*/
Polymer_LegacyElementMixin.prototype.deserialize = function(value, type){};
/**
* @param {string} property
* @param {string=} attribute
* @param {*=} value
*/
Polymer_LegacyElementMixin.prototype.reflectPropertyToAttribute = function(property, attribute, value){};
/**
* @param {*} value
* @param {string} attribute
* @param {Element} node
*/
Polymer_LegacyElementMixin.prototype.serializeValueToAttribute = function(value, attribute, node){};
/**
* @param {Object} prototype
* @param {Object} api
* @return {Object}
*/
Polymer_LegacyElementMixin.prototype.extend = function(prototype, api){};
/**
* @param {Object} target
* @param {Object} source
* @return {Object}
*/
Polymer_LegacyElementMixin.prototype.mixin = function(target, source){};
/**
* @param {Object} object
* @param {Object} prototype
* @return {Object}
*/
Polymer_LegacyElementMixin.prototype.chainObject = function(object, prototype){};
/**
* @param {HTMLTemplateElement} template
* @return {DocumentFragment}
*/
Polymer_LegacyElementMixin.prototype.instanceTemplate = function(template){};
/**
* @param {string} type
* @param {*=} detail
* @param {Object=} options
* @return {Event}
*/
Polymer_LegacyElementMixin.prototype.fire = function(type, detail, options){};
/**
* @param {Element} node
* @param {string} eventName
* @param {string} methodName
*/
Polymer_LegacyElementMixin.prototype.listen = function(node, eventName, methodName){};
/**
* @param {Element} node
* @param {string} eventName
* @param {string} methodName
*/
Polymer_LegacyElementMixin.prototype.unlisten = function(node, eventName, methodName){};
/**
* @param {string=} direction
* @param {HTMLElement=} node
*/
Polymer_LegacyElementMixin.prototype.setScrollDirection = function(direction, node){};
/**
* @param {string} slctr
* @return {Element}
*/
Polymer_LegacyElementMixin.prototype.$$ = function(slctr){};
/**
*/
Polymer_LegacyElementMixin.prototype.distributeContent = function(){};
/**
* @return {Array.<Node>}
*/
Polymer_LegacyElementMixin.prototype.getEffectiveChildNodes = function(){};
/**
* @param {string} selector
* @return {Array.<Node>}
*/
Polymer_LegacyElementMixin.prototype.queryDistributedElements = function(selector){};
/**
* @return {Array.<Node>}
*/
Polymer_LegacyElementMixin.prototype.getEffectiveChildren = function(){};
/**
* @return {string}
*/
Polymer_LegacyElementMixin.prototype.getEffectiveTextContent = function(){};
/**
* @param {string} selector
* @return {Object.<Node>}
*/
Polymer_LegacyElementMixin.prototype.queryEffectiveChildren = function(selector){};
/**
* @param {string} selector
* @return {Array.<Node>}
*/
Polymer_LegacyElementMixin.prototype.queryAllEffectiveChildren = function(selector){};
/**
* @param {string=} slctr
* @return {Array.<Node>}
*/
Polymer_LegacyElementMixin.prototype.getContentChildNodes = function(slctr){};
/**
* @param {string=} slctr
* @return {Array.<HTMLElement>}
*/
Polymer_LegacyElementMixin.prototype.getContentChildren = function(slctr){};
/**
* @param {?Node} node
* @return {boolean}
*/
Polymer_LegacyElementMixin.prototype.isLightDescendant = function(node){};
/**
* @param {HTMLElement=} node
* @return {boolean}
*/
Polymer_LegacyElementMixin.prototype.isLocalDescendant = function(node){};
/**
* @param {*} container
* @param {*} shouldObserve
*/
Polymer_LegacyElementMixin.prototype.scopeSubtree = function(container, shouldObserve){};
/**
* @param {string} property
* @return {string}
*/
Polymer_LegacyElementMixin.prototype.getComputedStyleValue = function(property){};
/**
* @param {string} jobName
* @param {function ()} callback
* @param {number} wait
* @return {Object}
*/
Polymer_LegacyElementMixin.prototype.debounce = function(jobName, callback, wait){};
/**
* @param {string} jobName
* @return {boolean}
*/
Polymer_LegacyElementMixin.prototype.isDebouncerActive = function(jobName){};
/**
* @param {string} jobName
*/
Polymer_LegacyElementMixin.prototype.flushDebouncer = function(jobName){};
/**
* @param {string} jobName
*/
Polymer_LegacyElementMixin.prototype.cancelDebouncer = function(jobName){};
/**
* @param {Function} callback
* @param {number=} waitTime
* @return {number}
*/
Polymer_LegacyElementMixin.prototype.async = function(callback, waitTime){};
/**
* @param {number} handle
*/
Polymer_LegacyElementMixin.prototype.cancelAsync = function(handle){};
/**
* @param {string} tag
* @param {Object} props
* @return {Element}
*/
Polymer_LegacyElementMixin.prototype.create = function(tag, props){};
/**
* @param {string} href
* @param {Function} onload
* @param {Function} onerror
* @param {boolean} optAsync
* @return {HTMLLinkElement}
*/
Polymer_LegacyElementMixin.prototype.importHref = function(href, onload, onerror, optAsync){};
/**
* @param {string} selector
* @param {Element=} node
* @return {boolean}
*/
Polymer_LegacyElementMixin.prototype.elementMatches = function(selector, node){};
/**
* @param {string} name
* @param {boolean=} bool
* @param {HTMLElement=} node
*/
Polymer_LegacyElementMixin.prototype.toggleAttribute = function(name, bool, node){};
/**
* @param {string} name
* @param {boolean=} bool
* @param {HTMLElement=} node
*/
Polymer_LegacyElementMixin.prototype.toggleClass = function(name, bool, node){};
/**
* @param {string} transformText
* @param {HTMLElement=} node
*/
Polymer_LegacyElementMixin.prototype.transform = function(transformText, node){};
/**
* @param {number} x
* @param {number} y
* @param {number} z
* @param {HTMLElement=} node
*/
Polymer_LegacyElementMixin.prototype.translate3d = function(x, y, z, node){};
/**
* @param {(string|!Array.<(number|string)>)} arrayOrPath
* @param {*} item
* @return {Array}
*/
Polymer_LegacyElementMixin.prototype.arrayDelete = function(arrayOrPath, item){};
/**
* @param {string} level
* @param {Array} args
*/
Polymer_LegacyElementMixin.prototype._logger = function(level, args){};
/**
* @param {*} args
*/
Polymer_LegacyElementMixin.prototype._log = function(args){};
/**
* @param {*} args
*/
Polymer_LegacyElementMixin.prototype._warn = function(args){};
/**
* @param {*} args
*/
Polymer_LegacyElementMixin.prototype._error = function(args){};
/**
* @param {*} args
* @return {string}
*/
Polymer_LegacyElementMixin.prototype._logf = function(args){};
/**
* @record
*/
function Polymer_MutableData(){}
/**
* @param {string} property
* @param {*} value
* @param {*} old
* @return {boolean}
*/
Polymer_MutableData.prototype._shouldPropertyChange = function(property, value, old){};
/**
* @record
*/
function Polymer_OptionalMutableData(){}
/** @type {boolean} */
Polymer_OptionalMutableData.prototype.mutableData;

/**
* @param {string} property
* @param {*} value
* @param {*} old
* @return {boolean}
*/
Polymer_OptionalMutableData.prototype._shouldPropertyChange = function(property, value, old){};
/**
* @record
*/
function Polymer_ArraySelectorMixin(){}
/** @type {Array} */
Polymer_ArraySelectorMixin.prototype.items;

/** @type {boolean} */
Polymer_ArraySelectorMixin.prototype.multi;

/** @type {Object} */
Polymer_ArraySelectorMixin.prototype.selected;

/** @type {Object} */
Polymer_ArraySelectorMixin.prototype.selectedItem;

/** @type {boolean} */
Polymer_ArraySelectorMixin.prototype.toggle;

/**
*/
Polymer_ArraySelectorMixin.prototype.clearSelection = function(){};
/**
* @param {*} item
* @return {boolean}
*/
Polymer_ArraySelectorMixin.prototype.isSelected = function(item){};
/**
* @param {*} idx
* @return {boolean}
*/
Polymer_ArraySelectorMixin.prototype.isIndexSelected = function(idx){};
/**
* @param {*} item
*/
Polymer_ArraySelectorMixin.prototype.deselect = function(item){};
/**
* @param {number} idx
*/
Polymer_ArraySelectorMixin.prototype.deselectIndex = function(idx){};
/**
* @param {*} item
*/
Polymer_ArraySelectorMixin.prototype.select = function(item){};
/**
* @param {number} idx
*/
Polymer_ArraySelectorMixin.prototype.selectIndex = function(idx){};