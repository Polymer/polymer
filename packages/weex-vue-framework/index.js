'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var latestNodeId = 1;

function TextNode (text) {
  this.instanceId = '';
  this.nodeId = latestNodeId++;
  this.parentNode = null;
  this.nodeType = 3;
  this.text = text;
}

// this will be preserved during build
var VueFactory = require('./factory');

var instances = {};
var modules = {};
var components = {};

var renderer = {
  TextNode: TextNode,
  instances: instances,
  modules: modules,
  components: components
};

/**
 * Prepare framework config, basically about the virtual-DOM and JS bridge.
 * @param {object} cfg
 */
function init (cfg) {
  renderer.Document = cfg.Document;
  renderer.Element = cfg.Element;
  renderer.Comment = cfg.Comment;
  renderer.compileBundle = cfg.compileBundle;
}

/**
 * Reset framework config and clear all registrations.
 */
function reset () {
  clear(instances);
  clear(modules);
  clear(components);
  delete renderer.Document;
  delete renderer.Element;
  delete renderer.Comment;
  delete renderer.compileBundle;
}

/**
 * Delete all keys of an object.
 * @param {object} obj
 */
function clear (obj) {
  for (var key in obj) {
    delete obj[key];
  }
}

/**
 * Create an instance with id, code, config and external data.
 * @param {string} instanceId
 * @param {string} appCode
 * @param {object} config
 * @param {object} data
 * @param {object} env { info, config, services }
 */
function createInstance (
  instanceId,
  appCode,
  config,
  data,
  env
) {
  if ( appCode === void 0 ) appCode = '';
  if ( config === void 0 ) config = {};
  if ( env === void 0 ) env = {};

  // Virtual-DOM object.
  var document = new renderer.Document(instanceId, config.bundleUrl);

  var instance = instances[instanceId] = {
    instanceId: instanceId, config: config, data: data,
    document: document
  };

  // Prepare native module getter and HTML5 Timer APIs.
  var moduleGetter = genModuleGetter(instanceId);
  var timerAPIs = getInstanceTimer(instanceId, moduleGetter);

  // Prepare `weex` instance variable.
  var weexInstanceVar = {
    config: config,
    document: document,
    supports: supports,
    requireModule: moduleGetter
  };
  Object.freeze(weexInstanceVar);

  // Each instance has a independent `Vue` module instance
  var Vue = instance.Vue = createVueModuleInstance(instanceId, moduleGetter);

  // The function which create a closure the JS Bundle will run in.
  // It will declare some instance variables like `Vue`, HTML5 Timer APIs etc.
  var instanceVars = Object.assign({
    Vue: Vue,
    weex: weexInstanceVar,
    // deprecated
    __weex_require_module__: weexInstanceVar.requireModule // eslint-disable-line
  }, timerAPIs, env.services);

  if (!callFunctionNative(instanceVars, appCode)) {
    // If failed to compile functionBody on native side,
    // fallback to 'callFunction()'.
    callFunction(instanceVars, appCode);
  }

  // Send `createFinish` signal to native.
  instance.document.taskCenter.send('dom', { action: 'createFinish' }, []);
}

/**
 * Destroy an instance with id. It will make sure all memory of
 * this instance released and no more leaks.
 * @param {string} instanceId
 */
function destroyInstance (instanceId) {
  var instance = instances[instanceId];
  if (instance && instance.app instanceof instance.Vue) {
    instance.document.destroy();
    instance.app.$destroy();
  }
  delete instances[instanceId];
}

/**
 * Refresh an instance with id and new top-level component data.
 * It will use `Vue.set` on all keys of the new data. So it's better
 * define all possible meaningful keys when instance created.
 * @param {string} instanceId
 * @param {object} data
 */
function refreshInstance (instanceId, data) {
  var instance = instances[instanceId];
  if (!instance || !(instance.app instanceof instance.Vue)) {
    return new Error(("refreshInstance: instance " + instanceId + " not found!"))
  }
  for (var key in data) {
    instance.Vue.set(instance.app, key, data[key]);
  }
  // Finally `refreshFinish` signal needed.
  instance.document.taskCenter.send('dom', { action: 'refreshFinish' }, []);
}

/**
 * Get the JSON object of the root element.
 * @param {string} instanceId
 */
function getRoot (instanceId) {
  var instance = instances[instanceId];
  if (!instance || !(instance.app instanceof instance.Vue)) {
    return new Error(("getRoot: instance " + instanceId + " not found!"))
  }
  return instance.app.$el.toJSON()
}

