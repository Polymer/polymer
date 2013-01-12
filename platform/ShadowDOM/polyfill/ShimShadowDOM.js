(function(scope) {

// imports

var Projection = scope.Projection;
var LightDOM = scope.LightDOM;

// ShadowRoot constructor

var ShadowRoot = function(inNode) {
  // ShadowDOM implies LightDOM
  if (!inNode.lightDOM) {
    new LightDOM(inNode);
  }
  // make a new root
  var root = document.createElement("shadow-root");
  // chain shadows
  root.olderSubtree = inNode.shadow;
  // mutual references
  root.host = inNode;
  inNode.shadow = root;
  // get shadows store
  var shadows = inNode.shadows;
  // if there is no store
  if (!shadows) {
    // create shadow store
    shadows = inNode.shadows = document.createDocumentFragment();
    // add API to inNode
    inNode.distribute = distribute;
  }
  // install the root
  shadows.appendChild(root);
  // return the reference
  return root;
};

var isInsertionPoint = function(inNode) {
  return (inNode.tagName == "SHADOW" || inNode.tagName == "CONTENT");
};

// ShadowDOM Query (simplistic)

// custom selectors:
//
// ~        = any node with lightDOM
// #<id>    = node with id = <id>
// *        = any non-Text node
// .<class> = any node with <class> in it's classList
// [<attr>] = any node with attribute <attr>
//
var matches = function(inNode, inSlctr) {
  if (inSlctr == "~") {
    return Boolean(inNode.lightDOM);
  }
  if (inSlctr[0] == '#') {
    return inNode.id == inSlctr.slice(1);
  }
  if (inSlctr == '*') {
    return inNode.nodeName != '#text';
  }
  if (inSlctr[0] == '.') {
    return inNode.classList && inNode.classList.contains(inSlctr.slice(1));
  }
  if (inSlctr[0] == '[') {
    return inNode.hasAttribute && inNode.hasAttribute(inSlctr.slice(1, -1));
  }
  return (inNode.tagName == inSlctr.toUpperCase());
};

var search = function(inNodes, inSlctr) {
  var results = [];
  for (var i=0, n; (n=inNodes[i]); i++) {
    n = n.baby || n;
    if (matches(n, inSlctr)) {
      results.push(n);
    }
    if (!isInsertionPoint(n)) {
      results = results.concat(_search(n, inSlctr));
    }
  }
  return results;
};

var _search = function(inNode, inSlctr) {
  return search((inNode.lightDOM && inNode.lightDOM.childNodes) ||
    inNode.insertions || inNode.childNodes, inSlctr);
};

var localQueryAll = function(inNode, inSlctr) {
  return search(inNode.insertions || inNode.childNodes, inSlctr);
};

var localQuery = function(inNode, inSlctr) {
  return localQueryAll(inNode, inSlctr)[0];
};

// distribution

var poolify = function(inNodes) {
  var pool = [];
  var base = inNodes ? Array.prototype.slice.call(inNodes, 0) : [];
  for (var i=0, n; (n=base[i]) && (n=n.baby || n); i++) {
    if (isInsertionPoint(n)) {
      base.splice(i--, 1);
      pool = pool.concat(poolify(n.insertions || n.childNodes));
    } else {
      pool.push(n);
    }
  }
  return pool;
};

var extract = function(inPool, inSlctr) {
  if (!inSlctr) {
    return inPool.splice(0);
  } else {
    var result = [];
    for (var i=0, n; (n=inPool[i]); i++) {
      if (matches(n, inSlctr)) {
        result.push(n);
        inPool.splice(i--, 1);
      }
    }
    return result;
  }
};

var decorateInsertionPoint = function(inPoint) {
  if (!inPoint.__decorated__) {
    inPoint.__decorated__ = true;
    inPoint.getDistributedNodes = function() {
      var items = [];
      for (var i=0, n$=this.childNodes, n; (n=n$[i]); i++) {
        items.push(n.baby || n);
      }
      return items;
    };
  }
};

var distribute = function() {
  // primary shadow root
  var root = this.shadows.lastChild;
  // content pool from lightDOM
  var pool = poolify(this.lightDOM && this.lightDOM.childNodes);
  // distribute any lightDOM to our shadowDOM(s)
  distributePool(pool, root);
  // virtualize insertion points
  flatten(root);
  // project composed tree
  new Projection(this).addNodes(root.composedNodes || root.childNodes);
};

var hostInsertions = function(insertion, nodes) {
  // create back-pointers from inserted nodes to the insertion point
  for (var i=0, n; n=nodes[i]; i++) {
    if (n.host && n.host.tagName != 'CONTENT') {
      console.warn("node already has host", n.host, insertion, n);
    }
    n.host = insertion;
  }
  new Projection(insertion).addNodes(nodes);
}

var distributePool = function(inPool, inRoot) {
  // distribute pool to <content> nodes
  var insertions = localQueryAll(inRoot, "content");
  insertions.forEach(function(insertion) {
    decorateInsertionPoint(insertion);
    var slctr = insertion.getAttribute("select");
    var nodes = extract(inPool, slctr);
    hostInsertions(insertion, nodes);
  });
  //
  // distribute older shadow to <shadow>
  var shadow = localQuery(inRoot, "shadow");
  if (shadow) {
    var olderRoot = inRoot.previousSibling;
    if (olderRoot) {
      // project the EXPLODED root-tree into <shadow>
      new Projection(shadow).addNodes(olderRoot.insertions
        || olderRoot.childNodes);
      distributePool(inPool, olderRoot);
    }
  }
  //
  // distribute any contained objects
  var comps = localQueryAll(inRoot, "~");
  comps.forEach(function(c) {
    c.distribute();
  });
};

var flatten = function(inTree) {
  var nodes = inTree.insertions || inTree.composedNodes || inTree.childNodes;
  if (nodes) {
    var hasInsertion = false;
    for (var i=0, n; (n=nodes[i]); i++) {
      n = n.baby || n;
      flatten(n);
      if (isInsertionPoint(n)) {
        n.shouldFlatten = true;
        hasInsertion = true;
      }
    }
    if (hasInsertion) {
      Projection.flatten(inTree);
    }
  }
};

// exports

scope.ShimShadowDOM = {
  shim: true,
  ShadowRoot: ShadowRoot,
  distribute: function(inNode) {
    inNode.distribute();
  },
  localQueryAll: localQueryAll,
  localQuery: localQuery
};

})(window.__exported_components_polyfill_scope__);
