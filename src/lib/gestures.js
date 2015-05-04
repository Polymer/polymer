/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(scope) {

  'use strict';

  // detect native touch action support
  var HAS_NATIVE_TA = typeof document.head.style.touchAction === 'string';
  var GESTURE_KEY = '__polymerGestures';
  var HANDLED_OBJ = '__polymerGesturesHandled';
  var TOUCH_ACTION = '__polymerGesturesTouchAction';
  var TAP_DISTANCE = 25;

  // Disabling "mouse" handlers for 500ms is enough
  var MOUSE_TIMEOUT = 500;
  var MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'click'];

  // touch will make synthetic mouse events
  // `preventDefault` on touchend will cancel them,
  // but this breaks `<input>` focus and link clicks
  // disable mouse handlers for MOUSE_TIMEOUT ms after
  // a touchend to ignore synthetic mouse events
  var MOUSE_CANCELLER = function(mouseEvent) {
    mouseEvent[HANDLED_OBJ] = {skip: true};
    // disable "ghost clicks"
    if (mouseEvent.type === 'click') {
      var path = Polymer.dom(mouseEvent).path;
      for (var i = 0; i < path.length; i++) {
        if (path[i] === POINTERSTATE.mouse.target) {
          return;
        }
      }
      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
    }
  };

  function IGNORE_MOUSE(set) {
    for (var i = 0, en; i < MOUSE_EVENTS.length; i++) {
      en = MOUSE_EVENTS[i];
      if (set) {
        document.addEventListener(en, MOUSE_CANCELLER, true);
      } else {
        document.removeEventListener(en, MOUSE_CANCELLER, true);
      }
    }
    if (set) {
      // disable MOUSE_CANCELLER after MOUSE_TIMEOUT ms
      setTimeout(IGNORE_MOUSE, MOUSE_TIMEOUT);
    } else {
      POINTERSTATE.mouse.target = null;
    }
  }

  var POINTERSTATE = {
    tapPrevented: false,
    mouse: {
      target: null,
    },
    touch: {
      x: 0,
      y: 0,
      id: 0,
      scrollDecided: false
    }
  };

  function firstTouchAction(ev) {
    var path = Polymer.dom(ev).path;
    var ta = 'auto';
    for (var i = 0, n; i < path.length; i++) {
      n = path[i];
      if (n[TOUCH_ACTION]) {
        ta = n[TOUCH_ACTION];
        break;
      }
    }
    return ta;
  }

  function deepTargetFind(x, y) {
    var node = document.elementFromPoint(x, y);
    var next = node.shadowRoot;
    while(next) {
      next = next.elementFromPoint(x, y);
      if (next) {
        node = next;
      }
    }
    return node;
  }

  var Gestures = {
    gestures: {},
    recognizers: [],

    handleNative: function(ev) {
      var handled;
      var type = ev.type;
      var node = ev.currentTarget;
      var gobj = node[GESTURE_KEY];
      var gs = gobj[type];
      if (!gs) {
        return;
      }
      if (!ev[HANDLED_OBJ]) {
        ev[HANDLED_OBJ] = {};
        if (type === 'touchstart') {
          if (POINTERSTATE.touch.id === -1) {
            POINTERSTATE.touch.id = ev.changedTouches[0].touchIdentifier;
          }
        }
        if (!HAS_NATIVE_TA) {
          if (type === 'touchstart' || type === 'touchmove') {
            Gestures.handleTouchAction(ev);
          }
        }
        if (type === 'touchend') {
          POINTERSTATE.mouse.target = Polymer.dom(ev).rootTarget;
        }
      }
      // only handle the first finger
      if (type.slice(0, 5) === 'touch') {
        if (POINTERSTATE.touch.id !== ev.changedTouches[0].touchIdentifier) {
          return;
        }
      }
      handled = ev[HANDLED_OBJ];
      if (handled.skip) {
        return;
      }
      var recognizers = Gestures.recognizers;
      // enforce gesture recognizer order
      for (var i = 0, r; i < recognizers.length; i++) {
        r = recognizers[i];
        if (gs[r.name] && !handled[r.name]) {
          handled[r.name] = true;
          r[type](ev);
        }
      }
      // ignore syntethic mouse events after a touch
      if (type === 'touchend') {
        POINTERSTATE.touch.id = -1;
        IGNORE_MOUSE(true);
      }
    },

    handleTouchAction: function(ev) {
      var t = ev.changedTouches[0];
      var type = ev.type;
      if (type === 'touchstart') {
        POINTERSTATE.touch.x = t.clientX;
        POINTERSTATE.touch.y = t.clientY;
        POINTERSTATE.touch.scrollDecided = false;
      } else if (type === 'touchmove') {
        if (POINTERSTATE.touch.scrollDecided) {
          return;
        }
        POINTERSTATE.touch.scrollDecided = true;
        var ta = firstTouchAction(ev);
        var prevent = false;
        var dx = Math.abs(POINTERSTATE.touch.x - t.clientX);
        var dy = Math.abs(POINTERSTATE.touch.y - t.clientY);
        if (!ev.cancelable) {
          // scrolling is happening
        } else if (ta === 'none') {
          prevent = true;
        } else if (ta === 'pan-x') {
          prevent = dx >= dy;
        } else if (ta === 'pan-y') {
          prevent = dy > dx;
        }
        if (prevent) {
          ev.preventDefault();
        }
      }
    },

    // automate the event listeners for the native events
    add: function(node, evType, handler) {
      var recognizer = this.gestures[evType];
      var deps = recognizer.deps;
      var name = recognizer.name;
      var gobj = node[GESTURE_KEY];
      if (!gobj) {
        node[GESTURE_KEY] = gobj = {};
      }
      for (var i = 0, dep, gd; i < deps.length; i++) {
        dep = deps[i];
        gd = gobj[dep];
        if (!gd) {
          gobj[dep] = gd = {};
          node.addEventListener(dep, this.handleNative);
        }
        gd[name] = (gd[name] || 0) + 1;
      }
      node.addEventListener(evType, handler);
      if (recognizer.touchaction) {
        this.setTouchAction(node, recognizer.touchaction);
      }
    },

    register: function(recog) {
      this.recognizers.push(recog);
      for (var i = 0; i < recog.emits.length; i++) {
        this.gestures[recog.emits[i]] = recog;
      }
    },

    // set scrolling direction on node to check later on first move
    // must call this before adding event listeners!
    setTouchAction: function(node, value) {
      if (HAS_NATIVE_TA) {
        node.style.touchAction = value;
      }
      node[TOUCH_ACTION] = value;
    },

    fire: function(target, type, detail) {
      var ev = new CustomEvent(type, {
        detail: detail,
        bubbles: true,
        cancelable: true
      });
      target.dispatchEvent(ev);
    }
  };

  Gestures.register({
    name: 'downup',
    deps: ['mousedown', 'touchstart', 'touchend'],
    emits: ['down', 'up'],

    mousedown: function(e) {
      var t = e.currentTarget;
      var self = this;
      var upfn = function upfn(e) {
        self.fire('up', t, e);
        document.removeEventListener('mouseup', upfn);
      };
      document.addEventListener('mouseup', upfn);
      this.fire('down', t, e);
    },
    touchstart: function(e) {
      this.fire('down', e.currentTarget, e.changedTouches[0]);
    },
    touchend: function(e) {
      this.fire('up', e.currentTarget, e.changedTouches[0]);
    },
    fire: function(type, target, event) {
      Gestures.fire(target, type, {
        x: event.clientX,
        y: event.clientY,
        sourceEvent: event
      });
    }
  });

  Gestures.register({
    name: 'track',
    touchaction: 'none',
    deps: ['mousedown', 'touchmove', 'touchend'],
    emits: ['track'],

    info: {
      state: 'start',
      started: 'true',
      moves: [],
      addMove: function(move) {
        if (this.moves.length > 5) {
          this.moves.splice(1, 1);
        }
        this.moves.push(move);
      }
    },

    clearInfo: function() {
      this.info.state = 'start';
      this.info.started = false;
      this.info.moves = [];
    },

    mousedown: function(e) {
      var t = e.currentTarget;
      var self = this;
      var movefn = function movefn(e) {
        // first move is 'start', subsequent moves are 'move', mouseup is 'end'
        self.info.state = self.info.started ? (e.type === 'mouseup' ? 'end' : 'track') : 'start';
        self.info.addMove({x: e.clientX, y: e.clientY});
        self.fire(t, e);
        e.preventDefault();
        self.info.started = true;
      };
      var upfn = function upfn(e) {
        if (self.info.state !== 'start') {
          POINTERSTATE.tapPrevented = true;
          movefn(e);
        }
        self.clearInfo();
        // remove the temporary listeners
        document.removeEventListener('mousemove', movefn);
        document.removeEventListener('mouseup', upfn);
      };
      // add temporary document listeners as mouse retargets
      document.addEventListener('mousemove', movefn);
      document.addEventListener('mouseup', upfn);
    },

    touchmove: function(e) {
      var t = e.currentTarget;
      var ct = e.changedTouches[0];
      this.info.addMove({x: ct.clientX, y: ct.clientY});
      this.fire(t, ct);
      this.info.state = 'track';
    },

    touchend: function(e) {
      var t = e.currentTarget;
      var ct = e.changedTouches[0];
      // only trackend if track was started and not aborted
      if (this.info.state !== 'start') {
        // iff tracking, always prevent tap
        POINTERSTATE.tapPrevented = true;
        // reset started state on up
        this.info.state = 'end';
        this.info.addMove({x: ct.clientX, y: ct.clientY});
        this.fire(t, ct);
      }
      this.clearInfo();
    },

    fire: function(target, touch) {
      var secondlast = this.info.moves[this.info.moves.length - 2];
      var lastmove = this.info.moves[this.info.moves.length - 1];
      var firstmove = this.info.moves[0];
      var dx, dy = 0;
      if (firstmove) {
        dx = lastmove.x - firstmove.x;
        dy = lastmove.y - firstmove.y;
      }
      var ddx, ddy = 0;
      if (secondlast) {
        ddx = lastmove.x - secondlast.x;
        ddy = lastmove.y - secondlast.y;
      }
      return Gestures.fire(target, 'track', {
        state: this.info.state,
        x: touch.clientX,
        y: touch.clientY,
        dx: dx,
        dy: dy,
        ddx: ddx,
        ddy: ddy,
        hover: function() {
          return deepTargetFind(touch.clientX, touch.clientY);
        }
      });
    }

  });

  Gestures.register({
    name: 'tap',
    deps: ['mousedown', 'click', 'touchstart', 'touchend'],
    emits: ['tap'],
    start: {
      x: 0,
      y: 0
    },
    reset: function() {
      this.start.x = 0;
      this.start.y = 0;
    },
    save: function(e) {
      this.start.x = e.clientX;
      this.start.y = e.clientY;
    },

    mousedown: function(e) {
      this.save(e);
    },
    click: function(e) {
      this.forward(e);
    },

    touchstart: function(e) {
      this.save(e.changedTouches[0]);
    },
    touchend: function(e) {
      this.forward(e.changedTouches[0]);
    },

    forward: function(e) {
      var dx = Math.abs(e.clientX - this.start.x);
      var dy = Math.abs(e.clientY - this.start.y);
      if (dx <= TAP_DISTANCE || dy <= TAP_DISTANCE) {
        // prevent taps from being generated if an event has canceled them
        if (!POINTERSTATE.tapPrevented) {
          Gestures.fire(e.target, 'tap', {
            x: e.clientX,
            y: e.clientY,
            sourceEvent: e
          });
        }
      }
      POINTERSTATE.tapPrevented = false;
      this.reset();
    }
  });

  var DIRECTION_MAP = {
    'x': 'pan-x',
    'y': 'pan-y',
    'none': 'none',
    'all': 'auto'
  };

  // expose Polymer.Gestures as the behavior for gestures
  scope.Gestures = {
    // override _addListener to handle gestures
    _addListener: function(node, eventName, handler) {
      if (Gestures.gestures[eventName]) {
        Gestures.add(node, eventName, handler);
      } else {
        node.addEventListener(eventName, handler);
      }
    },
    setScrollDirection: function(node, direction) {
      var ta = DIRECTION_MAP[direction] || 'auto';
      Gestures.setTouchAction(node, ta);
    }
  };

})(Polymer);