var jsHandlers = {
  fireEvent: function (id) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    return fireEvent.apply(void 0, [ instances[id] ].concat( args ))
  },
  callback: function (id) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    return callback.apply(void 0, [ instances[id] ].concat( args ))
  }
};

function fireEvent (instance, nodeId, type, e, domChanges) {
  var el = instance.document.getRef(nodeId);
  if (el) {
    return instance.document.fireEvent(el, type, e, domChanges)
  }
  return new Error(("invalid element reference \"" + nodeId + "\""))
}

function callback (instance, callbackId, data, ifKeepAlive) {
  var result = instance.document.taskCenter.callback(callbackId, data, ifKeepAlive);
  instance.document.taskCenter.send('dom', { action: 'updateFinish' }, []);
  return result
}

/**
 * Accept calls from native (event or callback).
 *
 * @param  {string} id
 * @param  {array} tasks list with `method` and `args`
 */
function receiveTasks (id, tasks) {
  var instance = instances[id];
  if (instance && Array.isArray(tasks)) {
    var results = [];
    tasks.forEach(function (task) {
      var handler = jsHandlers[task.method];
      var args = [].concat( task.args );
      /* istanbul ignore else */
      if (typeof handler === 'function') {
        args.unshift(id);
        results.push(handler.apply(void 0, args));
      }
    });
    return results
  }
  return new Error(("invalid instance id \"" + id + "\" or tasks"))
}

/**
 * Register native modules information.
 * @param {object} newModules
 */
function registerModules (newModules) {
  var loop = function ( name ) {
    if (!modules[name]) {
      modules[name] = {};
    }
    newModules[name].forEach(function (method) {
      if (typeof method === 'string') {
        modules[name][method] = true;
      } else {
        modules[name][method.name] = method.args;
      }
    });
  };

  for (var name in newModules) loop( name );
}

/**
 * Check whether the module or the method has been registered.
 * @param {String} module name
 * @param {String} method name (optional)
 */
function isRegisteredModule (name, method) {
  if (typeof method === 'string') {
    return !!(modules[name] && modules[name][method])
  }
  return !!modules[name]
}

/**
 * Register native components information.
 * @param {array} newComponents
 */
function registerComponents (newComponents) {
  if (Array.isArray(newComponents)) {
    newComponents.forEach(function (component) {
      if (!component) {
        return
      }
      if (typeof component === 'string') {
        components[component] = true;
      } else if (typeof component === 'object' && typeof component.type === 'string') {
        components[component.type] = component;
      }
    });
  }
}

/**
 * Check whether the component has been registered.
 * @param {String} component name
 */
function isRegisteredComponent (name) {
  return !!components[name]
}

/**
 * Detects whether Weex supports specific features.
 * @param {String} condition
 */
function supports (condition) {
  if (typeof condition !== 'string') { return null }

  var res = condition.match(/^@(\w+)\/(\w+)(\.(\w+))?$/i);
  if (res) {
    var type = res[1];
    var name = res[2];
    var method = res[4];
    switch (type) {
      case 'module': return isRegisteredModule(name, method)
      case 'component': return isRegisteredComponent(name)
    }
  }

  return null
}

/**
 * Create a fresh instance of Vue for each Weex instance.
 */
function createVueModuleInstance (instanceId, moduleGetter) {
  var exports = {};
  VueFactory(exports, renderer);
  var Vue = exports.Vue;

  var instance = instances[instanceId];

  // patch reserved tag detection to account for dynamically registered
  // components
  var isReservedTag = Vue.config.isReservedTag || (function () { return false; });
  Vue.config.isReservedTag = function (name) {
    return components[name] || isReservedTag(name)
  };

  // expose weex-specific info
  Vue.prototype.$instanceId = instanceId;
  Vue.prototype.$document = instance.document;

  // expose weex native module getter on subVue prototype so that
  // vdom runtime modules can access native modules via vnode.context
  Vue.prototype.$requireWeexModule = moduleGetter;

  // Hack `Vue` behavior to handle instance information and data
  // before root component created.
  Vue.mixin({
    beforeCreate: function beforeCreate () {
      var options = this.$options;
      // root component (vm)
      if (options.el) {
        // set external data of instance
        var dataOption = options.data;
        var internalData = (typeof dataOption === 'function' ? dataOption() : dataOption) || {};
        options.data = Object.assign(internalData, instance.data);
        // record instance by id
        instance.app = this;
      }
    }
  });

  /**
   * @deprecated Just instance variable `weex.config`
   * Get instance config.
   * @return {object}
   */
  Vue.prototype.$getConfig = function () {
    if (instance.app instanceof Vue) {
      return instance.config
    }
  };

  return Vue
}

/**
 * Generate native module getter. Each native module has several
 * methods to call. And all the behaviors is instance-related. So
 * this getter will return a set of methods which additionally
 * send current instance id to native when called.
 * @param  {string}  instanceId
 * @return {function}
 */
function genModuleGetter (instanceId) {
  var instance = instances[instanceId];
  return function (name) {
    var nativeModule = modules[name] || [];
    var output = {};
    var loop = function ( methodName ) {
      Object.defineProperty(output, methodName, {
        enumerable: true,
        configurable: true,
        get: function proxyGetter () {
          return function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return instance.document.taskCenter.send('module', { module: name, method: methodName }, args)
          }
        },
        set: function proxySetter (val) {
          if (typeof val === 'function') {
            return instance.document.taskCenter.send('module', { module: name, method: methodName }, [val])
          }
        }
      });
    };

    for (var methodName in nativeModule) loop( methodName );
    return output
  }
}

/**
 * Generate HTML5 Timer APIs. An important point is that the callback
 * will be converted into callback id when sent to native. So the
 * framework can make sure no side effect of the callback happened after
 * an instance destroyed.
 * @param  {[type]} instanceId   [description]
 * @param  {[type]} moduleGetter [description]
 * @return {[type]}              [description]
 */
function getInstanceTimer (instanceId, moduleGetter) {
  var instance = instances[instanceId];
  var timer = moduleGetter('timer');
  var timerAPIs = {
    setTimeout: function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var handler = function () {
        args[0].apply(args, args.slice(2));
      };

      timer.setTimeout(handler, args[1]);
      return instance.document.taskCenter.callbackManager.lastCallbackId.toString()
    },
    setInterval: function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var handler = function () {
        args[0].apply(args, args.slice(2));
      };

      timer.setInterval(handler, args[1]);
      return instance.document.taskCenter.callbackManager.lastCallbackId.toString()
    },
    clearTimeout: function (n) {
      timer.clearTimeout(n);
    },
    clearInterval: function (n) {
      timer.clearInterval(n);
    }
  };
  return timerAPIs
}

/**
 * Call a new function body with some global objects.
 * @param  {object} globalObjects
 * @param  {string} code
 * @return {any}
 */
function callFunction (globalObjects, body) {
  var globalKeys = [];
  var globalValues = [];
  for (var key in globalObjects) {
    globalKeys.push(key);
    globalValues.push(globalObjects[key]);
  }
  globalKeys.push(body);

  var result = new (Function.prototype.bind.apply( Function, [ null ].concat( globalKeys) ));
  return result.apply(void 0, globalValues)
}

/**
 * Call a new function generated on the V8 native side.
 *
 * This function helps speed up bundle compiling. Normally, the V8
 * engine needs to download, parse, and compile a bundle on every
 * visit. If 'compileBundle()' is available on native side,
 * the downloding, parsing, and compiling steps would be skipped.
 * @param  {object} globalObjects
 * @param  {string} body
 * @return {boolean}
 */
function callFunctionNative (globalObjects, body) {
  if (typeof renderer.compileBundle !== 'function') {
    return false
  }

  var fn = void 0;
  var isNativeCompileOk = false;
  var script = '(function (';
  var globalKeys = [];
  var globalValues = [];
  for (var key in globalObjects) {
    globalKeys.push(key);
    globalValues.push(globalObjects[key]);
  }
  for (var i = 0; i < globalKeys.length - 1; ++i) {
    script += globalKeys[i];
    script += ',';
  }
  script += globalKeys[globalKeys.length - 1];
  script += ') {';
  script += body;
  script += '} )';

  try {
    var weex = globalObjects.weex || {};
    var config = weex.config || {};
    fn = renderer.compileBundle(script,
      config.bundleUrl,
      config.bundleDigest,
      config.codeCachePath);
    if (fn && typeof fn === 'function') {
      fn.apply(void 0, globalValues);
      isNativeCompileOk = true;
    }
  } catch (e) {
    console.error(e);
  }

  return isNativeCompileOk
}

exports.init = init;
exports.reset = reset;
exports.createInstance = createInstance;
exports.destroyInstance = destroyInstance;
exports.refreshInstance = refreshInstance;
exports.getRoot = getRoot;
exports.receiveTasks = receiveTasks;
exports.registerModules = registerModules;
exports.isRegisteredModule = isRegisteredModule;
exports.registerComponents = registerComponents;
exports.isRegisteredComponent = isRegisteredComponent;
exports.supports = supports;
